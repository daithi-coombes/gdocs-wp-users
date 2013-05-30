<?php
/**
 * Handles requests for gas_wp_users xmlrpc method
 */
class GAS_WP_Users{
	
	function __construct(){
		
		add_filter( 'xmlrpc_methods', array(&$this, 'set_xmlrpc_callback') );
	}

	/**
	 * callback add custom xmlrpc methods
	 * @param array $methods The current methods list
	 * @return  array The new methods list
	 */
	public function set_xmlrpc_callback(array $methods){
		$methods['gas_wp.update_user'] = array(&$this, 'update_user');
		return $methods;
	}

	/**
	 * Updates an array of users passed from xmlrcp wp_gas.update_user
	 * @param  array $params An array of objects{ cols, data: users[] }
	 * @return mixed         Returns void or WP_Error if error
	 */
	public function update_user( $params ){

		global $wp_xmlrpc_server;

		//vars
		$username = $params[1];
		$password = $params[2];
		$args = json_decode(html_entity_decode($params[3]));

		//login user
		if(!$wp_xmlrpc_server->login($username, $password))
			return $wp_xmlrpc_server->error;

		foreach($args->data as $user){

			//match vars with cols
			foreach($args->columns as $key => $col)
				$userObj[$col] = $user[$key];

			//cast and set user_id
			$userObj['ID'] = intval($user[0]);
			unset($userObj['user_id']);
			
			//run update
			$res = wp_update_user($userObj);
			if(is_wp_error($res))
				return $wp_xmlrpc_server->error('503', $res->get_error_message());
		}
	}
}
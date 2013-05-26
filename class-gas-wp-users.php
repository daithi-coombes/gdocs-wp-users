<?php
/**
 * Handles requests for gas_wp_users xmlrpc method
 */
class GAS_WP_Users{
	
	function __construct(){
		
		add_filter( 'xmlrpc_methods', array(&$this, 'set_xmlrpc_callback') );
	}

	public function set_xmlrpc_callback(array $methods){
		$methods['gas_wp.update_user'] = array(&$this, 'update_user');
		return $methods;
	}

	public function update_user( $params ){

		global $wp_xmlrpc_server;

		//vars
		$username = $params[1];
		$password = $params[2];
		$args = $params[3];

		//login user
		if(!$wp_xmlrpc_server->login($username, $password))
			return $wp_xmlrpc_server->error;
		
		return html_entity_decode($args);

		//update user
		$res = wp_update_user($args);
		if(is_wp_error($res))
			return $wp_xmlrpc_server->error('503', $res->get_error_message());
	}
}
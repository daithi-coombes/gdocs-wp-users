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
}
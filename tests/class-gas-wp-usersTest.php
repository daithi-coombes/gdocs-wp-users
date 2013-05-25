<?php

require_once('class-gas-wp-users.php');

class GAS_WP_UsersTest extends PHPUnit_Framework_TestCase{

	protected $obj;

	function setUp(){
		parent::setUp();

		global $wp_xmlrpc_server;
		$wp_xmlrpc_server = new wp_xmlrpc_server();
		$this->obj = new GAS_WP_Users();
	}

	function test_xml_update_user(){
		global $wp_xmlrpc_server;

		if(! $wp_xmlrpc_server->login('admin','password') )
			print_r($wp_xmlrpc_server->error);
		
		do_action('xmlrpc_call', 'gas_wp.update_user');

	}

	function test_set_xmlrpc_callback(){

		//set method
		$methods = array('wp.core' => 'wp_core');
		$methods = $this->obj->set_xmlrpc_callback( $methods );

		//test method was set
		$method = $methods['gas_wp.update_user'];
		$this->assertTrue($method[0] instanceof GAS_WP_Users);
		$this->assertEquals('update_user', $method[1]);
	}

	function test_update_user(){

		//taken from parameter
		$params = array(1,'admin','password', array(ID => 1, 'first_name' => 'foo', 'last_name' => 'bar'));

		wp_update_user( $params [3] );
		$user = get_userdata(1);
		
		$this->assertEquals('foo', $user->user_firstname);
	}
}
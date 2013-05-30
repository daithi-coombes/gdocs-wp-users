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

	function tearDown(){
		parent::tearDown();
		$params = array('ID' => 1, 'first_name' => '', 'last_name' => '');
		wp_update_user($params);
	}

	function test_xml_update_user(){
		global $wp_xmlrpc_server;

		//login to xmlrpc server
		if(! $wp_xmlrpc_server->login('admin','password') )
			print_r($wp_xmlrpc_server->error);
		
		//mock $params
		$params = array(
			);
		$res = $this->obj->update_user($params);

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

	function test_update_user_login_success(){

		//update success
		$params = array(1,'admin','password', array('ID' => 1, 'first_name' => 'foo', 'last_name' => 'bar'));
		$res = $this->obj->update_user($params);
		$user = get_userdata(1);
		$this->assertEquals($user->user_firstname, 'foo', "gas_wp.update_user update success failed");

		//login fail
		$params[1] = 'unkown_user';
		$res = $this->obj->update_user($params);
		$this->assertTrue($res instanceof IXR_Error, "gas_wp.update_user login fail failed");

		//update fail
		$params[1] = 'admin';
		$params[3]['ID'] = '4567';
		$res = $this->obj->update_user($params);
		print_r($res);
		
	}
}
<?php
/**
 * @package gdocs-wp-users
 */
/*
  Plugin Name: GDocs Wordpress Users
  Plugin URI: https://github.com/daithi-coombes/gdocs-wp-users
  Description: Allows editing of user profiles on a wordpress database using google docs spreadsheet
  Version: 0.1
  Author: Daithi Coombes
  Author URI: http://david-coombes.com
 */
require_once( WP_PLUGIN_DIR . "/api-connection-manager/index.php");
require_once('class-gas-wp-users.php');

$gas_users = new GAS_WP_Users();


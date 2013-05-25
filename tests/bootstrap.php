<?php 
/**
 * Bootstrap
 *
 * To run the unit tests please see
 * @link http://david-coombes.com/phpunit-testing-wordpress-plugins-with-wordpress-make/
 */
ob_start(); 
 
//change this to your path 
$path = '/var/www/wordpress.loc/foo/wordpress-tests/includes/bootstrap.php'; 
 
if (file_exists($path)) {         
    $GLOBALS['wp_tests_options'] = array(
        'active_plugins' => array('gdocs-wp-users/index.php')
    );
    require_once $path;
} else {
    exit("Couldn't find wordpress-tests/bootstrap.phpn");
}
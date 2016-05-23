<?php

namespace App\Controllers;

class Test {

	protected $ci;

	public function __construct(\Slim\Container $ci) {
		$this->ci = $ci;
	}

	public function test($request, $response, $args) {
		$data = array('name' => 'Bob', 'age' => 40, 'test' => 'pa ovo radi !!!', 'valid_days' => $this->ci->settings['login_token_valid_days']);
		return $response->withJson($data);
	}
	
	public function testdb($request, $response, $args) {
		//$users = \App\Models\Users::all();
		$table = $this->ci->get('db')->table('users');
		$users = $table->get();
		print_r($users);
	}

}
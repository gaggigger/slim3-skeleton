<?php

namespace App\Controllers;

class Users {

	protected $ci;

	public function __construct(\Slim\Container $ci) {
		$this->ci = $ci;
	}

	public function getall($request, $response, $args) {
		$ret = array(
			"status" => "OK",
			"message" => "data fetched",
			"data" => \App\Models\Users::all()
		);
		return $response->withJson($ret);
	}

}
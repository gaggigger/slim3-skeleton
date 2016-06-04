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
	
	public function add($request, $response, $args) {
		$data = $request->getParams();
		//$this->ci->logger->addInfo(json_encode($data));
		try {
			$user = new \App\Models\Users();
			$user->username = $data['username'];
			$user->password = password_hash($data['password'], PASSWORD_DEFAULT);		
			$user->first_name = $data['first_name'];
			$user->last_name = $data['last_name'];
			$user->email = $data['email'];
			$user->group_admin = (int) $data['group_admin'];
		} catch (Exception $e) {
			$ret = array("status" => "ERROR", "message" => $e->getMessage());
			return $response->withJson($ret);
		}
		try {
			$user->save();
			$ret = array("status" => "OK", "message" => "user saved");
		} catch (\Illuminate\Database\QueryException $e) {
			$ret = array("status" => "ERROR", "message" => $e->getMessage());
		}		
		return $response->withJson($ret);
	}

}
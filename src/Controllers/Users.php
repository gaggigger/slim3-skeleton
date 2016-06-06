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
			"data" => array(
				"items" => \App\Models\Users::select('id', 'username', 'first_name', 'last_name', 'email', 'group_admin', 'updated_at', 'created_at')
								->orderBy('id', 'asc')
								->skip(($args['page']-1)*$args['pageSize'])
								->take($args['pageSize'])
								->get(),
				"totalItems" => \App\Models\Users::count()
			)
		);
		return $response->withJson($ret);
	}
	
	public function get($request, $response, $args) {
		$ret = array("status" => "ERROR", "message" => "unknown data1");
		$data = \App\Models\Users::where('id', $args['id'])->select('username', 'first_name', 'last_name', 'email', 'group_admin')->first();
		if ($data) {
			$ret = array(
				"status" => "OK",
				"message" => "data fetched",
				"data" => $data
			);
		}
		return $response->withJson($ret);
	}
	
	public function update($request, $response, $args) {
		$ret = array("status" => "ERROR", "message" => "unknown data2");
		$data = $request->getParams();
		$user = \App\Models\Users::find($args['id']);
		if ($user) {
			try {
				$user->username = $data['username'];
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
				$ret = array("status" => "OK", "message" => "user updated");
			} catch (\Illuminate\Database\QueryException $e) {
				$ret = array("status" => "ERROR", "message" => $e->getMessage());
			}
		}
		return $response->withJson($ret);
	}
	
	public function delete($request, $response, $args) {
		$ret = array("status" => "ERROR", "message" => "unknown data3");
		if (\App\Models\Users::destroy($args['id'])) {
			\App\Models\UserTokens::where('user_id', $args['id'])->delete();
			$ret = array("status" => "OK", "message" => "user deleted");
		}
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
			$ret = array("status" => "OK", "message" => "new user saved");
		} catch (\Illuminate\Database\QueryException $e) {
			$ret = array("status" => "ERROR", "message" => $e->getMessage());
		}		
		return $response->withJson($ret);
	}

}
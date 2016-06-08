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
		$ret = array("status" => "ERROR", "message" => ['info'=>"unknown data"]);
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
		$ret = array("status" => "ERROR", "message" => ['info'=>"unknown data"]);
		$data = $request->getParams();
		//validate data
		$rules = [
			'required'		=> [['username']],
			'lengthBetween' => [['username',4,50]],
			'alphaNum'		=> [['username']],
			'email'			=> [['email']],
			'lengthMax'		=> [['first_name',150],['last_name',150]],
		];
		$v = new \Valitron\Validator($data);
		$v->rules($rules);
		if (!$v->validate()) {
			$ret = array("status" => "ERROR", "message" => $v->errors());
			return $response->withJson($ret);
		}
		//update user
		$user = \App\Models\Users::find($args['id']);
		if ($user) {
			try {
				$user->username = $data['username'];
				$user->first_name = $data['first_name'];
				$user->last_name = $data['last_name'];
				$user->email = $data['email'];
				$user->group_admin = (int) $data['group_admin'];
			} catch (Exception $e) {
				$ret = array("status" => "ERROR", "message" => ['info'=>$e->getMessage()]);
				return $response->withJson($ret);
			}
			try {
				$user->save();
				$ret = array("status" => "OK", "message" => "User ".$user->username." updated");
			} catch (\Illuminate\Database\QueryException $e) {
				$ret = array("status" => "ERROR", "message" => ['info'=>$e->getMessage()]);
			}
		}
		return $response->withJson($ret);
	}
	
	public function chpass($request, $response, $args) {
		$ret = array("status" => "ERROR", "message" => ['info'=>"unknown data"]);
		$data = $request->getParams();
		//validate data
		$rules = [
			'required'		=> [['password']],
			'lengthBetween' => [['password',6,50]],
		];
		$v = new \Valitron\Validator($data);
		$v->rules($rules);
		if (!$v->validate()) {
			$ret = array("status" => "ERROR", "message" => $v->errors());
			return $response->withJson($ret);
		}
		//update user
		$user = \App\Models\Users::find($args['id']);
		if ($user) {
			try {
				$user->password = password_hash($data['password'], PASSWORD_DEFAULT);
			} catch (Exception $e) {
				$ret = array("status" => "ERROR", "message" => ['info'=>$e->getMessage()]);
				return $response->withJson($ret);
			}
			try {
				$user->save();
				$ret = array("status" => "OK", "message" => "Password changed for user ".$user->username);
			} catch (\Illuminate\Database\QueryException $e) {
				$ret = array("status" => "ERROR", "message" => ['info'=>$e->getMessage()]);
			}
		}
		return $response->withJson($ret);
	}
	
	public function delete($request, $response, $args) {
		$ret = array("status" => "ERROR", "message" => ['info'=>"unknown data"]);
		if (\App\Models\Users::destroy($args['id'])) {
			\App\Models\UserTokens::where('user_id', $args['id'])->delete();
			$ret = array("status" => "OK", "message" => "User deleted");
		}
		return $response->withJson($ret);
	}
	
	public function add($request, $response, $args) {
		$data = $request->getParams();
		//validate data
		$rules = [
			'required'		=> [['username'], ['password']],
			'lengthBetween' => [['username',4,50],['password',6,50]],
			'different'		=> [['password','username']],
			'alphaNum'		=> [['username']],
			'email'			=> [['email']],
			'lengthMax'		=> [['first_name',150],['last_name',150]],
		];
		$v = new \Valitron\Validator($data);
		$v->rules($rules);
		if (!$v->validate()) {
			$ret = array("status" => "ERROR", "message" => $v->errors());
			return $response->withJson($ret);
		}
		//update user
		try {
			$user = new \App\Models\Users();
			$user->username = $data['username'];
			$user->password = password_hash($data['password'], PASSWORD_DEFAULT);		
			$user->first_name = $data['first_name'];
			$user->last_name = $data['last_name'];
			$user->email = $data['email'];
			$user->group_admin = (int) $data['group_admin'];
		} catch (Exception $e) {
			$ret = array("status" => "ERROR", "message" => ['info'=>$e->getMessage()]);
			return $response->withJson($ret);
		}
		try {
			$user->save();
			$ret = array("status" => "OK", "message" => "Created user ".$user->username);
		} catch (\Illuminate\Database\QueryException $e) {
			$ret = array("status" => "ERROR", "message" => ['info'=>$e->getMessage()]);
		}		
		return $response->withJson($ret);
	}

}
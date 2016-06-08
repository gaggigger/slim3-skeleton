<?php

namespace App\Controllers;

class Authentication {

	protected $ci;

	public function __construct(\Slim\Container $ci) {
		$this->ci = $ci;
	}

	// ==================================================
	//                      LOGIN
	// ==================================================
	public function login($request, $response, $args) {
		$data = $request->getParsedBody();
		
		$ret = array(
			"status" => "ERROR",
			"message" => "wrong username or password"
		);
		
		if (isset($data) && array_key_exists('username', $data) && array_key_exists('password', $data)) {
			$user = \App\Models\Users::where('username', $data['username'])->first();
			if ($user) {
				if (password_verify($data['password'], $user->password)) {
					$token = new \App\Models\UserTokens();
					$token->user_id = $user->id;
					$token->token = \App\Models\UserTokens::generate_token(40);
					$token->valid_to = (new \DateTime())->modify('+'.$this->ci->settings['login_token_valid_days'].' day');
					try {
						$token->save();
						$ret = array(
							"status" => "OK",
							"message" => "user and password ok",
							"user" => array (
								//"username" => $user->username,
								"fullname" => $user->first_name.' '.$user->last_name,
								"token" => $token->token,
								"valid_days" => $this->ci->settings['login_token_valid_days'],
								"groups" => ["admin"=>$user->group_admin]
							)
						);
					} 
					catch(\Illuminate\Database\QueryException $e) { 
						//$this->ci->logger->addInfo($e->getMessage());
					}					
				}
			}
		}
		
		return $response->withJson($ret);
	}
	
	// ==================================================
	//                  REFRESH TOKEN
	// ==================================================
	public function refresh_token($request, $response, $args) {
		
		$token = $request->getBody()->getContents();
		
		$ret = array(
			"status" => "ERROR",
			"message" => "wrong token"
		);
		
		if (isset($token)) {
			$user_token = \App\Models\UserTokens::where('token', '=', $token)->where('valid_to', '>', date('Y-m-d H:i:s'))->first();
			if ($user_token) {
				try {
					//update token valid_to
					$user_token->valid_to = (new \DateTime())->modify('+'.$this->ci->settings['login_token_valid_days'].' day');
					$user_token->save();
					//get user info
					$user = \App\Models\Users::find($user_token->user_id);
					//construct refresh token
					if ($user) {
						$ret = array(
							"status" => "OK",
							"message" => "token refreshed",
							"user" => array (
								//"username" => $user->username,
								"fullname" => $user->first_name.' '.$user->last_name,
								"token" => $user_token->token,
								"valid_days" => $this->ci->settings['login_token_valid_days'],
								"groups" => ["admin"=>$user->group_admin]
							)
						);
					}
				}
				catch(\Illuminate\Database\QueryException $e) { 
					$this->ci->logger->addInfo($e->getMessage());
				}
			}
		}
		
		return $response->withJson($ret);
	}

}
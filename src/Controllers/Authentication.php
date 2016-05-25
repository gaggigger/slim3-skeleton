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
					$token->token = \App\Models\UserTokens::generate_token(30);
					$token->valid_to = (new \DateTime())->modify('+'.$this->ci->settings['login_token_valid_days'].' day');
					try {
						$token->save();
						$ret = array(
							"status" => "OK",
							"message" => "user and password ok",
							"user" => array (
								"username" => $user['username'],
								"fullname" => $user['first_name'].' '.$user['last_name'],
								"token" => $token->token,
								"valid_days" => $this->ci->settings['login_token_valid_days']
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
		
		$token = $request->getBody();
		
		$ret = array(
			"status" => "ERROR",
			"message" => "wrong token"
		);
		
		if (isset($token)) {
			$stmt = $this->db->prepare("SELECT * FROM user_tokens WHERE (token = :token1) AND (valid_to > :valid_to) LIMIT 1");
			$stmt->execute(["token1" => $token, "valid_to" => date('Y-m-d H:i:s')]);
			$user_token = $stmt->fetch();
			if ($user_token) {
				//$this->ci->logger->addInfo(json_encode($user_token));
				try {
					//update token valid_to
					$valid_to = new DateTime();
					$valid_to->modify('+'.$this->settings['login_token_valid_days'].' day');
					$stmt2 = $this->db->prepare("UPDATE user_tokens SET valid_to = :valid_to WHERE (id = :id)");
					$stmt2->execute(["id" => $user_token['id'], "valid_to" => $valid_to->format('Y-m-d H:i:s')]);
					//get user info
					$stmt3 = $this->db->prepare("SELECT * FROM users WHERE (id = :id) LIMIT 1");
					$stmt3->execute(["id" => $user_token['user_id']]);
					$user = $stmt3->fetch();
					//construct refresh token
					if ($user) {
						$ret = array(
							"status" => "OK",
							"message" => "token refreshed",
							"user" => array (
								"username" => $user['username'],
								"fullname" => $user['first_name'].' '.$user['last_name'],
								"token" => $user_token['token'],
								"valid_days" => $this->settings['login_token_valid_days']
							)
						);
					}
				}
				catch(PDOException $exception) { 
					$this->logger->addInfo($exception->getMessage());
				}
			}
		}
		
		return $response->withJson($ret);
	}

}
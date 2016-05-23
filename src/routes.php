<?php
// Routes

$app->get('/', function ($request, $response, $args) {
    return $this->renderer->render($response, 'index.phtml', ["app_name" => $this->settings['app_name']]);
});

//API routes
$app->group('/api', function () {
	
	// TEST
	$this->get('/test', function ($request, $response) {
		$data = array('name' => 'Bob', 'age' => 40);
		return $response->withJson($data);
	});
	
	// LOGIN
	$this->post('/login', function ($request, $response) {
		
		$data = $request->getParsedBody();
		
		$ret = array(
			"status" => "ERROR",
			"message" => "wrong username or password"
		);
		
		if (isset($data) && array_key_exists('username', $data) && array_key_exists('password', $data)) {
			$stmt = $this->db->prepare("SELECT * FROM users WHERE (username = :username) LIMIT 1");
			$stmt->execute(["username" => $data['username']]);
			$user = $stmt->fetch();
			if ($user) {
				if (password_verify($data['password'], $user['password'])) {
					$new_token = $this->token;
					$valid_to = new DateTime();
					$valid_to->modify('+'.$this->settings['login_token_valid_days'].' day');
					$sql = "INSERT INTO user_tokens (user_id, token, valid_to) VALUES (:user_id, :token, :valid_to)";
					$statement = $this->db->prepare($sql);
					$statement->bindValue(':user_id', $user['id']);
					$statement->bindValue(':token', $new_token);
					$statement->bindValue(':valid_to', $valid_to->format('Y-m-d H:i:s'));
					try {
						$statement->execute();
						$ret = array(
							"status" => "OK",
							"message" => "user and password ok",
							"user" => array (
								"username" => $user['username'],
								"fullname" => $user['first_name'].' '.$user['last_name'],
								"token" => $new_token,
								"valid_days" => $this->settings['login_token_valid_days']
							)
						);
					} 
					catch(PDOException $exception) { 
						//$this->logger->addInfo($exception->getMessage());
					}
					
				}
			}
		}
		
		return $response->withJson($ret);
	});
	
	// REFRESH TOKEN
	$this->post('/refreshToken', function ($request, $response) {
		
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
				//$this->logger->addInfo(json_encode($user_token));
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
	});
	
	//GET DATA EXAMPLE
	$this->get('/send_messages', function ($request, $response) {
		
		$ret = array(
			"status" => "AUTH ERROR",
			"message" => "wrong token"
		);
		
		if ($request->hasHeader('Authorization')) {
   			
			$stmt = $this->db->prepare("SELECT * FROM user_tokens WHERE (token = :token2) AND (valid_to > :valid_to) LIMIT 1");
			$stmt->execute(["token2" => $request->getHeaderLine('Authorization'), "valid_to" => date('Y-m-d H:i:s')]);
			$user_token = $stmt->fetch();
			
			if ($user_token) {
				
				$data = array();
				
				$ret = array(
					"status" => "OK",
					"message" => "data fetched",
					"data" => $data
				);
			}
		}
		
		return $response->withJson($ret);
	});
	
});
	


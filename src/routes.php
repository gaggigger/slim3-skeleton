<?php
// Routes

$app->get('/', function ($request, $response, $args) {
    return $this->renderer->render($response, 'index.phtml', ["app_name" => $this->settings['app_name']]);
});

//API routes
$app->group('/api', function () {
	
	$this->get('/test', '\App\Controllers\Test:testdb');
	$this->post('/login', '\App\Controllers\Authentication:login');
	$this->post('/refreshToken', '\App\Controllers\Authentication:refresh_token');
	
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
	


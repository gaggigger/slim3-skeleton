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
	$this->get('/users', '\App\Controllers\Users:getall')->add(new AuthMw(['admin'], $this->getContainer()));

});
	


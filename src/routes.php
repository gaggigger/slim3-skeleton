<?php
// Routes

$app->get('/', function ($request, $response, $args) {
    return $this->renderer->render($response, 'index.phtml', ["app_name" => $this->settings['app_name']]);
});

//API routes
$app->group('/api', function () {
	
	//test
	$this->get('/test', '\App\Controllers\Test:test');
	//login
	$this->post('/login', '\App\Controllers\Authentication:login');
	$this->post('/refreshToken', '\App\Controllers\Authentication:refresh_token');
	//users
	$this->get('/users/{page}/{pageSize}', '\App\Controllers\Users:getall')->add(new AuthMw(['admin'], $this->getContainer()));
	$this->get('/users/{id}', '\App\Controllers\Users:get')->add(new AuthMw(['admin'], $this->getContainer()));
	$this->post('/userupdate/{id}', '\App\Controllers\Users:update')->add(new AuthMw(['admin'], $this->getContainer()));
	$this->post('/userchpass/{id}', '\App\Controllers\Users:chpass')->add(new AuthMw(['admin'], $this->getContainer()));
	$this->get('/userdelete/{id}', '\App\Controllers\Users:delete')->add(new AuthMw(['admin'], $this->getContainer()));
	$this->post('/users', '\App\Controllers\Users:add')->add(new AuthMw(['admin'], $this->getContainer()));

});
	


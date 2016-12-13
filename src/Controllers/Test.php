<?php

namespace App\Controllers;

class Test {

	protected $ci;

	public function __construct(\Slim\Container $ci) {
		$this->ci = $ci;
	}

	public function test($request, $response, $args) {
		$data = \App\Models\Users::orderBy('id', 'desc')->skip(1)->take(1)->get();
		return $response->withJson($data);
	}
	
	public function testdb($request, $response, $args) {
		$users = \App\Models\Users::all();
		foreach ($users as $user) {
			echo $user->id.' '.$user->username.' '.$user->password.'<br />';
		}
		
		echo 'Dohvat find(id)<br />';
		if (\App\Models\Users::find(1)) echo 'imam 1'; else echo 'nemam 1';
		echo '<br />';
		if (\App\Models\Users::find(2))  echo 'imam 2'; else echo 'nemam 2';
		echo '<br />Dohvat where(\'username\', \'=\', \'?\')->first()<br />';
		if (\App\Models\Users::where('username', 'test')->first()) echo 'imam test'; else echo 'nemam test';
		echo '<br />';
		if (\App\Models\Users::where('username', 'pero2')->first())  echo 'imam pero'; else echo 'nemam pero';
		echo '<br />';
		$user = \App\Models\Users::where('username', 'test2')->first();
		if ($user) echo 'imam test'; else echo 'nemam test';
		//save test
		echo '<br />';
		$token = new \App\Models\UserTokens();
		$token->user_id = '23eeee';
		$token->token = \App\Models\UserTokens::generate_token(30);
		$token->valid_to = (new \DateTime())->modify('+'.$this->ci->settings['login_token_valid_days'].' day');
		try {
			$token->save();
			echo 'token saved';
		} catch(\Illuminate\Database\QueryException $e) {
			echo 'Caught exception: ',  $e->getMessage(), "<br />";
		}
		
	}

}
<?php

// Authorization middleware

class AuthMw
{
	private $groups;
	protected $ci;
	
	public function __construct($groups, \Slim\Container $ci)
	{
		$this->groups = $groups;
		$this->ci = $ci;
	}

	public function __invoke($request, $response, $next)
	{
		if ($request->hasHeader('Authorization')) {
			$user_token = \App\Models\UserTokens::where('token', '=', $request->getHeader('Authorization'))->where('valid_to', '>', date('Y-m-d H:i:s'))->first();
			//$this->ci->logger->addDebug('Authorization', $request->getHeader('Authorization'));
			if ($user_token) {
				if (\App\Models\Users::isUserInGroup($user_token->user_id, $this->groups)) {
					return $next($request, $response);
				}
			}
		}		
		return $response->withJson(['status'=>'AUTH ERROR', 'message'=>'unauthorized access']);
	}
}
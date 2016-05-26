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
		$this->ci->logger->addInfo('grupe sa dozvolom: '.json_encode($this->groups));
		if ($request->hasHeader('Authorization')) {
			$this->ci->logger->addInfo('token: '.$request->getHeaderLine('Authorization'));
		}
		$response = $next($request, $response);
		return $response;
	}
}
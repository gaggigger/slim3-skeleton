<?php
return [
    'settings' => [
        'displayErrorDetails' => true, // set to false in production

        // Renderer settings
        'renderer' => [
            'template_path' => __DIR__ . '/../templates/',
        ],

        // Monolog settings
        'logger' => [
            'name' => '',
            'path' => __DIR__ . '/../logs/app.log',
        ],
		// Database settings
		'database' => [
			'driver'   => 'mysql',
			'host'     => 'localhost',
			'database' => 'slim3-skeleton',
			'username' => 'testuser',
			'password' => 'testpass',
			'charset'  => 'utf8mb4',
			'collation'=> 'utf8mb4_unicode_ci',
			'prefix'   => '',
        ],
		// App settings
		'app_name' => 'Slim3 skeleton',
		'login_token_valid_days' => 10,
    ],
];

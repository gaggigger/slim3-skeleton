<?php
// DIC configuration

$container = $app->getContainer();

// view renderer
$container['renderer'] = function ($c) {
    $settings = $c->get('settings')['renderer'];
    return new Slim\Views\PhpRenderer($settings['template_path']);
};

// monolog
$container['logger'] = function ($c) {
    $settings = $c->get('settings')['logger'];
    $logger = new Monolog\Logger($settings['name']);
    $logger->pushProcessor(new Monolog\Processor\UidProcessor());
    $logger->pushHandler(new Monolog\Handler\StreamHandler($settings['path'], Monolog\Logger::DEBUG));
    return $logger;
};

// database
$container['db'] = function ($c) {
    $capsule = new Illuminate\Database\Capsule\Manager;
	$capsule->addConnection($c->get('settings')['database']);
	return $capsule;
};

$container->db->setAsGlobal();
$container->db->bootEloquent();
$container->db->connection()->setEventDispatcher(new Illuminate\Events\Dispatcher(new Illuminate\Container\Container));
$container->db->connection()->listen(function ($query) use ($app) {
	$app->getContainer()->logger->addDebug('['.($query->time * 1000).' ms] ['.$query->sql.']');
});
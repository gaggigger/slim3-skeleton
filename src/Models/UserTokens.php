<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model as Model;

class UserTokens extends Model {
	
	protected $table = 'user_tokens';
	public $timestamps = true;
	
	public static function generate_token($_size) {
		$token = '';
		$chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
		$chars_length=(strlen($chars)-1);
		for ($i=0; $i<$_size; $i++) {
			$token .= $chars{rand(0, $chars_length)};
		}
		return $token;
	}
	
}
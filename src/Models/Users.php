<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model as Model;

class Users extends Model {

	protected $casts = [
    	'group_admin' => 'integer',
	];
	protected $table = 'users';
	public $timestamps = true;

	public static function isUserInGroup($_user_id, $_route_groups) {
		//check global group
		if (in_array('all', $_route_groups)) {
			return true;
		}
		//check user groups (check all fields that start with 'group_' and match them with route groups)
		$user = \App\Models\Users::find($_user_id);
		if ($user) {
			$user_array = $user->toArray();
			foreach ($user_array as $field => $value) {
				if (substr($field, 0, 6) == 'group_') {
					if (($value == 1) && (in_array(substr($field, 6),$_route_groups))) {
						return true;
					}
				}
			}
		}
		return false;
	}

}
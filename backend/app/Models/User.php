<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'bio',
        'avatar_url',
        'city',
    ];

    protected $hidden = [
        'password',
    ];

    const UPDATED_AT = null;

    public $timestamps = true;
}

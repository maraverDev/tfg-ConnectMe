<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
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
    const UPDATED_AT = null; // 👈 esto evita que Laravel lo busque o devuelva

    public $timestamps = true;

    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}

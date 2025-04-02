<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $table = 'posts';

    protected $fillable = [
        'user_id',
        'image_url',
        'caption',
    ];
    const UPDATED_AT = null; // 👈 esto evita que Laravel lo busque o devuelva

    public $timestamps = true;

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

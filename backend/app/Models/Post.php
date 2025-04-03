<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Post extends Model
{
    protected $table = 'posts';
    public $timestamps = false; // Solo usamos created_at, no updated_at

    protected $fillable = [
        'user_id',
        'image_url',
        'caption',
        'created_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

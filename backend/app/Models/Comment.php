<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Comment extends Model
{
    use HasFactory;

    protected $table = 'comments';

    protected $fillable = [
        'content',
        'user_id',
        'post_id',
    ];

    // Relación con el usuario que hizo el comentario
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relación con el post al que pertenece el comentario
    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}

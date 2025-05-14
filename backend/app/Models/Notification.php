<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'from_user_id',
        'type',
        'message',
        'link',
        'read',
    ];

    // Receptor de la notificación
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Emisor de la notificación
    public function fromUser()
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }
}

?<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrivateMessage extends Model
{
    protected $table = 'private_messages';
    protected $fillable = ['from_id', 'to_id', 'message', 'read'];
    public $timestamps = false;

    protected $casts = [
        'read' => 'boolean',
    ];

    public function fromUser() {
        return $this->belongsTo(User::class, 'from_id');
    }

    public function toUser() {
        return $this->belongsTo(User::class, 'to_id');
    }
}


<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PrivateMessage;
use App\Models\User;
use App\Models\Notification;

use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
       // Obtener conversación entre usuario autenticado y otro usuario
       public function index($userId)
       {
              $authId = auth()->id();

              $messages = \DB::select("
        SELECT * FROM private_messages
        WHERE (from_id = ? AND to_id = ?)
           OR (from_id = ? AND to_id = ?)
        ORDER BY created_at ASC
    ", [$authId, $userId, $userId, $authId]);

              return response()->json($messages);
       }

       public function store(Request $request)
       {
              $fromId = auth()->id();
              $toId = $request->input('to_id');
              $messageText = $request->input('message');

              // Insertar mensaje privado
              \DB::insert("
        INSERT INTO private_messages (from_id, to_id, message)
        VALUES (?, ?, ?)
    ", [$fromId, $toId, $messageText]);

              // Crear notificación solo si el usuario no se está enviando a sí mismo
              if ($fromId !== $toId) {
                     $fromUser = \App\Models\User::find($fromId);

                     \DB::insert("
            INSERT INTO notifications (user_id, from_user_id, type, message, link, `read`)
            VALUES (?, ?, ?, ?, ?, 0)
        ", [
                            $toId,                        // user_id: destinatario del mensaje
                            $fromId,                     // from_user_id: quien lo envió
                            'private_message',           // tipo de notificación
                            $fromUser->name . ' te ha enviado un mensaje privado.',
                            '/chat/' . $fromId           // link directo al chat con el emisor
                     ]);
              }

              return response()->json(['status' => 'ok']);
       }
}

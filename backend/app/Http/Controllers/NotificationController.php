<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    // Obtener notificaciones del usuario autenticado
    public function index()
    {
        $user = Auth::user();

        $notifications = Notification::with('fromUser')
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($notifications);
    }

    // Marcar una notificación como leída
    public function markAsRead($id)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $notification->update(['read' => true]);

        return response()->json(['message' => 'Notificación marcada como leída']);
    }

    // Marcar todas como leídas
    public function markAllAsRead()
    {
        Notification::where('user_id', Auth::id())
            ->where('read', false)
            ->update(['read' => true]);

        return response()->json(['message' => 'Todas las notificaciones marcadas como leídas']);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function getChats($userId)
    {
        $authUserId = request()->get('auth_user_id');

        $chats = Chat::where(function ($query) use ($authUserId, $userId) {
            $query->where('sender_id', $authUserId)
                  ->where('receiver_id', $userId);
        })->orWhere(function ($query) use ($authUserId, $userId) {
            $query->where('sender_id', $userId)
                  ->where('receiver_id', $authUserId);
        })->orderBy('created_at', 'asc')->get();
        // dd( $chats);
        return response()->json($chats);
    }

    public function sendMessage(Request $request)
    {
        $message = Chat::create([
            'sender_id' => $request->sender_id,
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
        ]);

        event(new \App\Events\ChatMessageSent($message));

        return response()->json($message);
    }
}

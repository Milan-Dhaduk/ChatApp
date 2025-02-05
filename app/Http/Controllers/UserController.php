<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {

        $authUserId = request()->get('auth_user_id');
        return response()->json(User::where('id','!=',$authUserId)->orderBy('created_at','desc')->get()); // Fetch all users
    }

}

<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Follow;

class FollowController extends Controller
{
       public function toggleFollow($id)
       {
              $user = auth()->user();

              $follow = Follow::where('follower_id', $user->id)
                     ->where('followed_id', $id)
                     ->first();

              if ($follow) {
                     $follow->delete();
                     return response()->json(['followed' => false]);
              } else {
                     Follow::create([
                            'follower_id' => $user->id,
                            'followed_id' => $id,
                     ]);
                     return response()->json(['followed' => true]);
              }
       }

       public function isFollowing($id)
       {
              $user = auth()->user();

              $isFollowing = Follow::where('follower_id', $user->id)
                     ->where('followed_id', $id)
                     ->exists();

              return response()->json(['followed' => $isFollowing]);
       }
       public function followersCount($id)
       {
              $followers = Follow::where('followed_id', $id)->count();
              return response()->json(['followers' => $followers]);
       }

       public function followingCount($id)
       {
              $following = Follow::where('follower_id', $id)->count();
              return response()->json(['following' => $following]);
       }
}

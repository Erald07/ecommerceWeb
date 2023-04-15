<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function registerUser(Request $request)
    {
        if($request->isMethod('POST')){

            $data = $request->input();

            $userEmail = User::where('email', $data['email'])->exists();
            if(!$userEmail){

                $val = $request->validate([
                    'email' => 'required|:rfc,dns|unique:users,email',
                    'password' => ['required', Password::min(8)->letters()->numbers()->symbols()->mixedCase()],
                    'first_name' => 'required',
                    'last_name' => 'required',
                ]);

                if($val){

                    $user = new User;
                    $user->email = $data['email'];
                    $user->password = Hash::make($data['password']);
                    $user->first_name = $data['first_name'];
                    $user->last_name = $data['last_name'];

                    $user->save();

                    $token = $user->createToken($user->email . '_Token')->plainTextToken;

                    return response()->json([
                        'status' => 200,
                        'message' => "Registration was Successful!",
                        "username" => $data['first_name'],
                        'token' => $token,
                    ]);
                }
                else{
                    return response()->json([
                        'status' => 400,
                        'message' => "Something went wrong."
                    ]);
                }
            }
            else{
                return response()->json([
                    'status' => 400,
                    'message' => "Email already exists.",
                ]);
            }

        }
    }
    public function loginUser(Request $request)
    {   
        if($request->isMethod('POST')){
            $data = $request->input();

            $userDetails = User::where('email', $data['email'])->first();

            if( !$userDetails || !password_verify($data['password'], $userDetails->password)){
                return response()->json([
                    'status' => 400,
                    'message' => "Invalid credentials.!"
                ]);
            }
            else{
                $token = $userDetails->createToken($userDetails->email . '_Token')->plainTextToken;

                return response()->json([
                    'status' => 200,
                    "username" => $userDetails->first_name,
                    'token' => $token,
                    'message' => "Login Successfully!"
                ]);
            }
        }
    }
    public function logout()
    {
        Auth::user()->tokens->each(function ($token, $key) {
            $token->delete();
        });
        return response()->json([
            'status' => 200,
            'message' => "Logged out Successfully!"
        ]);
    }
}

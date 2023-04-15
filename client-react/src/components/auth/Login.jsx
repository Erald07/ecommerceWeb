import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import InputForm from "./InputForm";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';
import GoogleLogin from "react-google-login";
import {refreshTokenSetup} from './refreshTokenSetup';

const clientID = "673056910395-mr6sqjd25cjpclokmj6eff3se85rdhb0.apps.googleusercontent.com";

export default function Login(){

    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    const onSuccess = (res) => {
        console.log('[Login Success] current user: ', res.profileObj);

        refreshTokenSetup(res);
    };

    const onFailure = (res) => {
        console.log('[Login Failed] res: ', res);
    };

    const [values, setValues] = useState({
        email: "",
        password: "",
    });

    const handleShowHide = () => {
        setShow(!show);
    }

    const inputs = [
        {
            id: 1,
            name: "email",
            type: "email",
            placeholder: "Email",
            className: "w-full border outline-gray-400 rounded py-3 px-3 text-gray-700",
            required: true,
        },
        {
            id: 2,
            name: "password",
            type: show ? "text" : "password",
            message: "The password must be at least 8 characters, with uppercase and lowercase letters, numbers and special characters.",
            placeholder: "Password",
            className: "w-full border outline-gray-400 rounded py-3 px-3 text-gray-700",
            butoni: show ? 
                (<FontAwesomeIcon icon={faEye} id="show_hide" className="absolute" onClick={handleShowHide} />) 
                : 
                (<FontAwesomeIcon icon={faEyeSlash} id="show_hide" className="absolute" onClick={handleShowHide} />),
            required: true,
        },
        
    ];

    async function Login(){
        axios.get('http://localhost:8000/sanctum/csrf-cookie').then(response => {
            axios.post("http://localhost:8000/api/login-user", values).then(res => {
                if(res.data.status === 200){

                    localStorage.setItem("auth_token", res.data.token);
                    localStorage.setItem("auth_name", res.data.username);

                    Swal.fire({
                        icon: 'success',
                        title: res.data.message,
                        showConfirmButton: false,
                        timer: 2500
                    });
                    navigate('/');
                }
                else if(res.data.status === 400){
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.data.message,
                    })
                }
            });
        })
    }

    const onChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value});
    }

    return(
        <div className="container pt-16">
            <div className="w-full max-w-md shadow-2xl mx-auto px-3 md:px-8 rounded-xl">
                <h2 className="text-3xl font-norma pt-10">Please log in</h2>
                <div className="mt-6">
                    {inputs.map((input) => (
                        <InputForm key={input.id} {...input} value={values[input.name]} onChange={onChange} />
                    ))}
                    <div className="text-end text-sm underline decoration-1">
                        <Link to={'/forgot-password'}>Forgot password?</Link>
                    </div>
                    <div className="flex items-center pt-6">
                        <button onClick={Login} className="bg-primary hover:bg-white hover:text-primary duration-75 delay-75 outline-primary outline-1 hover:outline text-white w-full font-bold py-3 px-4 rounded-lg focus:outline-none focus:-outline text-sm">
                            LOG IN
                        </button>
                        <div>
                            <GoogleLogin
                                clientId={clientID}
                                buttonText="Login with Google"
                                onSuccess={onSuccess}
                                onFailure={onFailure}
                                cookiePolicy={'single_host_origin'}
                                style={{ marginTop: '100px' }}
                                isSignedIn={true}
                            />
                        </div>
                    </div>
                    <div className="mt-8 px-3 md:px-8 py-4 text-center">
                        <p className="text-sm ">Do not have an account?</p>
                        <Link to={'/register'} className="text-primary uppercase mt-1 hover:underline hover:decoration-1 text-md font-semibold">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function Header() {

    const navigate = useNavigate();
    const [isShown, setIsShown] = useState(false);

    const logoutSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8000/api/logout').then(res => {
            if(res.data.status === 200){
                localStorage.removeItem("auth_token");
                localStorage.removeItem("auth_nome");

                Swal.fire({
                    icon: 'success',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 2500
                });
                navigate('/');
                setIsShown(current => !current);
            }
        });
    }

    var AuthButtons = '';
    if(!localStorage.getItem('auth_token')){
        AuthButtons = (
            <>
            <div className="py-4 px-2 flex">
                <div className="flex-col w-full">
                    <div className="w-full">
                        <Link to={'/login'} className="text-center decoration-none w-full py-2 px-5 rounded-full bg-primary text-white hover:bg-white hover:text-primary duration-75 delay-75 outline-primary outline-1 hover:outline uppercase">LOG IN</Link>
                    </div>
                    {/* <div className="login-google justify-center w-full mt-4">
                        <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />    
                    </div> */}
                </div>
            </div>
            <p className="text-primary text-center"><Link to={'/register'} className="underline underline-offset-4 decoration-solid decoration-primary">Register here</Link></p>
            </>
        );
    }
    else{
        let name = localStorage.getItem("auth_name");
        AuthButtons = (
            <>
            <h2 className="py-2 text-center text-2xl lg:text-lg font-semibold text">Hi {name}!</h2>
            <div className="px-2 flex">
                <button onClick={logoutSubmit} className="text-center decoration-none w-full py-2 px-5 rounded-full bg-primary text-white hover:bg-white hover:text-primary duration-75 delay-75 outline-primary outline-1 hover:outline uppercase">disconnettersi</button>
            </div>
            </>
        );
    }
    return (
        <>
        <div className={"lg:block absolute top-12 right-24 shadow-xl bg-white z-30 w-[270px] space-y-2 py-4 text-center"}>
            {(AuthButtons)}
        </div>
        </>
    )
}

export default Header
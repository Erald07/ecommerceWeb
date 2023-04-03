import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import InputForm from "./InputForm";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';

export default function Login(){

    const navigate = useNavigate();
    const [show, setShow] = useState(false);

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
            message: "La password deve avere almeno 6 caratteri, con lettere maiuscole e minuscole e numeri.",
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
                    localStorage.setItem("auth_nome", res.data.username);

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
                <h2 className="text-3xl font-norma pt-10">Effettua il login</h2>
                <div className="mt-6">
                    {inputs.map((input) => (
                        <InputForm key={input.id} {...input} value={values[input.name]} onChange={onChange} />
                    ))}
                    <div className="text-end text-sm underline decoration-1">
                        <Link to={'/forgot-password'}>Password dimenticata?</Link>
                    </div>
                    <div className="flex items-center pt-6">
                        <button onClick={Login} className="bg-primary hover:bg-white hover:text-primary duration-75 delay-75 outline-primary outline-1 hover:outline text-white w-full font-bold py-3 px-4 rounded-lg focus:outline-none focus:-outline text-sm">
                            ACCEDI
                        </button>
                    </div>
                    <div className="mt-2">
                        <p className="px-3 pt-8 md:px-8 text-sm">Dichiaro di aver letto ed accettato l'<Link className="text-primary underline decoration-1">Informativa sui dati personali</Link></p>
                    </div>
                    <div className="mt-8 px-3 md:px-8 py-4 text-center">
                        <p className="text-sm ">Non hai un account?</p>
                        <Link to={'/register'} className="text-primary uppercase mt-1 hover:underline hover:decoration-1 text-md font-semibold">Registrati</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
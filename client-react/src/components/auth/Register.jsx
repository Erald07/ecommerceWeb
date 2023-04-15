import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import InputForm from "./InputForm";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import Swal from 'sweetalert2';

export const Register = (props) => {
    const navigate = useNavigate();

    const [checked, setChecked] = useState(false);
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [stateDisable, setStateDisable] = useState(true);

    const handleShowHide1 = () => {
        setShow1(!show1);
    }
    const handleShowHide2 = () => {
        setShow2(!show2);
    }

    const [values, setValues] = useState({
        email: "",
        password: "",
        confirm_password: "",
        first_name: "",
        last_name: "",
    });

    const inputs = [
        {
            id: 1,
            name: "email",
            type: "email",
            errorMessage: "Must be a valid email address.",
            placeholder: "Email*",
            className: "w-full border outline-gray-400 rounded py-3 px-3 text-gray-700",
            required: true,
        },
        {
            id: 2,
            name: "password",
            type: show1 ? "text" : "password",
            errorMessage: "Invalid format.",
            message: "The password must be at least 8 characters, with uppercase and lowercase letters, numbers and special characters.",
            placeholder: "Password*",
            pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
            className: "w-full border outline-gray-400 rounded py-3 px-3 text-gray-700 text-left",
            validatee: <div className="validation text-left hidden">
                            <div id="length">
                                <FontAwesomeIcon className="fa-xmark icon" icon={faXmark}/>  
                                <FontAwesomeIcon className="fa-check icon" icon={faCheck}/>  
                                <span className="ml-5">8 characters</span>
                            </div>
                            <div id="lower">
                                <FontAwesomeIcon className="fa-xmark icon" icon={faXmark}/>  
                                <FontAwesomeIcon className="fa-check icon" icon={faCheck}/>  
                                <span className="ml-5">A lowercase letter</span>
                            </div>
                            <div id="capital">
                                <FontAwesomeIcon className="fa-xmark icon" icon={faXmark}/>  
                                <FontAwesomeIcon className="fa-check icon" icon={faCheck}/>  
                                <span className="ml-5">A capital letter</span>
                            </div>
                            <div id="number">
                                <FontAwesomeIcon className="fa-xmark icon" icon={faXmark}/>  
                                <FontAwesomeIcon className="fa-check icon" icon={faCheck}/>  
                                <span className="ml-5">Number</span>
                            </div>
                            <div id="special">
                                <FontAwesomeIcon className="fa-xmark icon" icon={faXmark}/>  
                                <FontAwesomeIcon className="fa-check icon" icon={faCheck}/>  
                                <span className="ml-5">Special character</span>
                            </div>
                        </div>,
            butoni: show1 ? 
                (<FontAwesomeIcon icon={faEye} id="show_hide" className="absolute" onClick={handleShowHide1} />) 
                : 
                (<FontAwesomeIcon icon={faEyeSlash} id="show_hide" className="absolute" onClick={handleShowHide1} />),
            required: true,
        },
        {
            id: 3,
            name: "confirm_password",
            type: show2 ? "text" : "password",
            errorMessage: "Passwords don't match.",
            placeholder: "Confirm password*",
            className: "w-full border outline-gray-400 rounded py-3 px-3 text-gray-700",
            butoni: show2 ? 
                (<FontAwesomeIcon icon={faEye} id="show_hide_confirm" className="absolute" onClick={handleShowHide2} />) 
                : 
                (<FontAwesomeIcon icon={faEyeSlash} id="show_hide_confirm" className="absolute" onClick={handleShowHide2} />),
            required: true,
        },
        {
            id: 4,
            name: "first_name",
            type: "text",
            errorMessage: "Required.",
            placeholder: "First name*",
            className: "w-full border outline-gray-400 rounded py-3 px-3 text-gray-700",
            required: true,
        },
        {
            id: 5,
            name: "last_name",
            type: "text",
            errorMessage: "Required.",
            placeholder: "Last name*",
            className: "w-full border outline-gray-400 rounded py-3 px-3 text-gray-700",
            required: true,
        },
    ];

    async function Save(){
        axios.get('http://localhost:8000/sanctum/csrf-cookie').then(response => {
            axios.post("http://localhost:8000/api/register-user", values).then(res => {
                if(res.data.status === 200){
                    localStorage.setItem("auth_token", res.data.token);
                    localStorage.setItem("auth_name", res.data.username);

                    Swal.fire({
                        icon: 'success',
                        title: res.data.message,
                        showConfirmButton: false,
                        timer: 2500
                    }).then(function() {
                        navigate('/');
                    });
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

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const valid = (item, v_icon, inv_icon) => {

        let valid_icon = document.querySelector(`#${item} .${v_icon}`);
        valid_icon.style.opacity = "1";

        let invalid_icon = document.querySelector(`#${item} .${inv_icon}`);
        invalid_icon.style.opacity = "0";
    }

    const invalid = (item, v_icon, inv_icon) => {

        let valid_icon = document.querySelector(`#${item} .${v_icon}`);
        valid_icon.style.opacity = "0";

        let invalid_icon = document.querySelector(`#${item} .${inv_icon}`);
        invalid_icon.style.opacity = "1";
    }

    const onChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value});

        if(e.target.name === 'password'){
            var password = e.target.value;

            if(password.match(/[A-Z]/)){
                valid("capital", "fa-check", "fa-xmark");
            }
            else{
                invalid("capital", "fa-check", "fa-xmark");
            }
            if(password.match(/[0-9]/)){
                valid("number", "fa-check", "fa-xmark");
            }
            else{
                invalid("number", "fa-check", "fa-xmark");
            }
            if(password.match(/[a-z]/)){
                valid("lower", "fa-check", "fa-xmark");
            }
            else{
                invalid("lower", "fa-check", "fa-xmark");
            }
            if(password.length > 7){
                valid("length", "fa-check", "fa-xmark");
            }
            else{
                invalid("length", "fa-check", "fa-xmark");
            }
            if(password.match(/[!@#$%^&*]/)){
                valid("special", "fa-check", "fa-xmark");
            }
            else{
                invalid("special", "fa-check", "fa-xmark");
            }
        }

        if(e.target.name === 'confirm_password'){
            var confirm_password = e.target.value;

            if(confirm_password !== values.password){
                // values.confirm_password.errorMessage.style.display = 'block';
            }
            else{
                // confirm_password.errorMessage = 'hidden';
            }
        }

        if(e.target.name === 'password' && e.target.value !== ''){
            const validate = document.querySelector('.validation');
            validate.style.display = 'block';
        }
    }

    const canBeSubmitted = () => {

        const isValid = 
            values.email.trim().match("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$") &&
            values.password.trim().match(/[A-Z]/) &&
            values.password.trim().match(/[a-z]/) &&
            values.password.trim().match(/[0-9]/) &&
            values.password.trim().length > 7 &&
            values.password.trim().match(/[!@#$%^&*]/) &&
            values.confirm_password === values.password &&
            values.first_name.trim().length > 0 && 
            values.last_name.trim().length > 0 &&
            checked;
        
        if(isValid){
            setStateDisable(false);
        }
        else{
            setStateDisable(true);
        }
    };

    useEffect(() => canBeSubmitted());
     
    const handleCheck = () => {
        setChecked(!checked);
    }

    return(
        <div className="container pt-16">
            <div onSubmit={handleSubmit} className="w-full max-w-md shadow-2xl mx-auto px-3 md:px-8 rounded-xl mb-4">
                <h2 className="text-3xl font-norma pt-10 px-4">Please register</h2>
                <div className="mt-6 px-4">
                    {inputs.map((input) => (
                        <InputForm key={input.id} {...input} value={values[input.name]} onChange={onChange} />
                    ))}
                </div>
                <div className="mb-4 flex px-4">
                    <input id="conditions" onChange={handleCheck} checked={checked} type="checkbox" className="w-6 h-6 items-center my-auto" />
                    <p className="ml-8">I declare that I have read and accepted the information on personal data. *</p>
                </div>
                <div className="py-4 px-4">
                    <button onClick={Save} disabled={stateDisable} id="register" className="text-center">SIGN IN</button>
                </div>
            </div>
        </div>
    )
}

export default Register;
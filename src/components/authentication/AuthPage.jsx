import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/auth';

function AuthPage() {
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();

    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const [isLogin, setIsLogin] = useState(true);

    const [isLoading, setIsLoading] = useState(false);

    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        let confirmPassword;

        setIsLoading(true);

        if (password === password) {
            setPasswordsMatch(true);

            let url;
            if (isLogin) {
                url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDQxqWAXQVnifXhqishJ95EfgRZb9DOkq0';
            } else {
                confirmPassword = confirmPasswordRef.current.value;
                url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDQxqWAXQVnifXhqishJ95EfgRZb9DOkq0';
            }
            fetch(
                url,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        email: email,
                        password: password,
                        returnSecureToken: true
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).then((response) => {
                setIsLoading(false);

                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then((data) => {
                        let errorMessage = 'Authentication failed!';
                        if (data && data.error && data.error.message) {
                            errorMessage = data.error.message;
                        }
                        throw new Error(errorMessage);
                    });
                }
            }).then((data) => {
                dispatch(authActions.login({ token: data.idToken, email: data.email }));

                navigate('/profile');
            })
                .catch((error) => {
                    alert(error.message);
                });
            emailRef.current.value = '';
            passwordRef.current.value = '';
            if (!isLogin) {
                confirmPasswordRef.current.value = '';
            }
        } else {
            setPasswordsMatch(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="card shadow-lg">
                        <div className="card-body p-5">
                            <h3 className="card-title text-center mb-4">{isLogin ? 'Login' : 'Sign Up'}</h3>
                            <form onSubmit={submitHandler}>
                                <div className="form-group mb-3">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Enter email"
                                        ref={emailRef}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Enter password"
                                        ref={passwordRef}
                                        required
                                    />
                                </div>
                                {!isLogin && (<div className="form-group mb-3">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        placeholder="Confirm password"
                                        ref={confirmPasswordRef}
                                        required
                                    />
                                    {!passwordsMatch && <p className="text-danger mt-2">Passwords do not match</p>}
                                </div>)}
                                {!isLoading && <button type="submit" className="btn btn-primary btn-block">{isLogin ? 'Login' : 'Sign Up'}</button>}
                                {isLoading && <p>Sending request...</p>}

                                {isLogin && (<div className="text-center mt-3">
                                    <NavLink to="/resetPassword">Forgot password?</NavLink>
                                </div>)}
                            </form>
                        </div>
                    </div>
                    <div className="card mt-3">
                        <div className="card-body text-center">
                            <p className="mb-3">{isLogin ? 'Do not have an account?' : 'Already have an account?'}</p>
                            <button
                                type='button'
                                className="btn btn-info"
                                onClick={switchAuthModeHandler}
                            >{isLogin ? 'SignUp' : 'Login'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;

import React, { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

function ResetPassword() {
    const emailRef = useRef();

    const [isLoading, setIsLoading] = useState(false);

    const [message, setMessage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = emailRef.current.value;
        setIsLoading(true);

        fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDQxqWAXQVnifXhqishJ95EfgRZb9DOkq0',
            {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    requestType: "PASSWORD_RESET"
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
            setMessage('You would recieve a password reset link in your mail ID which you entered above.');
            console.log("reset", data);
            setIsLoading(false);
        })
            .catch((error) => {
                setMessage(error.message);
            });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg">
                        <div className="card-body p-5">
                            <h3 className="card-title text-center mb-4">Forgot Password</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Enter your email"
                                        ref={emailRef}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-block"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Sending...' : 'Submit'}
                                </button>
                                {message && (
                                    <div className="alert text-success mt-1" role="alert">
                                        {message}
                                    </div>
                                )}
                            </form>
                            <div className="text-center mt-3">
                                <NavLink to="/">Back to login</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;

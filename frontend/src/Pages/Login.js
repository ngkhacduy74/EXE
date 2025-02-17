import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {

    const [users, setUsers] = useState([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();



    const handleLogin = (e) => {
        e.preventDefault();
        const user = users.find(user => user.email === email && user.password === password);
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/');
        } else {
            alert('Invalid email or password');
        }
    }


    const handleChange = (e) => {
        if (e.target.name === 'email') {
            setEmail(e.target.value);
        } else {
            setPassword(e.target.value);
        }
    }



    return (
        <section className="vh-100" style={{ backgroundColor: '#508BFC' }}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-xl-10">
                        <div className="card" style={{ borderRadius: '1rem' }}>
                            <div className="row g-0">
                                <div className="col-md-6 col-lg-5 d-none d-md-block">
                                    <img
                                        src="../images/Community.jpg"
                                        alt="login form"
                                        className="img-fluid"
                                        style={{ borderRadius: '1rem 0 0 1rem', height: '100%', width: '100%' }}
                                    />
                                </div>
                                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                    <div className="card-body p-4 p-lg-5 text-black">

                                        <form onSubmit={handleLogin}>
                                            <div className="d-flex align-items-center mb-3 pb-1">
                                                <i className="fas fa-cubes fa-2x me-3" style={{ color: '#ff6219' }}></i>
                                                <span className="h1 fw-bold mb-0">Vinsaky</span>
                                            </div>

                                            <div data-mdb-input-init className="form-outline mb-4">
                                                <label
                                                    className="form-label"
                                                    htmlFor="form2Example17"
                                                    style={{
                                                        fontSize: '1.1rem',
                                                        color: '#393f81',
                                                        fontWeight: '500',
                                                        marginTop: '8px',
                                                        textAlign: 'left',
                                                        display: 'block',
                                                    }}
                                                >
                                                    Email address
                                                </label>
                                                <input type="email"
                                                    id="form2Example17"
                                                    className="form-control form-control-lg"
                                                    name='email' value={email}
                                                    onChange={handleChange} />
                                            </div>

                                            <div data-mdb-input-init className="form-outline mb-4">
                                                <label
                                                    className="form-label"
                                                    htmlFor="form2Example27"
                                                    style={{
                                                        fontSize: '1.1rem',
                                                        color: '#393f81',
                                                        fontWeight: '500',
                                                        marginTop: '8px',
                                                        textAlign: 'left',
                                                        display: 'block',
                                                    }}
                                                >
                                                    Password
                                                </label>
                                                <input type="password"
                                                    id="form2Example27"
                                                    className="form-control form-control-lg"
                                                    name='password' value={password}
                                                    onChange={handleChange} />
                                            </div>

                                            <div className="pt-1 mb-4">
                                                <button
                                                    data-mdb-button-init
                                                    data-mdb-ripple-init
                                                    className="btn btn-dark btn-lg btn-block"
                                                    type="submit"
                                                >
                                                    Login
                                                </button>
                                            </div>

                                            <a className="text-primary" style={{cursor: 'pointer'}} onClick={() => navigate('/forgotPassword')}>Forgot password?</a>
                                            <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>
                                                Don't have an account? <a onClick={() => navigate('/register')} style={{ color: '#393f81', cursor: 'pointer' }}><span className="text-primary">Register here</span></a>
                                            </p>
                                            <a className="text-primary">Terms of use.</a>
                                            <a className="text-primary">Privacy policy</a>
                                        </form>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;

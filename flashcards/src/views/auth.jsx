import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const { login, setUser } = useAuth(); // Extract login and setUser from authContext
    const navigate = useNavigate(); // Initialize useNavigate

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            try {
                login(username); // Call the login function
                navigate("/"); // Redirect to the home page
            } catch (error) {
                alert("Login failed: " + error.message);
            }
        } else {
            alert("Sign-up functionality not implemented yet.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center">
                                {isLogin ? "Login" : "Sign Up"}
                            </h3>
                            <form onSubmit={handleSubmit}>
                                {!isLogin && (
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            placeholder="Enter your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                )}
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">
                                    {isLogin ? "Login" : "Sign Up"}
                                </button>
                            </form>
                            <div className="text-center mt-3">
                                <button
                                    className="btn btn-link"
                                    onClick={toggleForm}
                                >
                                    {isLogin
                                        ? "Don't have an account? Sign Up"
                                        : "Already have an account? Login"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
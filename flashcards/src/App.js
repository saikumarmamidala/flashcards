import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, PrivateRoute } from "./context/authContext";
import Auth from "./views/auth";
import Home from "./views/home";


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<PrivateRoute element={<Home />} />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

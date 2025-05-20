import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AdminPage from "./Admin/Dashboard";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import OTP from "./Pages/OTP";
import ManaAccount from "./Admin/ManaAccount";
import UserDetails from "./Admin/UserDetails";
import ManaProduct from "./Admin/ManaProduct";
import ProductDetails from "./Admin/ProductDetail";
import ManaPost from "./Admin/ManaPost";
import ProductDetail from "./Pages/ProductDetail";
import ErrorPage from "./Components/ErrorPage";


const App = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/test")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp" element={<OTP />} />

          {/* UI ADMIN */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/manaAccount" element={<ManaAccount />} />
         <Route path="/user/:userId" element={<UserDetails />} />
          <Route path="/user/:userId" element={<UserDetails />} />
          <Route path="/manaProduct" element={<ManaProduct />} />
          <Route path="/manaPost" element={<ManaPost />} />
          <Route path="/products/:productId" element={<ProductDetails />} />
          <Route path="/product/:productId" element={<ProductDetail />} />




        </Routes>
      </div>
    </Router>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Import Bootstrap JavaScript
import * as bootstrap from 'bootstrap';

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
import PostDetails from "./Admin/PostDetatil";
// import ProductDetail from "./Pages/ProductDetail";
import ErrorPage from "./Components/ErrorPage";
import NewPostForm from "./Components/NewPost";
import CreateProduct from "./Admin/CreateProduct";
import ProductBrowser  from "./Pages/ProductBrowser";
import CompareProduct from "./Pages/CompareProduct";
import MultiProductViewer from "./Admin/MultiProductViewer";
import Profile from "./Pages/Profile";
import ProductView from "./Pages/ProductView";
import CreatePost from "./Admin/CreatePost";


const App = () => {
  const [message, setMessage] = useState("");

  // Make Bootstrap available globally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.bootstrap = bootstrap;
    }
  }, []);

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

          {/* UI USER */}
          <Route path='/' element={<Home/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/newPost" element={<NewPostForm />} />
          <Route path="/profile" element={<Profile />} />
            <Route path="/productView/:productId" element={<ProductView />} />
          {/* UI ADMIN */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/manaAccount" element={<ManaAccount />} />
         <Route path="/user/:userId" element={<UserDetails />} />
          <Route path="/user/:userId" element={<UserDetails />} />
          <Route path="/manaProduct" element={<ManaProduct />} />
          <Route path="/manaPost" element={<ManaPost />} />
          <Route path="/multiProductViewer" element={<MultiProductViewer />} />
          <Route path="/post/:postId" element={<PostDetails />} />
          {/* Error Page */}
          <Route path="/product/:productId" element={<ProductDetails />} />
          
          
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/product-browser" element={<ProductBrowser />} />
          <Route path="/compare-product" element={<CompareProduct />} />
          {/* 404 Error Page */}




        </Routes>
      </div>
    </Router>
  );
};

export default App;

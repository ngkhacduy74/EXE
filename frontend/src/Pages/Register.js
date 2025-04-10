import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [repeatPassword, setRepeatPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  const [addUser, setAddUser] = useState({
    fullname: "",
    bio: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    roleId: "user",
    avatar: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "repeatPassword") {
      setRepeatPassword(value);
    } else if (type === "checkbox") {
      setTermsAccepted(checked);
    } else {
      setAddUser({ ...addUser, [name]: value });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      alert("You must accept the terms and conditions.");
      return;
    }

    if (
      !addUser.fullname ||
      !addUser.email ||
      !addUser.password ||
      !repeatPassword
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (addUser.password !== repeatPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Check if the email already exists
      const usersResponse = await axios.get("http://localhost:4000/auth/users");
      const existingAccount = usersResponse.data.find(
        (user) => user.email === addUser.email
      );

      if (existingAccount) {
        alert("Email already exists");
        return;
      }

      // Register new user
      await axios.post("http://localhost:4000/auth/register", addUser);
      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration.");
    }
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#eee" }}>
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{ borderRadius: "25px" }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5">
                    <img
                      onClick={() => navigate("/login")}
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/BackButton.svg/2048px-BackButton.svg.png"
                      width="50px"
                      alt="Back"
                      style={{ cursor: "pointer", float: "left" }}
                    />
                    <p className="text-center h1 fw-bold mb-5 mt-4">Sign up</p>

                    <form onSubmit={handleRegister}>
                      <div className="mb-4">
                        <label className="form-label fw-bold">Your Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="fullname"
                          value={addUser.fullname}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-bold">Your Email</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={addUser.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-bold">Your Phone</label>
                        <input
                          type="text"
                          className="form-control"
                          name="phone"
                          value={addUser.phone}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-bold">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          value={addUser.password}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-bold">
                          Repeat Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          name="repeatPassword"
                          value={repeatPassword}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-check mb-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="termsAccepted"
                          checked={termsAccepted}
                          onChange={handleChange}
                        />
                        <label className="form-check-label">
                          I agree to the <a href="#">Terms of Service</a>
                        </label>
                      </div>

                      <div className="d-flex justify-content-center">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg"
                        >
                          Register
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                      className="img-fluid"
                      alt="Sample"
                    />
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

export default Register;

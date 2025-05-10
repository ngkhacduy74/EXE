import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import "./styles/UserDetails.css";

export default function UserDetails() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/user/${userId}`
        );
        setUser(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user details");
      }
    };

    fetchUser();
  }, [userId]);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading…</p>;
  console.log("8iuasd", user.user);
  return (
    <Container fluid className="bg-light" style={{ minHeight: "100vh" }}>
      <Row>
        <Col
          md="auto"
          style={{
            width: "250px",
            background: "#2c3e50",
            color: "white",
            padding: 0,
          }}
        >
          <Sidebar />
        </Col>
        <Col>
          <div className="container emp-profile">
            <form method="post">
              <div className="row">
                <div className="col-md-4">
                  <div className="profile-img">
                    <img
                      src="https://res.cloudinary.com/dtdwjplew/image/upload/v1737903159/9_gnxlmk.jpg"
                      alt="Profile"
                    />
                    <div className="file btn btn-lg btn-primary">
                      Change Photo
                      <input type="file" name="file" />
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="profile-head">
                    <h5>{user.user[0].fullname || "Name here"}</h5>

                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                      <li className="nav-item">
                        <a
                          className="nav-link active"
                          id="home-tab"
                          data-toggle="tab"
                          href="#home"
                          role="tab"
                          aria-controls="home"
                          aria-selected="true"
                        >
                          About
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          id="profile-tab"
                          data-toggle="tab"
                          href="#profile"
                          role="tab"
                          aria-controls="profile"
                          aria-selected="false"
                        >
                          Timeline
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-2">
                  <input
                    type="submit"
                    className="profile-edit-btn"
                    name="btnAddMore"
                    value="Edit Profile"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="profile-work">
                    <p>WORK LINK</p>
                    <a href="">Website Link</a>
                    <br />
                    <a href="">Bootsnipp Profile</a>
                    <br />
                    <a href="">Bootply Profile</a>
                    <p>SKILLS</p>
                    <a href="">Web Designer</a>
                    <br />
                    <a href="">Web Developer</a>
                    <br />
                    <a href="">WordPress</a>
                    <br />
                    <a href="">WooCommerce</a>
                    <br />
                    <a href="">PHP, .Net</a>
                    <br />
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="tab-content profile-tab" id="myTabContent">
                    <div
                      className="tab-pane fade show active"
                      id="home"
                      role="tabpanel"
                      aria-labelledby="home-tab"
                    >
                      <div className="row">
                        <div className="col-md-3">
                          <label>Full Name</label>
                        </div>
                        <div className="col-md-6">
                          <p>{user.user[0].fullname || "On fix :("}</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <label>Phone Number</label>
                        </div>
                        <div className="col-md-6">
                          <p>{user.user[0].phone || "Dont have XD"}</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <label>Address</label>
                        </div>
                        <div className="col-md-6">
                          <p>{user.user[0].address || "Fix Yea"}</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <label>Phone</label>
                        </div>
                        <div className="col-md-6">
                          <p>{user.user[0].phone || "123 456 7890"}</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <label>Profession</label>
                        </div>
                        <div className="col-md-6">
                          <p>Web Developer and Designer</p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="profile"
                      role="tabpanel"
                      aria-labelledby="profile-tab"
                    >
                      <div className="row">
                        <div className="col-md-6">
                          <label>Experience</label>
                        </div>
                        <div className="col-md-6">
                          <p>Expert</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <label>Hourly Rate</label>
                        </div>
                        <div className="col-md-6">
                          <p>10$/hr</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <label>Total Projects</label>
                        </div>
                        <div className="col-md-6">
                          <p>230</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <label>English Level</label>
                        </div>
                        <div className="col-md-6">
                          <p>Expert</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <label>Availability</label>
                        </div>
                        <div className="col-md-6">
                          <p>6 months</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <label>Your Bio</label>
                          <br />
                          <p>Your detail description</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

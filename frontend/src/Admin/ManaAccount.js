import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Nav, Table, Button, Form, FormControl } from "react-bootstrap";
import { FaUserCircle, FaBell, FaCog, FaChartBar, FaUser, FaUsersCog, FaHome } from "react-icons/fa";
import Sidebar from "../Components/Sidebar";
import { useNavigate } from "react-router-dom";
import HeaderAdmin from "../Components/HeaderAdmin";
import ErrorPage from "../Components/ErrorPage";
import UpdateRole from "./UpdateRole";

function ManaAccount() {
  // Sample data embedded in the component
  

  return (
    <Container fluid className="bg-light" style={{ minHeight: "100vh" }}>
      {/* Header */}
      <HeaderAdmin />

      <Row>
        {/* Sidebar */}
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

        {/* Main Content */}
        <Col style={{ marginLeft: "10px" }} className="p-4">
          {/* Manage Users Section */}
          <div id="manage-users" className="mb-5">
            <h3 className="mb-4">Manage Users</h3>
            <Table
              striped
              bordered
              hover
              className="shadow-sm"
              style={{ borderRadius: "15px", overflow: "hidden" }}
            >
              <thead className="bg-primary text-white">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    
      </Container>
    );
  }
  export default ManaAccount;
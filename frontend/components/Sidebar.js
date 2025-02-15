import React from "react";
import { Nav } from "react-bootstrap";
import { FaChartBar, FaUser, FaUsersCog, FaLayerGroup, FaBell, FaEnvelope, FaFileAlt, FaExclamationTriangle, FaCommentDots } from "react-icons/fa";
import { MdReport } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();

    return (
        <div
            style={{
                background: "#2c3e50",
                color: "white",
                minHeight: "100vh",
                padding: "20px",
            }}
        >
            <h5 className="text-center mb-4">Admin Panel</h5>
            <Nav className="flex-column">
                <Nav.Link
                    className="text-white mb-3 d-flex align-items-center"
                    onClick={() => navigate('/setting')}
                >
                    <FaChartBar className="me-2" /> Dashboard
                </Nav.Link>
                <Nav.Link
                    className="text-white d-flex align-items-center"
                    onClick={() => navigate('/manaAccount')}
                >
                    <FaUsersCog className="me-2" /> Manage Accounts
                </Nav.Link>
                <Nav.Link
                    className="text-white d-flex align-items-center"
                    onClick={() => navigate('/manaCategory')}
                >
                    <FaLayerGroup className="me-2" /> Manage Category
                </Nav.Link>
                <Nav.Link
                    className="text-white d-flex align-items-center"
                    onClick={() => navigate('/manaPost')}
                >
                    <FaFileAlt className="me-2" /> Manage Posts
                </Nav.Link>
                <Nav.Link
                    className="text-white d-flex align-items-center"
                    onClick={() => navigate('/manaComment')}
                >
                    <FaCommentDots className="me-2" /> Manage Comments
                </Nav.Link>

                <Nav.Link
                    className="text-white mb-3 d-flex align-items-center"
                    onClick={() => navigate('/report')}
                >
                    <FaExclamationTriangle className="me-2" /> Report
                </Nav.Link>
            </Nav>
        </div>
    );
}

export default Sidebar;

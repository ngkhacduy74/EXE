import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Sidebar from "../Components/Sidebar";
import { useNavigate } from "react-router-dom";
import HeaderAdmin from "../Components/HeaderAdmin";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Setting() {
  // Sample data embedded in the component
  const sampleData = {
    summary: {
      totalUsers: 1200,
      totalCategories: 15,
      totalPosts: 450,
      totalComments: 2300,
    },
    postsByYear: {
      2023: [30, 25, 40, 35, 50, 45, 60, 55, 70, 65, 80, 75],
      2024: [40, 35, 50, 45, 60, 55, 70, 65, 80, 75, 90, 85],
      2025: [50, 45, 60, 55, 0, 0, 0, 0, 0, 0, 0, 0], // Partial data for 2025 (up to April)
    },
  };

  // State initialization
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalCategories: 0,
    totalPosts: 0,
    totalComments: 0,
  });
  const [postsByMonth, setPostsByMonth] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const navigate = useNavigate();

  // Set initial data on component mount
  useEffect(() => {
    // Update dashboard summary
    setDashboardData(sampleData.summary);

    // Update available years
    const years = Object.keys(sampleData.postsByYear).map(Number);
    setAvailableYears(years);

    // Set initial posts for the selected year
    setPostsByMonth(sampleData.postsByYear[selectedYear] || Array(12).fill(0));
  }, [selectedYear]); // Re-run when selectedYear changes to update chart

  const chartData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: `Number of Posts in ${selectedYear}`,
        data: postsByMonth,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Monthly Posts Statistics for ${selectedYear}`,
      },
    },
  };

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
          {/* Dashboard Section */}
          <div id="dashboard" className="mb-5">
            <h3 className="mb-4">Dashboard</h3>
            <Row className="g-4">
              <Col md={3}>
                <Card className="text-center shadow-sm" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <Card.Title>Total Users</Card.Title>
                    <Card.Text className="fs-4 text-success">{dashboardData.totalUsers}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <Card.Title>Total Categories</Card.Title>
                    <Card.Text className="fs-4 text-info">{dashboardData.totalCategories}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <Card.Title>Total Posts</Card.Title>
                    <Card.Text className="fs-4 text-primary">{dashboardData.totalPosts}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm" style={{ borderRadius: "15px" }}>
                  <Card.Body>
                    <Card.Title>Total Comments</Card.Title>
                    <Card.Text className="fs-4 text-warning">{dashboardData.totalComments}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Chart Section */}
          <div id="chart" className="mt-5">
            <h3 className="mb-4">Posts Statistics</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "10px",
              }}
            >
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                style={{
                  width: "150px",
                  height: "35px",
                  fontSize: "14px",
                  padding: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <Card className="shadow-sm" style={{ borderRadius: "15px" }}>
              <Card.Body>
                <Bar data={chartData} options={chartOptions} />
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Setting;
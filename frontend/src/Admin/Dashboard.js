import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Sidebar from "../Components/Sidebar"; // Ensure this component exists
import { useNavigate } from "react-router-dom";
import HeaderAdmin from "../Components/HeaderAdmin"; // Ensure this component exists
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Setting() {
  const [dashboardData, setDashboardData] = useState({
    totalPosts: 0,
    totalUsers: 0,
    totalComments: 0,
    totalCategories: 0,
  });
  const [postsByMonth, setPostsByMonth] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const navigate = useNavigate();

  // Mock data instead of API calls
  useEffect(() => {
    // Sample dashboard data
    const mockDashboardData = {
      totalUsers: 150,
      totalCategories: 12,
      totalPosts: 320,
      totalComments: 850,
    };
    setDashboardData(mockDashboardData);

    // Sample posts data for multiple years
    const mockPosts = [
      { createdTime: "2023-01-15", id: 1 },
      { createdTime: "2023-02-10", id: 2 },
      { createdTime: "2023-02-20", id: 3 },
      { createdTime: "2023-03-05", id: 4 },
      { createdTime: "2023-06-12", id: 5 },
      { createdTime: "2023-07-18", id: 6 },
      { createdTime: "2023-07-19", id: 7 },
      { createdTime: "2024-01-25", id: 8 },
      { createdTime: "2024-03-14", id: 9 },
      { createdTime: "2024-04-02", id: 10 },
      { createdTime: "2024-04-03", id: 11 },
      { createdTime: "2024-05-22", id: 12 },
      { createdTime: "2024-08-30", id: 13 },
      { createdTime: "2025-02-11", id: 14 },
    ];

    // Extract unique years
    const years = [
      ...new Set(
        mockPosts.map((post) =>
          new Date(post.createdTime).getFullYear()
        )
      ),
    ].sort((a, b) => b - a);
    setAvailableYears(years);

    // Count posts by month for selected year
    const counts = Array(12).fill(0);
    mockPosts.forEach((post) => {
      const date = new Date(post.createdTime);
      const year = date.getFullYear();
      if (year === selectedYear) {
        const month = date.getMonth(); // 0-11
        counts[month]++;
      }
    });
    setPostsByMonth(counts);
  }, [selectedYear]);

  // Chart config
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
      "12月",
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
      legend: { position: "top" },
      title: {
        display: true,
        text: `Monthly Posts Statistics for ${selectedYear}`,
      },
    },
  };

  return (
    <Container fluid className="bg-light" style={{ minHeight: "100vh" }}>
      <HeaderAdmin />
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
        <Col className="p-4">
          <h3 className="mb-4">Dashboard</h3>
          <Row className="g-4">
            <DashboardCard
              title="Total Users"
              value={dashboardData.totalUsers}
              color="success"
            />
            <DashboardCard
              title="Total Categories"
              value={dashboardData.totalCategories}
              color="info"
            />
            <DashboardCard
              title="Total Posts"
              value={dashboardData.totalPosts}
              color="primary"
            />
            <DashboardCard
              title="Total Comments"
              value={dashboardData.totalComments}
              color="warning"
            />
          </Row>

          <div className="mt-5">
            <h3 className="mb-4">Posts Statistics</h3>
            <div className="d-flex justify-content-end mb-3">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="form-select w-auto"
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

// Reusable card component
const DashboardCard = ({ title, value, color }) => (
  <Col md={3}>
    <Card className="text-center shadow-sm" style={{ borderRadius: "15px" }}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text className={`fs-4 text-${color}`}>{value}</Card.Text>
      </Card.Body>
    </Card>
  </Col>
);

export default Setting;
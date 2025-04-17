import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Sidebar from "../Components/Sidebar";
import HeaderAdmin from "../Components/HeaderAdmin";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalCategories: 0,
    totalPosts: 0,
    totalComments: 0,
  });
  const [postsByMonth, setPostsByMonth] = useState(Array(12).fill(0));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sampleData = {
    summary: { totalUsers: 1200, totalCategories: 15, totalPosts: 450, totalComments: 2300 },
    postsByYear: {
      2023: [30, 25, 40, 35, 50, 45, 60, 55, 70, 65, 80, 75],
      2024: [40, 35, 50, 45, 60, 55, 70, 65, 80, 75, 90, 85],
      2025: [50, 45, 60, 55, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  };

  useEffect(() => {
    setIsLoading(true);
    try {
      setDashboardData(sampleData.summary || {});
      const years = Object.keys(sampleData.postsByYear).map(Number);
      setAvailableYears(years);
      setPostsByMonth(sampleData.postsByYear[selectedYear] || Array(12).fill(0));
    } catch (error) {
      console.error("Error processing dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedYear]);

  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
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
      title: { display: true, text: `Monthly Posts Statistics for ${selectedYear}` },
    },
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Container fluid className="bg-light" style={{ minHeight: "100vh" }}>
      <HeaderAdmin />
      <Row>
        <Col md="auto" style={{ width: "250px", background: "#2c3e50", color: "white", padding: 0 }}>
          <Sidebar />
        </Col>
        <Col style={{ marginLeft: "10px" }} className="p-4">
          <div id="dashboard" className="mb-5">
            <h3 className="mb-4">Dashboard</h3>
            <Row className="g-4">
              {/* Summary cards... */}
            </Row>
          </div>
          <div id="chart" className="mt-5">
            <h3 className="mb-4">Posts Statistics</h3>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                aria-label="Select year for posts statistics"
                style={{ width: "150px", height: "35px", fontSize: "14px", padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
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
                <div style={{ maxWidth: "100%", overflowX: "auto" }}>
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard;
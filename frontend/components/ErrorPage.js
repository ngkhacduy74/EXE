import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

function ErrorPage() {
    return (
        <Container fluid className="text-center bg-light vh-100 d-flex flex-column justify-content-center align-items-center">
            <Row>
                <Col>
                    <h1 className="display-1 text-danger fw-bold">404</h1>
                    <h2 className="mb-4 text-secondary">Oops! Page Not Found</h2>
                    <p className="mb-4 text-muted">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <Button
                        variant="primary"
                        size="lg"
                        href="/"
                        className="px-5 rounded-pill shadow"
                    >
                        Back to Home
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default ErrorPage;

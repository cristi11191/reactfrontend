// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaUserGraduate, FaChalkboardTeacher, FaUsers, FaClipboardCheck, FaBookOpen, FaFileAlt, FaUserFriends, FaGraduationCap } from 'react-icons/fa';
import './adminpanel.css'; // Import custom styles
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import FontAwesome icons

export default function AdminPanel() {
    const userRole = localStorage.getItem('role'); // Get the user's role from localStorage

    // Check if the user has the admin role
    if (userRole !== 'Admin') {
        return (
                <div >You do not have access to this section.</div>
        );
    }

    return (
        <div>
            <Container fluid>
                <Row className="counter-row mt-4">
                    <Col lg={3} md={6} sm={12} className="counter-section">
                        <i className="medium-icon"><FaUserGraduate /></i>
                        <span className="counter-number">1,245</span>
                        <span className="counter-title">Students</span>
                    </Col>

                    <Col lg={3} md={6} sm={12} className="counter-section">
                        <i className="medium-icon"><FaChalkboardTeacher /></i>
                        <span className="counter-number">45</span>
                        <span className="counter-title">Teachers</span>
                    </Col>

                    <Col lg={3} md={6} sm={12} className="counter-section">
                        <i className="medium-icon"><FaUsers /></i>
                        <span className="counter-number">12</span>
                        <span className="counter-title">Secretaries</span>
                    </Col>

                    <Col lg={3} md={6} sm={12} className="counter-section">
                        <i className="medium-icon"><FaClipboardCheck /></i>
                        <span className="counter-number">100</span>
                        <span className="counter-title">Exams</span>
                    </Col>

                    <Col lg={3} md={6} sm={12} className="counter-section">
                        <i className="medium-icon"><FaBookOpen /></i>
                        <span className="counter-number">85%</span>
                        <span className="counter-title">Pass Rate</span>
                    </Col>

                    <Col lg={3} md={6} sm={12} className="counter-section">
                        <i className="medium-icon"><FaUserFriends /></i>
                        <span className="counter-number">8</span>
                        <span className="counter-title">Groups</span>
                    </Col>

                    <Col lg={3} md={6} sm={12} className="counter-section">
                        <i className="medium-icon"><FaFileAlt /></i>
                        <span className="counter-number">3</span>
                        <span className="counter-title">Series</span>
                    </Col>

                    <Col lg={3} md={6} sm={12} className="counter-section">
                        <i className="medium-icon"><FaBookOpen /></i>
                        <span className="counter-number">87</span>
                        <span className="counter-title">Courses</span>
                    </Col>

                    <Col lg={3} md={6} sm={12} className="counter-section">
                        <i className="medium-icon"><FaGraduationCap /></i>
                        <span className="counter-number">600</span>
                        <span className="counter-title">Graduated</span>
                    </Col>

                    <Col lg={3} md={6} sm={12} className="counter-section">
                        <i className="medium-icon"><FaUserGraduate /></i>
                        <span className="counter-number">645</span>
                        <span className="counter-title">Studying</span>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

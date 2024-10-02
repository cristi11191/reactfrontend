// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaUserGraduate, FaChalkboardTeacher, FaUsers, FaClipboardCheck, FaBookOpen, FaFileAlt, FaUserFriends, FaGraduationCap } from 'react-icons/fa';
import './adminpanel.css'; // Import custom styles
import '@fortawesome/fontawesome-free/css/all.min.css';
import {fetchAllUsers} from "../../services/userServices.jsx"; // Import FontAwesome icons
import GroupServices from "../../services/groupServices.jsx";
import SeriesServices from "../../services/serieServices.jsx";

export default function AdminPanel() {
    const userRole = localStorage.getItem('role'); // Get the user's role from localStorage
    const [studentCount, setStudentCount] = useState(0);
    const [teacherCount, setTeacherCount] = useState(0);
    const [secretaryCount, setSecretaryCount] = useState(0);
    const [passRate, setPassRate] = useState(0);
    const [coursesCount, setCoursesCount] = useState(0);
    const [graduatedCount, setGraduatedCount] = useState(0);
    const [studyingCount, setStudyingCount] = useState(0);
    const [groupsCount, setGroupsCount] = useState(0);
    const [seriesCount, setSeriesCount] = useState(0);
    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const [users, groups, series] = await Promise.all([fetchAllUsers(), GroupServices.fetchGroup(), SeriesServices.fetchSeries()]);

                const students = users.filter(user =>
                    user.role.name.toLowerCase().includes('student'));
                const teachers = users.filter(user =>
                    user.role.name.toLowerCase().includes('teacher'));
                const secretaries = users.filter(user =>
                    user.role.name.toLowerCase().includes('secretary'));

                //const passRate = await fetchPassRate();
                //const courses = await fetchCoursesCount();
                //const graduated = await fetchGraduatedCount();
                //const studying = await fetchStudyingCount();
                setStudentCount(students.length);
                setTeacherCount(teachers.length);
                setSecretaryCount(secretaries.length);
                //setPassRate(passRate);
                //setCoursesCount(courses);
                //setGraduatedCount(graduated);
                //setStudyingCount(studying);
                setGroupsCount(groups.length);
                setSeriesCount(series.length);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        }

        fetchDashboardData();
    }, []);

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
                        <span className="counter-number">{studentCount}</span>
                        <span className="counter-title">Students</span>
                    </Col>

                    <Col lg={3} md={6} sm={12} className="counter-section">
                        <i className="medium-icon"><FaChalkboardTeacher /></i>
                        <span className="counter-number">{teacherCount}</span>
                        <span className="counter-title">Teachers</span>
                    </Col>

                    <Col lg={3} md={6} sm={12} className="counter-section">
                        <i className="medium-icon"><FaUsers /></i>
                        <span className="counter-number">{secretaryCount}</span>
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
                        <span className="counter-number">{groupsCount}</span>
                        <span className="counter-title">Groups</span>
                    </Col>

                    <Col lg={3} md={6} sm={12} className="counter-section">
                        <i className="medium-icon"><FaFileAlt /></i>
                        <span className="counter-number">{seriesCount}</span>
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

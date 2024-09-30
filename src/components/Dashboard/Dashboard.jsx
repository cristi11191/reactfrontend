import React from "react";
import ProfileSidebar from "./profilesidebar.jsx";
import {Tab, Tabs, Table, Button, Row, Col} from 'react-bootstrap';
import Results from './results.jsx';
import SemesterGrade from './semestergrade.jsx';
import './dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Dashboard({ isSidebarOpen }) {
    return (
        <div className={`dashboard ${isSidebarOpen ? '' : 'close'} d-flex`}>
            <div className="flex-grow-1">
                <div className="p-4 text-dashboard">
                    <h2>Welcome back, Cristin!</h2>
                    <p>Tuesday, 29 September 2024</p>

                    {/* Upcoming Schedules Section */}
                    <h4>Upcoming Schedules</h4>
                    <Tabs defaultActiveKey="classes" id="schedule-tabs" className="mb-3 card-bkgd">
                        <Tab eventKey="classes" title="Classes">
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>Class</th>
                                    <th>Lesson</th>
                                    <th>Date</th>
                                    <th>Join</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>Java Programming</td>
                                    <td>Lesson 30</td>
                                    <td>Today 4:00 PM</td>
                                    <td><Button variant="primary">Join</Button></td>
                                </tr>
                                <tr>
                                    <td>Angular Theory</td>
                                    <td>Lesson 22</td>
                                    <td>Jan 11, 4:00 PM</td>
                                    <td><Button variant="primary">Join</Button></td>
                                </tr>
                                </tbody>
                            </Table>
                        </Tab>
                        <Tab eventKey="exams" title="Exams">
                            {/* Similar content structure for exams */}
                        </Tab>
                        <Tab eventKey="assignments" title="Assignments">
                            {/* Similar content structure for assignments */}
                        </Tab>
                    </Tabs>

                    <Row>
                        {/* Latest Results Section */}
                        <Col md={6}>
                            <h4>Latest Results</h4>
                            <Results />
                        </Col>

                        {/* Semester's Grade Section */}
                        <Col md={6}>
                            <h4>Semester's Grade</h4>
                            <SemesterGrade />
                        </Col>
                    </Row>
                </div>
            </div>
            <ProfileSidebar className="profile-sidebar" />
        </div>
    );
}

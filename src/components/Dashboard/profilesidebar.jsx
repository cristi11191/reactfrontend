import React from 'react';
import { Card, ProgressBar, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './dashboard.css';
import logo from "../../assets/logo.png";

const ProfileSidebar = () => {
    return (
        <div className="container-fluid p-3" style={{maxWidth: '300px'}}>
            {/* Profile Information */}
            <Card className="mb-3 shadow-sm border-1 card-bkgd">
                <Card.Body className="text-center">
                    <img
                        src={logo}
                        alt="Profile"
                        className="rounded-circle mb-3"
                        width="80"
                    />
                    <h5 className="text-dashboard">Shibin Rajan</h5>
                    <p className="text-dashboard">Student ID: 12345695</p>
                </Card.Body>
                <Card.Body>
                    <Card.Title className="text-dashboard">Academic Details</Card.Title>
                    <p className="text-dashboard">B.Sc. Computer Science</p>
                    <p className="text-dashboard">Semester 6</p>
                </Card.Body>
            </Card>

            {/* Semester Progress */}
            <Card className="mt-3 shadow-sm border-1 card-bkgd">
                <Card.Body>
                    <Card.Title className="text-primary">Semester Progress</Card.Title>
                    <p className="text-dashboard">Lesson Progress</p>
                    <ProgressBar now={90} label="30 / 33" className="mb-3"/>
                    <p className="text-danger">Exams in 7 days</p>
                </Card.Body>
            </Card>

            {/* Events Calendar */}
            <Card className="mt-3 shadow-sm border-1 card-bkgd">
                <Card.Body className="card-bkgd">
                    <Card.Title className="text-dashboard">Events</Card.Title>
                    <ListGroup>
                        <ListGroup.Item className="card-bkgd text-dashboard">Jan 7: Angular Theory Exam</ListGroup.Item>
                        <ListGroup.Item className="card-bkgd text-dashboard">Jan 13: Java Programming Lab</ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ProfileSidebar;

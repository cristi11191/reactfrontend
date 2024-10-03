// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog,
    DialogActions, DialogContent, DialogTitle, TextField, IconButton, CircularProgress, MenuItem,
    Stepper, Step, StepLabel, Box
} from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchContext from "../../contexts/SearchContext.jsx";
import { fetchAllUsers, createUser, updateUserById, deleteUserById } from "../../services/userServices.jsx";
import RoleServices from "../../services/roleServices.jsx";
import '../../styles/styles.css';
import {createStudent, deleteStudentById, fetchStudentById, updateStudentById} from "../../services/studentService.jsx";
import GroupServices from "../../services/groupServices.jsx";
import SeriesServices from "../../services/serieServices.jsx";


export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newUser, setNewUser] = useState({ name: '', email: '', role_id: '' });
    const [studentDetails, setStudentDetails] = useState({
        full_name: '', student_number: '', year: '', semester: '', group: '', series: '',
        specialization: '', faculty: '', date_of_birth: '', birth_place: '', address: '',
        city: '', phone: ''
    });
    const [roles, setRoles] = useState([]);
    const [emailError, setEmailError] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [activeStep, setActiveStep] = useState(0); // Step navigation
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const { searchQuery } = useContext(SearchContext);
    const [groupsData, setGroups] = useState([]);
    const [seriesData, setSeries] = useState([]);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);  // State to store the selected user for viewing
    const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);  // State to store student details


    const steps = ['User Info', 'Academic Details', 'Personal Details'];


    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const getUsersAndRoles = async () => {
            try {
                const [usersData, rolesData] = await Promise.all([fetchAllUsers(), RoleServices.fetchRoles()]);
                setUsers(usersData);
                setRoles(rolesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        getUsersAndRoles();
        const fetchGroupsAndSeries = async () => {
            try {
                const groupsData = await GroupServices.fetchGroup(); // Fetch groups from backend
                const seriesData = await SeriesServices.fetchSeries(); // Fetch series from backend
                setGroups(groupsData);
                setSeries(seriesData);
            } catch (error) {
                console.error('Error fetching groups/series:', error);
            }
        };

        fetchGroupsAndSeries();
    }, []);

    // Role-based access check
    const userRole = localStorage.getItem('role');
    const canAddOrEdit = userRole === 'Admin'; // Only admins can add or edit users
    const canDelete = userRole === 'Admin'; // Only admins can delete users

    const handleClickOpen = async (user = null) => {
        if (user) {
            setIsEditMode(true);
            setCurrentUser(user);
            setNewUser({
                name: user.name,
                email: user.email,
                role_id: user.role_id
            });
            if (user.role.name === "Student") {
                try {
                    const studDetails = await fetchStudentById(user.id);
                    setStudentDetails(studDetails);
                } catch (error) {
                    console.error("Error fetching student details:", error);
                }
            }
        } else {
            setIsEditMode(false);
            setNewUser({name: '', email: '', role_id: roles[0]?.id || ''});
        }
        setEmailError('');
        setActiveStep(0); // Reset stepper
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setIsEditMode(false);
        setOpenViewDialog(false); // Reset view mode

        // Reset form fields
        setCurrentUser(null);
        setSelectedUser(null);
        setSelectedStudentDetails(null);
        setActiveStep(0);
    };
    const handleClickOpenView = async (user) => {
        setSelectedUser(user);
        setOpenViewDialog(true); // Set view dialog to true
        setNewUser(user);
        console.log(user);

        // If user is a student, fetch student details
        if (user.role_id === 4) {
            try {
                const studentDetails = await fetchStudentById(user.id); // Assuming student details are tied to user ID
                setSelectedStudentDetails(studentDetails);
            } catch (error) {
                console.error('Error fetching student details:', error);
            }
        }

        setOpen(true); // Open the dialog
        setActiveStep(0); // Reset stepper to the first step
    };

    const handleEmailChange = (e) => {
        const email = e.target.value;
        setNewUser(prev => ({ ...prev, email }));

        const emailExists = users.some(user => user.email === email && (!isEditMode || user.id !== currentUser.id));
        setEmailError(emailExists ? 'Email is already registered' : '');
    };

    const handleNext = () => {
        if (newUser.role_id === 4 && activeStep < steps.length - 1) {
            setActiveStep((prevStep) => prevStep + 1);
        } else {
            { openViewDialog ? handleClose() : handleAddOrUpdateUser(); }// If role is not student or on final step
        }
    };

    const handleAddOrUpdateUser = async () => {
        if (emailError) {
            alert('Please correct the errors before submitting');
            return;
        }

        try {
            let createdUser;
            const userPayload = {
                name: newUser.name,
                email: newUser.email,
                password: newUser.password,
                password_confirmation: newUser.password,  // Add password confirmation
                role_id: newUser.role_id
            };

            if (isEditMode && currentUser) {
                // Update user
                createdUser = await updateUserById(currentUser.id, userPayload);

                // Update student details if the role is Student
                if (newUser.role_id === 4) {  // Assuming 4 is the ID for Student
                    const studentPayload = {
                        user_id: currentUser.id,  // Use existing user ID for update
                        full_name: studentDetails.full_name || newUser.name,
                        student_number: studentDetails.student_number,
                        group_id: studentDetails.group_id,   // Correct field name
                        series_id: studentDetails.series_id, // Correct field name
                        year: studentDetails.year,
                        semester: studentDetails.semester,
                        faculty: studentDetails.faculty,
                        specialization: studentDetails.specialization,
                        date_of_birth: studentDetails.date_of_birth,
                        birth_place: studentDetails.birth_place,
                        address: studentDetails.address,
                        city: studentDetails.city,
                        phone: studentDetails.phone
                    };
                    await updateStudentById(currentUser.id, studentPayload);
                }
            } else {
                // Create user
                const response = await createUser(userPayload);

                // Extract user from the nested response
                createdUser = response.data.user;

                // Debugging the response from createUser
                console.log('Created User:', createdUser);

                // Check if the createdUser has the ID
                if (!createdUser.id) {
                    throw new Error('User ID missing from createUser response');
                }

                // Create student details if the role is Student
                if (newUser.role_id === 4) {  // Assuming 4 is the ID for Student
                    const studentPayload = {
                        user_id: createdUser.id,  // Ensure user_id is included from nested data
                        full_name: studentDetails.full_name || newUser.name,
                        student_number: studentDetails.student_number,
                        group_id: studentDetails.group_id,   // Correct field name
                        series_id: studentDetails.series_id, // Correct field name
                        year: studentDetails.year,
                        semester: studentDetails.semester,
                        faculty: studentDetails.faculty,
                        specialization: studentDetails.specialization,
                        date_of_birth: studentDetails.date_of_birth,
                        birth_place: studentDetails.birth_place,
                        address: studentDetails.address,
                        city: studentDetails.city,
                        phone: studentDetails.phone
                    };

                    await createStudent(studentPayload);
                }
            }

            // Fetch updated users list and set in state
            const updatedUsers = await fetchAllUsers();
            setUsers(updatedUsers);
            handleClose();  // Close the modal
        } catch (error) {
            console.error('Error saving user or student:', error);
        }
    };




    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            if (userToDelete) {
                await deleteUserById(userToDelete.id);
                // If the user is a student, delete the corresponding student record
                if (userToDelete.role_id === 4) {  // Assuming 4 is the Student role ID
                    await deleteStudentById(userToDelete.id);
                }

                // Fetch updated users list
                const updatedUsers = await fetchAllUsers();
                setUsers(updatedUsers);
            }
            setOpenDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting user or student:', error);
        }
    };


    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
    };

    return (
        <div style={{ padding: 20 }}>
            {!loading && canAddOrEdit && (
                <Button className='btn-add' variant="contained" color="primary" onClick={() => handleClickOpen()}>
                    Add User
                </Button>
            )}

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                </div>
            ) : (
                <TableContainer component={Paper} style={{ marginTop: 20 }} className='tableusers'>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                        <TableHead>
                            <TableRow className='tblrow'>
                                <TableCell align="right" className='tabletext tblrow'>ID</TableCell>
                                <TableCell align="right" className='tabletext tblrow'>Name</TableCell>
                                <TableCell align="right" className='tabletext tblrow'>Email</TableCell>
                                <TableCell align="right" className='tabletext tblrow'>Role</TableCell>
                                {(canAddOrEdit || canDelete) && (
                                    <TableCell align="right" className='tabletext tblrow'>Actions</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id} sx={{ border: 0 }} className='tblrow'>
                                    <TableCell align="right" component="th" scope="row" className='tabletext tblrow'>{user.id}</TableCell>
                                    <TableCell align="right" className='tabletext tblrow'>{user.name}</TableCell>
                                    <TableCell align="right" className='tabletext tblrow'>{user.email}</TableCell>
                                    <TableCell align="right" className='tabletext tblrow'>{user.role.name}</TableCell>
                                    {(canAddOrEdit || canDelete) && (
                                        <TableCell align="right">
                                            {/* Eye icon to view user details */}
                                            <IconButton
                                                aria-label="view"
                                                color="primary"
                                                sx={{ color: '#00bfa5', '&:hover': { color: '#26a69a' } }}
                                                className='tblrow action-btn view'
                                                id='viewbtn'
                                                onClick={() => handleClickOpenView(user)}
                                            >
                                                <AssignmentIndIcon />
                                            </IconButton>
                                            {canAddOrEdit && (
                                                <IconButton
                                                    aria-label="edit"
                                                    color="primary"
                                                    sx={{ color: '#ff9800', '&:hover': { color: '#ffa726' } }}
                                                    className='tblrow action-btn edit'
                                                    id='editbtn'
                                                    onClick={() => handleClickOpen(user)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            )}
                                            {canDelete && (
                                                <IconButton
                                                    aria-label="delete"
                                                    color="secondary"
                                                    sx={{ color: '#f44336', '&:hover': { color: '#e57373' } }}
                                                    className='tblrow action-btn delete '
                                                    id='deletebtn'
                                                    onClick={() => handleDeleteClick(user)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}


            <Dialog open={openDeleteDialog} onClose={handleCancelDelete} PaperProps={{ className: 'custom-dialog-paper' }}>
                <DialogTitle className='custom-dialog-title'>Confirm Delete</DialogTitle>
                <DialogContent>Are you sure you want to delete {userToDelete?.name}?</DialogContent>
                <DialogActions className='custom-dialog-actions'>
                    <Button onClick={handleCancelDelete} color="primary" className="custom-button custom-cancel-button">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="secondary" className="custom-button custom-confirm-button">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for adding/editing user */}
            <Dialog open={open} onClose={handleClose} PaperProps={{ className: 'custom-dialog-paper' }}>
                <DialogTitle className='custom-dialog-title'>{isEditMode ? 'Edit User' : ( openViewDialog === true ? "View user" : 'Add New User' )}</DialogTitle>
                <DialogContent>
                    {/* Conditionally render Stepper for Student role */}
                    {newUser.role_id === 4 && (
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    )}

                    {/* Form for Step 1: User Info */}
                    {activeStep === 0 && (
                        <>
                            <TextField
                                margin="dense"
                                label="Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={newUser.name || selectedUser?.name || ''}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                InputProps={openViewDialog ? { readOnly: true } : {}}
                                autoComplete="new-name"
                            />
                            <TextField
                                margin="dense"
                                label="Email"
                                type="email"
                                fullWidth
                                variant="outlined"
                                value={newUser.email || selectedUser?.email || ''}
                                onChange={handleEmailChange}
                                error={!!emailError}
                                helperText={emailError}
                                style={{ marginBottom: 16 }}
                                InputProps={openViewDialog ? { readOnly: true } : {}}
                                autoComplete="new-email"
                            />
                            {!openViewDialog && (
                                <TextField
                                margin="dense"
                                label="Password"
                                type="password"
                                fullWidth
                                variant="outlined"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                autoComplete="new-password"
                            />
                            )}

                            <TextField
                                margin="dense"
                                label="Role"
                                select
                                fullWidth
                                value={newUser.role_id || selectedUser?.role_id || ''}
                                onChange={(e) => setNewUser({ ...newUser, role_id: e.target.value })}
                                InputProps={openViewDialog ? { readOnly: true } : {}}
                            >
                                {roles.map((role) => (
                                    <MenuItem key={role.id} value={role.id}>
                                        {role.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </>
                    )}

                    {/* Form for Step 2: Academic Details (only if role is student) */}
                    {activeStep === 1 && newUser.role_id === 4  && (
                        <>
                            <TextField
                                margin="dense"
                                label="Student Number"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={studentDetails.student_number || selectedStudentDetails?.student_number || ''}
                                onChange={(e) => setStudentDetails({ ...studentDetails, student_number: e.target.value })}
                                InputProps={openViewDialog ? { readOnly: true } : {}}
                            />

                            <TextField
                                margin="dense"
                                label="Year"
                                type="number"
                                fullWidth
                                variant="outlined"
                                className="hide-spinner"
                                value={studentDetails.year || selectedStudentDetails?.year || ''}
                                onChange={(e) => setStudentDetails({ ...studentDetails, year: e.target.value })}
                                InputProps={openViewDialog ? { readOnly: true } : {}}
                            />
                            <TextField
                                margin="dense"
                                label="Semester"
                                type="number"
                                fullWidth
                                variant="outlined"
                                className="hide-spinner"
                                value={studentDetails.semester || selectedStudentDetails?.semester || ''}
                                onChange={(e) => setStudentDetails({ ...studentDetails, semester: e.target.value })}
                                InputProps={openViewDialog ? { readOnly: true } : {}}
                            />
                            {/* Group Dropdown */}
                            <TextField
                                margin="dense"
                                label="Group"
                                select
                                fullWidth
                                value={studentDetails.group_id || selectedStudentDetails?.group_id || ''}
                                onChange={(e) => setStudentDetails({ ...studentDetails, group_id: e.target.value })}
                                InputProps={openViewDialog ? { readOnly: true } : {}}
                            >
                                {groupsData.map((group) => (
                                    <MenuItem key={group.id} value={group.id}>
                                        {group.group_name}
                                    </MenuItem>
                                ))}
                            </TextField>

                            {/* Series Dropdown */}
                            <TextField
                                margin="dense"
                                label="Series"
                                select
                                fullWidth
                                value={studentDetails.series_id || selectedStudentDetails?.series_id || ''}
                                onChange={(e) => setStudentDetails({ ...studentDetails, series_id: e.target.value })}
                                InputProps={openViewDialog ? { readOnly: true } : {}}
                            >
                                {seriesData.map((series) => (
                                    <MenuItem key={series.id} value={series.id}>
                                        {series.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                margin="dense"
                                label="Faculty"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={studentDetails.faculty || selectedStudentDetails?.faculty || ''}
                                onChange={(e) => setStudentDetails({ ...studentDetails, faculty: e.target.value })}
                                InputProps={openViewDialog ? { readOnly: true } : {}}
                            />
                            <TextField
                                margin="dense"
                                label="Specialization"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={studentDetails.specialization || selectedStudentDetails?.specialization || ''}
                                onChange={(e) => setStudentDetails({ ...studentDetails, specialization: e.target.value })}
                                InputProps={openViewDialog ? { readOnly: true } : {}}
                            />
                        </>
                    )}

                    {/* Form for Step 3: Personal Details */}
                    {activeStep === 2 && newUser.role_id === 4 && (
                        <>
                            <TextField
                                margin="dense"
                                label="Full Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={studentDetails.full_name || selectedStudentDetails?.full_name || ''}
                                onChange={(e) => setStudentDetails({ ...studentDetails, full_name: e.target.value })}
                                InputProps={openViewDialog ? { readOnly: true } : {}}
                            />

                            <TextField
                                margin="dense"
                                label="Date of Birth"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                                value={studentDetails.date_of_birth || selectedStudentDetails?.date_of_birth || ''}
                                onChange={(e) => setStudentDetails({ ...studentDetails, date_of_birth: e.target.value })}
                                InputProps={openViewDialog ? { readOnly: true } : {}}
                            />
                            <TextField
                                margin="dense"
                                label="Birth Place"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={studentDetails.birth_place || selectedStudentDetails?.birth_place || ''}
                                onChange={(e) => setStudentDetails({ ...studentDetails, birth_place: e.target.value })}
                                InputProps={openViewDialog ? { readOnly: true } : {}}
                            />
                            <TextField
                                margin="dense"
                                label="Address"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={studentDetails.address || selectedStudentDetails?.address || ''}
                                onChange={(e) => setStudentDetails({ ...studentDetails, address: e.target.value })}
                                InputProps={openViewDialog ? { readOnly: true } : {}}
                            />
                            <TextField
                                margin="dense"
                                label="City"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={studentDetails.city || selectedStudentDetails?.city || ''}
                                onChange={(e) => setStudentDetails({ ...studentDetails, city: e.target.value })}
                                InputProps={openViewDialog ? { readOnly: true } : {}}
                            />
                            <TextField
                                margin="dense"
                                label="Phone"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={studentDetails.phone || selectedStudentDetails?.phone || ''}
                                onChange={(e) => setStudentDetails({ ...studentDetails, phone: e.target.value })}
                                InputProps={openViewDialog ? { readOnly: true } : {}}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions className='custom-dialog-actions'>
                    {/* For non-student roles, show the Submit button instead of Next */}
                    {newUser.role_id !== 4 ? (
                        <Button onClick={(openViewDialog ? handleNext : handleAddOrUpdateUser)} color="primary">
                            Submit
                        </Button>
                    ) : (
                        <>
                            {activeStep > 0 && (
                                <Button onClick={() => setActiveStep((prevStep) => prevStep - 1)} color="secondary">
                                    Back
                                </Button>
                            )}

                            {/* Flex container to separate the Cancel and Next/Submit buttons */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Button onClick={handleClose} color="primary" className="custom-button custom-cancel-button">
                                    Cancel
                                </Button>

                                <Button onClick={handleNext} color="primary">
                                    {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                                </Button>
                            </Box>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
}
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog,
    DialogActions, DialogContent, DialogTitle, TextField, IconButton, CircularProgress, MenuItem,
    Stepper, Step, StepLabel, Box, Chip, FormControl, InputLabel, Select
} from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchContext from "../../contexts/SearchContext.jsx";
import {
    fetchAllUsers,
    createUser,
    updateUserById,
    deleteUserById,
    toggleUserStatusById
} from "../../services/userServices.jsx";
import RoleServices from "../../services/roleServices.jsx";
import '../../styles/styles.css';
import {createStudent, deleteStudentById, fetchStudentById, updateStudentById} from "../../services/studentService.jsx";
import GroupServices from "../../services/groupServices.jsx";
import SeriesServices from "../../services/serieServices.jsx";
import FacultiesServices from "../../services/facultyServices.jsx"; // Import FacultiesServices
import SpecialitiesServices from "../../services/specialityServices.jsx"; // Import SpecialitiesServices

import { useToasts } from "../../contexts/ToastContainer.jsx";

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
    const [faculties, setFaculties] = useState([]); // Add faculties state
    const [specialities, setSpecialities] = useState([]); // Add specialities state
    const [filteredSpecialities, setFilteredSpecialities] = useState([]);
    const [openStatusDialog, setOpenStatusDialog] = useState(false); // State for the dialog
    const [userToToggle, setUserToToggle] = useState(null);
    const { addToast } = useToasts();
    const [statusFilter, setStatusFilter] = useState(''); // State for status filter
    const [roleFilter, setRoleFilter] = useState(''); // State for role filter

    const filterSpecialitiesByFaculty = (facultyId) => {
        const filtered = specialities.filter(speciality => speciality.faculty_id === facultyId);
        setFilteredSpecialities(filtered);
    };


    const steps = ['User Info', 'Academic Details', 'Personal Details'];


    const filteredUsers = users.filter(user => {
        const matchesQuery = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.role.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter ? (user.status.toString() === statusFilter) : true;
        const matchesRole = roleFilter ? (user.role.name === roleFilter) : true;
        return matchesQuery && matchesStatus && matchesRole;
    });

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
        const fetchAdditionalData  = async () => {
            try {
                const [groupsData, seriesData, facultiesData, specialitiesData] = await Promise.all([
                    GroupServices.fetchGroup(), // Fetch groups
                    SeriesServices.fetchSeries(), // Fetch series
                    FacultiesServices.fetchFaculties(), // Fetch faculties
                    SpecialitiesServices.fetchSpecialities() // Fetch specialities
                ]);
                setGroups(groupsData);
                setSeries(seriesData);
                setFaculties(facultiesData); // Set faculties data
                setSpecialities(specialitiesData); // Set specialities data

            } catch (error) {
                console.error('Error fetching groups/series/faculties/specialities:', error);
            }
        };

        fetchAdditionalData();
    }, []);

    // Role-based access check
    const userRole = localStorage.getItem('role');
    const canAddOrEdit = userRole === 'Admin' || userRole === 'Secretary'; // Only admins and secretaries can add or edit
    const canDelete = userRole === 'Admin' || userRole === 'Secretary'; // Only admins and secretaries can delete

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
        if (user.role.name === "Student") {
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
        if (newUser.role.name === "Student" && activeStep < steps.length - 1) {
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
                if (newUser.role.name === "Student") {  // Assuming 4 is the ID for Student
                    const studentPayload = {
                        user_id: currentUser.id,  // Use existing user ID for update
                        full_name: studentDetails.full_name || newUser.name,
                        student_number: studentDetails.student_number,
                        group_id: studentDetails.group_id,
                        series_id: studentDetails.series_id,
                        year: studentDetails.year,
                        semester: studentDetails.semester,
                        faculty_id: studentDetails.faculty_id,
                        speciality_id: studentDetails.speciality_id,
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
                createdUser = response.data.user;

                // Create student details if the role is Student
                if (newUser.role.name === "Student") {
                    const studentPayload = {
                        user_id: createdUser.id,
                        full_name: studentDetails.full_name || newUser.name,
                        student_number: studentDetails.student_number,
                        group_id: studentDetails.group_id,
                        series_id: studentDetails.series_id,
                        year: studentDetails.year,
                        semester: studentDetails.semester,
                        faculty_id: studentDetails.faculty_id,
                        speciality_id: studentDetails.speciality_id,
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
                if (userToDelete.role.name === "Student") {  // Assuming 4 is the Student role ID
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

    const handleOpenStatusDialog = (user) => {
        setUserToToggle(user); // Set the user to toggle
        setOpenStatusDialog(true); // Open the dialog
    };

    // Close the status dialog
    const handleCloseStatusDialog = () => {
        setOpenStatusDialog(false); // Close the dialog
        setUserToToggle(null); // Clear the user being toggled
    };

    const handleConfirmToggleStatus = async () => {
        if (userToToggle) {
            // Prevent status toggle for Admin users
            if (userToToggle.role.name === 'Admin') {
                addToast('error', 'You cannot change the status of an Admin user.', 4000);
                handleCloseStatusDialog();
                return; // Exit the function
            }

            try {
                // Call the API to toggle the user's status
                const updatedUser = await toggleUserStatusById(userToToggle.id);

                // Update the users state with the new status
                setUsers((prevUsers) =>
                    prevUsers.map((u) =>
                        u.id === userToToggle.id ? { ...u, status: updatedUser.status } : u
                    )
                );
            } catch (error) {
                console.error('Error toggling user status:', error);
            } finally {
                handleCloseStatusDialog(); // Close the dialog after toggle
            }
        }
    };




    const getChipStyleStatus = (status) => {
        return status
            ? { backgroundColor: 'green', color: 'white' }  // Active
            : { backgroundColor: 'gray', color: 'white' };   // Inactive
    };

    const getChipStyle = (role) => {
        switch (role) {
            case 'Student':
                return { backgroundColor: 'green', color: 'white' };
            case 'Teacher':
                return { backgroundColor: 'blue', color: 'white' };
            case 'Secretary':
                return { backgroundColor: 'orange', color: 'white' };
            case 'Admin':
                return { backgroundColor: 'red', color: 'white' };
            default:
                return { backgroundColor: 'gray', color: 'white' };  // Default color if no role matches
        }
    };

    return (
        <div style={{padding: 20}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                {!loading && canAddOrEdit && (
                    <Button className='btn-add' variant="contained" color="primary" onClick={() => handleClickOpen()}>
                        Add User
                    </Button>

                )}
                {!loading && (
                <div style={{display: 'flex', gap: '10px'}}>
                    <div className="user-filters">
                        {/* Role filter */}
                        <FormControl variant="outlined" className="custom-form-control" style={{minWidth: 150}}>
                            <InputLabel>Filter by Role</InputLabel>
                            <Select
                                label="Filter by Role"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <MenuItem value="">All Roles</MenuItem>
                                {roles.map(role => (
                                    <MenuItem key={role.id} value={role.name}>{role.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Status filter */}
                        <FormControl variant="outlined" className="custom-form-control" style={{minWidth: 150}}>
                            <InputLabel>Filter by Status</InputLabel>
                            <Select
                                label="Filter by Status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <MenuItem value="">All Statuses</MenuItem>
                                <MenuItem value="1">Active</MenuItem>
                                <MenuItem value="0">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>)}

            </div>

            {loading ? (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh'}}>
                    <CircularProgress/>
                </div>
            ) : (
                <TableContainer component={Paper} style={{marginTop: 20}} className='tableusers'>
                    <Table sx={{minWidth: 650}} size="small" aria-label="simple table">
                        <TableHead>
                            <TableRow className='tblrow'>
                                <TableCell align="right" className='tabletext tblrow'>ID</TableCell>
                                <TableCell align="right" className='tabletext tblrow'>Name</TableCell>
                                <TableCell align="right" className='tabletext tblrow'>Email</TableCell>
                                <TableCell align="right" className='tabletext tblrow'>Role</TableCell>
                                <TableCell align="right" className='tabletext tblrow'>Status</TableCell>
                                {(canAddOrEdit || canDelete) && (
                                    <TableCell align="right" className='tabletext tblrow'>Actions</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id} sx={{border: 0}} className='tblrow'>
                                    <TableCell align="right" component="th" scope="row"
                                               className='tabletext tblrow'>{user.id}</TableCell>
                                    <TableCell align="right" className='tabletext tblrow'>{user.name}</TableCell>
                                    <TableCell align="right" className='tabletext tblrow'>{user.email}</TableCell>
                                    <TableCell align="right" className='tabletext tblrow'>
                                        <Chip
                                            key={user.role.name}
                                            label={user.role.name}
                                            className="custom-chip"
                                            style={getChipStyle(user.role.name)}
                                        /></TableCell>
                                    <TableCell align="right" className='tabletext tblrow'> {/* Chip for status */}
                                        <Chip
                                            label={user.status ? "Active" : "Inactive"}
                                            className="custom-chip"
                                            style={getChipStyleStatus(user.status)}
                                            onClick={() => handleOpenStatusDialog(user)} // Open confirmation dialog on click
                                        />
                                    </TableCell>
                                    {(canAddOrEdit || canDelete) && (
                                        <TableCell align="right">
                                            {/* Eye icon to view user details */}
                                            <IconButton
                                                aria-label="view"
                                                color="primary"
                                                sx={{color: '#00bfa5', '&:hover': {color: '#26a69a'}}}
                                                className='tblrow action-btn view'
                                                id='viewbtn'
                                                onClick={() => handleClickOpenView(user)}
                                            >
                                                <AssignmentIndIcon/>
                                            </IconButton>
                                            {canAddOrEdit && (
                                                <IconButton
                                                    aria-label="edit"
                                                    color="primary"
                                                    sx={{color: '#ff9800', '&:hover': {color: '#ffa726'}}}
                                                    className='tblrow action-btn edit'
                                                    id='editbtn'
                                                    onClick={() => handleClickOpen(user)}
                                                >
                                                    <EditIcon/>
                                                </IconButton>
                                            )}
                                            {canDelete && (
                                                <IconButton
                                                    aria-label="delete"
                                                    color="secondary"
                                                    sx={{color: '#f44336', '&:hover': {color: '#e57373'}}}
                                                    className='tblrow action-btn delete '
                                                    id='deletebtn'
                                                    onClick={() => handleDeleteClick(user)}
                                                >
                                                    <DeleteIcon/>
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

            {/* Dialog for confirming status toggle */}
            <Dialog open={openStatusDialog} onClose={handleCloseStatusDialog}
                    PaperProps={{className: 'custom-dialog-paper'}}>
                <DialogTitle>Confirm Status Change</DialogTitle>
                <DialogContent>
                    Are you sure you want to change the status of <span
                    style={{color: 'red', fontWeight: 'bold'}}> {userToToggle?.name}</span>?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseStatusDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmToggleStatus} color="secondary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={handleCancelDelete}
                    PaperProps={{className: 'custom-dialog-paper'}}>
                <DialogTitle className='custom-dialog-title'>Confirm Delete</DialogTitle>
                <DialogContent>Are you sure you want to delete {userToDelete?.name}?</DialogContent>
                <DialogActions className='custom-dialog-actions'>
                    <Button onClick={handleCancelDelete} color="primary"
                            className="custom-button custom-cancel-button">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="secondary"
                            className="custom-button custom-confirm-button">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for adding/editing user */}
            <Dialog open={open} onClose={handleClose} PaperProps={{className: 'custom-dialog-paper'}}>
                <DialogTitle
                    className='custom-dialog-title'>{isEditMode ? 'Edit User' : (openViewDialog === true ? "View user" : 'Add New User')}</DialogTitle>
                <DialogContent>
                    {/* Conditionally render Stepper for Student role */}
                    {newUser.role_id === 4 && (
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label} className="step-label">
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
                                className="text-fields-dialog"
                                value={newUser.name || selectedUser?.name || ''}
                                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                InputProps={openViewDialog ? {readOnly: true} : {}}
                                autoComplete="new-name"
                            />
                            <TextField
                                margin="dense"
                                label="Email"
                                type="email"
                                fullWidth
                                variant="outlined"
                                className="text-fields-dialog"
                                value={newUser.email || selectedUser?.email || ''}
                                onChange={handleEmailChange}
                                error={!!emailError}
                                helperText={emailError}
                                style={{marginBottom: 16}}
                                InputProps={openViewDialog ? {readOnly: true} : {}}
                                autoComplete="new-email"
                            />
                            {!openViewDialog && (
                                <TextField
                                    margin="dense"
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    variant="outlined"
                                    className="text-fields-dialog"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                    autoComplete="new-password"
                                />
                            )}

                            <TextField
                                margin="dense"
                                label="Role"
                                select
                                fullWidth
                                className="text-fields-dialog"
                                value={newUser.role_id || selectedUser?.role_id || ''}
                                onChange={(e) => setNewUser({...newUser, role_id: e.target.value})}
                                InputProps={(openViewDialog || isEditMode) ? {readOnly: true} : {}}
                            >
                                {roles.map((role) => (
                                    <MenuItem key={role.id} value={role.id} className="text-fields-dialog">
                                        {role.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </>
                    )}

                    {/* Form for Step 2: Academic Details (only if role is student) */}
                    {activeStep === 1 && newUser.role_id === 4 && (
                        <>
                            <TextField
                                margin="dense"
                                label="Student Number"
                                type="text"
                                fullWidth
                                variant="outlined"
                                className="text-fields-dialog"
                                value={studentDetails.student_number || selectedStudentDetails?.student_number || ''}
                                onChange={(e) => setStudentDetails({
                                    ...studentDetails,
                                    student_number: e.target.value
                                })}
                                InputProps={openViewDialog ? {readOnly: true} : {}}
                            />

                            <TextField
                                margin="dense"
                                label="Year"
                                type="number"
                                fullWidth
                                variant="outlined"
                                className="hide-spinner text-fields-dialog"
                                value={studentDetails.year || selectedStudentDetails?.year || ''}
                                onChange={(e) => setStudentDetails({...studentDetails, year: e.target.value})}
                                InputProps={openViewDialog ? {readOnly: true} : {}}
                            />
                            <TextField
                                margin="dense"
                                label="Semester"
                                type="number"
                                fullWidth
                                variant="outlined"
                                className="hide-spinner text-fields-dialog"
                                value={studentDetails.semester || selectedStudentDetails?.semester || ''}
                                onChange={(e) => setStudentDetails({...studentDetails, semester: e.target.value})}
                                InputProps={openViewDialog ? {readOnly: true} : {}}
                            />
                            {/* Group Dropdown */}
                            <TextField
                                margin="dense"
                                label="Group"
                                select
                                fullWidth
                                className="text-fields-dialog"
                                value={studentDetails.group_id || selectedStudentDetails?.group_id || ''}
                                onChange={(e) => setStudentDetails({...studentDetails, group_id: e.target.value})}
                                InputProps={openViewDialog ? {readOnly: true} : {}}
                            >
                                {groupsData.map((group) => (
                                    <MenuItem key={group.id} value={group.id} className="text-fields-dialog">
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
                                className="text-fields-dialog"
                                value={studentDetails.series_id || selectedStudentDetails?.series_id || ''}
                                onChange={(e) => setStudentDetails({...studentDetails, series_id: e.target.value})}
                                InputProps={openViewDialog ? {readOnly: true} : {}}
                            >
                                {seriesData.map((series) => (
                                    <MenuItem key={series.id} value={series.id} className="text-fields-dialog">
                                        {series.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            {/* Faculty Dropdown */}
                            <TextField
                                margin="dense"
                                label="Faculty"
                                select
                                fullWidth
                                className="text-fields-dialog"
                                value={faculties.some(faculty => faculty.id === studentDetails.faculty_id) ? studentDetails.faculty_id : ''}
                                onChange={(e) => {
                                    const facultyId = e.target.value;
                                    setStudentDetails({
                                        ...studentDetails,
                                        faculty_id: facultyId,
                                        speciality_id: ''
                                    }); // Reset speciality when faculty changes
                                    filterSpecialitiesByFaculty(facultyId); // Call function to filter specialities based on selected faculty
                                }}
                                InputProps={openViewDialog ? {readOnly: true} : {}}
                            >
                                <MenuItem value="">
                                    <em>None</em> {/* Blank option */}
                                </MenuItem>
                                {faculties.map((faculty) => (
                                    <MenuItem key={faculty.id} value={faculty.id} className="text-fields-dialog">
                                        {faculty.faculty_name}
                                    </MenuItem>
                                ))}
                            </TextField>

                            {/* Speciality Dropdown */}
                            <TextField
                                margin="dense"
                                label="Speciality"
                                select
                                fullWidth
                                className="text-fields-dialog"
                                value={filteredSpecialities.some(speciality => speciality.id === studentDetails.speciality_id) ? studentDetails.speciality_id : ''}
                                onChange={(e) => setStudentDetails({
                                    ...studentDetails,
                                    speciality_id: e.target.value
                                })}
                                InputProps={(openViewDialog || !studentDetails.faculty_id) ? {readOnly: true} : {}}
                            >
                                <MenuItem value="">
                                    <em>None</em> {/* Blank option */}
                                </MenuItem>
                                {filteredSpecialities.map((speciality) => (
                                    <MenuItem key={speciality.id} value={speciality.id}
                                              className="text-fields-dialog">
                                        {speciality.speciality_name}
                                    </MenuItem>
                                ))}
                            </TextField>


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
                                className="text-fields-dialog"
                                value={studentDetails.full_name || selectedStudentDetails?.full_name || ''}
                                onChange={(e) => setStudentDetails({...studentDetails, full_name: e.target.value})}
                                InputProps={openViewDialog ? {readOnly: true} : {}}
                            />

                            <TextField
                                margin="dense"
                                label="Date of Birth"
                                type="date"
                                fullWidth
                                InputLabelProps={{shrink: true}}
                                variant="outlined"
                                className="text-fields-dialog"
                                value={studentDetails.date_of_birth || selectedStudentDetails?.date_of_birth || ''}
                                onChange={(e) => setStudentDetails({
                                    ...studentDetails,
                                    date_of_birth: e.target.value
                                })}
                                InputProps={openViewDialog ? {readOnly: true} : {}}
                            />
                            <TextField
                                margin="dense"
                                label="Birth Place"
                                type="text"
                                fullWidth
                                variant="outlined"
                                className="text-fields-dialog"
                                value={studentDetails.birth_place || selectedStudentDetails?.birth_place || ''}
                                onChange={(e) => setStudentDetails({
                                    ...studentDetails,
                                    birth_place: e.target.value
                                })}
                                InputProps={openViewDialog ? {readOnly: true} : {}}
                            />
                            <TextField
                                margin="dense"
                                label="Address"
                                type="text"
                                fullWidth
                                variant="outlined"
                                className="text-fields-dialog"
                                value={studentDetails.address || selectedStudentDetails?.address || ''}
                                onChange={(e) => setStudentDetails({...studentDetails, address: e.target.value})}
                                InputProps={openViewDialog ? {readOnly: true} : {}}
                            />
                            <TextField
                                margin="dense"
                                label="City"
                                type="text"
                                fullWidth
                                variant="outlined"
                                className="text-fields-dialog"
                                value={studentDetails.city || selectedStudentDetails?.city || ''}
                                onChange={(e) => setStudentDetails({...studentDetails, city: e.target.value})}
                                InputProps={openViewDialog ? {readOnly: true} : {}}
                            />
                            <TextField
                                margin="dense"
                                label="Phone"
                                type="text"
                                fullWidth
                                variant="outlined"
                                className="text-fields-dialog"
                                value={studentDetails.phone || selectedStudentDetails?.phone || ''}
                                onChange={(e) => setStudentDetails({...studentDetails, phone: e.target.value})}
                                InputProps={openViewDialog ? {readOnly: true} : {}}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions className='custom-dialog-actions'>
                    {/* For non-student roles, show the Submit button instead of Next */}
                    {newUser.role_id !== 4 ? (
                        <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                            <Button onClick={handleClose} color="primary"
                                    className="custom-button custom-cancel-button">
                                Cancel
                            </Button>

                            <Button onClick={(openViewDialog ? handleNext : handleAddOrUpdateUser)} color="primary">
                                Submit
                            </Button>
                        </Box>

                    ) : (
                        <>
                            {activeStep > 0 && (
                                <Button onClick={() => setActiveStep((prevStep) => prevStep - 1)} color="secondary">
                                    Back
                                </Button>
                            )}

                            {/* Flex container to separate the Cancel and Next/Submit buttons */}
                            <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                <Button onClick={handleClose} color="primary"
                                        className="custom-button custom-cancel-button">
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
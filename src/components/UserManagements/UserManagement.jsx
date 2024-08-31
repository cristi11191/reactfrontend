// eslint-disable-next-line no-unused-vars
import React, {useContext, useEffect, useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import { hasPermission } from '../../utils/permissions.jsx';
import { permissionsConfig } from '../../config/permissionsConfig.jsx';
import '../../styles/styles.css';
import { fetchAllUsers, createUser, updateUserById,deleteUserById } from "../../services/userServices.jsx";
import RoleServices  from "../../services/roleServices.jsx";
import MenuItem from '@mui/material/MenuItem';
import SearchBox from "../SearchBar/SearchBar.jsx";
import SearchContext from "../../contexts/SearchContext.jsx";
export default function UserManagement() {

    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true); // New loading state
    const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });
    const [roles, setRoles] = useState([{ id: 1, name: 'Student' }]); // Example role options
    const [emailError, setEmailError] = useState(''); // State for email error message
    const [isEditMode, setIsEditMode] = useState(false); // New state for edit mode
    const [currentUser, setCurrentUser] = useState(null); // State to hold the user being edited
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const { searchQuery } = useContext(SearchContext);

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
    }, []);

    const { permissions } = permissionsConfig.user_management;

    const handleClickOpen = (user = null) => {
        if (user) {
            setIsEditMode(true);
            setCurrentUser(user);
            setNewUser({
                name: user.name,
                email: user.email,
                password: '', // Do not pre-fill password
                role_id: user.role_id
            });
        } else {
            setIsEditMode(false);
            setNewUser({ name: '', email: '', password: '', role_id: '1' });
        }
        setEmailError('');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setIsEditMode(false);
        setCurrentUser(null);
    };

    const handleEmailChange = (e) => {
        const email = e.target.value;
        setNewUser((prev) => ({ ...prev, email }));

        const emailExists = users.some(user => user.email === email && (!isEditMode || user.id !== currentUser.id));
        if (emailExists) {
            setEmailError('Email is already registered');
        } else {
            setEmailError('');
        }
    };

    const handleAddOrUpdateUser = async () => {
        if (emailError) {
            alert('Please correct the errors before submitting');
            return;
        }

        try {
            if (isEditMode && currentUser) {
                await updateUserById(currentUser.id, newUser);
            } else {
                await createUser(newUser);
            }
            const updatedUsers = await fetchAllUsers();
            setUsers(updatedUsers);
            handleClose();
        } catch (error) {
            console.error('Error saving user:', error);
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
                const updatedUsers = await fetchAllUsers();
                setUsers(updatedUsers);
            }
            setOpenDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
    };

    const showActionsColumn = hasPermission([permissions.update]) || hasPermission([permissions.delete]);
    return (

        <div style={{ padding: 20 }}>
            {hasPermission([permissions.create]) && (
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
                                <TableCell className='tabletext tblrow'>ID</TableCell>
                                <TableCell align="right" className='tabletext tblrow'>Name</TableCell>
                                <TableCell align="right" className='tabletext tblrow'>Email</TableCell>
                                <TableCell align="right" className='tabletext tblrow'>Role</TableCell>
                                {showActionsColumn && (
                                    <TableCell align="right" className='tabletext tblrow'>Actions</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow
                                    key={user.id}
                                    sx={{ border: 0 }}
                                    className='tblrow'
                                >
                                    <TableCell component="th" scope="row" className='tabletext tblrow'>{user.id}</TableCell>
                                    <TableCell align="right" className='tabletext tblrow'>{user.name}</TableCell>
                                    <TableCell align="right" className='tabletext tblrow'>{user.email}</TableCell>
                                    <TableCell align="right" className='tabletext tblrow'>{user.role.name}</TableCell>
                                    {showActionsColumn && (
                                        <TableCell align="right">
                                            {hasPermission([permissions.update]) && (
                                                <IconButton
                                                    aria-label="edit"
                                                    color="primary"
                                                    sx={{ color: '#ff9800', '&:hover': { color: '#ffa726' } }}
                                                    className='tblrow action-btn edit'
                                                    id='editbtn'
                                                    onClick={() => handleClickOpen(user)} // Open dialog with user info
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            )}
                                            {hasPermission([permissions.delete]) && (
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

            <Dialog open={open} onClose={handleClose} PaperProps={{ className: 'custom-dialog-paper' }}>
                <DialogTitle className='custom-dialog-title'>{isEditMode ? 'Edit User' : 'Add New User'}</DialogTitle>
                <DialogContent >
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        className="custom-textfield"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        className="custom-textfield"
                        value={newUser.email}
                        onChange={handleEmailChange}
                        error={!!emailError}
                        helperText={emailError}
                        style={{ marginBottom: 16 }}
                    />
                    <TextField
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        className="custom-textfield"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value, password_confirmation: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        id="role_id"
                        label="Role"
                        select
                        fullWidth
                        variant="outlined"
                        value={newUser.role_id}
                        className={`custom-textfield role-dw`}
                        onChange={(e) => setNewUser({ ...newUser, role_id: e.target.value })}

                    >
                        {roles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                                {role.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions  className='custom-dialog-actions'>
                    <Button onClick={handleClose} color="primary" className="custom-button custom-cancel-button">
                        Cancel
                    </Button>
                    <Button onClick={handleAddOrUpdateUser } color="primary" className="custom-button custom-confirm-button">
                        {isEditMode ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDeleteDialog} onClose={handleCancelDelete} PaperProps={{ className: 'custom-dialog-paper' }}>
                <DialogTitle className='custom-dialog-title'>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete {userToDelete?.name}?
                </DialogContent>
                <DialogActions className='custom-dialog-actions'>
                    <Button onClick={handleCancelDelete} color="primary" className="custom-button custom-cancel-button">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="secondary" className="custom-button custom-confirm-button">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
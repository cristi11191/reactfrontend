// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
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
import { hasPermission } from '../utils/permissions';
import { permissionsConfig } from '../config/permissionsConfig';
import '../styles/styles.css';
import { fetchAllUsers } from "../services/userServices.jsx";
import RoleServices  from "../services/roleServices.jsx";
export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true); // New loading state
    const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });
    const [roles, setRoles] = useState([{ id: 1, name: 'Student' }]); // Example role options

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

    const { permissions } = permissionsConfig.user_management; // Retrieve permissions for this section

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddUser = () => {
        // Add user logic here
        setOpen(false);
    };

    const showActionsColumn = hasPermission(permissions.update) || hasPermission(permissions.delete);
    return (
        <div style={{ padding: 20 }}>
            {hasPermission(permissions.create) && (
                <Button className='btn-add' variant="contained" color="primary" onClick={handleClickOpen}>
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
                            {users.map((user) => (
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
                                            {hasPermission(permissions.update) && (
                                                <IconButton
                                                    aria-label="edit"
                                                    color="primary"
                                                    sx={{ color: '#ff9800', '&:hover': { color: '#ffa726' } }}
                                                    className='tblrow action-btn edit'
                                                    id='editbtn'
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            )}
                                            {hasPermission(permissions.delete) && (
                                                <IconButton
                                                    aria-label="delete"
                                                    color="secondary"
                                                    sx={{ color: '#f44336', '&:hover': { color: '#e57373' } }}
                                                    className='tblrow action-btn delete '
                                                    id='deletebtn'
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

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New User</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="outlined"
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
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
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
                        onChange={(e) => setNewUser({ ...newUser, role_id: e.target.value })}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddUser} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
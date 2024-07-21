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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CircularProgress from '@mui/material/CircularProgress';
import { hasPermission } from '../utils/permissions';
import { permissionsConfig } from '../config/permissionsConfig';
import { fetchUsers } from "../services/apiServices.jsx";
import RoleServices  from "../services/roleServices.jsx";
import PermissionServices from "../services/permissionServices.jsx";
import '../styles/styles.css';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true); // New loading state
    const [permissions, setPermissions] = useState([]);
    const [open, setOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });
    const [expandedRoleId, setExpandedRoleId] = useState(null); // Manage expanded role ID

    useEffect(() => {
        const getUsers = async () => {
            try {
                const data = await fetchUsers();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        const getRoles = async () => {
            try {
                const data = await RoleServices.fetchRoles();
                const rolesWithPermissions = await Promise.all(data.map(async (role) => {
                    const permissions = await RoleServices.getRolePermissions(role.id);
                    return { ...role, permissions };
                }));
                setRoles(rolesWithPermissions);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        const getPermissions = async () => {
            try {
                const data = await PermissionServices.fetchPermissions();
                setPermissions(data);
            } catch (error) {
                console.error('Error fetching permissions:', error);
            }
        };

        const fetchData = async () => {
            await Promise.all([getUsers(), getRoles(), getPermissions()]);
            setLoading(false);
        };

        fetchData();
    }, []);

    const { permissions: RoleManagementPermissions } = permissionsConfig.roleandpermission_management;

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
    const handleTogglePermissions = (roleId) => {
        setExpandedRoleId(expandedRoleId === roleId ? null : roleId);
    };

    const showPermissionActionsColumn = hasPermission(RoleManagementPermissions.permission_update) || hasPermission(RoleManagementPermissions.permission_delete);
    const showRoleActionsColumn = hasPermission(RoleManagementPermissions.role_update) || hasPermission(RoleManagementPermissions.role_delete);

    return (
        <div style={{ padding: 20 }}>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </div>
            ) : (
                <>
                    {hasPermission(RoleManagementPermissions.role_create) && (
                        <Button className='btn-add' variant="contained" color="primary" onClick={handleClickOpen}>
                            Add Role
                        </Button>
                    )}

                    {/* Roles Table */}
                    <TableContainer component={Paper} style={{ marginTop: 40 }} className='tableusers'>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="roles table">
                            <TableHead>
                                <TableRow className='tblrows'>
                                    <TableCell className='tabletext tblrow'>Role ID</TableCell>
                                    <TableCell align="right" className='tabletext tblrow'>Role Name</TableCell>
                                    <TableCell align="right" className='tabletext tblrow'>Permissions</TableCell>
                                    {showRoleActionsColumn && (
                                        <TableCell align="right" className='tabletext tblrow'>Actions</TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {roles.map((role) => (
                                    <TableRow
                                        key={role.id}
                                        sx={{ '&:last-child td, &:last-child th': { } }}
                                    >
                                        <TableCell component="th" scope="row" className='tabletext tblrow'>{role.id}</TableCell>
                                        <TableCell align="right" className='tabletext tblrow'>{role.name}</TableCell>
                                        <TableCell align="right" className='tabletext tblrow'>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                <div style={{ marginRight: 8 }}>
                                                    {expandedRoleId === role.id
                                                        ? role.permissions.map(permission => permission.name).join(', ')
                                                        : role.permissions.length > 0
                                                            ? role.permissions[0].name + (role.permissions.length > 1 ? ' ...' : '')
                                                            : ''}
                                                </div>
                                                <IconButton
                                                    onClick={() => handleTogglePermissions(role.id)}
                                                    aria-label={expandedRoleId === role.id ? "Collapse Permissions" : "Expand Permissions"}
                                                    size="small" // Smaller icon
                                                >
                                                    {expandedRoleId === role.id ? <ExpandLessIcon fontSize="small" /> :
                                                        <ExpandMoreIcon fontSize="small" />}
                                                </IconButton>
                                            </div>
                                        </TableCell>
                                        {showRoleActionsColumn && (
                                            <TableCell align="right">
                                                {hasPermission(RoleManagementPermissions.role_update) && (
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
                                                {hasPermission(RoleManagementPermissions.role_delete) && (
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

                    {hasPermission(RoleManagementPermissions.permission_create) && (
                        <Button className='btn-add permission' variant="contained" color="primary" onClick={handleClickOpen}>
                            Add Permission
                        </Button>
                    )}

                    {/* Permissions Table */}
                    <TableContainer component={Paper} style={{ marginTop: 40 }} className='tableusers'>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="permissions table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className='tabletext tblrow'>Permission ID</TableCell>
                                    <TableCell align="right" className='tabletext tblrow'>Permission Name</TableCell>
                                    {showPermissionActionsColumn && (
                                        <TableCell align="right" className='tabletext tblrow'>Actions</TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {permissions.map((permission) => (
                                    <TableRow
                                        key={permission.id}
                                        sx={{ '&:last-child td, &:last-child th': {  width: '10px' } }}
                                    >
                                        <TableCell component="th" scope="row" className='tabletext tblrow'>{permission.id}</TableCell>
                                        <TableCell align="right" className='tabletext tblrow'>{permission.name}</TableCell>
                                        {showPermissionActionsColumn && (
                                            <TableCell align="right">
                                                {hasPermission(RoleManagementPermissions.permission_update) && (
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
                                                {hasPermission(RoleManagementPermissions.permission_delete) && (
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
                                id="role"
                                label="Role"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            />
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
                </>
            )}
        </div>
    );
}

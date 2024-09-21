// eslint-disable-next-line no-unused-vars
import React, {useState, useEffect, useContext} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    CircularProgress,
    TextField
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import RoleServices from "../../services/roleServices.jsx";
import '../../styles/styles.css';
import SearchContext from "../../contexts/SearchContext.jsx";


export default function RoleManagement() {

    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);
    const [deleteType, setDeleteType] = useState(''); // 'role'
    const [newRoleName, setNewRoleName] = useState('');
    const [roleNameError, setRoleNameError] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [currentRole, setCurrentRole] = useState(null);
    const { searchQuery } = useContext(SearchContext);

    const filteredRoles = (roles || []).filter(role => {
        const nameMatches = role.name && role.name.toLowerCase().includes(searchQuery);

        return nameMatches;
    });



    useEffect(() => {
        const fetchData = async () => {
            try {
                const rolesData = await RoleServices.fetchRoles();
                console.log(rolesData);
                setRoles(rolesData);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);



    const handleClickOpen = (role = null) => {
        if (role) {
            // When editing an existing role
            setIsEdit(true);
            setCurrentRole(role);
            setNewRoleName(role.name);
        } else {
            // When adding a new role
            setIsEdit(false); // Ensure this is set to false for adding
            setCurrentRole(null);
            setNewRoleName('');
        }
        setOpen(true); // Open the dialog
    };


    const handleClose = () => {
        setOpen(false);
        setNewRoleName('');
        setRoleNameError('');
        setIsEdit(false);
        setCurrentRole(null);
    };

    const handleDelete = (item, type) => {
        setDeleteItem(item);
        setDeleteType(type);
        setOpenDeleteDialog(true);
    };

    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
        setDeleteItem(null);
        setDeleteType('');
    };


    const handleConfirmDelete = async () => {
        try {
            if (deleteType === 'role') {
                await RoleServices.deleteRole(deleteItem.id);
            }
            const data = await RoleServices.fetchRoles();
            setRoles(data);

        } catch (error) {
            console.error('Error deleting item:', error);
        }
        handleCancelDelete();
    };


    const handleAddOrUpdateRole = async () => {
        if (!newRoleName.trim()) {
            setRoleNameError('Role name is required');
            return;
        }

        const roleExists = roles.some(role => role.name.toLowerCase() === newRoleName.trim().toLowerCase());
        if (!isEdit && roleExists) {
            setRoleNameError('Role with this name already exists');
            return;
        }


        // Function to get permissions with their dependencies


        try {
            if (isEdit) {
                // Update existing role
                console.log("Updating role:", currentRole.id, newRoleName.trim());
                await RoleServices.updateRole(currentRole.id, { name: newRoleName.trim() });

            } else {
                const newRole = await RoleServices.createRole({ name: newRoleName.trim()});
                console.log("Created new role:", newRole.id, newRoleName.trim());
            }

            const data = await RoleServices.fetchRoles();

            setRoles(data);
            handleClose();
        } catch (error) {
            console.error('Error adding or updating role:', error);
        }
    };



    let user_role = localStorage.getItem('role');



    return (
        <div style={{ padding: 20 }}>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </div>
            ) : (
                <>
                    {(user_role === 'Admin') && (
                        <Button className='btn-add' variant="contained" color="primary" onClick={() => handleClickOpen(null)}>
                            Add Role
                        </Button>
                    )}

                    {(user_role === 'Admin') && (
                    <TableContainer component={Paper} style={{ marginTop: 40 }} className='tableusers'>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="roles table">
                            <TableHead>
                                <TableRow className='tblrows'>
                                    <TableCell align="right" className='tabletext tblrow'>Role ID</TableCell>
                                    <TableCell align="right" className='tabletext tblrow'>Role Name</TableCell>
                                    <TableCell align="right" className='tabletext tblrow'>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRoles.map((role) => (
                                    <TableRow
                                        key={role.id}
                                        sx={{ '&:last-child td, &:last-child th': { } }}
                                    >
                                        <TableCell align="right" component="th" scope="row" className='tabletext tblrow'>{role.id}</TableCell>
                                        <TableCell align="right" className='tabletext tblrow'>{role.name}</TableCell>

                                            <TableCell align="right">
                                                {(user_role === 'Admin') && (
                                                    <IconButton
                                                        aria-label="edit"
                                                        color="primary"
                                                        sx={{ color: '#ff9800', '&:hover': { color: '#ffa726' } }}
                                                        className='tblrow action-btn edit'
                                                        id='editbtn'
                                                        onClick={() => handleClickOpen(role)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                )}
                                                {(user_role === 'Admin') && (
                                                    <IconButton
                                                        aria-label="delete"
                                                        color="secondary"
                                                        sx={{ color: '#f44336', '&:hover': { color: '#e57373' } }}
                                                        className='tblrow action-btn delete '
                                                        id='deletebtn'
                                                        onClick={() => handleDelete(role, 'role')}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                )}
                                            </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    )}



                    <Dialog open={open} onClose={handleClose} PaperProps={{ className: 'custom-dialog-paper' }}>
                        <DialogTitle className='custom-dialog-title'>{isEdit ? 'Update Role' : 'Add New Role'}</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Name"
                                type="text"
                                fullWidth
                                required
                                variant="outlined"
                                className="custom-textfield"
                                value={newRoleName}
                                onChange={(e) => {
                                    setNewRoleName(e.target.value);
                                    setRoleNameError('');
                                }}
                                error={!!roleNameError}
                                helperText={roleNameError}
                            />


                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleAddOrUpdateRole} color="primary">
                                {isEdit ? 'Update' : 'Add'}
                            </Button>
                        </DialogActions>

                    </Dialog>






                    <Dialog open={openDeleteDialog} onClose={handleCancelDelete} PaperProps={{ className: 'custom-dialog-paper' }}>
                        <DialogTitle className='custom-dialog-title'>Confirm Delete</DialogTitle>
                        <DialogContent>
                            Are you sure you want to delete {deleteItem?.name}?
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


                </>
            )}
        </div>
    );
}

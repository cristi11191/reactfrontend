import React, { useContext, useEffect, useState } from 'react';
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
import GroupServices from "../../services/groupServices.jsx";
import SearchContext from "../../contexts/SearchContext.jsx";
import '../../styles/styles.css';

export default function GroupManagement() {
    const [groups, setGroups] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newGroup, setNewGroup] = useState({ group_name: '' });
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentGroup, setCurrentGroup] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null);
    const { searchQuery } = useContext(SearchContext);

    const filteredGroups = groups.filter(group =>
        group.group_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const getGroups = async () => {
            try {
                const groupsData = await GroupServices.fetchGroup();
                setGroups(groupsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        getGroups();
    }, []);

    // Role-based access check
    const userRole = localStorage.getItem('role');
    const canAddOrEdit = userRole === 'Admin' || userRole === 'Secretary'; // Only admins can add or edit groups
    const canDelete = userRole === 'Admin' || userRole === 'Secretary'; // Only admins can delete groups

    const handleClickOpen = (group = null) => {
        if (group) {
            setIsEditMode(true);
            setCurrentGroup(group);
            setNewGroup({ group_name: group.group_name });
        } else {
            setIsEditMode(false);
            setNewGroup({ group_name: '' });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setIsEditMode(false);
        setCurrentGroup(null);
    };

    const handleAddOrUpdateGroup = async () => {
        try {
            if (isEditMode && currentGroup) {
                await GroupServices.updateGroup(currentGroup.id, newGroup);
            } else {
                await GroupServices.createGroup(newGroup);
            }
            const updatedGroups = await GroupServices.fetchGroup();
            setGroups(updatedGroups);
            handleClose();
        } catch (error) {
            console.error('Error saving group:', error);
        }
    };

    const handleDeleteClick = (group) => {
        setGroupToDelete(group);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            if (groupToDelete) {
                await GroupServices.deleteGroup(groupToDelete.id);
                const updatedGroups = await GroupServices.fetchGroup();
                setGroups(updatedGroups);
            }
            setOpenDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };

    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
    };

    return (
        <div style={{ padding: 20 }}>
            {!loading && canAddOrEdit && (
                <Button className='btn-add' variant="contained" color="primary" onClick={() => handleClickOpen()}>
                    Add Group
                </Button>
            )}

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                </div>
            ) : (
                <TableContainer component={Paper} style={{ marginTop: 20 }} className='tablegroups'>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                        <TableHead>
                            <TableRow className='tblrow'>
                                <TableCell align="right" className='tabletext tblrow'>ID</TableCell>
                                <TableCell align="right" className='tabletext tblrow'>Group Name</TableCell>
                                {(canAddOrEdit || canDelete) && (
                                    <TableCell align="right" className='tabletext tblrow'>Actions</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredGroups.map((group) => (
                                <TableRow key={group.id} sx={{ border: 0 }} className='tblrow'>
                                    <TableCell align="right" component="th" scope="row" className='tabletext tblrow'>{group.id}</TableCell>
                                    <TableCell align="right" component="th" scope="row" className='tabletext tblrow'>{group.group_name}</TableCell>
                                    {(canAddOrEdit || canDelete) && (
                                        <TableCell align="right">
                                            {canAddOrEdit && (
                                                <IconButton
                                                    aria-label="edit"
                                                    color="primary"
                                                    sx={{ color: '#ff9800', '&:hover': { color: '#ffa726' } }}
                                                    className='tblrow action-btn edit'
                                                    id='editbtn'
                                                    onClick={() => handleClickOpen(group)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            )}
                                            {canDelete && (
                                                <IconButton
                                                    aria-label="delete"
                                                    color="secondary"
                                                    sx={{ color: '#f44336', '&:hover': { color: '#e57373' } }}
                                                    className='tblrow action-btn delete'
                                                    id='deletebtn'
                                                    onClick={() => handleDeleteClick(group)}
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
                <DialogTitle className='custom-dialog-title'>{isEditMode ? 'Edit Group' : 'Add New Group'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="group_name"
                        label="Group Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        className="custom-textfield"
                        value={newGroup.group_name}
                        onChange={(e) => setNewGroup({ ...newGroup, group_name: e.target.value })}
                    />
                </DialogContent>
                <DialogActions className='custom-dialog-actions'>
                    <Button onClick={handleClose} color="primary" className="custom-button custom-cancel-button">
                        Cancel
                    </Button>
                    <Button onClick={handleAddOrUpdateGroup} color="primary" className="custom-button custom-confirm-button">
                        {isEditMode ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={handleCancelDelete} PaperProps={{ className: 'custom-dialog-paper' }}>
                <DialogTitle className='custom-dialog-title'>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete {groupToDelete?.group_name}?
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

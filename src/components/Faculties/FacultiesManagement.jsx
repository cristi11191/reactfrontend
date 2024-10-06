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
import FacultiesServices from "../../services/facultyServices.jsx";
import SearchContext from "../../contexts/SearchContext.jsx";
import '../../styles/styles.css';

export default function FacultiesManagement() {
    const [faculties, setFaculties] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newFaculty, setNewFaculty] = useState({ group_name: '' });
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentFaculty, setCurrentFaculty] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [facultyToDelete, setFacultyToDelete] = useState(null);
    const { searchQuery } = useContext(SearchContext);

    const filteredFaculties = faculties.filter(faculty =>
        faculty.faculty_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const getFaculties = async () => {
            try {
                const groupsData = await FacultiesServices.fetchFaculties();
                setFaculties(groupsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        getFaculties();
    }, []);

    // Role-based access check
    const userRole = localStorage.getItem('role');
    const canAddOrEdit = userRole === 'Admin' || userRole === 'Secretary'; // Only admins can add or edit groups
    const canDelete = userRole === 'Admin' || userRole === 'Secretary'; // Only admins can delete groups

    const handleClickOpen = (faculty = null) => {
        if (faculty) {
            setIsEditMode(true);
            setCurrentFaculty(faculty);
            setNewFaculty({ faculty_name: faculty.faculty_name, short_name: faculty.short_name }); // Include short_name for editing
        } else {
            setIsEditMode(false);
            setNewFaculty({ faculty_name: '', short_name: '' });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setIsEditMode(false);
        setCurrentFaculty(null);
    };

    const handleAddOrUpdateFaculty = async () => {
        try {
            if (isEditMode && currentFaculty) {
                await FacultiesServices.updateFaculty(currentFaculty.id, newFaculty);
            } else {
                await FacultiesServices.createFaculty(newFaculty);
            }
            const updatedFaculties = await FacultiesServices.fetchFaculties();
            setFaculties(updatedFaculties);
            handleClose();
        } catch (error) {
            console.error('Error saving group:', error);
        }
    };

    const handleDeleteClick = (faculty) => {
        setFacultyToDelete(faculty);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            if (facultyToDelete) {
                await FacultiesServices.deleteFaculty(facultyToDelete.id);
                const updatedFaculties = await FacultiesServices.fetchFaculties();
                setFaculties(updatedFaculties);
            }
            setOpenDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting faculty:', error);
        }
    };

    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
    };

    return (
        <div style={{ padding: 20 }}>
            {!loading && canAddOrEdit && (
                <Button className='btn-add' variant="contained" color="primary" onClick={() => handleClickOpen()}>
                    Add Faculty
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
                                <TableCell align="left" className='tabletext tblrow'>ID</TableCell>
                                <TableCell align="left" className='tabletext tblrow'>Faculty Name</TableCell>
                                <TableCell align="left" className='tabletext tblrow'>Short Name</TableCell> {/* New Column */}
                                {(canAddOrEdit || canDelete) && (
                                    <TableCell align="left" className='tabletext tblrow'>Actions</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredFaculties.map((faculty) => (
                                <TableRow key={faculty.id} sx={{ border: 0 }} className='tblrow'>
                                    <TableCell align="left" component="th" scope="row" className='tabletext tblrow'>{faculty.id}</TableCell>
                                    <TableCell align="left" component="th" scope="row" className='tabletext tblrow'>{faculty.faculty_name}</TableCell>
                                    <TableCell align="left" component="th" scope="row" className='tabletext tblrow'>{faculty.short_name}</TableCell> {/* Display Short Name */}
                                    {(canAddOrEdit || canDelete) && (
                                        <TableCell align="left">
                                            {canAddOrEdit && (
                                                <IconButton
                                                    aria-label="edit"
                                                    color="primary"
                                                    sx={{ color: '#ff9800', '&:hover': { color: '#ffa726' } }}
                                                    className='tblrow action-btn edit'
                                                    id='editbtn'
                                                    onClick={() => handleClickOpen(faculty)}
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
                                                    onClick={() => handleDeleteClick(faculty)}
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
                <DialogTitle className='custom-dialog-title'>{isEditMode ? 'Edit Faculty' : 'Add New Faculty'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="faculty_name"
                        label="Faculty Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        className="custom-textfield"
                        value={newFaculty.faculty_name}
                        onChange={(e) => setNewFaculty({ ...newFaculty, faculty_name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        id="short_name"
                        label="Short Name" // New TextField for short_name
                        type="text"
                        fullWidth
                        variant="outlined"
                        className="custom-textfield"
                        value={newFaculty.short_name}
                        onChange={(e) => setNewFaculty({ ...newFaculty, short_name: e.target.value })}
                    />
                </DialogContent>
                <DialogActions className='custom-dialog-actions'>
                    <Button onClick={handleClose} color="primary" className="custom-button custom-cancel-button">
                        Cancel
                    </Button>
                    <Button onClick={handleAddOrUpdateFaculty} color="primary" className="custom-button custom-confirm-button">
                        {isEditMode ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={handleCancelDelete} PaperProps={{ className: 'custom-dialog-paper' }}>
                <DialogTitle className='custom-dialog-title'>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete {facultyToDelete?.faculty_name}?
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

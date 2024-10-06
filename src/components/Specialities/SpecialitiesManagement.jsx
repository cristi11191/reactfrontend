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
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import SpecialitiesServices from "../../services/specialityServices.jsx";
import FacultiesServices from "../../services/facultyServices.jsx"; // Import Faculties services
import SearchContext from "../../contexts/SearchContext.jsx";
import '../../styles/styles.css';

export default function SpecialitiesManagement() {
    const [specialities, setSpecialities] = useState([]);
    const [faculties, setFaculties] = useState([]); // State to store faculties
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newSpeciality, setNewSpeciality] = useState({ speciality_name: '', faculty_id: '' });
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentSpeciality, setCurrentSpeciality] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [specialityToDelete, setSpecialityToDelete] = useState(null);
    const { searchQuery } = useContext(SearchContext);

    const filteredSpecialities = specialities.filter(speciality =>
        speciality.speciality_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const getData = async () => {
            try {
                const [specialitiesData, facultiesData] = await Promise.all([
                    SpecialitiesServices.fetchSpecialities(),
                    FacultiesServices.fetchFaculties()
                ]);
                setSpecialities(specialitiesData);
                setFaculties(facultiesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []);

    // Role-based access check
    const userRole = localStorage.getItem('role');
    const canAddOrEdit = userRole === 'Admin' || userRole === 'Secretary'; // Only admins and secretaries can add or edit
    const canDelete = userRole === 'Admin' || userRole === 'Secretary'; // Only admins and secretaries can delete

    const handleClickOpen = (speciality = null) => {
        if (speciality) {
            setIsEditMode(true);
            setCurrentSpeciality(speciality);
            setNewSpeciality({ speciality_name: speciality.speciality_name, faculty_id: speciality.faculty_id });
        } else {
            setIsEditMode(false);
            setNewSpeciality({ speciality_name: '', faculty_id: '' });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setIsEditMode(false);
        setCurrentSpeciality(null);
    };

    const handleAddOrUpdateSpeciality = async () => {
        try {
            if (isEditMode && currentSpeciality) {
                await SpecialitiesServices.updateSpeciality(currentSpeciality.id, newSpeciality);
            } else {
                await SpecialitiesServices.createSpeciality(newSpeciality);
            }
            const updatedSpecialities = await SpecialitiesServices.fetchSpecialities();
            setSpecialities(updatedSpecialities);
            handleClose();
        } catch (error) {
            console.error('Error saving speciality:', error);
        }
    };

    const handleDeleteClick = (speciality) => {
        setSpecialityToDelete(speciality);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            if (specialityToDelete) {
                await SpecialitiesServices.deleteSpeciality(specialityToDelete.id);
                const updatedSpecialities = await SpecialitiesServices.fetchSpecialities();
                setSpecialities(updatedSpecialities);
            }
            setOpenDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting speciality:', error);
        }
    };

    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
    };

    return (
        <div style={{ padding: 20 }}>
            {!loading && canAddOrEdit && (
                <Button className='btn-add' variant="contained" color="primary" onClick={() => handleClickOpen()}>
                    Add Speciality
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
                                <TableCell align="left" className='tabletext tblrow'>Speciality Name</TableCell>
                                <TableCell align="left" className='tabletext tblrow'>Faculty</TableCell>
                                {(canAddOrEdit || canDelete) && (
                                    <TableCell align="left" className='tabletext tblrow'>Actions</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredSpecialities.map((speciality) => (
                                <TableRow key={speciality.id} sx={{ border: 0 }} className='tblrow'>
                                    <TableCell align="left" component="th" scope="row" className='tabletext tblrow'>{speciality.id}</TableCell>
                                    <TableCell align="left" component="th" scope="row" className='tabletext tblrow'>{speciality.speciality_name}</TableCell>
                                    <TableCell align="left" component="th" scope="row" className='tabletext tblrow'>{speciality.faculty.faculty_name}</TableCell>
                                    {(canAddOrEdit || canDelete) && (
                                        <TableCell align="left">
                                            {canAddOrEdit && (
                                                <IconButton
                                                    aria-label="edit"
                                                    color="primary"
                                                    sx={{ color: '#ff9800', '&:hover': { color: '#ffa726' } }}
                                                    className='tblrow action-btn edit'
                                                    id='editbtn'
                                                    onClick={() => handleClickOpen(speciality)}
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
                                                    onClick={() => handleDeleteClick(speciality)}
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
                <DialogTitle className='custom-dialog-title'>{isEditMode ? 'Edit Speciality' : 'Add New Speciality'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="speciality_name"
                        label="Speciality Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        className="custom-textfield"
                        value={newSpeciality.speciality_name}
                        onChange={(e) => setNewSpeciality({ ...newSpeciality, speciality_name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Faculty"
                        select
                        fullWidth
                        variant="outlined"
                        className="custom-textfield"
                        value={newSpeciality.faculty_id}
                        onChange={(e) => setNewSpeciality({ ...newSpeciality, faculty_id: e.target.value })}
                    >
                        {faculties.map((faculty) => (
                            <MenuItem key={faculty.id} value={faculty.id} className="text-fields-dialog">
                                {faculty.faculty_name}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions className='custom-dialog-actions'>
                    <Button onClick={handleClose} color="primary" className="custom-button custom-cancel-button">
                        Cancel
                    </Button>
                    <Button onClick={handleAddOrUpdateSpeciality} color="primary" className="custom-button custom-confirm-button">
                        {isEditMode ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={handleCancelDelete} PaperProps={{ className: 'custom-dialog-paper' }}>
                <DialogTitle className='custom-dialog-title'>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete {specialityToDelete?.speciality_name}?
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

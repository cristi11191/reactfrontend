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
import ClassesServices from "../../services/classesServices.jsx";
import FacultiesServices from "../../services/facultyServices.jsx";
import SpecialitiesServices from "../../services/specialityServices.jsx";
import SearchContext from "../../contexts/SearchContext.jsx";
import '../../styles/styles.css';
import {MenuItem} from "@mui/material";

export default function ClassesManagement() {
    const [classes, setClasses] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [specialities, setSpecialities] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newClass, setNewClass] = useState({ class_name: '', year: '', semester: '', faculty_id: '', speciality_id: '' });
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentClass, setCurrentClass] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [filteredSpecialities, setFilteredSpecialities] = useState([]); // To store filtered specialities
    const [classToDelete, setClassToDelete] = useState(null);
    const { searchQuery } = useContext(SearchContext);

    const filteredClasses = classes.filter(cls =>
        cls.class_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const getClasses = async () => {
            try {
                const [classesData, facultiesData, specialitiesData] = await Promise.all([
                    ClassesServices.fetchClasses(),
                    FacultiesServices.fetchFaculties(),
                    SpecialitiesServices.fetchSpecialities()
                ]);
                setClasses(classesData);
                setFaculties(facultiesData);
                setSpecialities(specialitiesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        getClasses();
    }, []);

    // Role-based access check
    const userRole = localStorage.getItem('role');
    const canAddOrEdit = userRole === 'Admin' || userRole === 'Secretary'; // Only admins and secretaries can add/edit
    const canDelete = userRole === 'Admin' || userRole === 'Secretary'; // Only admins and secretaries can delete

    const handleClickOpen = (cls = null) => {
        if (cls) {
            setIsEditMode(true);
            setCurrentClass(cls);
            setNewClass({
                class_name: cls.class_name,
                year: cls.year,
                semester: cls.semester,
                faculty_id: cls.faculty_id,
                speciality_id: cls.speciality_id
            });

            // Filter specialities for the selected faculty
            handleFacultyChange(cls.faculty_id);
        } else {
            setIsEditMode(false);
            setNewClass({ class_name: '', year: '', semester: '', faculty_id: '', speciality_id: '' });
            setFilteredSpecialities([]); // Reset filtered specialities
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setIsEditMode(false);
        setCurrentClass(null);
    };

    const handleAddOrUpdateClass = async () => {
        try {
            if (isEditMode && currentClass) {
                await ClassesServices.updateClass(currentClass.id, newClass);
            } else {
                await ClassesServices.createClass(newClass);
            }
            const updatedClasses = await ClassesServices.fetchClasses();
            setClasses(updatedClasses);
            handleClose();
        } catch (error) {
            console.error('Error saving class:', error);
        }
    };

    const handleDeleteClick = (cls) => {
        setClassToDelete(cls);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            if (classToDelete) {
                await ClassesServices.deleteClass(classToDelete.id);
                const updatedClasses = await ClassesServices.fetchClasses();
                setClasses(updatedClasses);
            }
            setOpenDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting class:', error);
        }
    };

    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
    };

    const handleFacultyChange = (facultyId) => {
        setNewClass(prevClass => ({ ...prevClass, faculty_id: facultyId, speciality_id: '' }));

        // Filter specialities by the selected faculty ID
        const filtered = specialities.filter(speciality => speciality.faculty_id === facultyId);
        console.log(filtered);
        setFilteredSpecialities(filtered);
    };

    return (
        <div style={{ padding: 20 }}>
            {!loading && canAddOrEdit && (
                <Button className='btn-add' variant="contained" color="primary" onClick={() => handleClickOpen()}>
                    Add Class
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
                                <TableCell align="left" className='tabletext tblrow'>Class Name</TableCell>
                                <TableCell align="left" className='tabletext tblrow'>Year</TableCell>
                                <TableCell align="left" className='tabletext tblrow'>Semester</TableCell>
                                <TableCell align="left" className='tabletext tblrow'>Faculty</TableCell>
                                <TableCell align="left" className='tabletext tblrow'>Speciality</TableCell>
                                {(canAddOrEdit || canDelete) && (
                                    <TableCell align="left" className='tabletext tblrow'>Actions</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredClasses.map((cls) => (
                                <TableRow key={cls.id} sx={{ border: 0 }} className='tblrow'>
                                    <TableCell align="left" component="th" scope="row" className='tabletext tblrow'>{cls.id}</TableCell>
                                    <TableCell align="left" component="th" scope="row" className='tabletext tblrow'>{cls.class_name}</TableCell>
                                    <TableCell align="left" component="th" scope="row" className='tabletext tblrow'>{cls.year}</TableCell>
                                    <TableCell align="left" component="th" scope="row" className='tabletext tblrow'>{cls.semester}</TableCell>
                                    <TableCell align="left" component="th" scope="row" className='tabletext tblrow'>{cls.faculty.faculty_name}</TableCell>
                                    <TableCell align="left" component="th" scope="row" className='tabletext tblrow'>{cls.speciality.speciality_name}</TableCell>
                                    {(canAddOrEdit || canDelete) && (
                                        <TableCell align="left">
                                            {canAddOrEdit && (
                                                <IconButton
                                                    aria-label="edit"
                                                    color="primary"
                                                    sx={{ color: '#ff9800', '&:hover': { color: '#ffa726' } }}
                                                    className='tblrow action-btn edit'
                                                    id='editbtn'
                                                    onClick={() => handleClickOpen(cls)}
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
                                                    onClick={() => handleDeleteClick(cls)}
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
                <DialogTitle className='custom-dialog-title'>{isEditMode ? 'Edit Class' : 'Add New Class'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="class_name"
                        label="Class Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        className="custom-textfield"
                        value={newClass.class_name}
                        onChange={(e) => setNewClass({ ...newClass, class_name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        id="year"
                        label="Year"
                        type="number"
                        fullWidth
                        variant="outlined"
                        className="hide-spinner custom-textfield"
                        value={newClass.year}
                        onChange={(e) => setNewClass({ ...newClass, year: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        id="semester"
                        label="Semester"
                        type="number"
                        fullWidth
                        variant="outlined"
                        className="hide-spinner custom-textfield"
                        value={newClass.semester}
                        onChange={(e) => setNewClass({ ...newClass, semester: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        id="faculty_id"
                        label="Faculty"
                        select
                        fullWidth
                        variant="outlined"
                        className="custom-textfield"
                        value={newClass.faculty_id}
                        onChange={(e) => handleFacultyChange(e.target.value)}
                    >
                        <MenuItem value="">
                            None {/* Blank option */}
                        </MenuItem>
                        {faculties.map((faculty) => (
                            <MenuItem key={faculty.id} value={faculty.id} className="text-fields-dialog">
                                {faculty.faculty_name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        margin="dense"
                        id="speciality_id"
                        label="Speciality"
                        select
                        fullWidth
                        variant="outlined"
                        className="custom-textfield"
                        value={newClass.speciality_id}
                        onChange={(e) => setNewClass({ ...newClass, speciality_id: e.target.value })}
                        disabled={!newClass.faculty_id} // Disable if no faculty is selected
                    >
                        <MenuItem value="">
                            None {/* Blank option */}
                        </MenuItem>
                        {filteredSpecialities.map((speciality) => (
                            <MenuItem key={speciality.id} value={speciality.id} className="text-fields-dialog">
                                {speciality.speciality_name}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions className='custom-dialog-actions'>
                    <Button onClick={handleClose} color="primary" className="custom-button custom-cancel-button">
                        Cancel
                    </Button>
                    <Button onClick={handleAddOrUpdateClass} color="primary" className="custom-button custom-confirm-button">
                        {isEditMode ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={handleCancelDelete} PaperProps={{ className: 'custom-dialog-paper' }}>
                <DialogTitle className='custom-dialog-title'>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete {classToDelete?.class_name}?
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

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
import SeriesServices from "../../services/serieServices.jsx";
import GroupServices from "../../services/groupServices.jsx";
import SearchContext from "../../contexts/SearchContext.jsx";
import { Chip } from '@mui/material';
import '../../styles/styles.css';
import './seriestable.css';

export default function SeriesManagement() {
    const [series, setSeries] = useState([]);
    const [groups, setGroups] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newSeries, setNewSeries] = useState({ series_name: '', groups: [] });
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentSeries, setCurrentSeries] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [seriesToDelete, setSeriesToDelete] = useState(null);
    const { searchQuery } = useContext(SearchContext);
    const [searchTerm, setSearchTerm] = useState('');
    const filteredSeries = series.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    useEffect(() => {
        const getSeries = async () => {
            try {
                const seriesData = await SeriesServices.fetchSeries();
                setSeries(seriesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        const getGroups = async () => {
            try {
                const groupsData = await GroupServices.fetchGroup();
                setGroups(groupsData);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };

        getSeries();
        getGroups();
    }, []);

    const filteredGroups = groups.filter((group) =>
        group.group_name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const userRole = localStorage.getItem('role');
    const canAddOrEdit = userRole === 'Admin'  || userRole === 'Secretary';
    const canDelete = userRole === 'Admin'  || userRole === 'Secretary';

    const handleClickOpen = (series = null) => {
        if (series) {
            setIsEditMode(true);
            setCurrentSeries(series);
            setNewSeries({
                series_name: series.name,
                groups: series.groups || []
            });
        } else {
            setIsEditMode(false);
            setNewSeries({ series_name: '', groups: [] });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setIsEditMode(false);
        setCurrentSeries(null);
    };

    const handleAddOrUpdateSeries = async () => {
        try {
            // Prepare the data in the desired format
            const seriesData = {
                name: newSeries.series_name, // Changed to match 'name'
                groups: newSeries.groups, // Already in the right format
            };

            if (isEditMode && currentSeries) {
                await SeriesServices.updateSeries(currentSeries.id, seriesData);
            } else {
                await SeriesServices.createSeries(seriesData);
            }

            const updatedSeries = await SeriesServices.fetchSeries();
            setSeries(updatedSeries);
            handleClose();
        } catch (error) {
            console.error('Error saving series:', error);
        }
    };


    const handleDeleteClick = (series) => {
        setSeriesToDelete(series);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            if (seriesToDelete) {
                await SeriesServices.deleteSeries(seriesToDelete.id);
                const updatedSeries = await SeriesServices.fetchSeries();
                setSeries(updatedSeries);
            }
            setOpenDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting series:', error);
        }
    };

    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
    };

    const handleGroupSelection = (groupId) => {
        setNewSeries((prev) => {
            const isSelected = prev.groups.includes(groupId);
            if (isSelected) {
                return { ...prev, groups: prev.groups.filter(g => g !== groupId) };
            } else {
                return { ...prev, groups: [...prev.groups, groupId] };
            }
        });
    };

    return (
        <div style={{ padding: 20 }}>
            {!loading && canAddOrEdit && (
                <Button className='btn-add' variant="contained" color="primary" onClick={() => handleClickOpen()}>
                    Add Series
                </Button>
            )}

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                </div>
            ) : (
                <TableContainer component={Paper} style={{ marginTop: 20 }} className='tableseries'>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                        <TableHead>
                            <TableRow className='tblrow'>
                                <TableCell align="right" className='tabletext tblrow'>ID</TableCell>
                                <TableCell align="right" className='tabletext tblrow'>Series Name</TableCell>
                                <TableCell align="right" className='tabletext tblrow'>Groups</TableCell>
                                {(canAddOrEdit || canDelete) && (
                                    <TableCell align="right" className='tabletext tblrow'>Actions</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredSeries.map((s) => (
                                <TableRow key={s.id} sx={{ border: 0 }} className='tblrow'>
                                    <TableCell align="right" component="th" scope="row" className='tabletext tblrow'>{s.id}</TableCell>
                                    <TableCell align="right" component="th" scope="row" className='tabletext tblrow'>{s.name}</TableCell>
                                    <TableCell align="right" component="th" scope="row" className='tabletext tblrow'>
                                        {s.groups && s.groups.length > 0 && s.groups.map((groupName) => {
                                            const group = groups.find(g => g.group_name === groupName);
                                            return group ? (
                                                <Chip
                                                    key={group.group_name}
                                                    label={group.group_name}
                                                    className="custom-chip"
                                                />
                                            ) : null;
                                        })}
                                    </TableCell>
                                    {(canAddOrEdit || canDelete) && (
                                        <TableCell align="right">
                                            {canAddOrEdit && (
                                                <IconButton
                                                    aria-label="edit"
                                                    color="primary"
                                                    sx={{ color: '#ff9800', '&:hover': { color: '#ffa726' } }}
                                                    className='tblrow action-btn edit'
                                                    id='editbtn'
                                                    onClick={() => handleClickOpen(s)}
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
                                                    onClick={() => handleDeleteClick(s)}
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
                <DialogTitle className='custom-dialog-title'>{isEditMode ? 'Edit Series' : 'Add New Series'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="series_name"
                        label="Series Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        className="custom-textfield"
                        value={newSeries.series_name} // Update to newSeries.series_name
                        onChange={(e) => setNewSeries({
                            ...newSeries,
                            series_name: e.target.value
                        })} // Ensure to set series_name
                    />
                    <input
                        type="text"
                        placeholder="Search groups..."
                        className="group-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="group-selection-list">
                        <p className="group-selection-title">Select Groups:</p>
                        {filteredGroups.map(group => (
                            <Chip
                                key={group.id}
                                label={group.group_name}
                                className={`group-chip ${newSeries.groups.includes(group.group_name) ? 'selected' : ''}`}
                                onClick={() => handleGroupSelection(group.group_name)}
                            />
                        ))}
                    </div>
                </DialogContent>
                <DialogActions className='custom-dialog-actions'>
                    <Button onClick={handleClose} color="primary" className="custom-button custom-cancel-button">
                        Cancel
                    </Button>
                    <Button onClick={handleAddOrUpdateSeries} color="primary" className="custom-button custom-confirm-button">
                        {isEditMode ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={handleCancelDelete} PaperProps={{className: 'custom-dialog-paper'}}>
                <DialogTitle className='custom-dialog-title'>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete {seriesToDelete?.series_name}?
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

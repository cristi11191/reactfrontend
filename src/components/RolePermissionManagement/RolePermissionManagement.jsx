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
    Checkbox,
    Grid,
    List,
    Card,
    CardHeader,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    TextField,
    Divider
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import RoleServices from "../../services/roleServices.jsx";
import PermissionServices from "../../services/permissionServices.jsx";
import { hasPermission } from '../../utils/permissions.jsx';
import { permissionsConfig } from '../../config/permissionsConfig.jsx';
import '../../styles/styles.css';
import {permissionDependencies} from "../../hooks/permissionsDependencies.jsx";
import SearchContext from "../../contexts/SearchContext.jsx";

function not(a, b = []) {
    const bNames = new Set(b); // Use a Set of names from b
    return a.filter(item => !bNames.has(item.name)); // Filter based on names
}



function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

export default function RolePermissionManagement() {

    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);
    const [deleteType, setDeleteType] = useState(''); // 'role' or 'permission'
    const [expandedRoleId, setExpandedRoleId] = useState(null);
    const [newRoleName, setNewRoleName] = useState('');
    const [roleNameError, setRoleNameError] = useState('');
    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);
    const [openPermissionDialog, setOpenPermissionDialog] = useState(false);
    const [newPermissionName, setNewPermissionName] = useState('');
    const [permissionNameError, setPermissionNameError] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [currentRole, setCurrentRole] = useState(null);
    const [currentPermission, setCurrentPermission] = useState(null);
    const { searchQuery } = useContext(SearchContext);

    const filteredRoles = (roles || []).filter(role => {
        const nameMatches = role.name && role.name.toLowerCase().includes(searchQuery);

        // Ensure permissions are valid and check for matches
        const permissionsMatch = Array.isArray(role.permissions) && role.permissions.some(permission =>
            typeof permission === 'string' && permission.toLowerCase().includes(searchQuery) // Check if permission is a string
        );

        return nameMatches || permissionsMatch;
    });

// Filter permissions based on the search query
    const filteredPermissions = (permissions || []).filter(permission =>
        permission.name && permission.name.toLowerCase().includes(searchQuery) // Check if permission.name exists
    );



    const leftChecked = Array.isArray(checked) && Array.isArray(left) ? intersection(checked, left) : [];
    const rightChecked = Array.isArray(checked) && Array.isArray(right) ? intersection(checked, right) : [];


    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value); // Assuming value is an object with a name property
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };


    const isChecked = (value) => {
        return checked.includes(value); // Assuming value is an object with a name property
    };


    const numberOfChecked = (items) => {
        return items.filter((item) => isChecked(item)).length; // Count checked items
    };

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked([]); // Uncheck all
        } else {
            setChecked(items); // Check all
        }
    };

    const handleCheckedRight = () => {
        const permissionsToMove = leftChecked; // Array of checked permissions from the left list

        // Update the right permissions
        setRight(prevRight => {
            return [...prevRight, ...permissionsToMove]; // Add permissions to the right
        });

        // Update the left permissions by filtering out the moved permissions
        setLeft(prevLeft => {
            const newLeft = prevLeft.filter(item =>
                !permissionsToMove.some(perm => perm.name === item.name) // Remove items whose names match the ones being moved
            );
            return newLeft; // Update the left list
        });

        setChecked([]); // Uncheck all after moving
    };

    const handleCheckedLeft = () => {
        const permissionsToMove = rightChecked; // Array of checked permissions from the right list

        // Update the left permissions
        setLeft(prevLeft => {
            return [...prevLeft, ...permissionsToMove]; // Add permissions to the left
        });

        // Update the right permissions by filtering out the moved permissions
        setRight(prevRight => {
            const newRight = prevRight.filter(item =>
                !permissionsToMove.some(perm => perm.name === item.name) // Remove items whose names match the ones being moved
            );
            return newRight; // Update the right list
        });

        setChecked([]); // Uncheck all after moving
    };


    const handleOpenPermissionDialog = (permission = null) => {
        console.log(isEdit);
        console.log(permission);
        if (permission) {
            // Editing existing permission
            setIsEdit(true);
            setCurrentPermission(permission);
            setNewPermissionName(permission.name);
        } else {
            // Adding new permission
            setIsEdit(false);
            setCurrentPermission(null);
            setNewPermissionName('');
        }
        setOpenPermissionDialog(true);
    };


    const handleAddOrUpdatePermission = async () => {
        if (!newPermissionName.trim()) {
            setPermissionNameError('Permission name is required');
            return;
        }

        const permissionExists = permissions.some(permission => permission.name.toLowerCase() === newPermissionName.trim().toLowerCase());
        if (!isEdit && permissionExists) {
            setPermissionNameError('Permission with this name already exists');
            return;
        }

        try {
            if (isEdit) {
                await PermissionServices.updatePermission(currentPermission.id,{ name: newPermissionName.trim() });
            } else {
                await PermissionServices.createPermission({ name: newPermissionName.trim() });
            }

            const data = await PermissionServices.fetchPermissions();
            setPermissions(data);
            handleClosePermissionDialog();
        } catch (error) {
            console.error('Error adding or updating permission:', error);
        }
    };



    const customList = (title, items = []) => (
        <Card className="custom-list">
            <CardHeader
                sx={{ px: 2, py: 1 }}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={
                            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
                style={{ color: 'var(--text-color-dialog)' }} // Set text color
            />
            <Divider />
            <List
                sx={{
                    width: '100%',
                    height: 'calc(100% - 56px)', // Adjust height to fit the Card
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                    color: 'var(--text-color-dialog)', // Set text color
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((value) => {
                    const labelId = `transfer-list-all-item-${value.id}-label`;

                    return (
                        <ListItemButton
                            key={value.id}
                            role="listitem"
                            onClick={handleToggle(value)} // Ensure to pass the value correctly
                            style={{ color: 'var(--text-color-dialog)' }} // Set text color
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={isChecked(value)} // Use the isChecked function
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                    style={{ color: 'var(--text-color-dialog)' }} // Set text color
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={value.name} style={{ color: 'var(--text-color-dialog)' }} // Set text color
                            />
                        </ListItemButton>
                    );
                })}
            </List>
        </Card>
    );





    useEffect(() => {
        const fetchData = async () => {
            try {
                const rolesData = await RoleServices.fetchRoles();
                console.log(rolesData);
                const permissionsData = await PermissionServices.fetchPermissions();
                console.log(permissionsData);
                setRoles(rolesData);
                setPermissions(permissionsData);
                setLeft(permissionsData); // Initialize left side with all permissions
                setRight([]); // Initialize right side as empty

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const { permissions: RoleManagementPermissions } = permissionsConfig.role_and_permission_management;

    const handleClickOpen = (role = null) => {
        if (role) {
            // When editing an existing role
            setIsEdit(true);
            setCurrentRole(role);
            setNewRoleName(role.name);
            const assignedPermissions = permissions.filter(permission =>
                role.permissions.includes(permission.name) // Match by name
            );

            setRight(assignedPermissions);

            setLeft(not(permissions, role.permissions));
            console.log('Available Permissions:', right);

        } else {
            // When adding a new role
            setIsEdit(false); // Ensure this is set to false for adding
            setCurrentRole(null);
            setNewRoleName('');
            setRight([]); // Clear the right side (assigned permissions)
            setLeft(permissions); // Reset the left side (available permissions)

        }
        setOpen(true); // Open the dialog
    };


    const handleClose = () => {
        setOpen(false);
        setNewRoleName('');
        setRoleNameError('');
        setChecked([]);
        setLeft(permissions);
        setRight([]);
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

    const handleClosePermissionDialog = () => {
        setOpenPermissionDialog(false);
        setNewPermissionName('');
        setPermissionNameError('');
        setIsEdit(false); // Reset isEdit to false
        setCurrentPermission(null);
    };

    const handleConfirmDelete = async () => {
        try {
            if (deleteType === 'role') {
                await RoleServices.deleteRole(deleteItem.id);
            } else if (deleteType === 'permission') {
                await PermissionServices.deletePermission(deleteItem.id);
            }
            const data = await RoleServices.fetchRoles();
            const rolesWithPermissions = await Promise.all(data.map(async (role) => {
                const permissions = await RoleServices.getRolePermissions(role.id);
                return { ...role, permissions };
            }));
            setRoles(rolesWithPermissions);

            const permissionsData = await PermissionServices.fetchPermissions();
            setPermissions(permissionsData);
            setLeft(permissionsData);
            setRight([]);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
        handleCancelDelete();
    };

    const handleTogglePermissions = (roleId) => {
        setExpandedRoleId(expandedRoleId === roleId ? null : roleId);
    };

    const showPermissionActionsColumn = hasPermission([RoleManagementPermissions.permission.update]) || hasPermission([RoleManagementPermissions.permission.delete]);
    const showRoleActionsColumn = hasPermission([RoleManagementPermissions.role.update]) || hasPermission([RoleManagementPermissions.role.delete]);

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
        const permissionNameToIdMap = permissions.reduce((map, permission) => {
            map[permission.name] = permission.name;
            return map;
        }, {});

        // Function to get permissions with their dependencies
        const getPermissionsWithDependencies = (selectedPermissions) => {
            const allPermissions = new Set(selectedPermissions);
            console.log('passed:', allPermissions);


            selectedPermissions.forEach(permission => {
                if (permissionDependencies[permission]) {
                    permissionDependencies[permission].forEach(dep => {
                        allPermissions.add(dep);
                    });
                }
            });

            console.log('The last Things:', Array.from(allPermissions));
            return Array.from(allPermissions);
        };


        try {
            if (isEdit) {
                // Update existing role
                console.log("Updating role:", currentRole.id, newRoleName.trim());
                // Get permissions from the response, transforming to an array of names

                const permissionNames = right.map(perm => perm.name); // Transform to names
                const permissionsWithDeps = getPermissionsWithDependencies(permissionNames);
                console.log(permissionsWithDeps);
                await RoleServices.updateRole(currentRole.id, { name: newRoleName.trim(), permissions: permissionsWithDeps });

            } else {
                // Create new role
                const permissionsWithDeps = getPermissionsWithDependencies(right);
                const permissionNames = permissionsWithDeps.map(perm => perm.name); // Transform to names

                const newRole = await RoleServices.createRole({ name: newRoleName.trim(), permissions: permissionNames });
                console.log("Created new role:", newRole.id, newRoleName.trim());
            }

            const data = await RoleServices.fetchRoles();

            setRoles(data);
            handleClose();
        } catch (error) {
            console.error('Error adding or updating role:', error);
        }
    };







    return (
        <div style={{ padding: 20 }}>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </div>
            ) : (
                <>
                    {hasPermission([RoleManagementPermissions.role.create]) && (
                        <Button className='btn-add' variant="contained" color="primary" onClick={() => handleClickOpen(null)}>
                            Add Role
                        </Button>
                    )}

                    {hasPermission([RoleManagementPermissions.role.read]) && (
                    <TableContainer component={Paper} style={{ marginTop: 40 }} className='tableusers'>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="roles table">
                            <TableHead>
                                <TableRow className='tblrows'>
                                    <TableCell align="right" className='tabletext tblrow'>Role ID</TableCell>
                                    <TableCell align="right" className='tabletext tblrow'>Role Name</TableCell>
                                    <TableCell align="right" className='tabletext tblrow permission-column'>Permissions</TableCell>
                                    {showRoleActionsColumn && (
                                        <TableCell align="right" className='tabletext tblrow'>Actions</TableCell>
                                    )}
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
                                        <TableCell align="right" className='tabletext tblrow permission-column'>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                <div style={{ marginRight: 8 }}>
                                                    {expandedRoleId === role.id
                                                        ? Array.isArray(role.permissions) // Check if permissions is an array
                                                            ? role.permissions.join(', ') // Join if it's an array
                                                            : role.permissions // Otherwise, just display the permission directly
                                                        : Array.isArray(role.permissions) && role.permissions.length > 0
                                                            ? role.permissions[0] + (role.permissions.length > 1 ? ' ...' : '') // Display first permission with ellipsis
                                                            : ''
                                                    }


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
                                                {hasPermission([RoleManagementPermissions.role.update]) && (
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
                                                {hasPermission([RoleManagementPermissions.role.delete]) && (
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
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    )}

                    {hasPermission([RoleManagementPermissions.permission.create]) && (
                        <Button className='btn-add permission' variant="contained" color="primary" onClick={() => handleOpenPermissionDialog(null)}>
                            Add Permission
                        </Button>
                    )}
                    {hasPermission([RoleManagementPermissions.permission.read]) && (

                    <TableContainer component={Paper} style={{ marginTop: 40 }} className='tableusers'>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="permissions table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="right" className='tabletext tblrow'>Permission ID</TableCell>
                                    <TableCell align="right" className='tabletext tblrow'>Permission Name</TableCell>
                                    {showPermissionActionsColumn && (
                                        <TableCell align="right" className='tabletext tblrow'>Actions</TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredPermissions.map((permission) => (
                                    <TableRow
                                        key={permission.id}
                                        sx={{ '&:last-child td, &:last-child th': {  width: '10px' } }}
                                    >
                                        <TableCell align="right" component="th" scope="row" className='tabletext tblrow'>{permission.id}</TableCell>
                                        <TableCell align="right" className='tabletext tblrow'>{permission.name}</TableCell>
                                        {showPermissionActionsColumn && (
                                            <TableCell align="right">
                                                {hasPermission([RoleManagementPermissions.permission.update]) && (
                                                    <IconButton
                                                        aria-label="edit"
                                                        color="primary"
                                                        sx={{ color: '#ff9800', '&:hover': { color: '#ffa726' } }}
                                                        className='tblrow action-btn edit'
                                                        id='editbtn'
                                                        onClick={() => handleOpenPermissionDialog(permission)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                )}
                                                {hasPermission([RoleManagementPermissions.permission.delete]) && (
                                                    <IconButton
                                                        aria-label="delete"
                                                        color="secondary"
                                                        sx={{ color: '#f44336', '&:hover': { color: '#e57373' } }}
                                                        className='tblrow action-btn delete '
                                                        id='deletebtn'
                                                        onClick={() => handleDelete(permission, 'permission')}
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

                            <div style={{ marginTop: 20, marginBottom: 10 }}>Assign Permissions:</div>
                            <div className="grid-container">
                                <div>{customList('Available Permissions', left)}</div>
                                <div>
                                    <Grid container direction="column" alignItems="center">
                                        <Button
                                            sx={{ my: 0.5 }}
                                            variant="outlined"
                                            size="small"
                                            onClick={handleCheckedRight}
                                            disabled={leftChecked.length === 0}
                                            aria-label="move selected right"
                                            className="custom-button"
                                        >
                                            &gt;
                                        </Button>
                                        <Button
                                            sx={{ my: 0.5 }}
                                            variant="outlined"
                                            size="small"
                                            onClick={handleCheckedLeft}
                                            disabled={rightChecked.length === 0}
                                            aria-label="move selected left"
                                            className="custom-button"
                                        >
                                            &lt;
                                        </Button>
                                    </Grid>
                                </div>
                                <div>{customList('Assigned Permissions', right)}</div>
                            </div>

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

                    <Dialog
                        open={openPermissionDialog}
                        onClose={handleClosePermissionDialog}
                        PaperProps={{ className: 'custom-dialog-paper' }}
                    >
                        <DialogTitle className='custom-dialog-title'>
                            {isEdit ? 'Edit Permission' : 'Add New Permission'}
                        </DialogTitle>
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
                                value={newPermissionName}
                                onChange={(e) => {
                                    setNewPermissionName(e.target.value);
                                    setPermissionNameError('');
                                }}
                                error={!!permissionNameError}
                                helperText={permissionNameError}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClosePermissionDialog} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleAddOrUpdatePermission} color="primary">
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

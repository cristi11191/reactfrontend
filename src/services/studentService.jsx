import api from './apiServices';

// Create a new student
export const createStudent = async (studentData) => {
    try {
        const response = await api.post('students', studentData);
        return response.data;
    } catch (error) {
        console.error('Error creating student:', error);
        throw error;
    }
};

// Fetch a single student by ID
export const fetchStudentById = async (studentId) => {
    try {
        const response = await api.get(`students/${studentId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching student:', error);
        throw error;
    }
};

// Update a student by ID
export const updateStudentById = async (studentId, studentData) => {
    try {
        const response = await api.put(`students/${studentId}`, studentData);
        return response.data;
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
};

// Delete a student by ID
export const deleteStudentById = async (studentId) => {
    try {
        const response = await api.delete(`students/${studentId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting student:', error);
        throw error;
    }
};
// Fetch all students
export const fetchAllStudents = async () => {
    try {
        const response = await api.get('students');
        return response.data;
    } catch (error) {
        console.error('Error fetching all students:', error);
        throw error;
    }
};

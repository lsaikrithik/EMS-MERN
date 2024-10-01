// controllers/employeeController.js

import Employee from '../models/Employee.js'; // Import your Employee model
import multer from 'multer'; // Import multer
import path from 'path';

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Destination folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Unique file name
    }
});

export const upload = multer({ storage }); // Export the upload middleware

// Add Employee
export const addEmployee = async (req, res) => {
    console.log('Request body:', req.body); // Log the request body
    console.log('Uploaded file:', req.file); // Log the uploaded file

    try {
        const { name, email, mobile, designation, gender, course } = req.body;
        const image = req.file ? req.file.path : ''; // Use uploaded image path

        const newEmployee = new Employee({
            userId: req.user._id,
            name,
            email,
            mobile,
            designation,
            gender,
            course,
            image
        });

        await newEmployee.save();
        res.status(200).json({ success: true, message: "Employee added successfully" });
    } catch (error) {
        console.error('Error while adding employee:', error); // Log the error
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get Employees
export const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({ userId: req.user._id });
        res.status(200).json({ success: true, employees });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get Employee by ID
export const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findOne({ _id: req.params.employeeId, userId: req.user._id });
        
        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }

        res.status(200).json({ success: true, employee });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Edit Employee
export const editEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { name, email, mobile, designation, gender, course } = req.body;
        const image = req.file ? req.file.path : undefined;

        const updatedData = {
            name,
            email,
            mobile,
            designation,
            gender,
            course,
            ...(image && { image }), // Include image only if uploaded
            updatedAt: Date.now(),
        };

        const employee = await Employee.findOneAndUpdate(
            { _id: employeeId, userId: req.user._id },
            updatedData,
            { new: true, runValidators: true }
        );

        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }

        res.status(200).json({ success: true, message: "Employee updated successfully", employee });
    } catch (error) {
        console.error('Error while updating employee:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete Employee
export const deleteEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const employee = await Employee.findOneAndDelete({ _id: employeeId, userId: req.user._id });

        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }

        res.status(200).json({ success: true, message: "Employee deleted successfully" });
    } catch (error) {
        console.error('Error while deleting employee:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// routes/employee.js

import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { addEmployee, getEmployees, upload, editEmployee, deleteEmployee, getEmployeeById } from '../controllers/employeeController.js';

const router = express.Router();

router.post('/add', authMiddleware, upload.single('image'), addEmployee);
router.get('/', authMiddleware, getEmployees);
router.get('/:employeeId', authMiddleware, getEmployeeById);
router.put('/:employeeId', authMiddleware, upload.single('image'), editEmployee);
router.delete('/:employeeId', authMiddleware, deleteEmployee);

export default router;

import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import connectTodatabase from './db/db.js';
import employeeRouter from './routes/employee.js';
import path from 'path'; // Import path module

connectTodatabase();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/employee', employeeRouter);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
});

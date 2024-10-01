import React from 'react';
import { useAuth } from '../context/authContext';
import Navbar from '../components/dashboard/Navbar';
import { Outlet } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useAuth();

    return (
        <div className='flex flex-col min-h-screen'>
            <Navbar />
            <div className='flex-1 bg-gray-100 p-5'>
                
                <Outlet />
            </div>
        </div>
    );
};

export default AdminDashboard;

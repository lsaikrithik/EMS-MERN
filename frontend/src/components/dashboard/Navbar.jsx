import React from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const navigateToEmployees = () => {
        navigate('/admin-dashboard/employees'); // Navigate to the employees page
    };

    const navigateToHome = () => {
        navigate('/admin-dashboard'); // Navigate to the admin dashboard
    };

    const handleLogout = () => {
        logout(); // Call the logout function from context
        navigate('/'); // Redirect to the home page or login page
    };

    return (
        <div className='flex items-center text-white justify-between h-12 bg-teal-600 px-5'>
            <button onClick={navigateToHome} className='px-4 py-1 bg-teal-700 hover:bg-teal-800'>Home</button>
            <button onClick={navigateToEmployees} className='px-4 py-1 bg-teal-700 hover:bg-teal-800'>Employee List</button>
            <p>{user.username}</p>
            <button onClick={handleLogout} className='px-4 py-1 bg-teal-700 hover:bg-teal-800'>Logout</button>
        </div>
    );
};

export default Navbar;

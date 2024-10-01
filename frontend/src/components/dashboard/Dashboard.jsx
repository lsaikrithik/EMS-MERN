// src/components/dashboard/Dashboard.jsx

import React from 'react';

const Dashboard = () => {
    return (
        <div className="flex flex-col h-screen">
            <div className="flex justify-between items-center bg-teal-600 h-12 px-5">
                <h1 className="text-xl text-white font-bold">Dashboard</h1>
            </div>
            <div className="flex flex-grow items-center justify-center">
                <h2 className="text-3xl font-semibold">Welcome Admin!</h2>
            </div>
        </div>
    );
};

export default Dashboard;

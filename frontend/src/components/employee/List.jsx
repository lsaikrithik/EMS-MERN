import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const List = () => {
    const [employees, setEmployees] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(5);
    const navigate = useNavigate();

    // Fetch employees from the API
    const fetchEmployees = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/employee", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.data.success) {
                setEmployees(response.data.employees);
                console.log("Fetched employees:", response.data.employees);
            }
        } catch (error) {
            console.error("Error fetching employee data", error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Delete an employee
    const handleDelete = async (employeeId) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                const response = await axios.delete(`http://localhost:5000/api/employee/${employeeId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (response.data.success) {
                    setEmployees((prev) => prev.filter(emp => emp._id !== employeeId));
                    alert(response.data.message);
                }
            } catch (error) {
                console.error("Error deleting employee", error);
            }
        }
    };

    const handleEdit = (employeeId) => {
        navigate(`/admin-dashboard/edit-employee/${employeeId}`);
    };

    // Filter and sort employees
    const filteredEmployees = employees
        .filter((employee) =>
            employee.name.toLowerCase().includes(searchKeyword.toLowerCase())
        )
        .sort((a, b) => {
            const modifier = sortOrder === 'asc' ? 1 : -1;
            if (sortField === 'createAt') {
                const dateA = new Date(a[sortField]);
                const dateB = new Date(b[sortField]);

                if (isNaN(dateA) || isNaN(dateB)) {
                    console.warn(`Invalid date for employee ${a.name}: ${a[sortField]} or ${b.name}: ${b[sortField]}`);
                    return 0;
                }

                return (dateA - dateB) * modifier; // Sort by date
            }
            if (a[sortField] < b[sortField]) return -1 * modifier;
            if (a[sortField] > b[sortField]) return 1 * modifier;
            return 0;
        });

    // Pagination logic
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
    const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

    const handleSort = (field) => {
        setSortField(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sorting order
    };

    return (
        <div className='p-5'>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-xl font-bold'>Employee List</h1>
                <Link
                    to="/admin-dashboard/add-employee"
                    className='px-4 py-1 bg-teal-600 text-white rounded'
                >
                    Create Employee
                </Link>
            </div>

            <div className='flex justify-end mb-4'>
                <input
                    type="text"
                    placeholder='Enter Search Keyword'
                    className='flex-grow max-w-xs px-4 py-1 border border-gray-300 rounded-md'
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
            </div>

            <table className='min-w-full bg-white border'>
                <thead>
                    <tr>
                        <th className='py-2 border'>Unique Id</th>
                        <th className='border cursor-pointer' onClick={() => handleSort('imageUrl')}>Image</th> {/* New Column for Image */}
                        <th className='border cursor-pointer' onClick={() => handleSort('name')}>Name</th>
                        <th className='border cursor-pointer' onClick={() => handleSort('email')}>Email</th>
                        <th className='border'>Mobile No</th>
                        <th className='border'>Designation</th>
                        <th className='border'>Gender</th>
                        <th className='border'>Course</th>
                        <th className='border cursor-pointer' onClick={() => handleSort('createAt')}>Create Date</th>
                        <th className='border'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEmployees.map((employee) => (
                        <tr key={employee._id} className='text-center border-t'>
                            <td className='py-2 border'>{employee._id}</td>  {/* Unique Id */}
                            <td className='border'>
                                {employee.image ? (
                                    <img
                                        src={`http://localhost:5000/${employee.image}`}
                                        alt={employee.name}
                                        className="w-20 h-20 object-cover rounded mx-auto"
                                        style={{ maxWidth: '100px', maxHeight: '100px' }} // Added styles to fit the image within the table
                                    />
                                ) : (
                                    <span>No Image</span>
                                )}
                            </td> {/* Image */}
                            <td className='border'>{employee.name}</td>       {/* Name */}
                            <td className='border'>{employee.email}</td>      {/* Email */}
                            <td className='border'>{employee.mobile}</td>     {/* Mobile No */}
                            <td className='border'>{employee.designation}</td> {/* Designation */}
                            <td className='border'>{employee.gender}</td>     {/* Gender */}
                            <td className='border'>{employee.course}</td>      {/* Course */}
                            <td className='border'>
                                {employee.createAt 
                                    ? new Date(employee.createAt).toLocaleDateString() 
                                    : 'N/A'} {/* Create Date */}
                            </td>
                            <td className='border'>
                                <button 
                                    onClick={() => handleEdit(employee._id)} 
                                    className='px-2 py-1 bg-blue-600 text-white rounded'
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(employee._id)} 
                                    className='ml-2 px-2 py-1 bg-red-600 text-white rounded'
                                >
                                    Delete
                                </button>
                            </td>  {/* Action */}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className='flex justify-center mt-4'>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button 
                        key={index} 
                        onClick={() => setCurrentPage(index + 1)} 
                        className={`mx-1 px-2 py-1 ${currentPage === index + 1 ? 'bg-teal-600 text-white' : 'bg-gray-300'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default List;

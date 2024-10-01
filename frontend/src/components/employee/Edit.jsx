// src/components/employee/Edit.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Edit = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        course: [], // Initially an empty array
        image: null,
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, files, checked } = e.target;
        if (type === 'checkbox') {
            setFormData((prevData) => {
                const updatedCourses = checked
                    ? [...prevData.course, value]
                    : prevData.course.filter((course) => course !== value);
                return { ...prevData, course: updatedCourses };
            });
        } else if (name === 'image') {
            setFormData((prevData) => ({ ...prevData, [name]: files[0] })); // Handle image upload
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    // Validation function
    const validate = () => {
        let tempErrors = {};
        if (!formData.name) tempErrors.name = "Name is required";
        if (!formData.email) tempErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Invalid email format";
        if (!formData.mobile) tempErrors.mobile = "Mobile number is required";
        else if (!/^\d{10}$/.test(formData.mobile)) tempErrors.mobile = "Mobile number must be 10 digits";
        if (!formData.designation) tempErrors.designation = "Designation is required";
        if (!formData.gender) tempErrors.gender = "Gender is required";
        if (formData.course.length === 0) tempErrors.course = "At least one course must be selected";
        if (formData.image && !['image/jpeg', 'image/png'].includes(formData.image.type)) {
            tempErrors.image = "Only JPG/PNG files are allowed";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        const formDataObj = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataObj.append(key, formData[key]);
        });

        try {
            const response = await axios.put(
                `http://localhost:5000/api/employees/${id}`, // Ensure this endpoint is correct
                formDataObj,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust if you're not using JWT
                    },
                }
            );

            // Check for successful response
            if (response.data.success) {
                navigate("/admin-dashboard/employees");
            } else {
                throw new Error(response.data.error || 'Failed to update employee.');
            }
        } catch (error) {
            console.error("Error during submission:", error);
            alert("An error occurred while updating employee: " + error.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
            <h3 className="text-2xl font-bold mb-6">Edit Employee</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-500">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter name"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        required
                    />
                    {errors.name && <span className="text-red-500">{errors.name}</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        required
                    />
                    {errors.email && <span className="text-red-500">{errors.email}</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile No</label>
                    <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="Enter Mobile Number"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        required
                    />
                    {errors.mobile && <span className="text-red-500">{errors.mobile}</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Designation</label>
                    <select
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        required
                    >
                        <option value="">Select Designation</option>
                        <option value="HR">HR</option>
                        <option value="Manager">Manager</option>
                        <option value="Sales">Sales</option>
                    </select>
                    {errors.designation && <span className="text-red-500">{errors.designation}</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-500">Gender</label>
                    <div>
                        <input 
                            type="radio" 
                            name="gender" 
                            value="M" 
                            checked={formData.gender === 'M'} 
                            onChange={handleChange} 
                        /> Male
                        <input 
                            type="radio" 
                            name="gender" 
                            value="F" 
                            checked={formData.gender === 'F'} 
                            onChange={handleChange} 
                        /> Female
                    </div>
                    {errors.gender && <span className="text-red-500">{errors.gender}</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-500">Course</label>
                    <div>
                        <input 
                            type="checkbox" 
                            name="course" 
                            value="MCA" 
                            checked={formData.course.includes('MCA')} 
                            onChange={handleChange} 
                        /> MCA
                        <input 
                            type="checkbox" 
                            name="course" 
                            value="BCA" 
                            checked={formData.course.includes('BCA')} 
                            onChange={handleChange} 
                        /> BCA
                    </div>
                    {errors.course && <span className="text-red-500">{errors.course}</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-500">Upload Image</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/jpeg, image/png"
                        onChange={handleChange}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    />
                    {errors.image && <span className="text-red-500">{errors.image}</span>}
                </div>
                <button
                    type="submit"
                    className="mt-6 p-2 bg-blue-600 text-white rounded-md"
                >
                    Update Employee
                </button>
            </form>
        </div>
    );
};

export default Edit;

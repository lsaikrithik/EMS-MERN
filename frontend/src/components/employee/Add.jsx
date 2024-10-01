// src/components/employee/Add.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Add = () => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate(); // Initialize useNavigate

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData((prevData) => ({ ...prevData, [name]: files[0] })); // Set image file
        } else if (name === 'course') {
            // Handle checkbox inputs for courses
            const updatedCourses = formData.course ? [...formData.course] : [];
            if (updatedCourses.includes(value)) {
                updatedCourses.splice(updatedCourses.indexOf(value), 1); // Remove if already checked
            } else {
                updatedCourses.push(value); // Add if not checked
            }
            setFormData((prevData) => ({ ...prevData, [name]: updatedCourses }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value })); // Set other fields
        }
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.name) tempErrors.name = "Name is required";
        if (!formData.email) tempErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Invalid email format";
        if (!formData.mobile) tempErrors.mobile = "Mobile number is required";
        else if (!/^\d{10}$/.test(formData.mobile)) tempErrors.mobile = "Mobile number must be 10 digits";
        if (!formData.designation) tempErrors.designation = "Designation is required";
        if (!formData.gender) tempErrors.gender = "Gender is required";
        if (!formData.course || formData.course.length === 0) tempErrors.course = "At least one course must be selected";
        if (formData.image && !['image/jpeg', 'image/png'].includes(formData.image.type)) {
            tempErrors.image = "Only JPG/PNG files are allowed";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        const formDataObj = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataObj.append(key, formData[key]); // Append form data
        });

        try {
            const response = await axios.post(
                "http://localhost:5000/api/employee/add",
                formDataObj,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'multipart/form-data', // Ensure content type is set
                    },
                }
            );
            if (response.data.success) {
                navigate("/admin-dashboard/employees");
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
            <h3 className="text-2xl font-bold mb-6">Create Employee</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-500">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        onChange={handleChange}
                        placeholder="Enter name"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        required
                    />
                    {errors.name && <span className="text-red-500">{errors.name}</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="text"
                        name="email"
                        onChange={handleChange}
                        placeholder="Enter email"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        required
                    />
                    {errors.email && <span className="text-red-500">{errors.email}</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Mobile No
                    </label>
                    <input
                        type="text"
                        name="mobile"
                        onChange={handleChange}
                        placeholder="Enter Mobile Number"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        required
                    />
                    {errors.mobile && <span className="text-red-500">{errors.mobile}</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Designation
                    </label>
                    <select
                        name="designation"
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
                    <label className="block text-sm font-medium text-gray-500">
                        Gender
                    </label>
                    <div>
                        <input type="radio" name="gender" value="M" onChange={handleChange} /> Male
                        <input type="radio" name="gender" value="F" onChange={handleChange} /> Female
                    </div>
                    {errors.gender && <span className="text-red-500">{errors.gender}</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-500">
                        Course
                    </label>
                    <div>
                        <input type="checkbox" name="course" value="MCA" onChange={handleChange} /> MCA
                        <input type="checkbox" name="course" value="BCA" onChange={handleChange} /> BCA
                        <input type="checkbox" name="course" value="BSC" onChange={handleChange} /> BSC
                    </div>
                    {errors.course && <span className="text-red-500">{errors.course}</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Image Upload
                    </label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                        placeholder="Upload Image"
                        accept="image/*"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    />
                    {errors.image && <span className="text-red-500">{errors.image}</span>}
                </div>
                <button
                    type="submit"
                    className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Add;

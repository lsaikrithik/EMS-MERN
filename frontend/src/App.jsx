import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Login";
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoutes from './utils/PrivateRoutes';
import RoleBaseRoutes from './utils/RoleBaseRoutes';
import List from './components/employee/List';
import AdminSummary from './components/dashboard/AdminSummary';
import Add from './components/employee/Add';
import Edit from './components/employee/Edit'; // Import the Edit component
import Dashboard from './components/dashboard/Dashboard'; // Import the Dashboard component

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/admin-dashboard" />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/admin-dashboard" element={
                    <PrivateRoutes>
                        <RoleBaseRoutes requiredRole={["admin"]}>
                            <AdminDashboard />
                        </RoleBaseRoutes>
                    </PrivateRoutes>
                }>
                    <Route path="" element={<Dashboard />} /> {/* Set the Dashboard as the default for admin-dashboard */}
                    <Route path="employees" element={<List />} />
                    <Route path="add-employee" element={<Add />} />
                    <Route path="edit-employee/:id" element={<Edit />} /> {/* Add edit route */}
                    <Route path="summary" element={<AdminSummary />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

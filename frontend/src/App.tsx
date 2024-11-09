import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import RegisterUserAdmin from './pages/register-user/RegisterUser';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register-user" element={<RegisterUserAdmin />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={< Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

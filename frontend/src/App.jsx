import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import FacultyDashboard from "./pages/FacultyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import { AuthProvider } from "./context/authContext";
import Background3D from "./components/Background3D";
import CursorFollower from "./components/CursorFollower";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <AuthProvider>
      <CursorFollower />
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      <Background3D />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          
          {/* Dashboard Placeholders */}
          {/* Dashboard Routes */}
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/faculty" element={<FacultyDashboard />} />
          <Route path="/dashboard/counselor" element={<FacultyDashboard />} />
          <Route path="/dashboard/hod" element={<Home role="hod" />} />
          <Route path="/dashboard/librarian" element={<Home role="librarian" />} />
          <Route path="/dashboard/lab-technician" element={<Home role="lab_technician" />} />
          <Route path="/dashboard/hostel" element={<Home role="hostel_management" />} />
          <Route path="/dashboard/admin" element={<Home role="admin" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

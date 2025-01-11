import { LogIn } from "lucide-react"; // For the login icon, if needed
import "./index.css";
import SignUp from "./pages/SignUp"; // The sign up page component
import LoginPage from "./pages/Login"; // Assuming you have a LoginPage component
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Correct Router usage for React Router v6
import MainLayout from "./pages/MainLayout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Main layout with nested routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} /> {/* Default route for "/" */}
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Separate routes for SignUp and Login */}
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;

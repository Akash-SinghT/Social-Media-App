import { LogIn } from "lucide-react"; // For the login icon, if needed
import "./index.css";
import SignUp from "./pages/SignUp"; // The sign up page component
import LoginPage from "./pages/Login"; // Assuming you have a LoginPage component
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Correct Router usage for React Router v6
import MainLayout from "./pages/MainLayout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChatPage from "./pages/ChatPage";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";
import ProtectedRoutes from "./pages/ProtectedRoutes";

const App = () => {
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:8000", {
        query: {
          userId: user?._id, // provided user id to backend
        },
        transports: ["websocket"],
      }); // to stop unncessary api calls
      dispatch(setSocket(socketio));
      // listening all the events of socket
      socketio.on("getOnlineUsers", (onlineUsers) => {
        // get and set online users
        dispatch(setOnlineUsers(onlineUsers));
      });
      socket?.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });
      return () => {
        // clean up user means if user shut the browser it should show offline
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket?.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  return (
    <Router>
      <Routes>
        {/* Main layout with nested routes */}
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <MainLayout />
            </ProtectedRoutes>
          }
        >
          <Route index element={<Home />} /> {/* Default route for "/" */}
          <Route
            path="profile/:id"
            element={
              <ProtectedRoutes>
                <Profile />
              </ProtectedRoutes>
            }
          />
          <Route
            path="account/edit"
            element={
              <ProtectedRoutes>
                <EditProfile />
              </ProtectedRoutes>
            }
          />
          <Route
            path="chat"
            element={
              <ProtectedRoutes>
                <ChatPage />
              </ProtectedRoutes>
            }
          />
        </Route>

        {/* Separate routes for SignUp and Login */}
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;

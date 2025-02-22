import React, { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const SignUp = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [isLoading, setIsLoadibg] = useState(false);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const Signuphandler = async (e) => {
    e.preventDefault();
    setIsLoadibg(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/signup",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user)); // Save user in Redux
        navigate("/");
        toast.success(res.data.message);
        setInput({
          username: "",
          email: "",
          passsword: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoadibg(false);
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex items-center justify-center p-4 w-screen h-screen sm:p-8">
      <form
        onSubmit={Signuphandler}
        className="flex flex-col gap-5 p-8 bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg"
      >
        <div className="my-4 text-center">
          <h1 className="text-3xl font-bold">Ｂｏｎｄｌｙ</h1>
          <p className="text-gray-300">
            Sign up to see photos & videos from your friends
          </p>
        </div>
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-400"
          >
            Username
          </label>
          <Input
            type="text"
            placeholder="Enter your username"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className="mt-1 w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-400"
          >
            Email
          </label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            placeholder="Enter your email"
            className="mt-1 w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-400"
          >
            Password
          </label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            placeholder="Enter your password"
            className="mt-1 w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none"
          />
        </div>
        {isLoading ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button className="w-full bg-blue-500 hover:bg-blue-600">
            Signup
          </Button>
        )}

        <div>
          <span className="text-centre">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignUp;

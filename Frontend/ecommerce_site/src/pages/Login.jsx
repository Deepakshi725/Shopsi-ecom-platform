import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setEmail, setAuth } from '../store/userSlice';
import { toast } from 'react-toastify';
import { server } from "../server";

// Ensure axios sends cookies with requests
axios.defaults.withCredentials = true;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting login...');
      const response = await axios.post(`${server}/api/v2/user/login-user`, {
        email,
        password
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Login response:', response.data);

      if (response.data.success) {
        // Store the token from the cookie
        const token = response.data.token || response.headers['set-cookie']?.[0];
        console.log('Token received:', token ? 'Yes' : 'No');
        
        if (token) {
          localStorage.setItem('token', token);
        }
        localStorage.setItem('email', email);

        // Update Redux state
        console.log('Updating Redux state...');
        dispatch(setEmail(email));
        dispatch(setAuth(true));

        console.log('Login successful, navigating...');
        toast.success('Login successful!');
        navigate('/login'); // Navigate to home page
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
      // Clear any existing auth state on error
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      dispatch(setEmail(''));
      dispatch(setAuth(false));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#222831] px-6 py-12">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#EEEEEE] mb-8">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="bg-[#31363F] rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-[#EEEEEE] text-sm font-medium mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="w-full p-3 bg-[#222831] border border-[#76ABAE] rounded-lg text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE]"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[#EEEEEE] text-sm font-medium mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 bg-[#222831] border border-[#76ABAE] rounded-lg text-[#EEEEEE] pr-10 focus:outline-none focus:ring-2 focus:ring-[#76ABAE]"
                  placeholder="Enter your password"
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute top-3.5 right-3 text-[#76ABAE] cursor-pointer hover:text-[#5b8d90]"
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute top-3.5 right-3 text-[#76ABAE] cursor-pointer hover:text-[#5b8d90]"
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-[#EEEEEE]">
                <input 
                  type="checkbox" 
                  className="rounded border-[#76ABAE] text-[#76ABAE] focus:ring-[#76ABAE]"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-[#76ABAE] hover:text-[#5b8d90] hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#76ABAE] hover:bg-[#5b8d90] text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Sign Up Link */}
            <p className="text-sm text-center text-[#EEEEEE]">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#76ABAE] hover:text-[#5b8d90] hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

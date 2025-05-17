//eslint-disable-next-line
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import axios from "axios";
import { server } from "../server.js"

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const handleFileSubmit = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newForm = new FormData();
    newForm.append("file", avatar);
    newForm.append("name", name);
    newForm.append("email", email);
    newForm.append("password", password);

    try {
      const response = await axios.post(`${server}/user/create-user`, newForm, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept": "any",
        },
      });
      console.log(response.data);
      alert("Account created successfully!");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#222831] px-6 py-12">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#EEEEEE] mb-8">
          Create Your Account
        </h2>
        
        <form onSubmit={handleSubmit} className="bg-[#31363F] rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-[#EEEEEE] text-sm font-medium mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 bg-[#222831] border border-[#76ABAE] rounded-lg text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE]"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-[#EEEEEE] text-sm font-medium mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="Create a password"
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

            {/* Avatar Upload */}
            <div>
              <label className="block text-[#EEEEEE] text-sm font-medium mb-2">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-[#222831] border-2 border-[#76ABAE] flex items-center justify-center">
                  {avatar ? (
                    <img
                      src={URL.createObjectURL(avatar)}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <RxAvatar className="text-4xl text-[#76ABAE]" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="cursor-pointer">
                    <span className="text-[#76ABAE] hover:text-[#5b8d90] text-sm font-medium">
                      Upload Photo
                    </span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileSubmit}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-[#EEEEEE] mt-1">
                    JPG, JPEG or PNG. Max 2MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#76ABAE] hover:bg-[#5b8d90] text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-all text-lg"
            >
              Create Account
            </button>

            {/* Sign In Link */}
            <p className="text-sm text-center text-[#EEEEEE]">
              Already have an account?{" "}
              <Link to="/" className="text-[#76ABAE] hover:text-[#5b8d90] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;

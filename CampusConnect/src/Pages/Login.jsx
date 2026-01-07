import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="w-screen h-screen bg-[#1E3FAE] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl h-[80vh] bg-white rounded-xl overflow-hidden flex shadow-2xl">
        
        {/* LEFT PANEL */}
        <div className="w-1/2 bg-[#1E3FAE] text-white flex flex-col justify-center items-center p-10">
          <h1 className="text-3xl font-semibold mb-4">BoardMe</h1>

          <h2 className="text-xl font-semibold mb-2">Already Signed up?</h2>
          <p className="text-center text-sm mb-6 opacity-90">
            Log in to your account so you can continue building and editing your onboarding flows.
          </p>

          <button className="border border-white px-6 py-2 rounded-md hover:bg-white hover:text-[#1E3FAE] transition">
            LOG IN
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-1/2 bg-white flex flex-col justify-center px-16">
          <h2 className="text-2xl font-bold mb-2">Sign Up for an Account</h2>
          <p className="text-sm text-gray-500 mb-6">
            Let’s get you all set up so you can start creating your first onboarding experience.
          </p>

          {/* FORM */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your first name"
              className="border p-2 rounded-md text-sm"
            />
            <input
              type="text"
              placeholder="Your last name"
              className="border p-2 rounded-md text-sm"
            />
          </div>

          <input
            type="email"
            placeholder="Enter your email address"
            className="border p-2 rounded-md text-sm w-full mt-4"
          />

          <input
            type="password"
            placeholder="Enter a strong password"
            className="border p-2 rounded-md text-sm w-full mt-4"
          />

          <div className="flex items-center mt-4 gap-2">
            <input type="checkbox" />
            <label className="text-sm text-gray-600">
              I accept BoardMe’s{" "}
              <span className="text-blue-600 font-medium cursor-pointer">Terms & Conditions</span>
            </label>
          </div>

          <button className="bg-[#1E3FAE] text-white w-full py-2 mt-5 rounded-md hover:bg-blue-800 transition">
            SIGN UP
          </button>

          {/* SOCIAL SIGNUP */}
          <p className="text-center text-sm text-gray-500 mt-4">Or sign up using</p>

          <div className="flex justify-center gap-4 mt-4">
            <div className="p-3 border rounded-md cursor-pointer hover:bg-gray-100">
              <FcGoogle size={22} />
            </div>
            <div className="p-3 border rounded-md cursor-pointer hover:bg-gray-100">
              <FaFacebookF size={22} className="text-blue-700" />
            </div>
            <div className="p-3 border rounded-md cursor-pointer hover:bg-gray-100">
              <FaTwitter size={22} className="text-sky-500" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

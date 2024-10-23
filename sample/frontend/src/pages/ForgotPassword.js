import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from '../common/index';

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState("");
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setIdentifier(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataResponse = await fetch(SummaryApi.forgotPassword.url, {
      method: SummaryApi.forgotPassword.method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ identifier }),
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      toast.success(dataApi.message);
      navigate("/"); 
    } else {
      toast.error(dataApi.message);
    }
  };

  return (
    <section id="forgot-password" className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-2 py-5 w-full max-w-md mx-auto">
        <div className="text-2xl underline font-serif p-4 flex justify-center">
          Forgot Password
        </div>
        <form className="p-3" onSubmit={handleSubmit}>
          <div className="grid">
            <label className="text-lg">Email or Phone Number:</label>
            <div className="bg-slate-100 p-2">
              <input
                className="w-full h-full outline-none bg-transparent"
                name="identifier"
                value={identifier}
                onChange={handleOnChange}
                type="text"
                placeholder="Enter your Email or Phone Number"
                required
              />
            </div>
          </div>
          <div className="py-3">
            <button className="w-40 min-h-full py-1 text-xl text-white px-2 bg-purple-600 rounded-full hover:bg-purple-800 scale-90 transition-all mx-auto block mt-6">
              Send Reset Link
            </button>
          </div>
        </form>
        <p className="my-5">
          Remembered your password?{" "}
          <Link
            to={"/login"}
            className="text-purple-600 hover:text-purple-800 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;

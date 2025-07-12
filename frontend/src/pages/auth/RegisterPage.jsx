import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/axiosInstance";

function RegisterPage() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/register", {
        username,
        email,
        password,
      });
      console.log("Registration Successful: ", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed: ", error.message);
      const message =
        error.response?.data?.detail || "Registration failed, please try again";
      setErrorMessage(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Register at MyStore
          </h2>
          <form className="space-y-5" onSubmit={handleRegisterSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => {
                    setUserName(e.target.value)
                    setErrorMessage('')
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value)
                    setErrorMessage('')
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value)
                    setErrorMessage('')
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition"
              />
            </div>
            {errorMessage && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm font-medium border border-red-200">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-600 transition"
            >
              Register
            </button>
          </form>
          <p className="text-sm text-gray-600 text-center mt-6">
            Already Registered?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium transition-colors duration-200"
            >
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

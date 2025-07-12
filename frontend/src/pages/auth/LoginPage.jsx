import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/axiosInstance";
import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth()

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });
      console.log("Login Successful");
      const { access_token, user } = response.data;
      login(access_token, user)
      navigate("/");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Login failed");
      } else if (err.request) {
        setError("No response from server");
      } else {
        setError("Login error: " + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Login to MyStore
          </h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form className="space-y-5" onSubmit={handleLoginSubmit}>
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
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
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
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-600 transition"
            >
              Login
            </button>
          </form>
          <p className="text-sm text-gray-600 text-center mt-6">
            New user?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-medium transition-colors duration-200"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

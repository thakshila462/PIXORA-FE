import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../service/auth";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER"); // 👈 NEW
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password, role); // 👈 role send කරනවා

      alert("Registration Success! Please login.");
      navigate("/login");
    } catch (err) {
      console.log(err);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100">

      <div className="w-full max-w-md bg-neutral-900/40 p-10 rounded-3xl">

        <h2 className="text-3xl font-black mb-6 text-center">
          Create Account
        </h2>

        <div className="space-y-5">

          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-950 rounded-xl"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-950 rounded-xl"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-950 rounded-xl"
          />

          {/* 👇 ROLE SELECT */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-950 rounded-xl"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="PHOTOGRAPHER">Photographer</option>
            <option value="ADMIN">Admin</option>
          </select>

          {/* Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full py-3 bg-pink-500 rounded-xl font-bold"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

        </div>

        <p className="text-center mt-4 text-sm">
          Already have account? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
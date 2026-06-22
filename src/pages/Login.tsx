import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMyDetails, login as loginService } from "../service/auth";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const loginData = await loginService(email, password);

      const payload = loginData?.data || loginData || {};

      const accessToken = payload?.accessToken;
      const refreshToken = payload?.refreshToken;
      const roles = payload?.user?.roles || payload?.roles || [];
      const userId = payload?.id;
      const userEmail = payload?.email;
      console.log("LOGIN RESPONSE:", loginData);
      console.log("ROLES:", roles);

      if (!accessToken) {
        alert("Login failed: token not received");
        return;
      }

      // ✅ ONE TOKEN SYSTEM (important)
      localStorage.setItem("ACCESS_TOKEN", accessToken);

      if (refreshToken) {
        localStorage.setItem("REFRESH_TOKEN", refreshToken);
      }

      // ✅ USER STORE (IMPORTANT FOR ROLE CHECK)
      const user = {
        id: userId,
        name: payload?.user?.name || payload?.name || "",
        email: userEmail,
        role:
          payload?.user?.role || payload?.role ||
          roles?.map((r: string) => String(r).toUpperCase()).find((r: string) => r === "ADMIN") ||
          roles?.[0] ||
          "CUSTOMER",
        roles: roles || [],
      };

      authLogin(user, accessToken || "");

      localStorage.setItem("USER", JSON.stringify(user));

      // optional backend verify call
      await getMyDetails();

      alert("Login Success!");

      // ✅ ROLE BASED REDIRECT (MAIN FIX)
      if (roles?.includes("ADMIN")) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100 font-sans antialiased relative overflow-hidden selection:bg-pink-500 selection:text-white">
      
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-fuchsia-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <Link
        to="/"
        className="absolute top-6 left-6 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-pink-500 transition-colors duration-300 flex items-center gap-2"
      >
        ← Back to Studio
      </Link>

      <div className="w-full max-w-md bg-neutral-900/40 border border-neutral-900 p-10 rounded-3xl backdrop-blur-xl shadow-2xl relative group overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black tracking-tight text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-neutral-400 font-light">
            Enter your credentials to access Pixora Studio
          </p>
        </div>

        <div className="space-y-5">
          
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 ml-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-sm text-white"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 mt-2 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white rounded-full font-bold uppercase text-xs tracking-widest"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>

          <p className="text-center text-xs text-neutral-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-pink-500 underline">
              Create one now
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
import api from "./api";

// REGISTER
export const register = async (
  name: string,
  email: string,
  password: string,
  role: string,
) => {
  const res = await api.post("/auth/register", {
    name,
    email,
    password,
    role,
  });

  return res.data;
};

// LOGIN
export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", {
    email,
    password,
  });

  // Backend structure: res.data.data.accessToken
  const token = res?.data?.data?.accessToken;

  if (!token) {
    throw new Error("Access token not found in response");
  }

  // Login.tsx එකේ localStorage.setItem("ACCESS_TOKEN", ...) කරන නිසා
  // සර්විස් එක ඇතුළෙත් ඒ නමම (Key එකම) පාවිච්චි කිරීම වඩාත් නිවැරදියි.
  localStorage.setItem("ACCESS_TOKEN", token);
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
  api.defaults.headers.common["x-access-token"] = token;

  return res.data;
};

// GET CURRENT USER
export const getMyDetails = async () => {
  // මෙතනත් "token" වෙනුවට "ACCESS_TOKEN" එකෙන්ම කියවන්න හැදුවා
  const token = localStorage.getItem("ACCESS_TOKEN");

  if (!token) {
    throw new Error("No token found. Please login first.");
  }

  const res = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

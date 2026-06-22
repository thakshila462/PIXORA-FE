import { Link, Outlet } from "react-router-dom";

export const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-6 md:px-16 py-5 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-900">
        <h1 className="text-2xl md:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-400">
          📸 PIXORA
        </h1>

        <div className="hidden md:flex items-center gap-10 font-medium text-neutral-400 uppercase text-xs tracking-widest">
          <a href="#home" className="hover:text-pink-500 transition">
            Home
          </a>

          <a href="#services" className="hover:text-pink-500 transition">
            Services
          </a>

          <a href="#gallery" className="hover:text-pink-500 transition">
            Gallery
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white px-6 py-2.5 rounded-full font-semibold uppercase text-xs tracking-wider"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="border border-neutral-800 hover:border-pink-500 hover:text-pink-500 px-6 py-2.5 rounded-full font-semibold uppercase text-xs tracking-wider"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Pages Render */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-900 text-center py-10 text-neutral-600 text-xs tracking-widest uppercase">
        <p>© {new Date().getFullYear()} Pixora Studio. All Rights Reserved.</p>
      </footer>

    </div>
  );
};
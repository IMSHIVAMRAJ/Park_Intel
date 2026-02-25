import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

function Navbar() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔥 check token on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <>
      <nav className="flex justify-between items-center px-8 py-4 bg-black border-b border-yellow-500">
        <h1 className="text-yellow-400 font-bold text-xl">
          PARK-INTEL
        </h1>

        <div className="flex gap-6 text-yellow-300">
          <Link to="/">Home</Link>
          <Link to="/bookings">My Bookings</Link>
        </div>

        {/* 🔥 RIGHT SIDE */}
        <div className="flex gap-3 items-center">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => setLoginOpen(true)}
                className="border border-yellow-400 text-yellow-400 px-4 py-1 rounded-lg"
              >
                Login
              </button>

              <button
                onClick={() => setRegisterOpen(true)}
                className="bg-yellow-400 text-black px-4 py-1 rounded-lg"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <span className="text-green-400 font-semibold">
                Logged In ✅
              </span>

              <button
                onClick={handleLogout}
                className="border border-red-400 text-red-400 px-4 py-1 rounded-lg"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* 🔥 MODALS */}
      {loginOpen && (
        <LoginModal
          close={() => {
            setLoginOpen(false);
            setIsLoggedIn(true); // 🔥 login ke baad UI update
          }}
        />
      )}

      {registerOpen && (
        <RegisterModal close={() => setRegisterOpen(false)} />
      )}
    </>
  );
}

export default Navbar;
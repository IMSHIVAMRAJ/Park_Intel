import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MyBookings from "./pages/MyBookings";
import FindNearest from "./pages/FindNearest";
import Predictor from "./pages/Predictor";

function App() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/find" element={<FindNearest />} />
        <Route path="/predict" element={<Predictor />} />
      </Routes>
    </div>
  );
}

export default App;
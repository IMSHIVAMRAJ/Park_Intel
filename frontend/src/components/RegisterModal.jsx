import { useState } from "react";
import { motion } from "framer-motion";

function RegisterModal({ close }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    vehicle_image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      vehicle_image: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.vehicle_image) {
      alert("Vehicle image is required");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("vehicle_image", formData.vehicle_image);

      const res = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/register`,
        {
          method: "POST",
          body: data, // 🔥 backend ke liye perfect
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Registration failed");
        return;
      }

      alert(
        `Registration successful`
      );
      close();
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 p-8 rounded-2xl w-96 border border-yellow-400"
      >
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mb-4 p-3 bg-black border border-gray-700 rounded"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mb-4 p-3 bg-black border border-gray-700 rounded"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mb-4 p-3 bg-black border border-gray-700 rounded"
            required
          />

          <label className="text-sm text-gray-300 mb-2 block">
            Vehicle Image (OCR)
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full mb-4 text-gray-400"
            required
          />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-full h-32 object-cover rounded mb-4 border border-yellow-400"
            />
          )}

          <button
            disabled={loading}
            className="w-full bg-yellow-400 text-black py-3 rounded font-semibold disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <button
          onClick={close}
          className="mt-4 w-full text-red-400"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
}

export default RegisterModal;
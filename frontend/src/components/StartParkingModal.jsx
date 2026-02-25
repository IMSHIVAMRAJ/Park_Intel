import React, { useState } from "react";

function StartParkingModal({ close }) {
  const [parkingId, setParkingId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setPreview(null);
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!parkingId.trim()) {
      setError("Parking ID is required");
      return;
    }

    if (!imageFile) {
      setError("Vehicle image is required for OCR");
      return;
    }

    setError("");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("parking_id", parkingId); // 🔥 EXACT backend key
      formData.append("image", imageFile);      // 🔥 multer expects "image"

      const res = await fetch(
        "http://localhost:5000/api/ocr/auto-entry",
        {
          method: "POST",
          body: formData,
          // headers ❌ mat daalna
        }
      );

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Auto entry failed");
        return;
      }

      alert(
        `✅ Auto Entry Successful\nVehicle: ${result.vehicle_number}\nBooking ID: ${result.bookingId}`
      );

      close();
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-8 rounded-xl w-96 border border-yellow-400">
        <h2 className="text-xl mb-4 text-yellow-400 font-bold">
          Start Parking (Auto Entry)
        </h2>

        <label className="block mb-2 text-sm text-gray-300">
          Upload vehicle image (OCR)
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 w-full text-gray-400"
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full h-32 object-cover rounded mb-4 border border-yellow-400"
          />
        )}

        <input
          value={parkingId}
          onChange={(e) => setParkingId(e.target.value)}
          type="text"
          placeholder="Enter Parking ID"
          className="w-full p-2 mb-2 bg-black border border-gray-700 rounded"
        />

        {error && (
          <div className="text-red-400 text-sm mb-2">{error}</div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-yellow-400 text-black py-2 rounded font-semibold disabled:opacity-60"
        >
          {loading ? "Starting..." : "Start Parking"}
        </button>

        <button onClick={close} className="mt-3 text-red-400 w-full">
          Close
        </button>
      </div>
    </div>
  );
}

export default StartParkingModal;
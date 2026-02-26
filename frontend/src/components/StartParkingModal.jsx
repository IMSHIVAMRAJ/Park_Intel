import React, { useState, useEffect, useRef } from "react";

function StartParkingModal({ close }) {
  const [parkingId, setParkingId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setPreview(null);
      setFileName("");
      return;
    }

    setImageFile(file);
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview(null);
    setFileName("");
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const onOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      close();
    }
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
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/ocr/auto-entry`,
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
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onMouseDown={onOverlayClick}
      aria-hidden="false"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="start-parking-title"
        className="bg-gray-900 p-6 sm:p-8 rounded-xl w-full max-w-md border border-yellow-400 shadow-lg"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <h2 id="start-parking-title" className="text-xl text-yellow-400 font-bold">
            Start Parking (Auto Entry)
          </h2>

          <button
            onClick={close}
            aria-label="Close start parking"
            className="text-gray-300 hover:text-white ml-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <label className="block mb-2 text-sm text-gray-300">Upload vehicle image (OCR)</label>

        <label
          htmlFor="image-upload"
          className="group flex flex-col items-center justify-center w-full px-3 py-6 mb-3 border-2 border-dashed border-gray-700 rounded cursor-pointer hover:border-yellow-400 transition-colors text-center text-gray-400"
        >
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
          />

          {!preview ? (
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4v8z" />
              </svg>
              <span className="text-sm">Click to upload or drag an image here</span>
            </div>
          ) : (
            <div className="w-full">
              <img src={preview} alt="Vehicle preview" className="w-full h-36 object-cover rounded mb-2 border border-yellow-400" />
              <div className="flex items-center justify-between text-sm text-gray-300">
                <span className="truncate mr-2">{fileName}</span>
                <button onClick={removeImage} type="button" className="text-red-400 hover:text-red-300">Remove</button>
              </div>
            </div>
          )}
        </label>

        <input
          value={parkingId}
          onChange={(e) => setParkingId(e.target.value)}
          type="text"
          placeholder="Enter Parking ID"
          aria-label="Parking ID"
          className="w-full p-2 mb-3 bg-black border border-gray-700 rounded text-gray-200"
        />

        {error && (
          <div className="text-red-400 text-sm mb-3" role="alert" aria-live="assertive">{error}</div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-yellow-400 text-black py-2 rounded font-semibold disabled:opacity-60"
          >
            {loading ? "Starting..." : "Start Parking"}
          </button>

          <button
            onClick={close}
            type="button"
            className="flex-1 border border-gray-700 text-gray-200 py-2 rounded hover:border-yellow-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default StartParkingModal;
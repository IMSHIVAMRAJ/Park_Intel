import React, { useState } from "react";

function FindNearest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [parkings, setParkings] = useState([]);

  const findNearest = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported in this browser");
      return;
    }

    setLoading(true);
    setError("");
    setParkings([]);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const radius = 3; // km (same as Postman)

          const res = await fetch(
            `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/parking/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
          );

          if (!res.ok) {
            throw new Error("Failed to fetch nearby parking");
          }

          const data = await res.json();
          setParkings(data);
        } catch (err) {
          console.error(err);
          setError("Unable to fetch nearby parking");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        setError("Location permission denied");
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">
        Find Nearest Parking
      </h1>

      <button
        onClick={findNearest}
        disabled={loading}
        className="bg-yellow-400 text-black px-6 py-3 rounded font-semibold disabled:opacity-60"
      >
        {loading ? "Finding..." : "Find Nearby Parking"}
      </button>

      {error && (
        <div className="mt-4 text-red-500 font-medium">
          {error}
        </div>
      )}

      {/* RESULTS */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {!loading && parkings.length === 0 && !error && (
          <div className="text-gray-600">
            No nearby parking found
          </div>
        )}

        {parkings.map((p) => (
          <div
            key={p.id}
            className="border p-5 rounded-xl shadow-sm bg-white hover:shadow-md transition"
          >
            <h2 className="font-semibold text-lg mb-1">
              {p.name}
            </h2>

            {/* 🔥 PARKING ID */}
            <div className="text-sm font-semibold text-gray-800 mb-1">
              Parking ID: <span className="text-black">{p.id}</span>
            </div>

            <div className="text-sm text-gray-600 mb-2">
              📍 Lat: {p.lat}, Lng: {p.lng}
            </div>

            <div className="flex justify-between text-sm mb-3">
              <span>
                🚗 Slots:{" "}
                <strong>
                  {p.available_slots}/{p.total_slots}
                </strong>
              </span>
              <span>
                💰 <strong>₹{p.price_per_hour}/hr</strong>
              </span>
            </div>

            {/* Optional CTA */}
            <div className="text-xs text-gray-500">
              Use this Parking ID to start parking
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FindNearest;
import { useState } from "react";

function PredictorPage() {
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handlePredict = async () => {
    if (!day || hour === "") {
      setError("Please select day and hour");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnalysis("");

      const res = await fetch(
        "http://localhost:5000/api/prediction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            day,
            hour: Number(hour),
          }),
        }
      );

      const data = await res.json();
      setAnalysis(data.analysis || data.message);

    } catch (err) {
      setError("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-10 text-white">
      <h1 className="text-4xl font-bold text-yellow-400 mb-10">
        🤖 AI Parking Availability Predictor
      </h1>

      <div className="bg-gray-900 p-8 rounded-2xl border border-yellow-500 shadow-xl w-full max-w-xl">

        {/* Day Select */}
        <label className="block mb-2 text-yellow-400 font-semibold">
          Select Day
        </label>
        <select
          className="w-full p-3 rounded-lg bg-gray-800 text-white mb-6 border border-gray-700"
          value={day}
          onChange={(e) => setDay(e.target.value)}
        >
          <option value="">Choose Day</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* Hour Select */}
        <label className="block mb-2 text-yellow-400 font-semibold">
          Select Hour (0–23)
        </label>
        <select
          className="w-full p-3 rounded-lg bg-gray-800 text-white mb-6 border border-gray-700"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
        >
          <option value="">Choose Hour</option>
          {[...Array(24).keys()].map((h) => (
            <option key={h} value={h}>
              {h}:00
            </option>
          ))}
        </select>

        {/* Button */}
        <button
          onClick={handlePredict}
          className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-300 transition"
        >
          {loading ? "Analyzing..." : "Predict Availability"}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-600 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Result */}
        {analysis && (
          <div className="mt-6 bg-gray-800 p-5 rounded-xl border border-yellow-600">
            <h2 className="text-yellow-400 font-semibold mb-2">
              AI Analysis
            </h2>
            <p className="text-gray-200 whitespace-pre-line">
              {analysis}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PredictorPage;
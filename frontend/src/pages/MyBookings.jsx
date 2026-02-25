import React, { useEffect, useState, useMemo } from "react";

function statusClass(status) {
  switch ((status || "").toLowerCase()) {
    case "active":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-black text-yellow-300";
    case "cancelled":
      return "bg-yellow-50 text-yellow-800";
    default:
      return "bg-yellow-50 text-yellow-800";
  }
}

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchBookings() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Not logged in");
        }

        const res = await fetch(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/booking/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // 🔥 IMPORTANT
            },
          }
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to fetch bookings");
        }

        const data = await res.json();
        if (mounted) setBookings(data);
      } catch (err) {
        console.error(err);
        if (mounted) setBookings([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchBookings();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter(
      (b) =>
        (b.id && String(b.id).includes(q)) ||
        (b.parking_id && b.parking_id.toLowerCase().includes(q)) ||
        (b.vehicle_number &&
          b.vehicle_number.toLowerCase().includes(q))
    );
  }, [bookings, query]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-black">
          My Bookings
        </h1>
        <div className="text-sm text-black">
          {filtered.length} shown
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by vehicle, parking ID or booking ID"
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-yellow-300"
        />
        <button
          onClick={() => setQuery("")}
          className="px-3 py-2 bg-black text-yellow-300 rounded-md text-sm"
        >
          Clear
        </button>
      </div>

      {loading ? (
        <div className="p-6 text-center">Loading bookings…</div>
      ) : filtered.length === 0 ? (
        <div className="p-8 border rounded-md text-center">
          <div className="text-lg font-medium mb-2">
            No bookings found
          </div>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block overflow-auto border rounded-md">
            <table className="min-w-full divide-y">
              <thead className="bg-black">
                <tr>
                  <th className="px-4 py-3 text-yellow-300">
                    Booking
                  </th>
                  <th className="px-4 py-3 text-yellow-300">
                    Parking
                  </th>
                  <th className="px-4 py-3 text-yellow-300">
                    Vehicle
                  </th>
                  <th className="px-4 py-3 text-yellow-300">
                    Entry
                  </th>
                  <th className="px-4 py-3 text-yellow-300">
                    Exit
                  </th>
                  <th className="px-4 py-3 text-yellow-300 text-right">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-yellow-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-yellow-50">
                    <td className="px-4 py-3">#{b.id}</td>
                    <td className="px-4 py-3">
                      {b.parking_id}
                    </td>
                    <td className="px-4 py-3">
                      {b.vehicle_number}
                    </td>
                    <td className="px-4 py-3">
                      {b.entry_time
                        ? new Date(
                            b.entry_time
                          ).toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {b.exit_time
                        ? new Date(
                            b.exit_time
                          ).toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {b.total_amount != null
                        ? `₹${b.total_amount}`
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded ${statusClass(
                          b.status
                        )}`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex flex-col gap-3">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="p-4 border rounded-md"
              >
                <div className="font-medium">
                  #{b.id} — {b.parking_id}
                </div>
                <div className="text-sm">
                  {b.vehicle_number}
                </div>
                <div className="text-sm mt-1">
                  {b.entry_time
                    ? new Date(
                        b.entry_time
                      ).toLocaleString()
                    : "-"}
                </div>
                <div className="text-sm">
                  {b.exit_time
                    ? new Date(
                        b.exit_time
                      ).toLocaleString()
                    : "-"}
                </div>
                <div className="mt-2 flex justify-between">
                  <span
                    className={`px-2 py-1 text-xs rounded ${statusClass(
                      b.status
                    )}`}
                  >
                    {b.status}
                  </span>
                  <span className="font-medium">
                    ₹{b.total_amount ?? "-"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default MyBookings;
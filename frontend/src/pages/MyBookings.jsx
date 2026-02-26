import React, { useEffect, useState, useMemo } from "react";
import { Search, X, Car, MapPin, IndianRupee, Clock, ArrowRight, History } from "lucide-react";

// Status colors tailored for Dark/Yellow theme
function statusClass(status) {
  switch ((status || "").toLowerCase()) {
    case "active":
      return "bg-yellow-400/10 text-yellow-400 border-yellow-400/30";
    case "completed":
      return "bg-zinc-800 text-zinc-400 border-zinc-700";
    case "cancelled":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    default:
      return "bg-zinc-800 text-zinc-400 border-zinc-700";
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
        if (!token) throw new Error("Not logged in");

        const res = await fetch(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/booking/my`,
          { headers: { Authorization: `Bearer ${token}` } }
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
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter(
      (b) =>
        (b.id && String(b.id).includes(q)) ||
        (b.parking_id && b.parking_id.toLowerCase().includes(q)) ||
        (b.vehicle_number && b.vehicle_number.toLowerCase().includes(q))
    );
  }, [bookings, query]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-12 bg-yellow-400 rounded-full"></div>
              <span className="text-yellow-400 uppercase tracking-[0.2em] text-xs font-bold">Dashboard</span>
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tight">MY BOOKINGS</h1>
          </div>
          <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
            <div className="px-4 py-1">
              <p className="text-[10px] text-zinc-500 uppercase font-bold">Total History</p>
              <p className="text-xl font-mono font-bold text-yellow-400">{filtered.length}</p>
            </div>
          </div>
        </div>

        {/* Search Bar - Stylized */}
        <div className="relative mb-10 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-yellow-400 transition-colors" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by vehicle, parking ID or booking ID..."
            className="w-full bg-zinc-900 border-b-2 border-zinc-800 focus:border-yellow-400 pl-12 pr-12 py-4 outline-none transition-all text-lg placeholder:text-zinc-600 font-medium"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2">
              <X className="h-5 w-5 text-zinc-500 hover:text-white" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin"></div>
            <p className="mt-4 text-zinc-500 animate-pulse uppercase tracking-widest text-xs">Syncing Data...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed">
            <History className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-400">No Records Found</h3>
            <p className="text-zinc-600">Your parking history will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {/* Table Header (Desktop only) */}
            <div className="hidden md:grid grid-cols-6 px-6 py-3 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.15em]">
              <div className="col-span-1">ID</div>
              <div className="col-span-1">Location</div>
              <div className="col-span-1">Vehicle</div>
              <div className="col-span-2">Time Logs</div>
              <div className="col-span-1 text-right">Fare</div>
            </div>

            {/* List Items */}
            {filtered.map((b) => (
              <div 
                key={b.id} 
                className="group bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800 hover:border-yellow-400/50 rounded-2xl p-5 md:px-6 transition-all duration-300 relative overflow-hidden"
              >
                {/* Status Indicator Bar */}
                <div className={`absolute top-0 left-0 bottom-0 w-1 ${b.status === 'active' ? 'bg-yellow-400' : 'bg-zinc-700'}`}></div>
                
                <div className="grid grid-cols-1 md:grid-cols-6 items-center gap-4">
                  {/* ID & Status */}
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-yellow-400 font-bold tracking-tighter text-lg">#{b.id}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded border ${statusClass(b.status)}`}>
                      {b.status}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-zinc-600" />
                    <span className="text-zinc-300 font-medium truncate">{b.parking_id}</span>
                  </div>

                  {/* Vehicle */}
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-zinc-600" />
                    <span className="text-zinc-300 font-mono text-sm">{b.vehicle_number}</span>
                  </div>

                  {/* Time Logs */}
                  <div className="md:col-span-2 flex items-center gap-3">
                    <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800 flex items-center gap-4 w-full">
                      <div className="flex-1">
                        <p className="text-[8px] text-zinc-600 uppercase font-bold">Entry</p>
                        <p className="text-[11px] text-zinc-400 truncate">
                          {b.entry_time ? new Date(b.entry_time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '--:--'}
                        </p>
                      </div>
                      <ArrowRight className="h-3 w-3 text-zinc-700" />
                      <div className="flex-1">
                        <p className="text-[8px] text-zinc-600 uppercase font-bold">Exit</p>
                        <p className="text-[11px] text-zinc-400 truncate">
                          {b.exit_time ? new Date(b.exit_time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Parked'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right flex md:block items-center justify-between border-t md:border-none border-zinc-800 pt-3 md:pt-0">
                    <span className="md:hidden text-xs text-zinc-500 font-bold uppercase">Total Fare</span>
                    <span className="text-xl font-black text-white flex items-center md:justify-end gap-1">
                      <IndianRupee className="h-4 w-4 text-yellow-400" />
                      {b.total_amount ?? "0"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
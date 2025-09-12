import React, { useState } from "react";
import axios from "axios";
import MapDisplay from "./MapDisplay";
import ELDLog from "./ELDLog";
import type{ RouteRequest, RouteResponse } from "../types";
// import ROUTE_URL from "../utils/constants"
import { generateLogs } from "../utils/generateLogs";

export default function TripPlanner() {
  const [form, setForm] = useState<RouteRequest>({
    current_location: "",
    pickup_location: "",
    dropoff_location: "",
    current_cycle_used: 0,
  });
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<RouteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResp(null);

  
    

    try {
      const r = await axios.post<RouteResponse>(
        "http://127.0.0.1:8000"+ "/api/route/",
        form
      );
      console.log("API Response:", r.data);

        const logs = generateLogs({
      startTime: 6,
      totalDriveHrs: r.data.duration_h,
      pickupHrs: 1,
      dropoffHrs: 1,
    });
    console.log("Generated Logs:", logs); 

      setResp(r.data);
    } catch (err: any) {
      console.error("API Error:", err.response?.data ?? err);
      setError(err.response?.data?.error ?? err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-4">
          <h2 className="text-lg font-medium text-gray-900">Route Details</h2>
          <p className="mt-1 text-sm text-gray-500">Enter your trip information below</p>
        </div>
        
        <form onSubmit={submit} className="p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Location
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  value={form.current_location}
                  onChange={(e) =>
                    setForm({ ...form, current_location: e.target.value })
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter city or address"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Location
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  value={form.pickup_location}
                  onChange={(e) =>
                    setForm({ ...form, pickup_location: e.target.value })
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter pickup location"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dropoff Location
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  value={form.dropoff_location}
                  onChange={(e) =>
                    setForm({ ...form, dropoff_location: e.target.value })
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter dropoff location"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Cycle Used
                <span className="ml-1 text-sm text-gray-500">(in hours)</span>
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="70"
                  value={form.current_cycle_used}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      current_cycle_used: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter hours used (0-70)"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Enter the number of hours already used in your current cycle (0-70)
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  ⚠️
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error planning route
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {typeof error === 'string' ? error : JSON.stringify(error)}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Planning Route...
                </span>
              ) : (
                'Plan Trip'
              )}
            </button>
          </div>
        </form>
      </div>

      {resp && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Map Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
              <h3 className="text-lg font-medium text-gray-900">Route Map</h3>
            </div>
            <div className="h-[400px] relative">
              <MapDisplay geometry={resp.geometry} />
            </div>
          </div>

          {/* Trip Details Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
              <h3 className="text-lg font-medium text-gray-900">Trip Details</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Total Distance</div>
                  <div className="mt-1 text-2xl font-semibold text-blue-900">
                    {resp.distance_miles.toFixed(1)} miles
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Total Duration</div>
                  <div className="mt-1 text-2xl font-semibold text-green-900">
                    {resp.duration_h_with_pd.toFixed(1)} hrs
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Fuel Stops</h4>
                {resp.fuel_stops_miles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {resp.fuel_stops_miles.map((mile, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        At {mile} miles
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No fuel stops needed</p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Hours of Service</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">
                    Remaining Cycle Hours: <span className="font-medium text-gray-900">{resp.eld.remaining_cycle_hours.toFixed(1)}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <ELDLog logs={resp.eld.logs} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

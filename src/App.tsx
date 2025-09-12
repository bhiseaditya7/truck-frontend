import React from "react";
import TripPlanner from "./components/TripPlanner";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              🚛 Truck Route Planner
            </h1>
            <div className="text-sm text-gray-500">
              ELD Compliant Planning System
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TripPlanner />
      </main>
    </div>
  );
}

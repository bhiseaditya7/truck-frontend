export interface RouteRequest {
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  current_cycle_used: number;
}

export interface RouteResponse {
  distance_m: number;
  distance_miles: number;
  duration_s: number;
  duration_h: number;
  duration_h_with_pd: number;
  geometry: {
    type: string;
    coordinates: [number, number][];
  };
  fuel_stops_miles: number[];
  eld: {
    remaining_cycle_hours: number;
    logs: ELDLogEntry[];
  };
}

export interface ELDLogEntry {
  day: number;
  type: "drive" | "rest" | "reset";
  driving_h?: number;
  duration_h?: number;
  notes?: string;
}

export interface DutyLog {
  day: number;            // Day number (1,2,3...)
  status: "off" | "sleeper" | "drive" | "onduty";
  start: number;          // Start time in hours from trip start (e.g., 6 = 06:00)
  end: number;            // End time in hours from trip start
}

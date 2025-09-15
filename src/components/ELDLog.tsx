import { useEffect, useRef } from "react";
import type { ELDLogEntry } from "../types";

interface Props {
  logs: ELDLogEntry[];
}

const COLORS = {

  grid: "#e5e7eb",    // Grid lines - Light Gray
  text: "#1f2937",    // Labels - Dark Gray
  line: "#111827",    // Duty status line - Almost black
};

// Map duty status to Y positions (top-down)
const DUTY_STATUSES = ["OFF", "SB", "D", "ON"];
const STATUS_Y = {
  OFF: 50,
  SB: 100,
  D: 150,
  ON: 200,
};

export default function ELDLog({ logs }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Make canvas responsive
    canvas.width = container.clientWidth;
    canvas.height = 260;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const startX = 80; // leave room for labels
    const hourWidth = (width - startX - 20) / 24;

    // === Draw horizontal grid lines and labels ===
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    ctx.font = "12px system-ui";
    ctx.fillStyle = COLORS.text;
    ctx.textAlign = "right";

    DUTY_STATUSES.forEach((status) => {
      const y = STATUS_Y[status as keyof typeof STATUS_Y];
      // Draw horizontal grid line
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(width - 10, y);
      ctx.stroke();

      // Draw status label
      ctx.fillText(status, startX - 10, y + 4);
    });

    // === Draw vertical hour markers ===
    ctx.textAlign = "center";
    ctx.fillStyle = COLORS.text;
    for (let hour = 0; hour <= 24; hour++) {
      const x = startX + hour * hourWidth;
      ctx.beginPath();
      ctx.moveTo(x, STATUS_Y.OFF - 30);
      ctx.lineTo(x, STATUS_Y.ON + 30);
      ctx.strokeStyle = COLORS.grid;
      ctx.stroke();

      if (hour % 3 === 0) {
        ctx.fillText(hour.toString().padStart(2, "0") + ":00", x, STATUS_Y.OFF - 35);
      }
    }


    // === Draw connected duty status line ===
    ctx.strokeStyle = COLORS.line;
    ctx.lineWidth = 2;
    ctx.beginPath();

    logs.forEach((log, i) => {
      const x = startX + 1 * hourWidth;
      const y =  STATUS_Y.OFF;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Draw horizontal line for duration
      if (log.duration_h) {
        ctx.lineTo(x + log.duration_h * hourWidth, y);
      }
    });

    ctx.stroke();

  }, [logs]);

  return (
    <div ref={containerRef} className="w-full">
      <h3 className="text-lg font-semibold mb-2">Hours of Service Logs</h3>
      <div className="border rounded bg-white p-4">
        <canvas ref={canvasRef} className="w-full" style={{ maxHeight: "300px" }} />
      </div>
    </div>
  );
}

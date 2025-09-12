import React, { useEffect, useRef } from "react";
import type { ELDLogEntry } from "../types";

interface Props {
  logs: ELDLogEntry[];
}

const COLORS = {
  driving: "#2563eb", // blue-600
  rest: "#f59e0b",    // amber-500
  reset: "#dc2626",   // red-600
  grid: "#e5e7eb",    // gray-200
  text: "#1f2937",    // gray-800
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
    canvas.height = Math.max(200, 50 + logs.length * 30);
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const width = canvas.width;
    const height = canvas.height;
    const hourWidth = (width - 100) / 24; // Leave space for labels
    const startX = 80; // Starting X position after labels
    let y = 50; // Start lower to accommodate header

    // Draw time grid and labels
    ctx.font = '12px system-ui';
    ctx.fillStyle = COLORS.text;
    ctx.textAlign = 'center';
    
    // Draw hour markers
    for (let hour = 0; hour <= 24; hour++) {
      const x = startX + hour * hourWidth;
      // Grid lines
      ctx.strokeStyle = COLORS.grid;
      ctx.beginPath();
      ctx.moveTo(x, 30);
      ctx.lineTo(x, height);
      ctx.stroke();
      
      // Hour labels
      if (hour % 3 === 0) { // Show every 3 hours for clarity
        ctx.fillText(hour.toString().padStart(2, '0') + ':00', x, 25);
      }
    }

    // Draw the legend
    const legendY = 10;
    const legendItems = [
      { color: COLORS.driving, label: 'Driving' },
      { color: COLORS.rest, label: 'Rest' },
      { color: COLORS.reset, label: '34h Reset' }
    ];
    
    let legendX = startX;
    legendItems.forEach(item => {
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX, legendY - 8, 20, 8);
      ctx.fillStyle = COLORS.text;
      ctx.textAlign = 'left';
      ctx.fillText(item.label, legendX + 25, legendY);
      legendX += 120;
    });

    // Draw the logs
    logs.forEach((log) => {
      ctx.textAlign = 'right';
      if (log.type === "drive" && log.driving_h) {
        ctx.fillStyle = COLORS.driving;
        ctx.fillRect(startX, y, log.driving_h * hourWidth, 20);
        ctx.fillStyle = COLORS.text;
        ctx.fillText(`Day ${log.day}: ${log.driving_h}h driving`, startX - 5, y + 14);
        y += 30;
      }
      if (log.type === "rest" && log.duration_h) {
        ctx.fillStyle = COLORS.rest;
        ctx.fillRect(startX, y, log.duration_h * hourWidth, 20);
        ctx.fillStyle = COLORS.text;
        ctx.fillText(`Day ${log.day}: ${log.duration_h}h rest`, startX - 5, y + 14);
        y += 30;
      }
      if (log.type === "reset" && log.duration_h) {
        ctx.fillStyle = COLORS.reset;
        ctx.fillRect(startX, y, log.duration_h * hourWidth, 20);
        ctx.fillStyle = COLORS.text;
        ctx.fillText(`Day ${log.day}: 34h reset`, startX - 5, y + 14);
        y += 30;
      }
    });
  }, [logs]);

  return (
    <div ref={containerRef} className="w-full">
      <h3 className="text-lg font-semibold mb-2">Hours of Service Logs</h3>
      <div className="border rounded bg-white p-4">
        <canvas 
          ref={canvasRef} 
          className="w-full" 
          style={{ maxHeight: '400px' }}
        />
      </div>
    </div>
  );
}

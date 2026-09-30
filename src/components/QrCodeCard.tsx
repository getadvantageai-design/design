import React from "react";

interface QrSvgProps {
  className?: string;
}

export const LuminaQrSvg: React.FC<QrSvgProps> = ({ className = "w-36 h-36" }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* QR Pattern Blocks */}
    <rect fill="#eff4ff" height="100" rx="8" width="100" />
    {/* Corners */}
    <rect fill="#0b1c30" height="24" rx="4" width="24" x="10" y="10" />
    <rect fill="#eff4ff" height="16" rx="2" width="16" x="14" y="14" />
    <rect fill="#7c3aed" height="8" rx="1" width="8" x="18" y="18" />
    <rect fill="#0b1c30" height="24" rx="4" width="24" x="66" y="10" />
    <rect fill="#eff4ff" height="16" rx="2" width="16" x="70" y="14" />
    <rect fill="#7c3aed" height="8" rx="1" width="8" x="74" y="18" />
    <rect fill="#0b1c30" height="24" rx="4" width="24" x="10" y="66" />
    <rect fill="#eff4ff" height="16" rx="2" width="16" x="14" y="70" />
    <rect fill="#7c3aed" height="8" rx="1" width="8" x="18" y="74" />
    {/* Pattern pixels */}
    <rect fill="#0b1c30" height="6" rx="1" width="6" x="40" y="12" />
    <rect fill="#0b1c30" height="6" rx="1" width="6" x="50" y="16" />
    <rect fill="#0b1c30" height="6" rx="1" width="6" x="42" y="24" />
    <rect fill="#7c3aed" height="6" rx="1" width="6" x="52" y="32" />
    <rect fill="#0b1c30" height="6" rx="1" width="6" x="12" y="44" />
    <rect fill="#7c3aed" height="6" rx="1" width="6" x="22" y="48" />
    <rect fill="#0b1c30" height="6" rx="1" width="6" x="32" y="42" />
    <rect fill="#0b1c30" height="6" rx="1" width="6" x="64" y="42" />
    <rect fill="#7c3aed" height="6" rx="1" width="6" x="76" y="48" />
    <rect fill="#0b1c30" height="6" rx="1" width="6" x="84" y="40" />
    <rect fill="#0b1c30" height="6" rx="1" width="6" x="40" y="66" />
    <rect fill="#0b1c30" height="6" rx="1" width="6" x="50" y="72" />
    <rect fill="#7c3aed" height="6" rx="1" width="6" x="44" y="80" />
    <rect fill="#0b1c30" height="6" rx="1" width="6" x="68" y="72" />
    <rect fill="#0b1c30" height="6" rx="1" width="6" x="78" y="80" />
    {/* Center Brand Core */}
    <circle cx="50" cy="50" fill="#ffffff" r="11" />
    <circle cx="50" cy="50" fill="#7c3aed" r="9" />
    <path
      d="M47 54L50 45L53 54M48 51.5H52"
      stroke="#ffffff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.2"
    />
  </svg>
);

export function downloadQrPng(onDone?: () => void) {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 760;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Stand Card Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 600, 760);

  // Top Accent Bar
  ctx.fillStyle = "#7c3aed";
  ctx.fillRect(0, 0, 600, 14);

  // Header text
  ctx.fillStyle = "#0b1c30";
  ctx.font = "bold 28px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Lumina Haven • Salon & Spa", 300, 70);

  ctx.fillStyle = "#7c3aed";
  ctx.font = "bold 16px sans-serif";
  ctx.fillText("VIP LOYALTY & REVIEW CHECK-IN", 300, 102);

  // QR Container
  ctx.fillStyle = "#eff4ff";
  ctx.fillRect(140, 140, 320, 320);

  // Draw QR corners
  const drawFinder = (x: number, y: number) => {
    ctx.fillStyle = "#0b1c30";
    ctx.fillRect(x, y, 76, 76);
    ctx.fillStyle = "#eff4ff";
    ctx.fillRect(x + 12, y + 12, 52, 52);
    ctx.fillStyle = "#7c3aed";
    ctx.fillRect(x + 24, y + 24, 28, 28);
  };
  drawFinder(172, 172);
  drawFinder(352, 172);
  drawFinder(172, 352);

  // Center badge
  ctx.fillStyle = "#7c3aed";
  ctx.beginPath();
  ctx.arc(300, 300, 32, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px sans-serif";
  ctx.fillText("A", 300, 309);

  // Footer instructions
  ctx.fillStyle = "#0b1c30";
  ctx.font = "bold 24px sans-serif";
  ctx.fillText("Scan to Join & Earn 50 Bonus Points", 300, 525);

  ctx.fillStyle = "#565e74";
  ctx.font = "16px sans-serif";
  ctx.fillText("Automatically logs your visit & unlocks VIP rewards", 300, 560);

  ctx.fillStyle = "#007650";
  ctx.font = "bold 15px sans-serif";
  ctx.fillText("✓ Powered by AdVantage AI™ • Lumina Haven Front Desk", 300, 690);

  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = "lumina-haven-qr-stand.png";
  link.href = dataUrl;
  link.click();
  if (onDone) onDone();
}

import { useEffect, useRef } from 'react';

interface LedPreviewProps {
  colors: [string, string, string];
  size?: number;
}

export default function LedPreview({ colors, size = 120 }: LedPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Convert hex colors to RGB
    const rgbColors = colors.map(hex => ({
      r: parseInt(hex.slice(2, 4), 16),
      g: parseInt(hex.slice(4, 6), 16),
      b: parseInt(hex.slice(6, 8), 16),
    }));

    // Calculate center and radii
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = size / 2;
    const innerRadius = outerRadius * 0.6;

    // Draw outer ring segments
    for (let i = 0; i < 3; i++) {
      const startAngle = (i * 2 * Math.PI) / 3;
      const endAngle = ((i + 1) * 2 * Math.PI) / 3;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
      ctx.closePath();

      const { r, g, b } = rgbColors[i];
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fill();

      // Add inner dark border
      ctx.strokeStyle = `rgba(0, 0, 0, 0.2)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw inner circle (button)
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();

    // Add subtle shadow effect
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.stroke();

  }, [colors, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="rounded-full"
      style={{
        backgroundColor: '#f0f0f0',
      }}
    />
  );
}
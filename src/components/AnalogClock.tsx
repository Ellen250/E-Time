import  { useState, useEffect, useRef } from 'react';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    // Set time immediately to avoid initial delay
    setTime(new Date());
    
    // Update every second
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const size = Math.min(canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = size * 0.45; // 90% of half the size
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw clock face
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(18, 18, 18, 0.7)';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#6366f1'; // accent-primary
    ctx.stroke();
    
    // Draw hour marks
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const x1 = centerX + (radius - 10) * Math.sin(angle);
      const y1 = centerY - (radius - 10) * Math.cos(angle);
      const x2 = centerX + radius * Math.sin(angle);
      const y2 = centerY - radius * Math.cos(angle);
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    
    // Draw minute marks
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#a0a0a0';
    for (let i = 0; i < 60; i++) {
      if (i % 5 !== 0) { // Skip hour marks
        const angle = (i * Math.PI) / 30;
        const x1 = centerX + (radius - 5) * Math.sin(angle);
        const y1 = centerY - (radius - 5) * Math.cos(angle);
        const x2 = centerX + radius * Math.sin(angle);
        const y2 = centerY - radius * Math.cos(angle);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
    
    // Get current time
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    
    // Calculate precise angles for hands
    // Hours: Each hour is 30 degrees (360/12), plus a small amount for minutes
    const hourAngle = ((hours * 30) + (minutes * 0.5)) * Math.PI / 180;
    const hourHandLength = radius * 0.6;
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + hourHandLength * Math.sin(hourAngle),
      centerY - hourHandLength * Math.cos(hourAngle)
    );
    ctx.stroke();
    
    // Minutes: Each minute is 6 degrees (360/60), plus a small amount for seconds
    const minuteAngle = ((minutes * 6) + (seconds * 0.1)) * Math.PI / 180;
    const minuteHandLength = radius * 0.75;
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + minuteHandLength * Math.sin(minuteAngle),
      centerY - minuteHandLength * Math.cos(minuteAngle)
    );
    ctx.stroke();
    
    // Seconds: Each second is 6 degrees (360/60)
    const secondAngle = (seconds * 6) * Math.PI / 180;
    const secondHandLength = radius * 0.85;
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#6366f1'; // accent-primary
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + secondHandLength * Math.sin(secondAngle),
      centerY - secondHandLength * Math.cos(secondAngle)
    );
    ctx.stroke();
    
    // Draw center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#6366f1'; // accent-primary
    ctx.fill();
    
  }, [time]);

  return (
    <div className="relative w-80 h-80 md:w-96 md:h-96 mx-auto">
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={400} 
        className="w-full h-full"
      />
    </div>
  );
};

export default AnalogClock;
 
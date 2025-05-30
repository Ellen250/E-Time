import  { useState, useEffect } from 'react';

interface DigitalClockProps {
  use24Hour?: boolean;
}

const DigitalClock = ({ use24Hour = false }: DigitalClockProps) => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  // Format hours, minutes, seconds
  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  
  // Handle 12/24 hour format
  let displayHours: string;
  let ampm = '';
  
  if (use24Hour) {
    displayHours = hours.toString().padStart(2, '0');
  } else {
    ampm = hours >= 12 ? 'PM' : 'AM';
    displayHours = (hours % 12 || 12).toString(); // Convert to 12-hour format
    // Don't pad single-digit hours in 12-hour format for more natural display
  }
  
  // Format the date
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const day = days[time.getDay()];
  const date = time.getDate();
  const month = months[time.getMonth()];
  const year = time.getFullYear();

  return (
    <div className="flex flex-col items-center">
      <div className="text-8xl md:text-9xl font-bold tracking-tighter text-white mb-4 flex items-center">
        <span>{displayHours}</span>
        <span className="animate-pulse-soft mx-2">:</span>
        <span>{minutes}</span>
        <span className="animate-pulse-soft mx-2">:</span>
        <span>{seconds}</span>
        {!use24Hour && <span className="ml-4 text-2xl md:text-3xl font-medium text-accent-primary">{ampm}</span>}
      </div>
      
      <div className="text-xl md:text-2xl font-medium text-gray-300 tracking-wide">
        {day}, {month} {date}, {year}
      </div>
    </div>
  );
};

export default DigitalClock;
 
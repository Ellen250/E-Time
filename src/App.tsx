import  { useState, useEffect } from 'react';
import DigitalClock from './components/DigitalClock';
import AnalogClock from './components/AnalogClock';
import BackgroundSelector from './components/BackgroundSelector';
import TaskTracker from './components/TaskTracker';

//  Default animated gradient backgrounds
const DEFAULT_BACKGROUNDS = [
  'linear-gradient(to right, #0f0c29, #302b63, #24243e)',
  'linear-gradient(45deg, #000428, #004e92, #000428)',
  'linear-gradient(-45deg, #3f4c6b, #606c88, #3f4c6b)',
  'linear-gradient(60deg, #1f1c2c, #928dab, #1f1c2c)',
  'https://images.unsplash.com/photo-1506508618093-6fe5ce3def4c?ixlib=rb-4.1.0&fit=fillmax&h=1080&w=1920',
  'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?ixlib=rb-4.1.0&fit=fillmax&h=1080&w=1920',
  'https://images.unsplash.com/photo-1508717272800-9fff97da7e8f?ixlib=rb-4.1.0&fit=fillmax&h=1080&w=1920',
  'https://images.unsplash.com/photo-1492892132812-a00a8b245c45?ixlib=rb-4.1.0&fit=fillmax&h=1080&w=1920'
];
 

function  App() {
  const [clockMode, setClockMode] = useState<'digital' | 'analog'>('digital');
  const [use24HourFormat, setUse24HourFormat] = useState(() => {
    const savedFormat = localStorage.getItem('e-time-24hour');
    // Default to true for 24-hour format
    return savedFormat ? savedFormat === 'true' : true;
  });
  const [backgroundUrl, setBackgroundUrl] = useState(() => {
    // First try to get the uploaded background
    const uploadedBg = localStorage.getItem('e-time-uploaded-background');
    if (uploadedBg) return uploadedBg;
    
    // Then try the selected background
    const savedBg = localStorage.getItem('e-time-background');
    return savedBg || DEFAULT_BACKGROUNDS[0];
  });

  useEffect(() => {
    localStorage.setItem('e-time-background', backgroundUrl);
  }, [backgroundUrl]);
  
  useEffect(() => {
    localStorage.setItem('e-time-24hour', use24HourFormat.toString());
  }, [use24HourFormat]);
 

  // Separate background styles to avoid conflicting properties
  const bgStyle = backgroundUrl.startsWith('http')
    ? {
        backgroundImage: `url(${backgroundUrl})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
      }
    : {
        background: backgroundUrl,
        backgroundSize: '300% 300%',
        animation: 'gradientShift 15s ease infinite',
      };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center overflow-hidden transition-all duration-500"
      style={bgStyle}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-[2px]"></div>
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center justify-center px-4">
             <div className="flex flex-col mb-8 items-center">
        <div className="flex bg-dark-primary bg-opacity-20 backdrop-blur-md rounded-full p-1.5 shadow-lg mb-2">
          <button 
            onClick={() => setClockMode('digital')}
            className={`px-4 py-2 rounded-full transition-all ${
              clockMode === 'digital' ? 'bg-accent-primary' : 'bg-dark-tertiary hover:bg-gray-700'
            }`}
          >
            Digital
          </button>
          <button 
            onClick={() => setClockMode('analog')}
            className={`px-4 py-2 rounded-full transition-all ${
              clockMode === 'analog' ? 'bg-accent-primary' : 'bg-dark-tertiary hover:bg-gray-700'
            }`}
          >
            Analog
          </button>
        </div>
        
        {clockMode === 'digital' && (
          <button 
            onClick={() => setUse24HourFormat(!use24HourFormat)}
            className="text-sm px-3 py-1 bg-dark-tertiary hover:bg-gray-700 rounded-full transition-all"
          >
            {use24HourFormat ? '12-hour format' : '24-hour format'}
          </button>
        )}
      </div>
 
        
        {/* Clock display */}
        <div className="mb-8 bg-dark-primary bg-opacity-30 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-dark-tertiary">
          {clockMode === 'digital' ? <DigitalClock use24Hour={use24HourFormat} /> : <AnalogClock />}
        </div>
        
        {/* Credits */}
        <div className="text-xs text-gray-300 opacity-70">
          E-Time | Developer's Clock
        </div>
      </div>
      
      {/* Background selector */}
      <BackgroundSelector 
        onSelectBackground={setBackgroundUrl}
        defaultBackgrounds={DEFAULT_BACKGROUNDS}
      />
      
      {/* Task tracker */}
      <TaskTracker />
    </div>
  );
}

export default App;
 
import   { useState, useEffect } from 'react';
 
import { Image, X, Plus } from 'lucide-react';

interface BackgroundSelectorProps {
  onSelectBackground: (background: string) => void;
  defaultBackgrounds: string[];
}

const BackgroundSelector = ({ onSelectBackground, defaultBackgrounds }: BackgroundSelectorProps) => {
  const [showSelector, setShowSelector] = useState(false);
   const [customImageUrl, setCustomImageUrl] = useState('');
  const [error, setError] = useState('');
  const [unsplashImages, setUnsplashImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
 

   const handleCustomImage = () => {
    if (!customImageUrl) {
      setError('Please enter a URL');
      return;
    }
    
    // Basic URL validation
    if (!customImageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.+)?$/i)) {
      setError('Please enter a valid image URL');
      return;
    }
    
    onSelectBackground(customImageUrl);
    setShowSelector(false);
    setCustomImageUrl('');
    setError('');
  };

   const fetchUnsplashImages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://hooks.jdoodle.net/proxy?url=https://api.unsplash.com/photos/random?count=4&query=galaxy,stars,cosmic,nebula&orientation=landscape`, {
        method: 'GET'
      });
      
      const data = await response.json();
      if (Array.isArray(data)) {
        const imageUrls = data.map(item => `${item.urls.regular}&w=1920&q=80`);
        setUnsplashImages(imageUrls);
      }
    } catch (error) {
      console.error('Error fetching Unsplash images:', error);
    } finally {
      setIsLoading(false);
    }
  };
 

  // Load random Unsplash images when selector is opened
  useEffect(() => {
    if (showSelector && unsplashImages.length === 0) {
      fetchUnsplashImages();
    }
  }, [showSelector]);
 

   const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const result = event.target.result.toString();
          onSelectBackground(result);
          setShowSelector(false);
          
          // Save to localStorage to persist the uploaded image
          try {
            localStorage.setItem('e-time-uploaded-background', result);
          } catch (error) {
            console.error('Error saving image to localStorage:', error);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };
 

  return (
    <>
      {/* Toggle button */}
      <button 
        onClick={() => setShowSelector(!showSelector)}
        className="fixed bottom-4 right-4 z-10 bg-dark-tertiary hover:bg-gray-700 p-3 rounded-full shadow-lg transition-all"
      >
        <Image size={24} className="text-accent-primary" />
      </button>
      
      {/* Background selector modal */}
      {showSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-dark-secondary rounded-lg shadow-2xl w-full max-w-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Choose Background</h3>
              <button 
                onClick={() => setShowSelector(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Preset Backgrounds</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {defaultBackgrounds.map((bg, index) => {
                  // Separate styles to avoid conflicts
                  const buttonStyle = bg.startsWith('http')
                    ? {
                        backgroundImage: `url(${bg})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center center',
                        backgroundSize: 'cover'
                      }
                    : {
                        background: bg,
                      };
                  
                  return (
                    <button 
                      key={`preset-${index}`}
                      onClick={() => {
                        onSelectBackground(bg);
                        setShowSelector(false);
                      }}
                      className="h-24 rounded overflow-hidden border border-gray-700 hover:border-accent-primary transition-colors"
                      style={buttonStyle}
                      title={`Background ${index + 1}`}
                    />
                  );
                })}
              </div>
            </div>

            {unsplashImages.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Live Space Backgrounds</label>
                  <button 
                    onClick={fetchUnsplashImages}
                    className="text-xs text-accent-primary hover:text-accent-secondary flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Refresh'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {unsplashImages.map((img, index) => (
                    <button 
                      key={`unsplash-${index}`}
                      onClick={() => {
                        onSelectBackground(img);
                        setShowSelector(false);
                      }}
                      className="h-24 rounded overflow-hidden border border-gray-700 hover:border-accent-primary transition-colors"
                      style={{ 
                        backgroundImage: `url(${img})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center center',
                        backgroundSize: 'cover'
                      }}
                      title={`Live Background ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Custom Image URL</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customImageUrl}
                  onChange={(e) => {
                    setCustomImageUrl(e.target.value);
                    setError('');
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-3 py-2 bg-dark-tertiary border border-gray-700 rounded"
                />
                <button 
                  onClick={handleCustomImage}
                  className="bg-accent-primary hover:bg-accent-secondary px-4 py-2 rounded"
                >
                  Apply
                </button>
              </div>
              {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Upload Image</label>
              <label className="flex items-center justify-center px-4 py-6 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-accent-primary transition-colors">
                <div className="flex flex-col items-center">
                  <Plus size={24} className="mb-2 text-accent-primary" />
                  <span className="text-sm text-gray-300">Click to upload an image</span>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileInput}
                  className="hidden" 
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BackgroundSelector;
 
import React, { useRef, useState, useEffect } from 'react';
import { getImageUrl } from '../utils/imageUrl';

const ProtectedImage = ({ src, alt, className, ...props }) => {
  const [blur, setBlur] = useState(false);
  const imageRef = useRef(null);
  const [finalSrc, setFinalSrc] = useState(getImageUrl(src));

  useEffect(() => {
    setFinalSrc(getImageUrl(src));
  }, [src]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    return false;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'PrintScreen') {
      e.preventDefault();
      setBlur(true);
      setTimeout(() => setBlur(false), 1500);
      return false;
    }
    if ((e.ctrlKey || e.metaKey) && ['s', 'S', 'c', 'C', 'i', 'I', 'u', 'U'].includes(e.key)) {
      e.preventDefault();
      return false;
    }
  };

  const handleBlur = () => {
    setBlur(true);
    setTimeout(() => setBlur(false), 1000);
  };

  useEffect(() => {
    const handlePrintScreen = (e) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        setBlur(true);
        setTimeout(() => setBlur(false), 2000);
        return false;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setBlur(true);
        setTimeout(() => setBlur(false), 1000);
      }
    };

    document.addEventListener('keydown', handlePrintScreen);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('keydown', handlePrintScreen);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden ${className || ''}`}>
      <img
        ref={imageRef}
        src={finalSrc}
        alt={alt}
        onError={(e) => {
          // If the real image fails, fall back to placeholder
          if (e.currentTarget.src !== window.location.origin + '/placeholder.jpg') {
            e.currentTarget.src = '/placeholder.jpg';
          }
        }}
        className={`w-full h-full object-cover transition-all duration-300 ${
          blur ? 'blur-sm' : ''
        }`}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        {...props}
      />
      <div
        className="absolute inset-0 pointer-events-none image-protected"
        style={{
          background:
            'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 11px)',
        }}
      />
    </div>
  );
};

export default ProtectedImage;
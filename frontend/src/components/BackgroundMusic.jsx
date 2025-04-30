import React, { useRef, useState, useEffect } from 'react';

const BackgroundMusic = ({path,name}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

//   useEffect(() => {
//     // Autoplay with volume 0.5 on mount
//     audioRef.current.volume = volume;
//     audioRef.current.play().catch(() => {
//       // In case browser blocks autoplay with audio
//       setIsPlaying(false);
//     });
//   }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  return (
    <div className="p-4 flex w-full justify-center">
      <audio ref={audioRef} src={path} loop />
      
      <div className="flex items-center gap-4">
        <button 
          onClick={togglePlay}
          className="px-1 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isPlaying ? `Pause ${name}`  : `Play ${name}`}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-32"
        />
        <span>{Math.round(volume * 100)}%</span>
      </div>
    </div>
  );
};

export default BackgroundMusic;

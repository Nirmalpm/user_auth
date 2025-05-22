import React, { useRef, useState, useEffect } from 'react';

const lyrics = [
  { time: 0, text: "Om Sreem Om" },
  { time: 10, text: "Om Bhur Bhuvaḥ Suvaha" },
  { time: 15, text: "Tat-savitur Vareñyaṃ" },
  { time: 18, text: "Bhargo Devasya Dheemahi" },
  { time: 21, text: "Dhiyo Yonaḥ Prachodayāt" },
  { time: 26, text: "Om Sreem Om" },
  { time: 32, text: "Om Try-Ambakam Yajaamahe" },
  { time: 36, text: "Sugandhim Pushtti-Vardhanam" },
  { time: 39, text: "Urvaarukam-Iva Bandhanaan" },
  { time: 42, text: "Mrtyor-Mukssiiya Maa-[A]mrtaat " },
  { time: 45, text: "Om Sreem Om" },
];

const KaraokePlayer = ({path}) => {
  const audioRef = useRef(null);
  const lineRefs = useRef([]); // to hold references to each lyric line
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    }, 300); // updates 3 times per second

    return () => clearInterval(interval);
  }, []);

  const getActiveLineIndex = () => {
    let index = 0;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) {
        index = i;
      }
    }
    return index;
  };

  const activeIndex = getActiveLineIndex();

  // useEffect(() => {
  //   if (lineRefs.current[activeIndex]) {
  //     lineRefs.current[activeIndex].scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'center',
  //     });
  //   }
  // }, [activeIndex]);

  useEffect(() => {
    const container = audioRef.current;
    const activeLine = lineRefs.current[activeIndex];
  
    if (container && activeLine) {
      const offsetTop = activeLine.offsetTop;
      const lineHeight = activeLine.offsetHeight;
      const containerHeight = container.clientHeight;
  
      container.scrollTo({
        top: offsetTop - containerHeight / 2 + lineHeight / 2,
        behavior: 'smooth',
      });
    }
  }, [activeIndex]);

  return (
    <div className="p-4 flex flex-col justify-center items-center">
      <div className="text-3xl bg-gradient-to-r from-pink-100 to-pink-700 p-3 rounded-t-xl mt-5"><h1>Vishishta Gayathri Mantram</h1></div>
      <div className="flex w-full flex-col max-w-md  h-120 overflow-y-auto border p-4 rounded-b-2xl 
      bg-gradient-to-r from-pink-500 to-emerald-800">
        {lyrics.map((line, index) => (
          <p
            key={index}
            ref={(el) => (lineRefs.current[index] = el)}
            className={`text-lg mb-2 ${
              index === activeIndex ? 'text-white font-bold' : 'text-gray-900'
            }`}
          >
            {line.text}
          </p>
        ))}
      </div>
      <audio ref={audioRef} src={path} controls  />

    </div>
  );
};

export default KaraokePlayer;

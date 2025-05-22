import React, { useEffect, useRef, useState } from "react";

const interestingStuff = [
  "Did you know? Honey never spoils.",
  "The Eiffel Tower can be 15 cm taller during the summer.",
  "Octopuses have three hearts.",
  "Bananas are berries, but strawberries are not.",
  "There are more stars in the universe than grains of sand on Earth.",
  "A day on Venus is longer than its year.",
  "Sharks have been around longer than trees.",
  "Some turtles can breathe through their butts.",
  "The world's smallest reptile was discovered recently — it’s smaller than a fingernail.",
  "Cats can make over 100 different sounds.",
];

const RightPanelScrolling = () => {
  const containerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollSpeed = 1; // pixels per interval
    const intervalTime = 50; // ms

    const container = containerRef.current;
    if (!container) return;

    let scrollPosition = 0;

    const interval = setInterval(() => {
      if (!isPaused) {
        scrollPosition += scrollSpeed;
        if (scrollPosition >= container.scrollHeight - container.clientHeight) {
          scrollPosition = 0; // reset to top when reaching bottom
        }
        container.scrollTop = scrollPosition;
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div
      ref={containerRef}
      className="h-150 w-full overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 p-4 bg-white rounded shadow"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <h2 className="text-xl font-bold mb-4">Interesting Stuff</h2>
      <ul className="space-y-3">
        {interestingStuff.map((item, index) => (
          <li
            key={index}
            className="p-3 bg-blue-50 rounded border border-blue-200 hover:bg-blue-100 transition"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RightPanelScrolling;

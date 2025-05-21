import React, { useState, useRef, useEffect } from "react";
import bg from "../assets/wp.png";

const audioUrl = [
  {
    title: "Song 1",
    path: "https://res.cloudinary.com/dcq2qg6mw/video/upload/v1743934829/musc_y6lw1e.mp3"
  },
  {
    title: "Song 2",
    path: "https://res.cloudinary.com/dcq2qg6mw/video/upload/v1743944078/m2_smr3qv.mp3"
  },
  {
    title: "Song 3",
    path: "https://res.cloudinary.com/dcq2qg6mw/video/upload/v1743944107/m3_tx5qyh.mp3"
  },
  {
    title: "Song 4",
    path: "https://res.cloudinary.com/dcq2qg6mw/video/upload/v1743944108/m4_jgiwwh.mp3"
  }
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  const currentTrack = audioUrl[currentIndex];

  // Update progress bar and timestamps
  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    audio.addEventListener("timeupdate", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

  // Play/Pause when song or isPlaying changes
  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [currentIndex, isPlaying]);

  const handleProgress = (e) => {
    const value = e.target.value;
    const newTime = (value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(value);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const skipNext = () => {
    if (currentIndex < audioUrl.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsPlaying(true);
    }
  };

  const skipBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsPlaying(true);
    }
  };

  const handleSelect = (index) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
      setIsPlaying(true);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div
      className="h-screen w-screen bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="h-18 w-screen backdrop-blur-xs flex justify-center items-center py-4">
        <h1 className="text-3xl font-bold text-white drop-shadow">🎵 MUSIX PLAYER</h1>
      </div>

      <div className="flex flex-col items-center mt-6 space-y-4">
        {audioUrl.map((song, index) => (
          <div
            key={index}
            onClick={() => handleSelect(index)}
            className={`cursor-pointer w-3/4 md:w-1/2 text-center p-3 rounded-lg transition-all shadow-md border border-gray-200 
            ${
              index === currentIndex
                ? "bg-black text-white scale-105"
                : "bg-white hover:bg-black hover:text-white"
            }`}
          >
            <h2 className="font-semibold text-lg">{song.title}</h2>
          </div>
        ))}
      </div>

      <div className="h-40 w-screen backdrop-blur-xs absolute bottom-0 flex flex-col justify-evenly items-center p-4">
        <input
          type="range"
          value={progress}
          onChange={handleProgress}
          className="w-3/4 md:w-1/2 accent-black"
        />
        <div className="w-3/4 md:w-1/2 flex justify-between text-sm text-gray-300 px-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <audio ref={audioRef} src={currentTrack.path} />

        <div className="flex gap-6 text-3xl cursor-pointer mt-2 text-black">
          <i
            className={`fa-solid fa-backward ${
              currentIndex === 0 ? "opacity-30 cursor-not-allowed" : ""
            }`}
            onClick={skipBack}
          ></i>
          <i
            className={`fa-solid ${
              isPlaying ? "fa-circle-pause" : "fa-circle-play"
            }`}
            onClick={togglePlayPause}
          ></i>
          <i
            className={`fa-solid fa-forward ${
              currentIndex === audioUrl.length - 1 ? "opacity-30 cursor-not-allowed" : ""
            }`}
            onClick={skipNext}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default Home;

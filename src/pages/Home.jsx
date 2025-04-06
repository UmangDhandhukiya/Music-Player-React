import React, { useState, useRef, useEffect } from "react";
import bg from "../assets/wp.png";

const audioUrl = [
  {
    title: "Song 1",
    path: "https://res.cloudinary.com/dcq2qg6mw/video/upload/v1743934829/musc_y6lw1e.mp3"
  },
  {
    title: "Song 2",
    path:"https://res.cloudinary.com/dcq2qg6mw/video/upload/v1743944078/m2_smr3qv.mp3"
  },
  {
    title: "Song 3",
    path: "https://res.cloudinary.com/dcq2qg6mw/video/upload/v1743944107/m3_tx5qyh.mp3"
  },
  {
    title: "Song 4",
    path:"https://res.cloudinary.com/dcq2qg6mw/video/upload/v1743944108/m4_jgiwwh.mp3"
  }
];

const Home = () => {
  const [musicSel, setMusicSel] = useState(audioUrl[0]);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setisPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

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

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [musicSel]);

  const handleProgress = (e) => {
    const value = e.target.value;
    const newTime = (value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(value);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setisPlaying(!isPlaying);
  };

  const skipnext = () => {
    const currentIndex = audioUrl.indexOf(musicSel);
    const nextIndex = (currentIndex + 1) % audioUrl.length;
    setMusicSel(audioUrl[nextIndex]);
    setisPlaying(true);
  };

  const skipback = () => {
    const currentIndex = audioUrl.indexOf(musicSel);
    const prevIndex = (currentIndex - 1 + audioUrl.length) % audioUrl.length;
    setMusicSel(audioUrl[prevIndex]);
    setisPlaying(true);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div
      className="h-screen w-screen bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="h-18 w-screen backdrop-blur-xs flex justify-center items-center">
        <h1 className="text-3xl font-bold">MUSIX</h1>
      </div>

      <div className="h-70 flex flex-col justify-evenly items-center">
        {audioUrl.map((value, index) => (
          <div
            key={index}
            className="bg-white w-1/2 shadow-md rounded-lg p-2 border border-gray-200 hover:bg-black hover:text-white"
            onClick={() => {
              setMusicSel(value);
              setisPlaying(true);
            }}
          >
            <h2 className="text-lg font-semibold mb-2">{value.title}</h2>
          </div>
        ))}
      </div>

      <div className="h-40 w-screen backdrop-blur-xs absolute bottom-0 flex flex-col justify-evenly items-center">
        <input
          type="range"
          value={progress}
          onChange={handleProgress}
          className="h-1 w-1/2 accent-black"
        />

        <div className="w-1/2 flex justify-between text-sm text-gray-300 px-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <audio ref={audioRef} src={musicSel.path} />

        <div className="flex gap-5 text-3xl cursor-pointer mt-2 text-white">
          <i className="fa-solid fa-backward" onClick={skipback}></i>
          <i
            className={`fa-solid ${
              isPlaying ? "fa-circle-pause" : "fa-circle-play"
            }`}
            onClick={togglePlayPause}
          ></i>
          <i className="fa-solid fa-forward" onClick={skipnext}></i>
        </div>
      </div>
    </div>
  );
};

export default Home;

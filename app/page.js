'use client';
import { useEffect, useRef, useState } from "react";

const GIFS = [
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjZmem1xbGFubWY5MnZwbndhNnYzazZyem5waHFid3M4N3VuaDZnOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohze1qcZ9woSlyvFm/giphy.gif",
  "https://i.pinimg.com/originals/55/e8/af/55e8af23ff4e1055efd3605624dceb66.gif",
  "https://cdna.artstation.com/p/assets/images/images/006/489/920/original/andrii-shafetov-wegkreuz.gif?1499009157",
  `https://cdnb.artstation.com/p/assets/images/images/025/079/567/original/ngan-pham-lil-ants-anim-test-v06.gif?1584542703`,
  "https://i.pinimg.com/originals/e4/88/3a/e4883a5aeb51b2119bd17fe00889c866.gif"
];

export default function Home() {
  const audioRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [selectedGif, setSelectedGif] = useState(GIFS[0]);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderText, setReminderText] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [reminder, setReminder] = useState(null);
  const [completedAlert, setCompletedAlert] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Live clock
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Reminder checker
  useEffect(() => {
    if (!reminder) return;
    const checker = setInterval(() => {
      const [h, m] = reminder.time.split(":");
      const d = new Date();
      if (d.getHours() == h && d.getMinutes() == m) {
        setCompletedAlert(reminder.text);
        setReminder(null);
        if ( soundEnabled && audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
        setTimeout(() => setAlertVisible(false), 114000);
      }
    }, 1000);
    return () => clearInterval(checker);
  }, [reminder, soundEnabled]);

  // Format helpers
  const two = n => n < 10 ? "0" + n : n;
  const timeStr = `${two(now.getHours())}:${two(now.getMinutes())}:${two(now.getSeconds())}`;
  const dateStr = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  // Form handlers
  function handleSetReminder(e) {
    e.preventDefault();
    if (!reminderText || !reminderTime) return;
    setReminder({ text: reminderText, time: reminderTime });
    setShowReminder(false);
    setReminderText(""); setReminderTime("");
  }
  function clearReminder() { setReminder(null); }
  function markDone() {
    setCompletedAlert(reminder?.text);
    setReminder(null);
    setTimeout(() => setCompletedAlert(null), 4000);
  }

  // cancel alert and stop audio
  function cancelAlert() {
    setCompletedAlert(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  function truncateWords(text, wordLimit = 15) {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  }

  // Animated classes
  const expandedBg = expanded
    ? `fixed inset-0 z-10 transition-all duration-500 bg-black`
    : "";

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Top control button */}
      <button
        className={`
          fixed top-4 left-4 z-30 w-12 h-7 rounded-full bg-neutral-900 border-2 border-neutral-700 p-1 flex items-center
          transition-colors duration-200 focus:outline-none
        `}
        onClick={() => setExpanded(x => !x)}
        aria-label="Toggle background"
      >
        <span
          className={`
            block w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200
            ${expanded ? 'translate-x-5' : ''}
          `}
        />
      </button>

      {/* GIF right selector */}
      <div className="fixed z-30 flex flex-col gap-4 right-2 top-auto bottom-3 sm:right-8 sm:top-1/2 sm:-translate-y-1/2 sm:bottom-auto">
        {GIFS.map((gif, i) => (
          <button key={gif}
            className={`rounded-full border-2 ${selectedGif === gif ? "border-white scale-110" : "border-gray-600"} transition-transform`}
            onClick={() => setSelectedGif(gif)}
          >
            <img src={gif} className="w-10 h-10 rounded-full object-cover" />
          </button>
        ))}
      </div>

      {/* audio */}
      <audio ref={audioRef} src='/alert.mp3' preload="auto" />

      {/* Expanded background GIF overlay */}
      {expanded && (
        <div
          className={expandedBg}
          style={{ background: `url(${selectedGif}) center/cover no-repeat` }}
        />
      )}

      {/* Main Circle & Inner UI */}
      <div
        className={`
    transition-all duration-700 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
    rounded-full z-20
    w-[94vw] h-[94vw] max-w-[390px] max-h-[390px]
    sm:w-[400px] sm:h-[400px] sm:max-w-[400px] sm:max-h-[400px]
    md:w-[480px] md:h-[480px] md:max-w-[480px] md:max-h-[480px]
    flex items-center justify-center cursor-pointer hover:shadow-gray-300 shadow-lg
  `}
        style={expanded ? { backdropFilter: "blur(16px)", filter: "url(#glass-distortion)", background: "rgb(86 81 81 / 25%)" } : { background: `url(${selectedGif}) center/cover` }}
        onClick={() => { if (!reminder) setShowReminder(true); }}
      >
        {/* Show clock or reminder */}
        {reminder ? (
          <div className={`flex flex-col items-center justify-center rounded-full w-full h-full backdrop-blur-sm bg-opacity-40 transition-colors`}>
            <span className="text-white text-lg mb-2">{reminder.time}</span>
            <span className="text-center text-white text-2xl mb-6 w-[350px]">{truncateWords(reminder.text, 15)}</span>
            <div className="flex gap-4 mt-2">
              <button className="px-4 py-2 rounded bg-black bg-opacity-50 text-white font-bold" onClick={clearReminder}>
                Clear Reminder
              </button>
              <button className="px-4 py-2 rounded bg-green-700 text-white font-bold" onClick={markDone}>
                Mark as Done
              </button>
            </div>
          </div>
        ) : (
          <div className={`flex flex-col items-center justify-center w-full h-full`}>
            <span suppressHydrationWarning={true} className="text-white font-mono text-2xl">{timeStr}</span>
            <span suppressHydrationWarning={true} className="text-white/80 text-lg mt-2 flex">{dateStr}</span>
          </div>
        )}
      </div>

      {/* Add reminder pop-up */}
      {showReminder && (
        <form onSubmit={handleSetReminder} className="fixed left-1/2 bottom-0 -translate-x-1/2 bg-black bg-opacity-95 rounded-t-2xl z-30 p-8 border-t border-gray-700 flex flex-col items-center w-full max-w-[550px] transition-transform duration-300">
          <span className="flex flex-col mb-6 gap-2">
            <div className="text-white font-extrabold text-3xl text-center">
              What do you want to be reminded today?
            </div>
            <div className="text-white/70 text-lg mb-3 text-center">
              Add time for when you need to be reminded
            </div>
          </span>
          <input
            type="text"
            placeholder="I need to..."
            className={`w-full mb-3 px-4 py-2 flex rounded-md bg-gray-900 text-white outline-none transition-all duration-150 ${reminderText ? "border-2 border-gray-800" : "border border-gray-900"}`}
            value={reminderText}
            onChange={e => setReminderText(e.target.value)}
            autoFocus
          />
          <span className="grid grid-cols-2 justify-around w-full">
            <span className="flex flex-col">
              <label htmlFor="reminderTime" className="text-white/60 block mb-1 text-sm">Set a time</label>
              <input
                type="time"
                className={`w-full mb-3 px-4 py-2 rounded-md bg-gray-900 text-white outline-none transition-all duration-150 ${reminderTime ? "border-2 border-gray-800" : "border border-gray-900"}`}
                value={reminderTime}
                onChange={e => setReminderTime(e.target.value)}
              />
            </span>
            <span className="flex flex-col items-end">
              <label htmlFor="reminderTime" className="text-white/60 block mb-1 text-sm">sound</label>
              {/* Sound toggle*/}
                <button
                  className={`w-12 h-7 rounded-full bg-neutral-900 border-2 border-neutral-700 p-1 flex items-center transition-colors duration-200 focus:outline-none`}
                  onClick={() => setSoundEnabled(x => !x)}
                  aria-label="Enable or disable reminder sound"
                >
                  <span
                    className={`
        block w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200
        ${soundEnabled ? 'translate-x-5' : ''}
      `}
                  />
                </button>
                <span className="text-white text-sm font-medium select-none">
                  Sound {soundEnabled ? 'On' : 'Off'}
                </span>
            </span>
          </span>
          <button
            type="submit"
            className="w-full py-2 rounded bg-white text-black font-bold hover:bg-gray-200 transition-colors mb-2 cursor-pointer"
          >
            Set Reminder
          </button>
          <button type="button" onClick={() => setShowReminder(false)} className="text-gray-300 mt-2 text-sm cursor-pointer no-underline hover:underline">
            Close
          </button>
        </form>
      )}

      {/* Reminder completed pop-up */}
      {completedAlert && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40 bg-zinc-900 text-white px-8 py-4 rounded-xl shadow-md border border-gray-700 flex flex-col items-center animate-fadein">
          <button
            onClick={cancelAlert}
            className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center text-white bg-transparent hover:text-red-400 text-[10px] focus:outline-none"
            aria-label="Close reminder alert"
          >✖</button>
          <span className="font-bold text-xs mb-1 flex flex-row">Reminder completed</span>
          <span className="italic text-gray-300 text-center break-words max-w-[85vw] sm:max-w-xs">{truncateWords(completedAlert, 15)}</span>
        </div>
      )}

      <style jsx global>{`
        .animate-slideup { animation: slideup .4s cubic-bezier(.4,2,.8,1) both; }
        @keyframes slideup { from { transform: translate(-50%,100%); } to { transform: translate(-50%,0); } }
        .animate-fadein { animation: fadein .4s cubic-bezier(.4,2,.8,1) both;}
        @keyframes fadein { from {opacity:0;} to {opacity:1;} }
      `}</style>
    </div>
  );
}

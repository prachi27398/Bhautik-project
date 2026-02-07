import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import "./app.css";

import cat1 from "./assets/cat1.gif";
import cat2 from "./assets/cat2.gif";
import cat3 from "./assets/cat3.gif";
import cat4 from "./assets/cat4.gif";
import cat5 from "./assets/cat5.gif";
import cat6 from "./assets/cat6.gif";

import clickSfx from "./assets/click.mp3";
import successSfx from "./assets/success.mp3";

const screens = [
  {
    key: "q1",
    img: cat1,
    title: "Do you love me?",
    sub: "~I'm all yours, Main sirf apka hun",
    buttons: ["Yes", "No"],
  },
  {
    key: "q2",
    img: cat2,
    title: "Please think again!",
    sub: "itni jaldi nahi matt bolo🥺",
    buttons: ["Yes", "No"],
  },
  {
    key: "q3",
    img: cat3,
    title: "Ek aur baar Soch lo!",
    sub: "kyu aisa kar rahi ho😣",
    buttons: ["Yes", "No"],
  },
  {
    key: "q4",
    img: cat4,
    title: "Baby Man jao na! Kitna bhav khaogi 😭",
    sub: "bhut git baat hai yaar🥺",
    buttons: ["Yes", "No", "Click Me"],
  },
  {
    key: "sorry",
    img: cat5,
    title: "Sorry baby tumhe pareshan kiya,\nPlease gussa mat karo...!",
    sub: "I'll never multithread on you❤️\nI'm async & I would wait for you💖",
    buttons: ["It's Okay 💗", "No"],
    runaway: true,
  },
  {
    key: "good",
    img: cat6,
    title: "Achi Bachiii🧚‍♀️",
    sub: "♥ ♥ ♥ ♥ ♥",
    buttons: ["It's Okay 💗"],
  },
];

export default function App() {
  const [step, setStep] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const boxRef = useRef(null);

  // Use Audio objects (works on iOS only after user interaction)
  const clickAudioRef = useRef(null);
  const successAudioRef = useRef(null);

  useEffect(() => {
    clickAudioRef.current = new Audio(clickSfx);
    successAudioRef.current = new Audio(successSfx);
    clickAudioRef.current.preload = "auto";
    successAudioRef.current.preload = "auto";
  }, []);

  const current = screens[step];

  useEffect(() => {
    // reset runaway button on step change
    setNoPos({ x: 0, y: 0 });
  }, [step]);

  const playClick = () => {
    const a = clickAudioRef.current;
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(() => {});
  };

  const playSuccess = () => {
    const a = successAudioRef.current;
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(() => {});
  };

  const heartConfetti = () => {
    // Heart text confetti
    const heart = confetti.shapeFromText({ text: "❤", scalar: 1.4 });

    // Burst 1
    confetti({
      particleCount: 70,
      spread: 70,
      startVelocity: 35,
      shapes: [heart],
      scalar: 1.2,
      origin: { y: 0.65 },
    });

    // Burst 2 (slightly delayed)
    setTimeout(() => {
      confetti({
        particleCount: 70,
        spread: 80,
        startVelocity: 32,
        shapes: [heart],
        scalar: 1.1,
        origin: { y: 0.6 },
      });
    }, 180);
  };

  const success = () => {
    playSuccess();
    heartConfetti();
    setStep(screens.length - 1);
  };

  const next = () => setStep((s) => Math.min(s + 1, screens.length - 1));

  const moveNo = () => {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box) return;
    const maxX = Math.max(0, box.width - 120);
    const maxY = Math.max(0, box.height - 60);

    setNoPos({
      x: Math.random() * maxX,
      y: Math.random() * maxY,
    });
  };

  const clickBtn = (btn) => {
    playClick();

    if (btn === "Yes") return success();
    if (btn === "Click Me") return setStep(4);
    if (btn.includes("It's Okay")) return success();

    if (btn === "No" && !current.runaway) return next();
    // If runaway No: do nothing (it runs away)
  };

  return (
    <div className="page">
      <div className="box" ref={boxRef}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            className="card"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.35 }}
          >
            <motion.img
              src={current.img}
              className="cat"
              alt="cat"
              initial={{ y: -6 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              draggable={false}
            />

            <h1>
              {current.title.split("\n").map((t, i) => (
                <span key={i}>
                  {t}
                  <br />
                </span>
              ))}
            </h1>

            <p>
              {current.sub.split("\n").map((t, i) => (
                <span key={i}>
                  {t}
                  <br />
                </span>
              ))}
            </p>

            <div className="buttons">
              {current.buttons.map((b) => {
                const isRunawayNo = b === "No" && current.runaway;

                if (isRunawayNo) {
                  return (
                    <button
                      key={b}
                      className="btn ghost runaway"
                      style={{ transform: `translate(${noPos.x}px, ${noPos.y}px)` }}
                      onMouseEnter={moveNo}
                      onTouchStart={moveNo}
                      onClick={(e) => {
                        e.preventDefault();
                        playClick();
                        moveNo();
                      }}
                      type="button"
                    >
                      No
                    </button>
                  );
                }

                const cls =
                  b === "Yes" || b.includes("It's Okay") ? "btn primary" : "btn ghost";

                return (
                  <motion.button
                    key={b}
                    className={cls}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => clickBtn(b)}
                    type="button"
                  >
                    {b}
                  </motion.button>
                );
              })}
            </div>

            {current.key === "good" && (
              <button className="restart" onClick={() => setStep(0)} type="button">
                Restart ↺
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

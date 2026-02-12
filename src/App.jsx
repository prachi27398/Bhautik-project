import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

import img1 from "./assets/1.jpeg";
import img2 from "./assets/2.jpeg";
import img3 from "./assets/3.jpeg";
import img4 from "./assets/4.jpeg";
import img5 from "./assets/5.jpeg";
import img6 from "./assets/6.jpeg";

export default function App() {
  // ⭐ Edit these only
  const content = useMemo(
    () => ({
      heroTitle: "Hey my love 💖",
      heroSubtitle: "I made this page just for you… open it slowly 😌✨",
      yourName: "Bhautik",
      hisName: "Shreya",
      loveLetterTitle: "My Love Letter 💌",
      loveLetter: [
        "From the day you came into my life, everything became softer, warmer, brighter.",
        "I feel safe with you. I smile more with you. I dream bigger with you.",
        "You are my favorite person, my calm, my home.",
        "And I want to choose you… today, tomorrow, and forever. 💍",
      ],
      photosTitle: "Our Memories 📸",
      photos: [
         img1,
         img2,
        // "/photos/3.jpeg",
        img3,
        img4,
        img5,
        img6,
        // "/photos/6.jpeg",
      ],
      proposalTitle: "One question… 🥺👉👈",
      proposalQuestion: "Will you marry me?",
      yesText: "YESSS 💍😍",
      noText: "No 😅",
      yesResultTitle: "AAAAH YOU SAID YES! 💖",
      yesResultMsg:
        "You just made me the happiest person ever. I love you endlessly. Let’s plan our forever. 🥹✨",
    }),
    []
  );

  const [letterOpen, setLetterOpen] = useState(false);
  const [saidYes, setSaidYes] = useState(false);

  // No button “escape” position
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const noWrapRef = useRef(null);

  // Little sparkle animation timing
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    // Start NO button centered initially
    setNoPos({ x: 0, y: 0 });
  }, []);

  function spawnSparkles() {
    const now = Date.now();
    const items = Array.from({ length: 10 }).map((_, i) => ({
      id: `${now}-${i}`,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      size: 6 + Math.random() * 10,
    }));
    setSparkles(items);
    setTimeout(() => setSparkles([]), 1300);
  }

  function moveNoButton() {
    const wrap = noWrapRef.current;
    if (!wrap) return;

    const rect = wrap.getBoundingClientRect();
    // Keep within the wrapper
    const maxX = Math.max(0, rect.width - 140);
    const maxY = Math.max(0, rect.height - 56);

    const x = (Math.random() - 0.5) * maxX;
    const y = (Math.random() - 0.5) * maxY;

    setNoPos({ x, y });
  }

  function onYes() {
    setSaidYes(true);
    spawnSparkles();
  }

  return (
    <div className="page">
      <FloatingHearts />

      {/* Sparkles */}
      <div className="sparkleLayer" aria-hidden="true">
        {sparkles.map((s) => (
          <span
            key={s.id}
            className="sparkle"
            style={{
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      <main className="container">
        <header className="hero">
          <div className="pill">✨ Made with love</div>
          <h1 className="title">{content.heroTitle}</h1>
          <p className="subtitle">{content.heroSubtitle}</p>

          <div className="names">
            <span className="nameTag">{content.yourName}</span>
            <span className="heartDot">💗</span>
            <span className="nameTag">{content.hisName}</span>
          </div>
        </header>

        {/* Love letter section */}
        <section className="card">
          <div className="row">
            <div className="left">
              <h2 className="h2">{content.loveLetterTitle}</h2>
              <p className="muted">
                Tap the envelope to open a message (and maybe steal a smile 😌).
              </p>

              <button
                className={`envelopeBtn ${letterOpen ? "open" : ""}`}
                onClick={() => setLetterOpen(true)}
                aria-label="Open love letter"
              >
                <span className="envIcon" aria-hidden="true">
                  ✉️
                </span>
                <span>Open</span>
              </button>
            </div>

            <div className="right">
              <div className={`letter ${letterOpen ? "show" : ""}`}>
                <div className="letterTop">
                  <div className="stamp">💌</div>
                  <button
                    className="closeBtn"
                    onClick={() => setLetterOpen(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="letterBody">
                  {content.loveLetter.map((line, idx) => (
                    <p key={idx} className="letterLine">
                      {line}
                    </p>
                  ))}
                </div>

                <div className="letterFooter">— with all my heart ❤️</div>
              </div>
            </div>
          </div>
        </section>

        {/* Photos */}
        <section className="card">
          <h2 className="h2">{content.photosTitle}</h2>
          <p className="muted">Our best moments, my favorite collection.</p>

          <div className="grid">
            {content.photos.map((src, idx) => (
              <figure key={idx} className="ph">
                <img src={src} alt={`memory-${idx + 1}`} loading="lazy" />
              </figure>
            ))}
          </div>
        </section>

        {/* Proposal */}
        <section className="card proposal">
          <h2 className="h2">{content.proposalTitle}</h2>
          <div className="bigQ">{content.proposalQuestion}</div>

          {!saidYes ? (
            <div className="btnArea" ref={noWrapRef}>
              <button className="btn yes" onClick={onYes}>
                {content.yesText}
              </button>

              <button
                className="btn no"
                style={{ transform: `translate(${noPos.x}px, ${noPos.y}px)` }}
                onMouseEnter={moveNoButton}
                onTouchStart={moveNoButton}
                onClick={moveNoButton}
                aria-label="No (try to catch me)"
              >
                {content.noText}
              </button>

              <div className="hint">
                (Try pressing “No” 😄)
              </div>
            </div>
          ) : (
            <div className="yesBox">
              <div className="yesTitle">{content.yesResultTitle}</div>
              <p className="yesMsg">{content.yesResultMsg}</p>
              <div className="ring" aria-hidden="true">💍✨💖</div>
            </div>
          )}
        </section>

        <footer className="footer">
         Bhautik ❤️ Shreya
        </footer>
      </main>
    </div>
  );
}

function FloatingHearts() {
  return (
    <div className="hearts" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, i) => (
        <span key={i} className="heart" style={{ "--i": i }} />
      ))}
    </div>
  );
}

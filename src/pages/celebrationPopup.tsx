import React, { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import congratsJif from '../assets/congratulations.gif';
import { BACKEND_URL } from "../constants";


interface Props {
  open: boolean;
  data: any;
  onClose: () => void;
}

const jifStyle : React.CSSProperties = {
height: "8rem",
width: "20rem",
padding: "10px",

}

const overlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const popUpStyle: React.CSSProperties = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  width: "500px",
  position: "relative",
  animation: "scaleUp 0.3s ease",
};

const closeButtonStyle: React.CSSProperties = {
  cursor: "pointer",
  border: "none",
  background: "transparent",
  fontSize: "18px",
  fontWeight: "bold",
};

const CelebrationPopup: React.FC<Props> = ({ open, data, onClose }) => {


  //    const popRef = useRef<HTMLAudioElement | null>(null);
  // const clapRef = useRef<HTMLAudioElement | null>(null);

  // 🔊 Initialize audio once
  // useEffect(() => {
  //   popRef.current = new Audio("/pop.mp3");
  //   clapRef.current = new Audio("/clap_sm.mp3");

  //   if (popRef.current) popRef.current.volume = 0.6;
  //   if (clapRef.current) clapRef.current.volume = 0.6;
  // }, []);


  // 🎉 Effects on popup open
  useEffect(() => {
    if (open) {

      // 🔊 PLAY SOUND (safe)
    //   const pop = new Audio("/pop.mp3");
    // //   pop.volume = 1;
    //     pop.play();

    //   setTimeout(() => {
    //     const clap = new Audio("/clap_sm.mp3");
    //     // clap.volume = 1;
    //     clap.play();
    //   }, 150);

      // 💥 CENTER BLAST
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 },
      });

      // 🎇 FIREWORK ROCKETS
      const duration = 2500;
      const end = Date.now() + duration;

      const firework = () => {
        confetti({
          particleCount: 6,
          angle: 90,
          spread: 30,
          startVelocity: 45,
          gravity: 0.8,
          ticks: 200,
          origin: {
            x: Math.random(),
            y: 1,
          },
        });

        if (Date.now() < end) {
          setTimeout(firework, 250);
        }
      };

      firework();

      // 🎆 TOP EXPLOSION
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 120,
          origin: { y: 0.2 },
        });
      }, 500);

      // ⏱ AUTO CLOSE
      const timer = setTimeout(() => {
        onClose();
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div style={overlay}>
      <div style={popUpStyle}>

        <div style={{ textAlign: "right" }}>
          <button style={closeButtonStyle} onClick={onClose}>X</button>
        </div>

        <div>
              <img src={congratsJif} alt="logo" style={jifStyle} />
            </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            


          <img
            // src={`https://storage.googleapis.com/auction-players/${data?.team_logo}`}
            src={BACKEND_URL + '/player_images/' + data.team_logo} 
            alt="logo"
            style={{ width: "5rem", height: "5rem", borderRadius: "8px" }}
          />

          <span
            style={{
              padding: "10px",
              fontWeight: "bold",
              fontSize: "28px",
              fontFamily: "Georgia, serif",
            }}
          >
            {data?.team_name}
          </span>
        </div>

        <h2 style={{ marginTop: "20px" }}>🏆 Completed Auction 🏆 </h2>

      </div>

      <style>
        {`
          @keyframes scaleUp {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }

          canvas {
            position: fixed !important;
            z-index: 2000 !important;
            pointer-events: none;
          }
        `}
      </style>
    </div>
  );
};

export default CelebrationPopup;
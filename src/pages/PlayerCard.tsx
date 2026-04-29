import React, { CSSProperties, useEffect,useState } from "react";

interface Props {
  player: any;
}

const FifaGoldCard: React.FC<Props> = ({player}) => {

  const [currentPlayer , setCurrentPlayer] = useState(player);


  useEffect(() => {
         setCurrentPlayer(player)
  
      }, [player]);

  const container: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding:'20px',
    background: "#e5e7eb", // light bg to highlight gold
  };

  const card: CSSProperties = {
    width: "clamp(320px, 60vw, 700px)",
    height: "clamp(180px, 25vw, 260px)",
    display: "flex",
    borderRadius: "20px",
    overflow: "hidden",
    position: "relative",

    // 🟡 GOLD GRADIENT (main)
    background:
      "linear-gradient(135deg, #f9d976 0%, #f39f86 40%, #f6c453 100%)",

    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
  };

  // ✨ Shine overlay
  const shine: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(120deg, rgba(255,255,255,0.4) 0%, transparent 40%)",
    pointerEvents: "none",
  };

  const left: CSSProperties = {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const image: CSSProperties = {
    width: "90%",
    height: "90%",
    objectFit: "contain",
  };

  const right: CSSProperties = {
    flex: 2,
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    color: "#2d2d2d", // dark text for gold bg
  };

  const topRow: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const rating: CSSProperties = {
    fontSize: "clamp(22px, 3vw, 28px)",
    fontWeight: "bold",
  };

  const name: CSSProperties = {
    fontSize: "clamp(16px, 2vw, 20px)",
    fontWeight: "bold",
    letterSpacing: "1px",
  };

  const role: CSSProperties = {
    fontSize: "clamp(12px, 1.5vw, 14px)",
    marginTop: "2px",
  };

  const statsGrid: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(1, 1fr)",
    gap: "8px",
    marginTop: "10px",
  };

  const stat: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "clamp(12px, 1.5vw, 14px)",
  };

  const statValue: CSSProperties = {
    fontWeight: "bold",
  };

  const capitalizeFirst = (str: any) => {
        if (!str) return "";
        str = str.toLowerCase();
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

  return (
    <div style={container}>
      <div
        style={card}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "scale(1.03)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "scale(1)")
        }
      >
        {/* Shine */}
        <div style={shine} />

        {/* LEFT IMAGE */}
        <div style={left}>
          <img
            src={`https://storage.googleapis.com/rajas_pl/${currentPlayer.profile_image}`}
            alt="player"
            style={image}
          />
        </div>

        {/* RIGHT CONTENT */}
        <div style={right}>
          {/* Top */}
          <div style={topRow}>
            <div>
              <div style={rating}>{currentPlayer.id}</div>
              <div style={role}>{currentPlayer.player_role}</div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={name}>{currentPlayer.fullname.toUpperCase()}</div>
              <div style={role}>{capitalizeFirst(currentPlayer.location)}</div>
            </div>
          </div>

          {/* Stats */}
          <div style={statsGrid}>
            <div style={stat}><span>Batting Style</span><span style={statValue}>{currentPlayer.batting_style}</span></div>
            <div style={stat}><span>Bowling Style</span><span style={statValue}>{currentPlayer.bowling_style}</span></div>
            <div style={stat}><span>Contact No</span><span style={statValue}>{currentPlayer.contact_no}</span></div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default FifaGoldCard;
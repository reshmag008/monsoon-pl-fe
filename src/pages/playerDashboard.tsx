import React, { CSSProperties } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";

type Player = {
  id: number;
  name: string;
  status: "sold" | "unsold" | "pending";
  image: string;
};

const players: Player[] = [
  { id: 1, name: "Messi", status: "sold", image: "https://via.placeholder.com/150" },
  { id: 2, name: "Ronaldo", status: "unsold", image: "https://via.placeholder.com/150" },
  { id: 3, name: "Neymar", status: "pending", image: "https://via.placeholder.com/150" },
  { id: 4, name: "Mbappe", status: "sold", image: "https://via.placeholder.com/150" },
];

const PlayerDashboard: React.FC = () => {

  const soldCount = players.filter(p => p.status === "sold").length;
  const unsoldCount = players.filter(p => p.status === "unsold").length;
  const pendingCount = players.filter(p => p.status === "pending").length;

  /* ---------------- Styles ---------------- */

const pageWrapper: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start", // keep top aligned (not vertical center)
  width: "100%",
};

const container: CSSProperties = {
  padding: "20px",
  fontFamily: "Arial, sans-serif",
  width: "100%",
  maxWidth: "900px", // controls centered width
};

  const topbar: CSSProperties = {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap",
  };

  const cardBase: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 15px",
    borderRadius: "10px",
    fontWeight: "bold",
    color: "#fff",
  };

  const soldStyle: CSSProperties = {
    ...cardBase,
    backgroundColor: "#28a745",
  };

  const unsoldStyle: CSSProperties = {
    ...cardBase,
    backgroundColor: "#dc3545",
  };

  const pendingStyle: CSSProperties = {
    ...cardBase,
    backgroundColor: "#ffc107",
    color: "#000",
  };

  const grid: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "15px",
  };

  const playerCard: CSSProperties = {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "10px",
    textAlign: "center",
    background: "#fff",
  };

  const imageStyle: CSSProperties = {
    width: "100%",
    borderRadius: "8px",
  };

  const statusText = (status: string): CSSProperties => ({
    fontWeight: "bold",
    marginTop: "5px",
    color:
      status === "sold"
        ? "green"
        : status === "unsold"
        ? "red"
        : "orange",
  });

  /* ---------------- UI ---------------- */

  return (
    <div style={pageWrapper}>
    <div style={container}>

      {/* Top Bar */}
      <div style={topbar}>
        <div style={soldStyle}>
          <CheckCircle size={20} />
          <span>Sold: {soldCount}</span>
        </div>

        <div style={unsoldStyle}>
          <XCircle size={20} />
          <span>Unsold: {unsoldCount}</span>
        </div>

        <div style={pendingStyle}>
          <Clock size={20} />
          <span>Pending: {pendingCount}</span>
        </div>
      </div>
      
    </div>
    </div>
  );
};

export default PlayerDashboard;
import React from "react";
import { TOTAL_PLAYER } from "../constants";

interface TeamTableProps {
  teams: any[];
}

const TeamTable: React.FC<TeamTableProps> = ({ teams }) => {
  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          {/* <th style={thStyle}></th> */}
          <th style={thStyle} >Team</th>
          <th style={thStyle} >Players</th>
          <th style={thStyle} >Points</th>
          <th style={thStyle} >Max Bid</th>
        </tr>
      </thead>
      <tbody>
        {teams.map((team, index) => (
  team.player_count != TOTAL_PLAYER && (
    <tr key={index}>
      <td style={tdStyle}>{team.team_name}</td>
      <td style={tdStyle}>{team.player_count}</td>
      <td style={tdStyle}>{team.total_points}</td>
      <td style={tdStyle}>{team.max_bid_amount}</td>
    </tr>
  )
))}
      </tbody>
    </table>
  );

  
};

const imageStyle: React.CSSProperties = {
  height: "2rem",
  width: "2rem",
  objectFit: "cover",
border: "1px solid #6a0dad",
  padding: "10px",
  fontSize: "14px",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#111",
  color: "white",
};

const thStyle: React.CSSProperties = {
  border: "2px solid #6a0dad",
  padding: "12px",
  background: "linear-gradient(135deg, #6a0dad, #000)",
  color: "white",
  fontWeight : "800",
  textAlign: "left",
  fontSize: "18px",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #6a0dad",
  padding: "10px",
  fontWeight : "800",
  fontSize: "23px",
};


export default TeamTable;

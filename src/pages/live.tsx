import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BACKEND_URL, TOTAL_PLAYER, roomId } from "../constants";
import PlayerService from "../services/PlayerService";
import bellGif from '../assets/bell.gif';
import congratsJif from '../assets/congratulations.gif';
import clapJif from '../assets/clap.gif'
import playerBg from '../assets/aution_card.jpeg'
import TeamTable from "./TeamTable";
import Accordion from 'react-bootstrap/Accordion';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Loader from "react-js-loader";
import bklogo from '../assets/bk_logo.jpeg'
import auctionIcon from '../assets/icon.png'


const PlayerAuctionView: React.FC = () => {
  const isMobile = window.innerWidth < 768;


  const teamColors = [
  "#ec1c24",
 "#fdb913",
 "#004ba0",
   "#3a225d",
 "#ea1a85",
 "#f26522",
   "#17449b",
   "#d71920",
  "#1c2c5b",
   "#00a6e7",
   "#00C853",
   "#00B8D4"
  ];



const [socket, setSocket] = useState<any>(null);
    const [currentBidPlayer, setCurrentPlayer] = useState<any>({});
    const [currentBid, setCurrentBid] = useState<any>({});
    const [currentCall, setCurrentCall] = useState<any>({});
    const [soldPlayer, setSoldPlayer] = useState<any>({});
    const [allSoldPlayers, setAllSoldPlayer] = useState<any>([])
    const [popUpContent, setPopUpContent] = useState<any>({})
    const [openPopUp, setOpenPopUp] = useState(false);
    const [allTeams, setAllTeams] = useState<any>([])
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

     const [soldCount, setSoldCount] = useState(0);
        const [unSoldCount, setUnSoldCount] = useState(0);
        const [pendingCount, setPendingCount] = useState(0);

    const [playersByTeam, setPlayersByTeam] = useState<any>({});
  const [loadingTeam, setLoadingTeam] = useState<string | null>(null);


    useEffect(() => {
  const newSocket = io(BACKEND_URL, {
    transports: ["websocket"], // 👈 prefer websocket only
    withCredentials: true,

    reconnection: true,
    reconnectionAttempts: Infinity,   // 👈 keep trying
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  setSocket(newSocket);

  getSoldPlayers();
  GetAllTeams();
  GetAllPlayers();

  // 👇 Connection logs (VERY IMPORTANT)
  newSocket.on("connect", () => {
    console.log("Connected:", newSocket.id);
  });

  newSocket.on("disconnect", (reason) => {
    console.log("Disconnected:", reason);
  });

  newSocket.on("reconnect_attempt", () => {
    console.log("Reconnecting...");
  });

  newSocket.on("reconnect", () => {
    console.log("Reconnected!");

    // 👇 Re-fetch data after reconnect
    getSoldPlayers();
    GetAllTeams();
    GetAllPlayers();
  });


   

  const handleFocus = () => {
      if (!newSocket.connected) {
        console.log("Focus reconnect...");
        newSocket.connect();
      }
    };
  
    const interval = setInterval(() => {
      if (!newSocket.connected) {
        console.log("Heartbeat reconnect...");
        newSocket.connect();
      }
    }, 5000);
  
  
    // ✅ 🔥 HANDLE MOBILE SCREEN OFF / ON
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("App came back to foreground");
  
        if (!newSocket.connected) {
          console.log("Manually reconnecting...");
          newSocket.connect();
        }
      }
    };
  
    document.addEventListener("visibilitychange", handleVisibilityChange);
  
    return () => {
      clearInterval(interval); 
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      newSocket.off();
      newSocket.disconnect();
    };
  }, []);


  const GetAllPlayers = async () => {
          try {
              let params = {
                  offset : 0,
                  teamId : null
              }
              PlayerService().getAllPlayers(params).then((response:any)=>{
                  setSoldCount(response?.data?.soldPlayerCount);
                  setUnSoldCount(response?.data?.unSoldPlayerCount);
                  setPendingCount(response?.data?.pendingPlayerCount);

              })
            }catch(err){

            }
        }



  
      const parseData = (data: any) => {
    return typeof data === "string" ? JSON.parse(data) : data;
  };
  
      useEffect(() => {
          if (socket) {
  
              socket.emit("join-room", roomId);
  
              socket.on('current_bid', (message:any)=>{
                  console.log("message== ", message);
                  // setCurrentBid(message)
                  setCurrentBid(parseData(message));
              })
  
              // socket.join(roomId);
              socket.on("current_player", (message: any) => {
                  console.log("current_player ---- ", message);
                  setSoldPlayer({});
                  setCurrentCall({})
                  setCurrentPlayer(parseData(message));
              });
              socket.on("team_call", (message: any) => {
                  console.log("team_call ---- ", message);
                  setSoldPlayer({});
                  setCurrentCall(parseData(message));
              });
              socket.on("player_sold", (message: any) => {
                  console.log("player_sold ---- ", message);
                  let player = JSON.parse(message)
                  setSoldPlayer(player);
                  setCurrentCall({})
                  // toast.success(`${player.player_name} sold to ${player.team_name} for ${player.bid_amount}`)
                  getSoldPlayers();
                  GetAllTeams();
                  GetAllPlayers();
              });
  
              socket.on("team_complete", (message: any) => {
                  setOpenPopUp(true);
                  setPopUpContent(JSON.parse(message));
              })
  
              socket.on("close_popup", (message: any) => {
                  setOpenPopUp(false);
              })
  
  
          }
      }, [socket]);
  
  
      const GetAllTeams = () => {
          try {
              PlayerService()
                  .getAllTeams()
                  .then((response: any) => {
                      setAllTeams(response?.data);
                  });
          } catch (error) {
              console.error("Error fetching players:", error);
          }
      };
  
      const capitalizeFirst = (str: any) => {
          if (!str) return "";
          str = str.toLowerCase();
          return str.charAt(0).toUpperCase() + str.slice(1);
      }
  
  
  
      const getSoldPlayers = () => {
  
          PlayerService().getSoldPlayers().then((response: any) => {
              setAllSoldPlayer(response?.data?.players);
          })
      }
  
  
      const handleAccordionSelect = async (eventKey: any) => {
        console.log("eventKey== ",eventKey)
      if (!eventKey ) return;
  
      try {
        if(!playersByTeam[eventKey]){
          setIsLoading(true)
        }
        
        setLoadingTeam(eventKey);
        let params = {
            offset : 0,
            teamId : eventKey
        }
        PlayerService().getAllPlayers(params).then((response:any)=>{
            setIsLoading(false)
            setLoadingTeam(null);
            let playerList = response?.data?.players;
            console.log("playerList== ",playerList)
            setPlayersByTeam((prev: any) => ({
          ...prev,
          [eventKey]: playerList,
        }));
        })
        
      } finally {
        setLoadingTeam(null);
      }
    };
  

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "#000",
    padding: isMobile ? "12px" : "20px",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  };

  const topBarStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    gap: isMobile ? "9px" : "20px",
    marginBottom: "25px",
    flexWrap: "wrap",
  };

  const countCardStyle: React.CSSProperties = {
    background: "#111",
    border: "2px solid gold",
    borderRadius: "14px",
    padding: isMobile ? "8px 16px" : "15px 25px",
    minWidth: isMobile ? "90px" : "130px",
    textAlign: "center",
    boxShadow: "0 0 15px rgba(255,215,0,0.2)",
  };

  const countLabelStyle: React.CSSProperties = {
    color: "gold",
    fontSize: isMobile ? "12px" : "16px",
    fontWeight: "bold",
    marginBottom: "8px",
  };

  const countValueStyle: React.CSSProperties = {
    fontSize: isMobile ? "22px" : "32px",
    fontWeight: "bold",
  };

  const playerCardStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row", // always side-by-side
    background: "#111",
    border: "2px solid rgba(255,215,0,0.4)",
    borderRadius: "20px",
    padding: isMobile ? "12px" : "20px",
    width: isMobile ? "93%" : "100%",
    maxWidth: "1200px",
    margin: "auto",
    minHeight: isMobile ? "320px" : "500px",
    boxShadow: "0 0 25px rgba(255,215,0,0.15)",
    overflow: "hidden",
  };

  /* LEFT SIDE - PHOTO (50%) */
  const imageSectionStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingRight: isMobile ? "10px" : "20px",
  };

  const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    maxWidth: isMobile ? "180px" : "450px",
    maxHeight: isMobile ? "250px" : "500px",
    objectFit: "cover",
    borderRadius: "20px",
    border: isMobile
      ? "3px solid gold"
      : "5px solid gold",
    boxShadow:
      "0 0 15px gold, 0 0 35px rgba(255,215,0,0.5)",
  };


   const logoStyle: React.CSSProperties = {
    marginTop : isMobile ? "15px" : "0px",
  width: isMobile ? "45px" : "109px",
  height: isMobile ? "47px" : "108px",
  objectFit: "contain",
  borderRadius: "10px",
    border: isMobile
      ? "1px solid gold"
      : "3px solid gold",
    boxShadow:
      "0 0 15px gold, 0 0 35px rgba(255,215,0,0.5)",
};


  /* RIGHT SIDE - DETAILS (50%) */
  const detailsSectionStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: isMobile ? "10px" : "20px",
    minWidth: 0,
  };

  const playerNameStyle: React.CSSProperties = {
    color: "gold",
    fontSize: isMobile ? "22px" : "48px",
    fontWeight: "bold",
    marginBottom: isMobile ? "15px" : "30px",
    textTransform: "uppercase",
    wordBreak: "break-word",
  };

  const detailsGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile
      ? "1fr"
      : "repeat(2, 1fr)",
    gap: isMobile ? "12px" : "25px",
  };

  const labelStyle: React.CSSProperties = {
    color: "#aaa",
    fontSize: isMobile ? "11px" : "14px",
    marginBottom: "4px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  };

  const valueStyle: React.CSSProperties = {
    color: "#fff",
    fontSize: isMobile ? "14px" : "22px",
    fontWeight: "600",
    wordBreak: "break-word",
  };


  const teamListContainer: React.CSSProperties = {
    // display: "grid",
    // gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
    // gap: "2rem",
    // maxWidth: "63rem",
    // margin: "0 auto",
    // padding: "1rem",
    marginTop : "15px",
    marginLeft : '15px',
    background : 'black',
    color : 'gold'
  };

  const rowGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "3fr 1fr 1fr 1fr",
    alignItems: "center",
    width: "100%",
    columnGap: "12px",
  };

  const bodyCell: React.CSSProperties = {
    fontSize: "14px",
  };


  return (
    <div style={pageStyle}>
      {/* TOP BAR */}
      <div style={topBarStyle}>

        <img
            src={bklogo}
            alt="auction"
            style={logoStyle}
        />

        
        <div style={countCardStyle}>
          <div style={countLabelStyle}>SOLD</div>
          <div
            style={{
              ...countValueStyle,
              color: "#00ff7f",
            }}
          >
            {soldCount}
          </div>
        </div>

        <div style={countCardStyle}>
          <div style={countLabelStyle}>UNSOLD</div>
          <div
            style={{
              ...countValueStyle,
              color: "#ff4d4d",
            }}
          >
            {unSoldCount}
          </div>
        </div>

        <div style={countCardStyle}>
          <div style={countLabelStyle}>PENDING</div>
          <div
            style={{
              ...countValueStyle,
              color: "#ffc107",
            }}
          >
            {pendingCount}
          </div>
        </div>


        <img
            src={auctionIcon}
            alt="auction"
            style={logoStyle}
        />


      </div>

      {/* PLAYER CARD */}
      {currentBidPlayer &&
      <div style={playerCardStyle}>
        {/* LEFT - PHOTO */}
        <div style={imageSectionStyle}>
          <img
            src={`https://storage.googleapis.com/rajas_pl/${currentBidPlayer?.profile_image}`}
            alt={currentBidPlayer?.fullname}
            style={imageStyle}
          />
        </div>

        {/* RIGHT - DETAILS */}
        <div style={detailsSectionStyle}>
          <h1 style={playerNameStyle}>
            {currentBidPlayer?.fullname}
          </h1>

          <div style={detailsGridStyle}>

            <div>
              <div style={labelStyle}>ID</div>
              <div style={valueStyle}>
                {currentBidPlayer?.id}
              </div>
            </div>


            <div>
              <div style={labelStyle}>Role</div>
              <div style={valueStyle}>
                {currentBidPlayer?.player_role}
              </div>
            </div>

            

            <div>
              <div style={labelStyle}>Batting</div>
              <div style={valueStyle}>
                {currentBidPlayer?.batting_style}
              </div>
            </div>

            <div>
              <div style={labelStyle}>Bowling</div>
              <div style={valueStyle}>
                {currentBidPlayer?.bowling_style}
              </div>
            </div>

            
          </div>
        </div>
      </div>
    }




      <div style={teamListContainer}>
  <Accordion onSelect={handleAccordionSelect}>
    {/* Table Header */}
    {allTeams.map((team: any, teamIndex:any) => {
      const teamColor =
        teamColors[
          teamIndex
        ] || "#6c757d";

      return (
        <Accordion.Item
          eventKey={team.id}
          key={team.team_id}
          style={{
            border: "none",
            marginBottom: "15px",
            borderRadius: "18px",
            overflow: "hidden",
            background: "transparent",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.2)",
          }}
        >
          {/* Accordion Header */}
          <Accordion.Header>
            <div
              style={{
                ...rowGrid,
                width: "100%",
                padding: "18px",
                background: `linear-gradient(135deg, ${teamColor}, #111)`,
                color: "white",
                fontWeight: 700,
                borderRadius: "12px",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                

                <div>
                  {team.team_name}
                </div>
              </div>

              <div>
                {team.player_count}/
                {TOTAL_PLAYER}
              </div>

              <div>
                {team.total_points}
              </div>

              <div>
                
                {team.max_bid_amount?.toLocaleString()}
              </div>

              
            </div>
          </Accordion.Header>

          {/* Accordion Body */}
          <Accordion.Body
            style={{
              background: "#121212",
              color: "#fff",
              border:
                "1px solid rgba(255,255,255,0.08)",
              borderTop: "none",
              padding: "16px",
            }}
          >
            {/* Header */}
            <div
              style={{
                ...rowGrid,
                fontWeight: 700,
                padding: "12px",
                background:
                  "rgba(255,255,255,0.08)",
                borderRadius: "10px",
                marginBottom: "12px",
                color: teamColor,
              }}
            >
              <div>Player</div>
              <div>ID</div>
              <div>Role</div>
              <div>Points</div>
            </div>

            {/* Loader */}
            {isLoading && (
              <Loader
                type="spinner-cub"
                bgColor="gold"
                color="gold"
                title="Loading..."
                size={50}
              />
            )}

            {/* Players */}
            {playersByTeam[
              team.id
            ]?.map(
              (
                player: any,
                index: number
              ) => (
                <div
                  key={player.id}
                  style={{
                    ...rowGrid,
                    padding: "14px",
                    background:
                      index % 2 === 0
                        ? "#1a1a1a"
                        : "#222",
                    borderRadius: "10px",
                    marginBottom: "8px",
                    color: `${teamColors[teamIndex]}`,
                    transition:
                      "0.3s ease",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    {
                      player?.fullname
                    }
                  </div>

                  <div>
                    {player?.id}
                  </div>

                  <div>
                    {
                      player?.player_role
                    }
                  </div>

                  <div
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {player?.bid_amount?.toLocaleString()}
                  </div>
                </div>
              )
            )}
          </Accordion.Body>
        </Accordion.Item>
      );
    })}
  </Accordion>
</div>                  



    </div>
  );
};

export default PlayerAuctionView;
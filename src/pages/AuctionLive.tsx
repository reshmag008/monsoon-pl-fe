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
import PlayerCard from "./PlayerCard";
const isMobile = window.matchMedia("(max-width: 600px)").matches;



const AuctionLive: React.FC = () => {

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

  // 👇 Initial API calls
  getSoldPlayers();
  GetAllTeams();

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




    return (
        <div>
            <div >
                            {currentBidPlayer && currentBidPlayer.id && (
                                // <div style={players__card__wrap}>
                                //   <div style={{display:'flex'}}>
                                //     <img  src={`https://storage.googleapis.com/auction-players/${currentBidPlayer.profile_image}`} alt="logo" style={profileImageStyle}/>
            
                                // </div>
            
                                //     <div style={idStyle}>
                                //       <span>{currentBidPlayer.id} </span>
                                //     </div>
            
                                   
                                //     <div style={{ display: "flex" ,marginLeft:'271px', marginTop:'-118px', width:'107px'}}>
                                //         <span style={spanText}>{currentBidPlayer.player_role}</span>
                                //     </div>
            
                                //     <div style={{ display: "flex" ,marginLeft:'271px', marginTop:'-2px', width:'107px'}}>
                                //         <span
                                //         style={spanText}
                                //         >
                                //         {currentBidPlayer.batting_style}
                                //         </span>
                                //     </div>
            
                                //     <div style={{ display: "flex",marginLeft:'271px', marginTop:'-3px', width:'780px' }}>
                                //         <span
                                //         style={spanText}
                                //         >
                                //         {currentBidPlayer.bowling_style}
                                //         </span>
                                //     </div>
            
                                //     <div style={{display: 'flex', marginLeft:'271px', marginTop:'-3px', width:'780px'}}>
                                //         <span style={spanText}> {capitalizeFirst(currentBidPlayer.location)}</span>
                                //     </div>
            
            
                                //     <div style={{ display: "flex",marginLeft:'271px', marginTop:'-3px', width:'76px' }}>
                                //         <span style={spanText}>
                                //         {currentBidPlayer.contact_no}
                                //         </span>
                                //     </div>

                                //      <div style={{ display: 'flex', textAlign: 'left', width: '129px', marginLeft: '241px',marginTop:'1px' }}>
                                //       <span style={idText1}>{currentBidPlayer.fullname.toUpperCase()} </span>
                                //     </div>
                                    
            
                                    
                                    
                                // <div style={cardFooter}></div>
                                // </div>
                                <PlayerCard player={currentBidPlayer}></PlayerCard>
                            )}
                        </div>

                        {currentCall && currentCall.team_name &&

                        <div style={{display:'flex', alignItems:'center'}}>
                            <img src={bellGif} alt="logo" style={bellGifStyle} />
                            <div>Current Bid : {currentCall.team_name} | Points : {currentCall.amount} </div>
                        </div>
                        }


                        {soldPlayer && soldPlayer.team_name &&
                            <div style={{display:'flex', alignItems:'center'}}>
                            <img src={bellGif} alt="logo" style={bellGifStyle} />
                            <div>Player Sold to {soldPlayer.team_name} for {soldPlayer.bid_amount} points</div>
                        </div>
                        }


                        <div style={teamListContainer}>
     
      <Accordion onSelect={handleAccordionSelect}>
        <div style={rowGrid}>
          <div>Team Name</div>
          <div>Player Count</div>
          <div>Total Points</div>
          <div>Max Bid Amount</div>
          <div></div>
        </div>
  {allTeams.map((team: any) => (
    <Accordion.Item eventKey={team.id} key={team.team_id} style={{background : 'yellow', color : 'black'}}>
      <Accordion.Header>
        <div style={{...rowGrid}}>
          <div>{team.team_name}</div>
          <div>{team.player_count}/{TOTAL_PLAYER}</div>
          <div>{team.total_points}</div>
          <div>{team.max_bid_amount}</div>
        </div>
      </Accordion.Header>

      <Accordion.Body>
        {/* Player table header */}
        <div
          style={{
            ...rowGrid,
            fontWeight: 600,
            paddingBottom: "8px",
            borderBottom: "1px solid #eee",
          }}
        > 
          
          <div>Player</div>
          <div>ID</div>
          <div>Role</div>
          <div>Points</div>
        </div>

        {/* Player rows */}
        {isLoading && <Loader type="spinner-cub" bgColor={'green'} color={'green'} title={"Loading..."} size={50} />}

        {playersByTeam[team.id]?.map((player: any) => (
          <div
            key={player.id}
            style={{
              ...rowGrid,
              padding: "6px 0",
              borderBottom: "1px solid #f2f2f2",
              background : 'black',
              color : 'white'
            }}
          >
            <div style={bodyCell}>{player.fullname}</div>
            <div style={bodyCell}>{player.id}</div>
            <div style={bodyCell}>{player.player_role}</div>
            <div style={bodyCell}>{player.bid_amount}</div>
            
          </div>
        ))}
      </Accordion.Body>
    </Accordion.Item>
  ))}
</Accordion>

    </div>

                                  
                   
                  </div>

        // </div>
    )
}

const rowGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "3fr 1fr 1fr 1fr",
  alignItems: "center",
  width: "100%",
  columnGap: "12px",
};

const headerCell: React.CSSProperties = {
  fontWeight: 600,
};

const bodyCell: React.CSSProperties = {
  fontSize: "14px",
};

const thStyle: React.CSSProperties = {
  border: "2px solid #6a0dad",
  padding: "12px",
  background: "linear-gradient(135deg, #6a0dad, #000)",
  color: "white",
  fontSize: "16px",
  textAlign: "left",
};
const tdStyle: React.CSSProperties = {
  // border: "1px solid #6a0dad",
  padding: "10px",
  fontSize: "14px",
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
  color : 'white'
};


const teamCallStyle : React.CSSProperties = {
    display:'flex',
    justifyContent:'center',
    // marginLeft:'65px',
    padding:'10px'

}

const bellGifStyle: React.CSSProperties = {
  height: "2rem",
  width: "2rem",
  objectFit: "cover",
padding:'5px'
};



const imageStyle: React.CSSProperties = {
  height: "7rem",
  width: "7rem",
//   objectFit: "cover",
padding:'10px'
};

const playerListContainer: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(26rem, 1fr))",
  gap: "2rem",
  maxWidth: "120rem",
  margin: "0 auto",
  padding: "2rem",
};

const cardHeaderTextStyle: React.CSSProperties = {
  gap: "2rem",
  cursor: "pointer",
  color: "white",
  textAlign: "left",
  fontSize: "30px",
  textShadow: "1px 1px 0 #999, 2px 2px 0 #999, 3px 3px 0 #999",
};

const cardBodyTextStyle: React.CSSProperties = {
  color: "white",
  textAlign: "left",
  fontSize: "26px",
};

const imageStyle1: React.CSSProperties = {
  height: "7rem",
  width: "7rem",
  padding: "10px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "none",
};

const accTeamImg: React.CSSProperties = {
  height: "3rem",
  width: "3rem",
  padding: "5px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "none",
};


const spanText1 : React.CSSProperties = {

  // marginTop: "65px",
  fontWeight: "bold",
  fontSize: "14px",
  // paddingLeft: "10px",
  // marginLeft : '30px',
  color : 'black',
  // width:'780px',
  // textAlign : 'center'
};

const spanText: React.CSSProperties = {

  // marginTop: "65px",
  fontWeight: "bold",
  fontSize: "15px",
  // paddingLeft: "10px",
  // marginLeft : '30px',
  color : 'black',
  // width:'780px',
  // textAlign : 'center'
};

const idText: React.CSSProperties = {
  //  background: "linear-gradient(to bottom, purple, black)",
  //   WebkitBackgroundClip: "text",
  //   WebkitTextFillColor: "transparent",
  // marginTop: '-471px',
  fontWeight: 'bold',
  fontSize: '15px',
  // paddingLeft : '277px',
  color: "black",
  width: "48px",
  height: "22px",
  // marginLeft : '-114px',
  marginTop : '-83px'
}

const idText1: React.CSSProperties = {
  //  background: "linear-gradient(to bottom, purple, black)",
  //   WebkitBackgroundClip: "text",
  //   WebkitTextFillColor: "transparent",
  // marginTop: '-471px',
  fontWeight: 'bold',
  fontSize: '15px',
  // paddingLeft : '277px',
  color: "#0E0E55",
  width: "159px",
  height: "22px",
  // marginLeft : '-114px',

}


const fullNameText: React.CSSProperties = {
  marginTop: "10px",
  fontWeight: "bold",
  fontSize: "15px",
  paddingLeft: "10px",
};

const svgStyle: React.CSSProperties = {
  height: "1rem",
  width: "1rem",
  objectFit: "cover",
  padding: "10px",
  filter:
    "invert(85%) sepia(20%) saturate(150%) hue-rotate(200deg) brightness(120%) contrast(120%)",
};

// const profileImageStyle: React.CSSProperties = {
//   height: "24rem",
//   width: "19rem",
//   // padding: "5px",
//   // alignItems: "flex-start",
//   // display: "grid",
//   marginTop: "236px",
//   objectFit: "cover",
//   // boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//   // borderRadius: "7px",
//   marginLeft: "122px",
//   // filter: "grayscale(50%)",
//   //   border: "5px solid transparent",
// };

// const profileImageStyle: React.CSSProperties = {
//   width: "100%",
//   maxWidth: "98px",   // controls max size
//   height: "auto",
//   aspectRatio: "3 / 4", // keeps same proportion
//   objectFit: "cover",

//   marginTop: "20%",
//   marginLeft: "7.9%",
//   marginRight: "auto",
//   display: "block",
// };

const profileImageStyle: React.CSSProperties = {
  width: "clamp(5rem, 24vw, 19rem)",
  aspectRatio: "3 / 3.8",
  objectFit: "cover",

  marginTop: "clamp(3rem, 19.2vw, 15rem)",   // ⬇️ move down
  marginLeft: "clamp(1.5rem, 7.3vw, 9rem)", // ⬅️ move left

  display: "block",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const idStyle: React.CSSProperties = {
  position: "absolute",                 // REQUIRED
  bottom: "76%",                        // relative to image height
  left: "49%",
  transform: "translateX(-50%)",
  color: "#0E0E55",
  fontWeight: 'bolder',
  fontSize: "clamp(25px, 0vw, 30px)",   // responsive font
  textAlign: "left",
  // padding: "6px 14px",
  // borderRadius: "20px",
  maxWidth: "90%",
  whiteSpace: "nowrap",
  // overflow: "hidden",
  // textOverflow: "ellipsis",
  zIndex: 2,
  width : '99px'
};


const players__card__wrap: React.CSSProperties = {
  gap: "2rem",
  backgroundImage: `url(${playerBg})`,
  backgroundSize: 'cover',
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  border: "1px solid #ccc",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  overflow:'hidden',
  height : isMobile ? '233px' : '666px'
}

const cardHeader: React.CSSProperties = {
  display: "flex",
};

const cardFooter: React.CSSProperties = {
  display: "flex",
  backgroundColor: "purple",
  marginBottom: "10px",
};

const playerCountStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const displayMargin : React.CSSProperties = {
  backgroundColor:'black',
    marginTop : '-150px',
    padding:'10px'
}

const soldPlayersStyle : React.CSSProperties = {
  display:'grid',
  gridTemplateColumns: '20% 50% 30%',
  gap: '2rem'
}

const playCardHeading : React.CSSProperties = {
    fontSize: "30px",
    fontFamily: "auto",
    marginTop: "20px",
    textAlign: "center",
    padding:'10px'
}

const soldPlayerListStyle : React.CSSProperties = {
  backgroundColor:'white',
  border: "1px solid purple",
 boxShadow: "0 2px 4px rgba(0, 0, 0, 1.1)",
  borderRadius: "8px",
  width:'324px',

  margin: '10px',
  // marginLeft: '-280px'
}

const allTeamStyle :  React.CSSProperties = {
  // display: "grid",
  // gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))",
  // border: "1px solid purple",
//  boxShadow: "0 2px 4px rgba(0, 0, 0, 1.1)",
  // borderRadius: "8px",
  width:'60%',
  marginTop:'-121px',
  marginLeft : '500px'
}

const teamCardContainer: React.CSSProperties = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "8px",
  width: "224px",
  margin: "20px auto",
  cursor: "pointer",
  borderBlockColor: 'green'
};


const teamStyle :  React.CSSProperties = {
 
  border: "1px solid purple",
//  boxShadow: "0px 2px 4px rgba(0, 0, 0, 1.1)",
  borderRadius: "8px",
  width:'316px',
  padding : "20px",
  // marginTop:'764px',
  // marginLeft : '-606px'
}



const popUpStyle: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
};

const closeButtonStyle :  React.CSSProperties = {
  backgroundColor: 'red' ,
  color: 'white',
  padding: '5px 15px',
  borderRadius: '60%',
  outline: '0',
  border: '0',
  textTransform: 'uppercase',
  cursor: 'pointer'
}


const overlay : React.CSSProperties={
  position: 'fixed',
top: '0',
left: "0",
width: "100%",
height:" 100%",
backgroundColor: 'rgba(18, 15, 17, 0.85)', /* Semi-transparent black */
zIndex: '1000'
}

const jifStyle : React.CSSProperties = {
height: "8rem",
width: "20rem",
padding: "10px",

}

if (isMobile) {
    players__card__wrap.marginTop = '0px';
    players__card__wrap.marginLeft = '0px';
    players__card__wrap.margin = '10px';
//   playerCountStyle.fontSize = "12px"; // Adjust font size for mobile view
//   playerCountStyle.padding = "10px";

//   playerListContainer.gridTemplateColumns =
//     "repeat(auto-fit, minmax(18rem, 1fr))";
//   playerListContainer.padding = "0rem";
//   displayMargin.marginTop = '0px';

//   soldPlayersStyle.gridTemplateColumns = '1fr';
//   imageStyle.height = "6rem";
//   imageStyle.width = "6rem";

//   playCardHeading.padding = '0px';
//   playCardHeading.marginTop = '5px';

//   profileImageStyle.height = "8rem";
//   profileImageStyle.width = "7rem";

//   players__card__wrap.marginLeft = 'max-content'
//   players__card__wrap.width = "100%"

//   teamCallStyle.width = '75%';

//   soldPlayerListStyle.width = '100%'



}


export default AuctionLive;
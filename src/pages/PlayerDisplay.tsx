import React, {  useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { BACKEND_URL, TOTAL_PLAYER, roomId } from "../constants";
import playerSvg from "../assets/account-icon.png";
import battingSvg from "../assets/batter.png";
import ballingSvg from "../assets/tennisBall.jpg";
import logo from "../assets/icon.jpeg";
import no5 from '../assets/n05-icon.jpeg'
import PlayerService from "../services/PlayerService";
import bellGif from '../assets/bell.gif';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import congratsJif from '../assets/congratulations.gif';
import clapJif from '../assets/clap.gif'
import playerBg from '../assets/player_display.jpeg'
import TeamTable from "./TeamTable";
import CelebrationPopup from "./celebrationPopup";
import PlayerDashboard from "./playerDashboard";


const PlayerDisplay: React.FC = () => {
  const [socket, setSocket] = useState<any>(null);
  const [currentBidPlayer, setCurrentPlayer] = useState<any>({});
  const [currentCall, setCurrentCall] = useState<any>({});
  const [soldPlayer, setSoldPlayer] = useState<any>({});
  const [allSoldPlayers, setAllSoldPlayer] = useState<any>([])
  const [popUpContent, setPopUpContent] = useState<any>({})
  const [openPopUp, setOpenPopUp] = useState(false);
  const [allTeams, setAllTeams] = useState<any>([])
    const [showTeams, setShowTeam] = useState(false);

  const isMobile = window.matchMedia("(max-width: 600px)").matches;

  const [player, setPlayer] = useState<any | null>(null);

useEffect(() => {
  const loadPlayer = () => {
    const data = localStorage.getItem("selectedPlayer");
    const teamComp: any = JSON.parse(localStorage.getItem("team_complete") || "{}");
    let close_popup = localStorage.getItem('close_popup');
    console.log("close_popup= ", close_popup)
    if(close_popup == 'true'){
      setOpenPopUp(false);
      setPopUpContent(null);
    }
    if(teamComp?.id) {
      setOpenPopUp(true);
      setPopUpContent(teamComp);
    }
    console.log("teamComp== ", teamComp)
    GetAllTeams();
    getSoldPlayers();
    if (!data || data === "undefined") {
      setPlayer(null);
      return;
    }
     
    try {
      setPlayer(JSON.parse(data));
      setCurrentPlayer(JSON.parse(data))
    } catch {
      setPlayer(null);
    }
  };

  // Load initially
  loadPlayer();

  // Listen for changes
  window.addEventListener("storage", loadPlayer);

  return () => {
    window.removeEventListener("storage", loadPlayer);
  };
}, []);


  const GetAllTeams = () => {
    try {
      PlayerService()
        .getAllTeams()
        .then((response: any) => {
          setAllTeams(response?.data);
          setShowTeam(true);
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



  const getSoldPlayers = () =>{

    PlayerService().getSoldPlayers().then((response:any)=>{
        setAllSoldPlayer(response?.data?.players);
    })
  }

  return (
    
    <div style={displayMargin}>

<ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark" />

{/* {openPopUp && 
        <div style={overlay}>
            <div style={popUpStyle} >
                <div style={{textAlign:'right',marginTop:'-25px', marginRight:'-30px'}}>
                    <button style={closeButtonStyle} onClick={()=>setOpenPopUp(!openPopUp) }>X</button>
                </div>

                

                <div style={{display:'flex',justifyContent:'center'}}>

                    <img  src={`https://storage.googleapis.com/auction-players/${popUpContent.team_logo}`} alt="logo" style={{width: "6rem",
                        height: "6rem",
                        borderRadius: "8px",}}/> 
                    <span style={{ padding: "10px", 
                        fontWeight:'bold',
                        fontSize:'38px',
                        fontFamily: 'Georgia, serif' 
                    }}>{popUpContent.team_name}</span>
                    
                </div>
                
                <div>
              <img src={congratsJif} alt="logo" style={jifStyle} />
            </div>
                <div style={{display:'flex',justifyContent:'center'}}>
                  <img src={clapJif} alt="logo" style={{  height: "8rem",width: "8rem",padding: "10px",}} />
                </div>

                <div style={{display:'flex',justifyContent:'center'}}>
                  <span>Completed Auction</span>
                </div>

            </div>
            </div>
        } */}


          <CelebrationPopup
          open={openPopUp}
          data={popUpContent}
          onClose={() => setOpenPopUp(false)}
        />
        

        {/* <div>
          {allSoldPlayers && allSoldPlayers.length>0 &&
              <div style={soldPlayerListStyle}>
                  
                  { allSoldPlayers.map((element:any, index:number) => (
                      <div key={index} style={{display:'flex', padding:'10px'}} >
                        <img  src={`https://storage.googleapis.com/auction-players/${element.profile_image}`} alt="logo" style={profileImageStyle1}/>
                              <div style={{color:'black'}}>
                                  <div >
                                      <span style={fullNameText}>{element.id}.{element.fullname.toUpperCase()}</span>
                                  </div>
                                  <div >
                                      <span style={fullNameText}>{element.player_role}</span>
                                  </div>
                                  <div >
                                      <span style={fullNameText}>Team : {element.team_id}</span>
                                  </div>
                                  <div >
                                      <span style={fullNameText}>Points : {element.bid_amount}</span>
                                  </div>
                              </div>
                      </div>
                  ))}
              </div>
          }
          </div> */}


          <div >
                    {allTeams &&
                    <TeamTable teams={allTeams}/>
                      }
                  </div>



            <div >
                {currentBidPlayer && currentBidPlayer.id && (
                    <div style={players__card__wrap}>
                    {/* <div style={cardHeader}> */}
                      <div style={{display:'flex'}}>
                        <img  src={`https://storage.googleapis.com/rajas_pl/${currentBidPlayer.profile_image}`} alt="logo" style={profileImageStyle}/>
                      {/* <img src={BACKEND_URL + '/player_images/' + currentBidPlayer.profile_image} alt="logo" style={profileImageStyle} /> */}

                    </div>

                        

                        
                        <div style={{display: "flex" ,marginLeft:'433px', marginTop:'-244px', width:'780px'}}>
                            <span style={spanText}>{currentBidPlayer.player_role}</span>
                        </div>

                        <div style={{display: "flex" ,marginLeft:'433px', marginTop:'0px', width:'780px'}}>
                          <span style={spanText}>{currentBidPlayer.batting_style}</span>
                        </div>

                        <div style={{display: "flex",marginLeft:'433px', marginTop:'-5px', width:'780px' }}>
                            <span
                            style={spanText}
                            >
                            {currentBidPlayer.bowling_style}
                            </span>
                        </div>

                        <div style={{display: 'flex', marginLeft:'433px', marginTop:'-14px', width:'780px',fontSize: currentBidPlayer?.location?.length >10 ? "36px" : "40px"}}>
                            <span style={locText}> {capitalizeFirst(currentBidPlayer.location)}</span>
                        </div>

                        <div style={{ display: "flex",marginLeft:'433px', marginTop:'-1px', width:'780px' }}>
                            <span style={spanText}>
                            {currentBidPlayer.contact_no}
                            </span>
                        </div>

                          <div style={{ display: 'flex', textAlign: 'center', width: '164px', marginLeft: '684px' }}>
                          <span style={idText}>{currentBidPlayer.id} </span>
                        </div>

                         <div style={{display: 'flex',  width: '466px', marginLeft: '802px',marginTop:'5px' , textAlign:'center'}}>
                          <span style={idText1}>{currentBidPlayer.fullname.toUpperCase()} </span>
                        </div>



                       

                        
                    </div>
                )}

                 <div>
              {/* <PlayerDashboard/> */}
            </div>
            
            </div>

           


          


              


           




    </div>
  );
};


const teamListContainer: React.CSSProperties = {
  display: "grid",
  // gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
  // gap: "2rem",
  // maxWidth: "63rem",
  // margin: "0 auto",
  // padding: "1rem",
  // marginTop : "133px",
  // marginLeft : '10px'
};


const teamCallStyle : React.CSSProperties = {
    display:'flex',
    justifyContent:'center',
    // marginLeft:'65px',
    padding:'10px'

}

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

const spanText: React.CSSProperties = {
  fontWeight: "bold",
  fontSize: "40px",
  color: "white",
};

const locText: React.CSSProperties = {
  fontWeight: "bold",
  color: "white",
};

const idText: React.CSSProperties = {
  fontWeight: 'bold',
  fontSize: '55px',
  color: "black",
  width: "137px",
  height: "96px",
  marginTop : '-114px'
}

const idText1: React.CSSProperties = {
  fontWeight: 'bold',
  width: "488px",
  height: "80px",
  color: "white",
  fontSize : '40px',
 justifyContent: 'center',alignItems: 'center',

}


const fullNameText: React.CSSProperties = {
  marginTop: "10px",
  fontWeight: "bold",
  fontSize: "20px",
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

const profileImageStyle: React.CSSProperties = {
  height: "28.7rem",
  width: "23.2rem",
  marginTop: "116px",
  objectFit: "cover",
  marginLeft: "821px",
  // borderRadius : '21px'
};




const players__card__wrap: React.CSSProperties = {
  // width: "57%",
  gap: "2rem",
  // backgroundImage: "linear-gradient(to top,  #000033 , #800080)",
  backgroundImage : `url(${playerBg})`,
  backgroundSize: 'cover',
  border: "1px solid #ccc",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
//   margin: "0/ auto",
  marginLeft: "23px",
  width : '1297px',
  // marginTop : '168px',
  height : '708px'
};

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
  display :'flex',
  backgroundColor:'black',
    // marginTop : '-150px',
    padding:'10px',
    width: '142%'
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
  width:'137%',
  marginTop: '168px',
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

const isMobile = window.matchMedia("(max-width: 600px)").matches;
if (isMobile) {
  playerCountStyle.fontSize = "12px"; // Adjust font size for mobile view
  playerCountStyle.padding = "10px";

  playerListContainer.gridTemplateColumns =
    "repeat(auto-fit, minmax(18rem, 1fr))";
  playerListContainer.padding = "0rem";
  displayMargin.marginTop = '0px';

  soldPlayersStyle.gridTemplateColumns = '1fr';
  imageStyle.height = "6rem";
  imageStyle.width = "6rem";

  playCardHeading.padding = '0px';
  playCardHeading.marginTop = '5px';

  profileImageStyle.height = "8rem";
  profileImageStyle.width = "7rem";

  players__card__wrap.marginLeft = 'max-content'
  players__card__wrap.width = "100%"

  teamCallStyle.width = '75%';

  soldPlayerListStyle.width = '100%'



}

export default PlayerDisplay;

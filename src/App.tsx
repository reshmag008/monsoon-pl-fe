import React, { useEffect, useState } from 'react';
import './App.css';
import AppRouter from './AppRouter';



function App() {

  const [isMobileView, setIsMobileView] = useState(false);


  useEffect(() => {
  const unlock = () => {
    const audio = new Audio("/pop.mp3");
    audio.volume = 0;

    audio.play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
      })
      .catch(() => {});

    document.removeEventListener("click", unlock);
  };

  document.addEventListener("click", unlock);
}, []);


  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.matchMedia("(max-width: 600px)").matches);
    }
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  
  return (
      <div style={isMobileView? {} : divStyle} >
        <AppRouter/>
      </div>
  );
}

const divStyle : React.CSSProperties = {
  // marginTop : '6rem',
  // marginBottom: '5rem',
}


export default App;

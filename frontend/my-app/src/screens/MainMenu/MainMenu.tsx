import { useState } from 'react'
import './MainMenu.css'

import JoinMenu from './JoinMenu'
import axios from 'axios';
import { useNavigate } from 'react-router';

function MainMenu() {
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);

  // const handleCreate = async () => {
  //   try {
  //     await axios.post("/rooms");
  //   } catch (error) {
  //     console.error("Error joining room", error);
  //   }
  // };
  const handleCreate = () => {
    // retrieve room uuid using POST request
    let roomId = "1234";
    // join room and retrieve session id using POST request
    let sessionId = "5678"

    navigate(`/${roomId}/${sessionId}/waiting`);
  }

  return (
    <>
      <div id="mainMenu" className="imageBackground">
        <div style={{ flex: "1" }} />
        <p className="title">BARBICHETTE</p>
        <div className="menuButtons">
          <button onClick={handleCreate}>Create</button>
          <button onClick={() => setShowPopup(true)}>Join</button>
        </div>
        <div style={{ flex: "1" }} />
      </div>
      <JoinMenu showPopup={showPopup} closePopup={() => setShowPopup(false)} />
      
      
    </>
  )
}

export default MainMenu

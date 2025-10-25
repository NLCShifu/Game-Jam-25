import { useState } from 'react'
import './MainMenu.css'

import JoinMenu from './JoinMenu'
import axios from 'axios';
import { useNavigate } from 'react-router';

function MainMenu() {
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);

  const handleCreate = async () => {
    let roomId: string;
    let sessionId: string;

    try {
      const response = await axios.post("http://localhost:8000/rooms")
      roomId = response.data.room_id
    } catch (error) {
      console.error("Error creating room", error);
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8000/rooms/${roomId}/join`)
      sessionId = response.data.session_id;
    } catch (error) {
      console.error("Error joining room", error);
      return;
    }

    navigate(`/${roomId}/${sessionId}/waiting`);
  }

  return (
    <>
      <div id="mainMenu">
        <p className="title">BARBICHETTE</p>
        <div className="menuButtons">
          <button onClick={handleCreate}>Create</button>
          <button onClick={() => setShowPopup(true)}>Join</button>
        </div>
      </div>
      
      <JoinMenu showPopup={showPopup} closePopup={() => setShowPopup(false)} />
    </>
  )
}

export default MainMenu

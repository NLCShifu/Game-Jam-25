import { useState } from 'react'
import './MainMenu.css'

import JoinMenu from './JoinMenu'
import { useNavigate } from 'react-router';
import ButtonWide from '../../components/Buttons/ButtonWide';
import { Howl } from 'howler';
import axios from 'axios';

const imageSrc = '/logo.png';

function MainMenu() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [fartClicked, setFartClicked] = useState(false);

  const handleCreate = async () => {
    let roomId: string;
    let sessionId: string;
    
    try {
      let response = await axios.post("http://localhost:8000/rooms")
      roomId = response.data.room_id
    } catch (error) {
      console.error("Error creating room", error)
      return
    }
    try {
      let response = await axios.post(`http://localhost:8000/rooms/${roomId}/join`)
      sessionId = response.data.session_id
    } catch (error) {
      console.error("Error joining the room", error)
      return
    }

    navigate(`/${roomId}/${sessionId}/waiting`);
  }

  const fartSound = () => {
    const sound = new Howl({
      src: ["/dry-fart.mp3"],
      volume: 0.2,
    });
    sound.play();

    // Trigger CSS animation
    setFartClicked(true);
    setTimeout(() => setFartClicked(false), 300); // reset after animation
  };

  return (
    <>
      <div id="mainMenu" className="imageBackground">
        {/* Background SVG */}

        <div style={{ flex: "1" }} />
        <img
          src={imageSrc}
          alt="Logo"
          className={`pulsing-logo ${fartClicked ? 'fart-animate' : ''}`}
          onClick={fartSound}
          style={{ marginTop: '-150px', marginBottom: '50px' }}
        />
        <div className="menuButtons">
          <ButtonWide color="basic black" onClick={handleCreate} text='Create' size={0.7} />
          <ButtonWide color="basic black" onClick={() => setShowPopup(true)} text='Join' size={0.7} />
        </div>
        <div style={{ flex: "1" }} />
      </div>


      <JoinMenu showPopup={showPopup} closePopup={() => setShowPopup(false)} />
    </>
  )
}

export default MainMenu;

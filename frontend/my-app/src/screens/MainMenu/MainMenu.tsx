import { useState } from 'react'
import './MainMenu.css'


import JoinMenu from './JoinMenu'
import axios from 'axios';
import { useNavigate } from 'react-router';
import ButtonWide from '../../components/Buttons/ButtonWide';
import { scale, transform } from 'framer-motion';


const imageSrc = '/logo.png';

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
        <img src={imageSrc} alt="Logo" className='pulsing-logo' style={{ transform: 'scale(0.9)' }} />
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

export default MainMenu

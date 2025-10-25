import { useState } from 'react'
import './MainMenu.css'

import JoinMenu from './JoinMenu'
import { useNavigate } from 'react-router';
import ButtonWide from '../../components/Buttons/ButtonWide';
import { Howl } from 'howler';

const imageSrc = '/logo.png';

function MainMenu() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [fartClicked, setFartClicked] = useState(false);

  const handleCreate = () => {
    let roomId = "1234";
    let sessionId = "5678";
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
        <div className="backgroundSvg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 400"
            width="800"
            height="400"
            role="img"
            aria-label="Deux silhouettes face à face - respiration + rires animés"
          >
            {/* Your SVG content here (paths, g, defs, style...) */}
          </svg>
        </div>

        <div style={{ flex: "1" }} />
        <img
          src={imageSrc}
          alt="Logo"
          className={`pulsing-logo ${fartClicked ? 'fart-animate' : ''}`}
          onClick={fartSound}
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

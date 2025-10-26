import { useEffect, useState } from 'react'
import './MainMenu.css'

import JoinMenu from './JoinMenu'
import { useNavigate } from 'react-router'
import ButtonWide from '../../components/Buttons/ButtonWide'
import ButtonSquare from '../../components/Buttons/ButtonSquare'
import { Howl } from 'howler'
import axios from 'axios'

const imageSrc = '/logo.png'

function MainMenu() {
  const navigate = useNavigate()
  const [showPopup, setShowPopup] = useState(false)
  const [fartClicked, setFartClicked] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [music, setMusic] = useState<Howl | null>(null)

  useEffect(() => {
    // Create the Howl instance for background music
    const bgMusic = new Howl({
      src: ['/lobby-music.mp3'],
      loop: true,
      volume: 0.3,
    })
    setMusic(bgMusic)

    // Stop the music when leaving the page
    return () => {
      bgMusic.stop()
    }
  }, [])

  const toggleMusic = () => {
    if (!music) return
    if (musicPlaying) {
      music.pause()
    } else {
      music.play()
    }
    setMusicPlaying(!musicPlaying)
  }

  const handleCreate = async () => {
    let roomId: string
    let sessionId: string

    try {
      const response = await axios.post('http://localhost:8000/rooms')
      roomId = response.data.room_id
    } catch (error) {
      console.error('Error creating room', error)
      return
    }

    try {
      const response = await axios.post(`http://localhost:8000/rooms/${roomId}/join`)
      sessionId = response.data.session_id
    } catch (error) {
      console.error('Error joining the room', error)
      return
    }

    navigate(`/${roomId}/${sessionId}/waiting`)
  }

  const fartSound = () => {
    const sound = new Howl({
      src: ['/dry-fart.mp3'],
      volume: 0.2,
    })
    sound.play()

    setFartClicked(true)
    setTimeout(() => setFartClicked(false), 300)
  }

  return (
    <>
      <div id="mainMenu" className="imageBackground">
        <video
          className="menuOverlayVideo"
          src="/jewish.webm"
          autoPlay
          muted
          loop
          playsInline
        />

        <div style={{ flex: '1' }} />

        <img
          src={imageSrc}
          alt="Logo"
          className={`pulsing-logo ${fartClicked ? 'fart-animate' : ''}`}
          onClick={fartSound}
          style={{ marginTop: '-250px', marginBottom: '50px' }}
        />

        <div className="menuButtons">
          <ButtonWide color="basic black" onClick={handleCreate} text="Create" size={0.7} />
          <ButtonWide color="basic black" onClick={() => setShowPopup(true)} text="Join" size={0.7} />
        </div>

        {/* 🎵 Music toggle button */}
        <div className="musicButtonContainer">
          <ButtonSquare
            color="basic black"
            onClick={toggleMusic}
            iconName={musicPlaying ? 'icons sound on.png' : 'icons sound off.png'}
            size={70}
          />
        </div>

        <div style={{ flex: '1' }} />
      </div>

      <JoinMenu showPopup={showPopup} closePopup={() => setShowPopup(false)} />
    </>
  )
}

export default MainMenu

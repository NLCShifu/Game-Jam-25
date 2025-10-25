import { useRef, useState } from "react"

import "./GameRoom.css"

import LivesDisplay from "./LivesDisplay"
import EffectsList from "./EffectsList/EffectsList";
import PopupWindow from "../../components/PopupWindow";
import Hearts, { type HeartsHandle } from "../../components/Hearts";

function GameRoom() {
    // const [ownLives, setOwnLives] = useState(3);
    // const [otherLives, setOtherLives] = useState(3);

    const ownLivesRef = useRef<HeartsHandle>(null);
    const otherLivesRef = useRef<HeartsHandle>(null);

    return (
        <div className="layoutGap gameRoom gradientBackground">
            <div className="layoutGap half left">
                {/* <div className="container otherCameraContainer">
                    <div className="placeholder">other camera</div>
                </div> */}
                <PopupWindow color="basic pink" animated={false} className="container otherCameraContainer">
                    <div className="placeholder">other camera</div>
                </PopupWindow>
                <div className="container livesContainer">
                    <div className="livesDisplay otherLives">
                        {/* <LivesDisplay lives={otherLives} /> */}
                        <Hearts color="basic red" ref={otherLivesRef} size={80} />
                        <span>Their lives</span>
                    </div>
                    <div className="livesDisplay ownLives">
                        <span>Your lives</span>
                        {/* <LivesDisplay lives={ownLives} /> */}
                        <Hearts color="basic red" ref={ownLivesRef} size={80} />
                    </div>
                </div>
            </div>
            <div className="layoutGap half right">
                <div className="effectsContainer">
                    <EffectsList />
                </div>
                {/* <div className="container ownCameraContainer">
                    <div className="placeholder">your camera</div>
                </div> */}
                <PopupWindow color="basic pink" animated={false} className="container ownCameraContainer">
                    <div className="placeholder">your camera</div>
                </PopupWindow>
            </div>
        </div>
    )
}

export default GameRoom
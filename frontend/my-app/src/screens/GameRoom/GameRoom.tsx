import { useState } from "react"

import "./GameRoom.css"

import LivesDisplay from "./LivesDisplay"
import EffectsList from "./EffectsList/EffectsList";
import PopupWindow from "../../components/PopupWindow";

function GameRoom() {
    const [ownLives, setOwnLives] = useState(2);
    const [otherLives, setOtherLives] = useState(3);

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
                        <LivesDisplay lives={otherLives} />
                        Their lives
                    </div>
                    <div className="livesDisplay ownLives">
                        Your lives
                        <LivesDisplay lives={ownLives} />
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
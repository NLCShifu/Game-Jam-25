import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import PopupWindow from "../../components/PopupWindow";
import ButtonSquare from "../../components/Buttons/ButtonSquare";
import ButtonWide from "../../components/Buttons/ButtonWide";
import axios from "axios";

type PropTypes = {
    showPopup: boolean,
    closePopup: () => void
}

function JoinMenu({ showPopup, closePopup }: Readonly<PropTypes>) {
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_API_URL;

    const [code, setCode] = useState("");
    const [displayName, setDisplayName] = useState("");
    const updateCode = (e: ChangeEvent<HTMLInputElement>) => setCode(e.target.value)
    const updateName = (e: ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)

    const handleJoin = async () => {
      let sessionId: string;
      try {
        let response = await axios.post(`http://${baseUrl}:8000/rooms/${code}/join`);
        sessionId = response.data.session_id;
      } catch (error) {
        console.error("Error joining the room", error);
        return;
      }

      navigate(`/${code}/${sessionId}/waiting`);
    };

    if (!showPopup) return null;

    return (
        <PopupWindow color="basic green" show={showPopup} className="menuPanel" >
            <span>Input code:</span>

            <div style={{ flex: "5" }} />

    
            <input type="text" maxLength={6} onChange={updateCode} />
            {/* <button onClick={() => navigate(`/${code}/waiting`)}>JOIN</button> */}
            <ButtonWide color="basic yellow" text="JOIN" size={0.4} onClick={handleJoin} />

            <div className="exitbutton">
                <ButtonSquare iconName="icons cross.png" color="basic red" size={40} onClick={closePopup} />
            </div>

            <div style={{ flex: "3" }} />
        </PopupWindow>
    )
}

export default JoinMenu
import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import PopupWindow from "../../components/PopupWindow";
import ButtonSquare from "../../components/Buttons/ButtonSquare";
import ButtonWide from "../../components/Buttons/ButtonWide";

type PropTypes = {
    showPopup: boolean,
    closePopup: () => void
}

function JoinMenu({ showPopup, closePopup }: Readonly<PropTypes>) {
    const navigate = useNavigate();

    const [code, setCode] = useState("");
    const updateCode = (e: ChangeEvent<HTMLInputElement>) => setCode(e.target.value)

    if (!showPopup) return null;

    return (
        <PopupWindow color="basic green" show={showPopup} className="menuPanel" >
            <span>Input code:</span>

            <div style={{ flex: "5" }} />

    
            <input type="text" maxLength={6} onChange={updateCode} />
            {/* <button onClick={() => navigate(`/${code}/waiting`)}>JOIN</button> */}
            <ButtonWide color="basic yellow" text="JOIN" size={0.4} />

            <div className="exitbutton">
                <ButtonSquare iconName="icons cross.png" color="basic red" size={40} onClick={closePopup} />
            </div>

            <div style={{ flex: "3" }} />
        </PopupWindow>
    )
}

export default JoinMenu
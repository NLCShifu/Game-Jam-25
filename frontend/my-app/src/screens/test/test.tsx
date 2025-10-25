import { useRef } from "react"
import ButtonSquare from "../../components/Buttons/ButtonSquare"
import ButtonWide from "../../components/Buttons/ButtonWide"
import ButtonWider from "../../components/Buttons/ButtonWider"
import Heart, { type HeartHandle } from "../../components/Heart"
import IconPanel from "../../components/IconPanel"
import PopupWindow from "../../components/PopupWindow"
import Ribbon from "../../components/Ribbon"



function Test() {
    const heartRef = useRef<HeartHandle>(null);

    const handleUnfill = () => {
        heartRef.current?.unfill();
    };


    return (
        <>
            <ButtonWide text="NIGGA" color="basic pink" />
            <ButtonSquare iconName="icons arrow right.png" color="basic blue" />
            <ButtonWider text="FRIED CHICKEN" color="basic green" />
            <PopupWindow color="basic yellow" show={true} animated={true}>
                <Ribbon text="AAatefaact dagdai" color="basic red" scale={0.5} />
            </PopupWindow>
            <IconPanel color="metal" />
            <Heart ref={heartRef} color="basic red" initialFilled={true} />
            <ButtonSquare iconName="icons cross.png" color="basic black" onClick={handleUnfill} />
        </>
    )
}

export default Test
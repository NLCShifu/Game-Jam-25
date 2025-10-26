import { useEffect } from "react";
import { useVideo } from "../../contexts/VideoContext";

function OtherCameraDisplay() {
    const { otherCameraFrame } = useVideo();

    return (
        <img src={otherCameraFrame ?? undefined} />
    )
}

export default OtherCameraDisplay;
import { useEffect } from "react";
import { useVideo } from "../../contexts/VideoContext";

function OtherCameraDisplay() {
    const { otherCameraFrame } = useVideo();

    // useEffect(() => {
    //     console.log("update");
    // }, [otherCameraFrame]);

    return (
        <div className="otherCameraDisplay">
            <img src={otherCameraFrame ?? undefined} />
        </div>
    )
}

export default OtherCameraDisplay;
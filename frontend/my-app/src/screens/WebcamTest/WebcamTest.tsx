import OtherCameraDisplay from "../../components/Webcam/OtherCameraDisplay"
import WebcamDisplay from "../../components/Webcam/WebcamDisplay"
import { useVideo } from "../../contexts/VideoContext"

import "./WebcamTest.css"

function WebcamTest() {
    // const { openConnection, closeConnection } = useVideo();

    // useEffect(() => {
    //     openConnection()
    // })

    return (
        <div className="webcamtest">
            {/* <WebcamDisplay sendVideoData={} /> */}
            {/* <OtherCameraDisplay /> */}
        </div>
    )
}

export default WebcamTest
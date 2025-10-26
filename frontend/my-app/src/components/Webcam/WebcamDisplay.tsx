import { useEffect, useMemo, useRef, useState } from "react"
import "./WebcamDisplay.css"

type PropTypes = {
    sendVideoData: (buffer: ArrayBuffer) => void;
}

function WebcamDisplay({ sendVideoData }: PropTypes) {
    const videoRef = useRef<HTMLVideoElement>(null);
    // const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvas = useMemo<HTMLCanvasElement>(() => document.createElement("canvas"), []);



    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

    // const startWebcam = async () => {
    //     if (mediaStream) return;

    //     try {
    //         const stream = await navigator.mediaDevices.getUserMedia({
    //             video: true, audio: true
    //         })

    //         console.log("Webcam START");

    //         setMediaStream(stream);
    //     } catch (err) {
    //         console.error("Error opening webcam");
    //     }
    // }

    const stopWebcam = () => {
        if (mediaStream) {
            for (const track of mediaStream.getTracks()) {
                track.stop();
            }

            console.log("Webcam STOP");

            setMediaStream(null);
        }
    }

    useEffect(() => {
        let cancelled = false;

        const startWebcam = async () => {
            if (mediaStream) return;

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true, audio: true
                })

                if (cancelled) {
                    for (const track of stream.getTracks()) {
                        track.stop();
                    }
                }
                
                setMediaStream(stream);
            } catch (err) {
                console.error("Error opening webcam");
            }
        }

        startWebcam();

        return () => {
            cancelled = true;
            
            stopWebcam();
        }
    }, [mediaStream]);

    useEffect(() => {
        console.log("setup", mediaStream);
        let abort = false;

        if (mediaStream && videoRef.current) {
            const video = videoRef.current;
            video.srcObject = mediaStream;

            // Async function; we need to wait for the video to start playing to get data
            const setup = async () => {
                await video.play();

                const ctx = canvas.getContext("2d");

                if (ctx && video.videoHeight && video.videoWidth) {
                    // Set canvas dimensions to video dimensions
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;

                    let intervalId = 0;

                    const render = () => {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                        canvas.toBlob(blob => {
                            if (!blob) {
                                console.warn("Blob is null");
                                return;
                            }

                            blob.arrayBuffer().then(buffer => {
                                sendVideoData(buffer);
                            })
                        }, "image/jpeg", 0.4);

                        if (abort) clearInterval(intervalId);
                    }

                    intervalId = setInterval(render, 40);
                }
            }

            setup();
        }

        // return stopWebcam;
        return () => { 
            abort = true; 
        }
    }, [mediaStream])

    return (
        <div className="webcamDisplay">
            <video ref={videoRef} />
            {/* <canvas ref={canvasRef} /> */}
            {/* <button onClick={startWebcam}>start</button>
            <button onClick={stopWebcam}>stop</button> */}
        </div>
    )
}

export default WebcamDisplay
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import "./WebcamDisplay.css"

type PropTypes = {
    sendVideoData: (buffer: ArrayBuffer) => void;
    sendAudioData: (stream: Int16Array) => void;
}

function WebcamDisplay({ sendVideoData, sendAudioData }: Readonly<PropTypes>) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvas = useMemo<HTMLCanvasElement>(() => document.createElement("canvas"), []);

    const audioContextRef = useRef<AudioContext>(null);
    const audioSourceRef = useRef<MediaStreamAudioSourceNode>(null);
    const audioProcessorRef = useRef<ScriptProcessorNode>(null);

    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

    const stopWebcam = useCallback(() => {
        if (mediaStream) {
            for (const track of mediaStream.getTracks()) {
                track.stop();
            }

            console.log("Webcam STOP");

            setMediaStream(null);
        }
    }, [mediaStream]);

    const processAudio = useCallback((e: AudioProcessingEvent) => {
        console.log("Processing audio");
        const input = e.inputBuffer.getChannelData(0);
        const buffer = new Int16Array(input.length);

        for (let i = 0; i < input.length; i++) {
            const sample = Math.max(-1, Math.min(1, input[i]));
            
            buffer[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        }

        sendAudioData(buffer);
    }, [sendAudioData])

    const setupAudio = useCallback((stream: MediaStream) => {
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;
        const src = audioContext.createMediaStreamSource(stream);
        audioSourceRef.current = src;
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        audioProcessorRef.current = processor;

        processor.onaudioprocess = processAudio;

        src.connect(processor);
        processor.connect(audioContext.destination);

        console.log(audioContext.destination);

        console.log("Audio set up successfully");
    }, [processAudio]);

    const cleanupAudio = useCallback(() => {
        const src = audioSourceRef.current;
        const processor = audioProcessorRef.current;
        const audioContext = audioContextRef.current;

        if (processor) {
            processor.disconnect();
            processor.onaudioprocess = null;
        }

        src?.disconnect();

        if (audioContext) {
            try { audioContext.close(); }
            catch (err) {
                console.warn("Failed to close audio context", err)
            }
        }

        audioSourceRef.current = null;
        audioProcessorRef.current = null;
        audioContextRef.current = null;
    }, []);

    // Startup webcam
    useEffect(() => {
        let cancelled = false;

        const startWebcam = async () => {
            if (mediaStream) return;

            try {
                // Setup video

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true, audio: true
                })

                if (cancelled) {
                    for (const track of stream.getTracks()) {
                        track.stop();
                    }
                }
                
                setMediaStream(stream);
                setupAudio(stream);
            } catch (err) {
                console.error("Error opening webcam");
            }
        }

        startWebcam();

        return () => {
            cancelled = true;

            cleanupAudio();
            stopWebcam();
        }
    }, [mediaStream, setupAudio]);

    // Send webcam data to the server
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
                        if (abort) {
                            clearInterval(intervalId);

                            return;
                        }

                        // Video processing

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
        </div>
    )
}

export default WebcamDisplay
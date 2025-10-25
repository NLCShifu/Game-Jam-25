import { useEffect, useRef, useState, type CSSProperties } from "react"
import { useRoomMedia } from "./RoomMediaContext"

type Props = {
  active: boolean
  className?: string
  style?: CSSProperties
  videoStyle?: CSSProperties
}

export default function OwnCamera({ active, className, style, videoStyle }: Props) {
  const { sendVideoFrame, sendAudioSamples, videoConnected, audioConnected } = useRoomMedia()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const captureIntervalRef = useRef<number | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const activeRef = useRef(active)
  activeRef.current = active

  useEffect(() => {
    let cancelled = false
    let acquiredStream: MediaStream | null = null

    const startMedia = async () => {
      try {
        const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        if (cancelled) {
          media.getTracks().forEach((track) => track.stop())
          return
        }
        acquiredStream = media
        setStream(media)
        if (videoRef.current) {
          videoRef.current.srcObject = media
        }
      } catch (err) {
        console.error("Unable to access camera/microphone", err)
        if (!cancelled) {
          setError("Impossible d'accéder à la caméra ou au micro")
        }
      }
    }

    startMedia()

    return () => {
      cancelled = true
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current)
        captureIntervalRef.current = null
      }
      if (processorRef.current) {
        try {
          processorRef.current.disconnect()
        } catch (err) {
          console.warn("Failed to disconnect processor", err)
        }
        processorRef.current.onaudioprocess = null
        processorRef.current = null
      }
      if (sourceRef.current) {
        try {
          sourceRef.current.disconnect()
        } catch (err) {
          console.warn("Failed to disconnect source", err)
        }
        sourceRef.current = null
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close()
        } catch (err) {
          console.warn("Failed to close audio context", err)
        }
        audioCtxRef.current = null
      }
      if (acquiredStream) {
        acquiredStream.getTracks().forEach((track) => track.stop())
      }
      setStream(null)
    }
  }, [])

  useEffect(() => {
    if (!stream || !videoRef.current) {
      return
    }

    const videoEl = videoRef.current
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      console.warn("Cannot create canvas context for video capture")
      return
    }

    const updateCanvasSize = () => {
      canvas.width = videoEl.videoWidth || 640
      canvas.height = videoEl.videoHeight || 480
    }

    if (videoEl.readyState >= 1) {
      updateCanvasSize()
    } else {
      videoEl.addEventListener("loadedmetadata", updateCanvasSize, { once: true })
    }

    console.log("Setting up capture interval effect...")

    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current)
      console.log("Cleared existing capture interval.")
    }

    captureIntervalRef.current = window.setInterval(() => {
      // Log state BEFORE the guard clause
      console.log(`[Tick] Active: ${activeRef.current}, Video Connected: ${videoConnected}`)

      if (!activeRef.current || !videoConnected) {
        return
      }

      try {
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              console.warn(`[toBlob callback] Failed, blob is null.`)
              return
            }
            if (activeRef.current && videoConnected) {
              blob.arrayBuffer().then((buffer) => {
                if (activeRef.current && videoConnected) {
                  sendVideoFrame(buffer)
                  console.log(`[toBlob callback] Frame sent, size: ${buffer.byteLength}`)
                }
              })
            }
          },
          "image/jpeg",
          0.7
        )
      } catch (err) {
        console.warn("Failed to capture frame", err)
      }
    }, 200) // Increased interval slightly to reduce log spam
    console.log(`Capture interval created: ${captureIntervalRef.current}`)

    return () => {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current)
        console.log(`Cleaned up capture interval: ${captureIntervalRef.current}`)
        captureIntervalRef.current = null
      }
      videoEl.removeEventListener("loadedmetadata", updateCanvasSize)
    }
  }, [stream, sendVideoFrame, videoConnected])

  useEffect(() => {
    if (!stream) return

    const audioCtx = new AudioContext()
    audioCtxRef.current = audioCtx
    const src = audioCtx.createMediaStreamSource(stream)
    sourceRef.current = src
    const processor = audioCtx.createScriptProcessor(4096, 1, 1)
    processorRef.current = processor

    processor.onaudioprocess = (event: AudioProcessingEvent) => {
      if (!activeRef.current) return
      const input = event.inputBuffer.getChannelData(0)
      const buffer = new Int16Array(input.length)
      for (let i = 0; i < input.length; i++) {
        const sample = Math.max(-1, Math.min(1, input[i]))
        buffer[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff
      }
      sendAudioSamples(buffer)
    }

    src.connect(processor)
    processor.connect(audioCtx.destination)

    return () => {
      processor.disconnect()
      src.disconnect()
      processor.onaudioprocess = null
      try {
        audioCtx.close()
      } catch (err) {
        console.warn("Failed to close audio context", err)
      }
      if (audioCtxRef.current === audioCtx) audioCtxRef.current = null
      if (processorRef.current === processor) processorRef.current = null
      if (sourceRef.current === src) sourceRef.current = null
    }
  }, [stream, sendAudioSamples])

  return (
    <div className={className} style={style}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 8,
          background: "#000",
          ...videoStyle,
        }}
      />
      <div style={{ marginTop: 8, fontSize: 12, color: "#bbb", textAlign: "center" }}>
        {error ?? `Caméra ${videoConnected ? "connectée" : "en attente"} · Audio ${audioConnected ? "ok" : "en attente"}`}
      </div>
    </div>
  )
}

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"

interface RoomMediaContextValue {
  sendVideoFrame: (frame: ArrayBuffer) => void
  sendAudioSamples: (samples: Int16Array) => void
  remoteFrameUrl: string | null
  resetRemoteFrame: () => void
  videoConnected: boolean
  audioConnected: boolean
}

const RoomMediaContext = createContext<RoomMediaContextValue | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export const useRoomMedia = () => {
  const ctx = useContext(RoomMediaContext)
  if (!ctx) {
    throw new Error("useRoomMedia must be used within a RoomMediaProvider")
  }
  return ctx
}

type ProviderProps = {
  roomId: string
  sessionId: string
  children: ReactNode
}

export function RoomMediaProvider({ roomId, sessionId, children }: ProviderProps) {
  const wsVideoRef = useRef<WebSocket | null>(null)
  const wsAudioRef = useRef<WebSocket | null>(null)
  const playbackCtxRef = useRef<AudioContext | null>(null)
  const playbackCursorRef = useRef<number>(0)
  const remoteFrameUrlRef = useRef<string | null>(null)
  const pendingVideoFrameRef = useRef<ArrayBuffer | null>(null)

  const [remoteFrameUrl, setRemoteFrameUrl] = useState<string | null>(null)
  const [videoConnected, setVideoConnected] = useState(false)
  const [audioConnected, setAudioConnected] = useState(false)

  const resetRemoteFrame = useCallback(() => {
    if (remoteFrameUrlRef.current) {
      URL.revokeObjectURL(remoteFrameUrlRef.current)
      remoteFrameUrlRef.current = null
    }
    setRemoteFrameUrl(null)
  }, [])

  const sendVideoFrame = useCallback((frame: ArrayBuffer) => {
    const ws = wsVideoRef.current
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(frame)
    } else {
      // Buffer the latest frame to flush on open
      try {
        pendingVideoFrameRef.current = frame.slice(0)
      } catch {
        // Some ArrayBuffers may not support slice; fall back to as-is
        pendingVideoFrameRef.current = frame
      }
    }
  }, [])

  const sendAudioSamples = useCallback((samples: Int16Array) => {
    const ws = wsAudioRef.current
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(samples.buffer)
    }
  }, [])

  useEffect(() => {
    if (!roomId || !sessionId) {
      return
    }

    resetRemoteFrame()
    setVideoConnected(false)
    setAudioConnected(false)

    const proto = window.location.protocol === "https:" ? "wss" : "ws"
    const envHost = import.meta.env.VITE_BACKEND_HOST as string | undefined
    const envPort = import.meta.env.VITE_BACKEND_PORT as string | undefined
    const host = envHost ?? window.location.hostname
    const port = envPort ?? "8000"
    const portSegment = port ? `:${port}` : ""

    const videoUrl = `${proto}://${host}${portSegment}/ws/video/${roomId}?session_id=${encodeURIComponent(sessionId)}`
    const audioUrl = `${proto}://${host}${portSegment}/ws/audio/${roomId}?session_id=${encodeURIComponent(sessionId)}`

    const wsVideo = new WebSocket(videoUrl)
    wsVideo.binaryType = "arraybuffer"
    wsVideoRef.current = wsVideo

    const wsAudio = new WebSocket(audioUrl)
    wsAudio.binaryType = "arraybuffer"
    wsAudioRef.current = wsAudio

    wsVideo.onopen = () => {
      setVideoConnected(true)
      console.debug("video ws open", { url: videoUrl })
      // Flush any buffered frame
      const pending = pendingVideoFrameRef.current
      if (pending) {
        try {
          wsVideo.send(pending)
        } catch (err) {
          console.warn("failed to send pending frame on open", err)
        }
        pendingVideoFrameRef.current = null
      }
    }
    wsVideo.onclose = (event) => {
      console.log("video ws closed", event)
      setVideoConnected(false)
      resetRemoteFrame()
    }
    wsVideo.onerror = (event) => {
      console.error("video ws error", event)
    }
    wsVideo.onmessage = (event: MessageEvent<ArrayBuffer>) => {
      try {
        const blob = new Blob([event.data], { type: "image/jpeg" })
        const url = URL.createObjectURL(blob)
        if (remoteFrameUrlRef.current) {
          URL.revokeObjectURL(remoteFrameUrlRef.current)
        }
        remoteFrameUrlRef.current = url
        setRemoteFrameUrl(url)
      } catch (err) {
        console.warn("failed to handle remote frame", err)
      }
    }

    wsAudio.onopen = () => {
      setAudioConnected(true)
      console.debug("audio ws open", { url: audioUrl })
    }
    wsAudio.onclose = (event) => {
      console.log("audio ws closed", event)
      setAudioConnected(false)
    }
    wsAudio.onerror = (event) => {
      console.error("audio ws error", event)
    }
    wsAudio.onmessage = (event: MessageEvent<ArrayBuffer>) => {
      try {
        if (!event.data) return
        const int16 = new Int16Array(event.data)
        if (!int16.length) return

        let playbackCtx = playbackCtxRef.current
        if (!playbackCtx) {
          playbackCtx = new AudioContext()
          playbackCtxRef.current = playbackCtx
        }
        const float32 = new Float32Array(int16.length)
        for (let i = 0; i < int16.length; i++) {
          float32[i] = int16[i] / 0x7fff
        }
        const audioBuffer = playbackCtx.createBuffer(1, float32.length, playbackCtx.sampleRate)
        audioBuffer.copyToChannel(float32, 0)
        const source = playbackCtx.createBufferSource()
        source.buffer = audioBuffer
        source.connect(playbackCtx.destination)
        const now = playbackCtx.currentTime
        const startAt = Math.max(now, playbackCursorRef.current)
        source.start(startAt)
        playbackCursorRef.current = startAt + audioBuffer.duration
      } catch (err) {
        console.warn("failed to play remote audio", err)
      }
    }

    return () => {
      wsVideo.onopen = null
      wsVideo.onclose = null
      wsVideo.onerror = null
      wsVideo.onmessage = null
      wsAudio.onopen = null
      wsAudio.onclose = null
      wsAudio.onerror = null
      wsAudio.onmessage = null

      // Important: only close the sockets that were created by THIS effect run.
      // In React StrictMode (dev), effects run twice. The first cleanup would otherwise
      // close the newer socket created by the second effect if we close via the ref.
      if (wsVideoRef.current === wsVideo) {
        try {
          wsVideo.close()
        } catch (err) {
          console.warn("error closing video ws", err)
        }
        wsVideoRef.current = null
      }
      if (wsAudioRef.current === wsAudio) {
        try {
          wsAudio.close()
        } catch (err) {
          console.warn("error closing audio ws", err)
        }
        wsAudioRef.current = null
      }
      if (playbackCtxRef.current) {
        try {
          playbackCtxRef.current.close()
        } catch (err) {
          console.warn("error closing playback context", err)
        }
        playbackCtxRef.current = null
      }
      playbackCursorRef.current = 0
      resetRemoteFrame()
    }
  }, [roomId, sessionId, resetRemoteFrame])

  const value = useMemo<RoomMediaContextValue>(() => ({
    sendVideoFrame,
    sendAudioSamples,
    remoteFrameUrl,
    resetRemoteFrame,
    videoConnected,
    audioConnected,
  }), [sendVideoFrame, sendAudioSamples, remoteFrameUrl, resetRemoteFrame, videoConnected, audioConnected])

  return (
    <RoomMediaContext.Provider value={value}>
      {children}
    </RoomMediaContext.Provider>
  )
}

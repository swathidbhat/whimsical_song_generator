'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'

export default function MeetingPage() {
  const params = useParams()
  const meetingId = params.id as string

  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [employeeName, setEmployeeName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [status, setStatus] = useState<string>('pending')
  const [statusMessage, setStatusMessage] = useState('Please wait...')

  const videoRef = useRef<HTMLVideoElement>(null)
  const webcamRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])

  // Helper to get status message
  const getStatusMessage = (currentStatus: string): string => {
    switch (currentStatus) {
      case 'pending':
        return 'Initializing your personalized termination song...'
      case 'generating_lyrics':
        return 'Writing your unique termination lyrics...'
      case 'generating_music':
        return 'Creating musical arrangement...'
      case 'converting_voice':
        return 'Converting to AI voice...'
      case 'generating_video':
        return 'Generating AI avatar video...'
      case 'ready':
        return 'Ready!'
      case 'failed':
        return 'Generation failed. Please try again.'
      default:
        return 'Processing...'
    }
  }

  // Fetch meeting data with polling
  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null

    const fetchMeeting = async () => {
      try {
        const response = await fetch(`/api/meeting/${meetingId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Meeting not found')
        }

        setEmployeeName(data.employeeName)
        setStatus(data.status)
        setStatusMessage(getStatusMessage(data.status))

        // If video is ready, set it and stop polling
        if (data.status === 'ready' && data.videoUrl) {
          setVideoUrl(data.videoUrl)
          setIsLoading(false)
          if (pollInterval) {
            clearInterval(pollInterval)
          }
        } else if (data.status === 'failed') {
          // Stop polling on failure
          setError(data.error || 'Video generation failed')
          setIsLoading(false)
          if (pollInterval) {
            clearInterval(pollInterval)
          }
        }
        // Otherwise keep polling
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load meeting')
        setIsLoading(false)
        if (pollInterval) {
          clearInterval(pollInterval)
        }
      }
    }

    // Initial fetch
    fetchMeeting()

    // Poll every 3 seconds
    pollInterval = setInterval(fetchMeeting, 3000)

    // Cleanup
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval)
      }
    }
  }, [meetingId])

  // Set up webcam
  useEffect(() => {
    const setupWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        if (webcamRef.current) {
          webcamRef.current.srcObject = stream
        }

        // Set up MediaRecorder
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm',
        })

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data)
          }
        }

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, {
            type: 'video/webm',
          })
          
          // Download the recording
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `reaction-${meetingId}.webm`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
          
          // Show notification
          alert(`🎥 Recording saved!\n\nFile: reaction-${meetingId}.webm\nCheck your Downloads folder (Ctrl+J in Chrome)`)
        }

        mediaRecorderRef.current = mediaRecorder
      } catch (err) {
        console.error('Error accessing webcam:', err)
      }
    }

    if (!isLoading && videoUrl) {
      setupWebcam()
    }

    return () => {
      // Cleanup
      if (webcamRef.current?.srcObject) {
        const stream = webcamRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isLoading, videoUrl, meetingId])

  // Start recording when video plays
  const handleVideoPlay = () => {
    if (mediaRecorderRef.current && !isRecording) {
      mediaRecorderRef.current.start()
      setIsRecording(true)
    }
  }

  // Stop recording when video ends
  const handleVideoEnd = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zoom-darker flex items-center justify-center">
        <div className="text-white text-center max-w-md">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-zoom-blue mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold mb-2">Generating Your Termination Song</h2>
          <p className="text-gray-400 mb-4">{statusMessage}</p>
          <div className="bg-gray-800 rounded-lg p-4 text-sm text-left">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${status === 'generating_lyrics' || status === 'pending' ? 'bg-zoom-blue animate-pulse' : 'bg-green-500'}`}></div>
              <span>Writing lyrics</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${status === 'generating_music' ? 'bg-zoom-blue animate-pulse' : status === 'generating_lyrics' || status === 'pending' ? 'bg-gray-600' : 'bg-green-500'}`}></div>
              <span>Generating music</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${status === 'converting_voice' ? 'bg-zoom-blue animate-pulse' : ['generating_lyrics', 'generating_music', 'pending'].includes(status) ? 'bg-gray-600' : 'bg-green-500'}`}></div>
              <span>Converting voice</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status === 'generating_video' ? 'bg-zoom-blue animate-pulse' : status === 'ready' ? 'bg-green-500' : 'bg-gray-600'}`}></div>
              <span>Creating video</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-4">This usually takes 2-4 minutes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zoom-darker flex items-center justify-center">
        <div className="text-white text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Meeting Not Found</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-zoom-darker flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-zoom-dark px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-zoom-blue rounded flex items-center justify-center">
            <span className="text-white text-sm font-bold">DD</span>
          </div>
          <span className="text-white font-semibold">Dumb Dump Songs Meeting</span>
        </div>
        
        <div className="flex items-center gap-4">
          {isRecording && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-zoom-red rounded-full animate-pulse"></div>
              <span className="text-zoom-red text-sm font-semibold">Recording</span>
            </div>
          )}
          <div className="text-gray-400 text-sm">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 relative p-4">
        {/* Main Video - AI Avatar */}
        <div className="h-full flex items-center justify-center">
          <div className="relative max-w-5xl w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
            {videoUrl && (
              <video
                ref={videoRef}
                src={videoUrl}
                autoPlay
                controls
                className="w-full h-full"
                onPlay={handleVideoPlay}
                onEnded={handleVideoEnd}
              />
            )}
            
            {/* Employee Name Tag */}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 px-3 py-1 rounded">
              <span className="text-white text-sm">HR Department</span>
            </div>
          </div>

          {/* Webcam Preview (Picture-in-Picture) */}
          <div className="absolute top-8 right-8 w-64 aspect-video bg-black rounded-lg overflow-hidden shadow-xl border-2 border-zoom-blue">
            <video
              ref={webcamRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 px-2 py-1 rounded">
              <span className="text-white text-xs">{employeeName || 'You'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="bg-zoom-dark px-4 py-4 flex items-center justify-center gap-6">
        {/* Fake Controls */}
        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <span className="text-xs">Mute</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xs">Stop Video</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xs">Share Screen</span>
        </button>

        <button className="bg-zoom-red hover:bg-red-600 text-white px-6 py-3 rounded transition font-semibold">
          Leave Meeting
        </button>
      </div>
    </div>
  )
}

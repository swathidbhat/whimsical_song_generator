import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { storage } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { employeeName, employeeInfo } = body

    if (!employeeName || !employeeInfo) {
      return NextResponse.json(
        { error: 'Employee name and info are required' },
        { status: 400 }
      )
    }

    // Generate unique meeting ID
    const meetingId = nanoid(10)

    // Call teammate's video generation service
    const VIDEO_SERVICE_URL = process.env.VIDEO_SERVICE_URL || 'http://localhost:5000'
    
    let videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    let status: 'pending' | 'ready' | 'failed' = 'ready'
    
    try {
      const videoResponse = await fetch(`${VIDEO_SERVICE_URL}/generate-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeName, employeeInfo })
      })
      
      if (videoResponse.ok) {
        const data = await videoResponse.json()
        videoUrl = data.videoUrl
        status = data.status || 'ready'
        console.log('Video generated successfully:', data)
      } else {
        console.error('Video service error:', await videoResponse.text())
        // Fall back to mock video
      }
    } catch (error) {
      console.error('Failed to call video service:', error)
      // Fall back to mock video
    }

    // Create session
    const session = storage.createSession({
      id: meetingId,
      employeeName,
      employeeInfo,
      videoUrl,
      status,
    })

    // Generate meeting link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const meetingLink = `${baseUrl}/meeting/${meetingId}`

    return NextResponse.json({
      success: true,
      meetingId,
      meetingLink,
      videoUrl: session.videoUrl,
    })
  } catch (error) {
    console.error('Error generating meeting:', error)
    return NextResponse.json(
      { error: 'Failed to generate meeting' },
      { status: 500 }
    )
  }
}

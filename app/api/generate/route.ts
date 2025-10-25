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

    // TODO: Call teammate's video generation service
    // For now, use a mock video URL for development
    const mockVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    
    // In production, this would be:
    // const videoResponse = await fetch('TEAMMATE_VIDEO_SERVICE_URL', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ employeeName, employeeInfo })
    // })
    // const { videoUrl } = await videoResponse.json()

    // Create session
    const session = storage.createSession({
      id: meetingId,
      employeeName,
      employeeInfo,
      videoUrl: mockVideoUrl,
      status: 'ready',
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

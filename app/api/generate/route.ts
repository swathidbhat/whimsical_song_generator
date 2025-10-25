import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { storage } from '@/lib/storage'
import { generateTerminationVideo } from '@/lib/video-generator'

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

    // Create session with pending status
    const session = storage.createSession({
      id: meetingId,
      employeeName,
      employeeInfo,
      status: 'pending',
    })

    console.log('✅ Session created:', {
      id: session.id,
      name: session.employeeName,
      videoUrl: session.videoUrl
    })

    // Verify session was stored
    const verifySession = storage.getSession(meetingId)
    console.log('🔍 Session verification:', verifySession ? 'Found' : 'NOT FOUND')

    // Generate meeting link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const meetingLink = `${baseUrl}/meeting/${meetingId}`

    // Return immediately with pending status
    const response = NextResponse.json({
      success: true,
      meetingId,
      meetingLink,
      status: 'pending',
    })

    // Start background processing (non-blocking)
    // Stage 1: Generate lyrics via Flask service
    processVideoGeneration(meetingId, employeeName, employeeInfo).catch(error => {
      console.error(`[${meetingId}] Background processing failed:`, error)
    })

    return response
  } catch (error) {
    console.error('Error generating meeting:', error)
    return NextResponse.json(
      { error: 'Failed to generate meeting' },
      { status: 500 }
    )
  }
}

/**
 * Background processing function
 * Generates lyrics, then triggers the Replicate pipeline
 */
async function processVideoGeneration(
  meetingId: string,
  employeeName: string,
  employeeInfo: string
): Promise<void> {
  try {
    console.log(`[${meetingId}] Starting background video generation`)

    // Stage 1: Generate lyrics via Flask service
    storage.updateSession(meetingId, { status: 'generating_lyrics' })
    const VIDEO_SERVICE_URL = process.env.VIDEO_SERVICE_URL || 'http://localhost:5000'

    const videoResponse = await fetch(`${VIDEO_SERVICE_URL}/generate-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeName, employeeInfo }),
    })

    if (!videoResponse.ok) {
      throw new Error(`Lyrics service error: ${await videoResponse.text()}`)
    }

    const data = await videoResponse.json()
    const lyrics = data.lyrics

    if (!lyrics) {
      throw new Error('No lyrics returned from service')
    }

    console.log(`[${meetingId}] Lyrics generated:`, lyrics)
    storage.updateSession(meetingId, { lyrics })

    // Stages 2-4: Generate music, convert voice, generate video
    await generateTerminationVideo(meetingId, employeeName, employeeInfo, lyrics)

    console.log(`[${meetingId}] All stages complete!`)
  } catch (error) {
    console.error(`[${meetingId}] Processing error:`, error)
    storage.updateSession(meetingId, {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const session = storage.getSession(id)

    if (!session) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      videoUrl: session.videoUrl,
      employeeName: session.employeeName,
      status: session.status,
    })
  } catch (error) {
    console.error('Error fetching meeting:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meeting' },
      { status: 500 }
    )
  }
}

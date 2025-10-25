import Replicate from 'replicate'
import { storage } from '@/lib/storage'
import { readFileSync } from 'fs'
import { join } from 'path'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

// Timeout values (in milliseconds)
const TIMEOUT_LYRICS = parseInt(process.env.TIMEOUT_LYRICS || '30000')
const TIMEOUT_MUSIC = parseInt(process.env.TIMEOUT_MUSIC || '300000')
const TIMEOUT_VOICE = parseInt(process.env.TIMEOUT_VOICE || '180000')
const TIMEOUT_VIDEO = parseInt(process.env.TIMEOUT_VIDEO || '600000')

// Load configuration from prompts directory
function loadPromptConfig(filename: string): string {
  const promptPath = join(process.cwd(), 'prompts', filename)
  return readFileSync(promptPath, 'utf-8').trim()
}

/**
 * Stage 2: Generate music with lyrics using Music 1.5
 */
async function generateMusic(lyrics: string): Promise<string> {
  const musicStylePrompt = loadPromptConfig('music-style.txt')

  console.log('[Music Generation] Starting with lyrics:', lyrics)
  console.log('[Music Generation] Style prompt:', musicStylePrompt)

  const output = await replicate.run(
    'minimax/music-1.5:5080f14bbbfd3da1cf1387fa8799ce3c24ae7c9f43c2b9f406657d2e70784446',
    {
      input: {
        prompt: musicStylePrompt,
        lyrics: lyrics,
        bitrate: 256000,
        sample_rate: 44100,
        audio_format: 'wav',
      },
    }
  )

  // Output is a file URL
  const musicUrl = typeof output === 'string' ? output : (output as any)?.toString()

  if (!musicUrl) {
    throw new Error('Music generation failed: No output URL')
  }

  console.log('[Music Generation] Complete. URL:', musicUrl)
  return musicUrl
}

/**
 * Stage 3: Convert voice using singing voice conversion
 */
async function convertVoice(musicUrl: string): Promise<string> {
  const targetSinger = loadPromptConfig('voice-config.txt')

  console.log('[Voice Conversion] Starting with music URL:', musicUrl)
  console.log('[Voice Conversion] Target singer:', targetSinger)

  const output = await replicate.run(
    'lucataco/singing_voice_conversion:6c2ff4836d8acc30e3c89c81bfe555f6a7ac9de4fa61dbc4bc92f3cc90a6d02e',
    {
      input: {
        source_audio: musicUrl,
        target_singer: targetSinger,
        key_shift_mode: 0,
        pitch_shift_control: 'Auto Shift',
        diffusion_inference_steps: 1000,
      },
    }
  )

  // Output is a file URL
  const singingUrl = typeof output === 'string' ? output : (output as any)?.toString()

  if (!singingUrl) {
    throw new Error('Voice conversion failed: No output URL')
  }

  console.log('[Voice Conversion] Complete. URL:', singingUrl)
  return singingUrl
}

/**
 * Stage 4: Generate avatar video with lip-sync
 */
async function generateAvatar(audioUrl: string): Promise<string> {
  // Use default avatar image
  const avatarImageUrl =
    process.env.DEFAULT_AVATAR_URL ||
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/avatar.jpg`

  console.log('[Avatar Generation] Starting with audio URL:', audioUrl)
  console.log('[Avatar Generation] Avatar image:', avatarImageUrl)

  const output = await replicate.run(
    'bytedance/omni-human:27ff118087d512ffb93b1d115bbf46c96e51b25dfb4ee30337d6fa9bece05f4a',
    {
      input: {
        audio: audioUrl,
        image: avatarImageUrl,
      },
    }
  )

  // Output is a video file URL
  const videoUrl = typeof output === 'string' ? output : (output as any)?.toString()

  if (!videoUrl) {
    throw new Error('Avatar generation failed: No output URL')
  }

  console.log('[Avatar Generation] Complete. URL:', videoUrl)
  return videoUrl
}

/**
 * Main orchestrator: Generate complete termination video
 * Runs all stages sequentially and updates session status
 */
export async function generateTerminationVideo(
  meetingId: string,
  employeeName: string,
  employeeInfo: string,
  lyrics: string
): Promise<void> {
  let currentStage = ''

  try {
    console.log(`[${meetingId}] Starting video generation pipeline`)

    // Stage 2: Generate music
    currentStage = 'generating_music'
    storage.updateSession(meetingId, { status: 'generating_music' })
    const musicUrl = await generateMusic(lyrics)
    storage.updateSession(meetingId, { musicUrl })
    console.log(`[${meetingId}] Music generation complete`)

    // Stage 3: Convert voice (TEMPORARILY SKIPPED)
    console.log(`[${meetingId}] Skipping voice conversion - using music directly`)
    const singingUrl = musicUrl // Use music URL directly instead of converting
    storage.updateSession(meetingId, { singingUrl })

    // Stage 4: Generate avatar video
    currentStage = 'generating_video'
    storage.updateSession(meetingId, { status: 'generating_video' })
    const videoUrl = await generateAvatar(singingUrl)
    console.log(`[${meetingId}] Avatar video generation complete`)

    // Mark as ready
    storage.updateSession(meetingId, {
      videoUrl,
      status: 'ready',
      completedAt: new Date(),
    })

    console.log(`[${meetingId}] Pipeline complete! Video URL: ${videoUrl}`)
  } catch (error) {
    console.error(`[${meetingId}] Error in ${currentStage}:`, error)

    storage.updateSession(meetingId, {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      failedStage: currentStage,
    })

    throw error
  }
}

/**
 * Helper function to validate lyric length (20-30 words for 15 seconds)
 */
export function validateLyrics(lyrics: string): boolean {
  const wordCount = lyrics.split(/\s+/).filter(word => word.length > 0).length
  return wordCount >= 15 && wordCount <= 50 // Allow some flexibility
}

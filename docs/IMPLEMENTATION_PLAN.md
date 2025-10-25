# Backend Implementation Plan

## Overview

This document outlines the implementation strategy for the AI-powered termination song generation backend. The system orchestrates multiple AI models to create a personalized video experience delivered through a fake Zoom meeting interface.

## Architecture Flow

```
User Input → Lyrics Generation → Music Generation → Voice Conversion → Avatar Video → Meeting Link
   (Form)      (OpenAI API)      (Music 1.5)      (Singing Voice)    (OmniHuman)     (Display)
```

## Technology Stack

- **Framework:** Next.js 14 API Routes
- **Language:** TypeScript
- **AI Orchestration:** Replicate Node.js SDK
- **Storage:** In-memory Map (upgrade to database for production)
- **Environment:** Node.js 18+

## ⚠️ CRITICAL CONSTRAINT: 15-Second Audio Limit

All audio files generated through the pipeline MUST be 15 seconds or less due to the OmniHuman model limitation. This constraint affects every stage:

1. **Lyrics:** Brief, 20-30 words maximum
2. **Music:** Explicit "15 second" instruction in prompt
3. **Voice Conversion:** Inherits 15-second limit from music input
4. **Avatar Video:** Guaranteed ≤15 seconds from previous stages

**Validation Points:**
- Stage 1: Lyric word count validation
- Stage 2: Audio duration check after generation (reject if > 15s)
- Stage 4: Pre-submission audio duration verification

---

## Processing Pipeline

### Stage 1: Lyrics Generation (IMPLEMENTED)
**Status:** ✅ Complete
**Location:** `app/api/generate/route.ts` (to be extracted)
**Service:** OpenAI API
**Duration Constraint:** ⚠️ CRITICAL - Must generate lyrics for 15-second song maximum

**Current Implementation:**
- Accepts employee name and info
- Uses custom prompt from text file
- Generates personalized termination song lyrics
- Returns structured lyrics with verses/chorus

**Next Steps:**
- Extract prompt to `/prompts/lyrics-generation.txt` for easy editing
- **UPDATE PROMPT:** Explicitly instruct OpenAI to create lyrics for a 15-second song only
- Add lyric length validation (recommend max 100-150 characters total)
- Add error handling and retry logic

---

### Stage 2: Music Generation
**Status:** ⏳ To Implement
**Service:** Replicate - minimax/music-1.5
**Model Version:** `5080f14bbbfd3da1cf1387fa8799ce3c24ae7c9f43c2b9f406657d2e70784446`
**Duration Constraint:** ⚠️ CRITICAL - Must output 15-second audio maximum

**Input Parameters:**
```typescript
{
  prompt: string,          // Music style description (10-300 chars)
                          // MUST include "15 seconds" or "short" in prompt
  lyrics: string,          // Generated lyrics from Stage 1 (10-600 chars)
                          // Should be brief, max 100-150 characters
  bitrate: 256000,         // Audio quality
  sample_rate: 44100,      // Standard audio sample rate
  audio_format: "wav"      // Output format (wav preferred for Stage 3)
}
```

**Output:**
- WAV audio file URL
- Duration: ~15 seconds (ENFORCED)

**Implementation Notes:**
- ⚠️ **CRITICAL:** Include duration constraint in prompt: "15 second song, very short, quick"
- Use minimal structure: `[verse]` and `[chorus]` ONLY (no intro, bridge, outro)
- Separate lines with `\n`
- Store music prompt in `/prompts/music-style.txt`
- WAV format recommended for better quality in voice conversion
- **Validation:** After generation, check audio duration using metadata/headers
- **Fallback:** If audio > 15 seconds, trim to first 15 seconds using FFmpeg or reject

**Error Handling:**
- Timeout: 5 minutes max
- Retry on failure: 2 attempts
- Duration validation: REJECT if > 15 seconds
- Fallback: Log error, mark session as 'failed'

---

### Stage 3: Voice Conversion
**Status:** ⏳ To Implement
**Service:** Replicate - lucataco/singing_voice_conversion
**Model:** Amphion Singing Voice Conversion (DiffWaveNetSVC)

**Input Parameters:**
```typescript
{
  source_audio: string,              // URL from Stage 2 output
  target_singer: string,             // Voice selection (configurable)
  key_shift_mode: 0,                 // No pitch shift (default)
  pitch_shift_control: "Auto Shift", // Automatic pitch adjustment
  diffusion_inference_steps: 1000    // Quality setting
}
```

**Available Singers:**
- English: Adele, John Mayer, Bruno Mars, Beyoncé, Michael Jackson, Taylor Swift
- Mandarin/Cantonese: David Tao, Eason Chan, Feng Wang, Jian Li, Ying Na, Yijie Shi, Jacky Cheung, Faye Wong, Tsai Chin

**Output:**
- WAV audio file URL with converted vocals
- Naming pattern: `source_vocalist_l1_[SingerName].wav`

**Implementation Notes:**
- Store default singer in `/prompts/voice-config.txt`
- Allow future customization per request
- Handle conversion failures gracefully

**Error Handling:**
- Timeout: 3 minutes max
- Quality validation: Check file size > 0
- Retry logic: 1 retry on network failure

---

### Stage 4: Avatar Video Generation
**Status:** ⏳ To Implement
**Service:** Replicate - bytedance/omni-human
**Model:** OmniHuman audio-driven animation
**Duration Constraint:** ✅ Satisfied - Audio from Stage 3 is already ≤15 seconds

**Input Parameters:**
```typescript
{
  audio: string,  // URL from Stage 3 output (WAV file, ≤15 seconds)
  image: string   // Static avatar image URL
}
```

**Output:**
- MP4 video file URL
- Lip-synced animation with audio
- Duration: ~15 seconds (matches input audio)

**Implementation Notes:**
- **Avatar Image Options:**
  1. **Static hosted image:** Store default avatar in `/public/avatar.jpg`
  2. **External URL:** Configure in environment variable `DEFAULT_AVATAR_URL`
  3. **Future:** Allow manager to select avatar style
- **Audio Duration Guarantee:**
  - Input audio is guaranteed to be ≤15 seconds from Stage 3
  - No splitting or stitching required
  - OmniHuman model constraint automatically satisfied

**Pre-validation:**
- Double-check audio duration before API call
- Reject if audio > 15 seconds (safety check)

**Error Handling:**
- Timeout: 10 minutes max
- Validate MP4 output format
- Validate audio duration < 15 seconds before submission
- Log generation metrics

---

## Status Tracking

### MeetingSession Interface Extension

Update `/lib/storage.ts`:

```typescript
interface MeetingSession {
  id: string
  employeeName: string
  employeeInfo: string

  // Processing status
  status: 'pending' | 'generating_lyrics' | 'generating_music' |
          'converting_voice' | 'generating_video' | 'ready' | 'failed'

  // Stage outputs
  lyrics?: string
  musicUrl?: string      // Stage 2 output
  singingUrl?: string    // Stage 3 output
  videoUrl?: string      // Stage 4 output (final)

  // Error tracking
  error?: string
  failedStage?: string

  // Timestamps
  createdAt: Date
  updatedAt?: Date
  completedAt?: Date
}
```

### Status Progression

1. **pending** → Initial state after meeting ID created
2. **generating_lyrics** → OpenAI API call in progress
3. **generating_music** → Music 1.5 processing
4. **converting_voice** → Voice conversion processing
5. **generating_video** → Avatar video generation
6. **ready** → Final video available
7. **failed** → Error occurred (check `error` and `failedStage`)

---

## API Route Structure

### POST /api/generate (Enhanced)

**Request:**
```typescript
{
  employeeName: string
  employeeInfo: string
}
```

**Response:**
```typescript
{
  success: boolean
  meetingId: string
  meetingLink: string
  status: 'pending'  // Always pending initially
}
```

**Processing Flow:**
1. Generate unique meeting ID (nanoid)
2. Create session with status 'pending'
3. Return meeting link immediately
4. Trigger background processing (async)

---

### Background Processing Service

**Location:** `/lib/video-generator.ts` (new file)

```typescript
async function generateTerminationVideo(
  meetingId: string,
  employeeName: string,
  employeeInfo: string
): Promise<void>
```

**Workflow:**

```typescript
// 1. Update status: generating_lyrics
updateSessionStatus(meetingId, 'generating_lyrics')
const lyrics = await generateLyrics(employeeName, employeeInfo)
updateSession(meetingId, { lyrics })

// 2. Update status: generating_music
updateSessionStatus(meetingId, 'generating_music')
const musicUrl = await generateMusic(lyrics)
updateSession(meetingId, { musicUrl })

// 3. Update status: converting_voice
updateSessionStatus(meetingId, 'converting_voice')
const singingUrl = await convertVoice(musicUrl)
updateSession(meetingId, { singingUrl })

// 4. Update status: generating_video
updateSessionStatus(meetingId, 'generating_video')
const videoUrl = await generateAvatar(singingUrl)
updateSession(meetingId, { videoUrl, status: 'ready', completedAt: new Date() })
```

**Error Handling:**
```typescript
try {
  // ... processing stages
} catch (error) {
  updateSession(meetingId, {
    status: 'failed',
    error: error.message,
    failedStage: currentStage
  })
}
```

---

## Meeting Page Updates

### GET /api/meeting/[id] (Enhanced)

**Current:** Returns session data
**Enhancement:** Return processing status for polling

**Response:**
```typescript
{
  id: string
  employeeName: string
  status: SessionStatus
  videoUrl?: string      // Only present when status === 'ready'
  error?: string         // Only present when status === 'failed'
  estimatedTimeRemaining?: number  // Seconds (optional)
}
```

### Frontend Polling

**Location:** `/app/meeting/[id]/page.tsx`

**Implementation:**
```typescript
// Poll every 3 seconds while status !== 'ready' && status !== 'failed'
useEffect(() => {
  if (session.status === 'pending' || session.status.startsWith('generating')) {
    const interval = setInterval(fetchSessionStatus, 3000)
    return () => clearInterval(interval)
  }
}, [session.status])
```

**UI States:**
- **pending/generating_*:** Show loading spinner with status message
  - "Generating your personalized termination song..."
  - "Creating musical arrangement..."
  - "Converting vocals..."
  - "Generating video avatar..."
- **ready:** Load and autoplay video
- **failed:** Show error message with retry option

---

## Configuration Files

### /prompts/lyrics-generation.txt

```txt
You are a creative AI songwriter tasked with writing a humorous, personalized termination song.

Employee Name: {employeeName}
Employee Info: {employeeInfo}

CRITICAL CONSTRAINT: This must be a 15-SECOND song. Keep lyrics VERY SHORT.

Write lyrics with the following structure:
- [verse]: ONE short line introducing the employee (max 10 words)
- [chorus]: Main termination message - catchy and punchy (max 15 words)

Total lyrics should be 20-30 words maximum to fit in 15 seconds of music.

Example format:
[verse]
{EmployeeName}, your time here is done

[chorus]
You're fired today, time to move on, find a new way!

Tone: Humorous but not mean-spirited, quick and punchy
Style: Pop/comedy song, simple rhymes
Length: 15 seconds total, 20-30 words maximum
```

### /prompts/music-style.txt

```txt
15 second song, very short, quick, upbeat, comedic pop, humorous tone, termination theme, corporate satire, fast-paced
```

### /prompts/voice-config.txt

```txt
Taylor Swift
```

**Note:** These files allow non-developers to customize the generation without touching code.

---

## Environment Variables

### .env.local (Required)

```bash
# OpenAI (Already configured)
OPENAI_API_KEY=sk-...

# Replicate API
REPLICATE_API_TOKEN=r8_...

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Optional: Custom avatar image
DEFAULT_AVATAR_URL=https://your-cdn.com/avatar.jpg

# Optional: Processing timeouts (seconds)
TIMEOUT_LYRICS=30
TIMEOUT_MUSIC=300
TIMEOUT_VOICE=180
TIMEOUT_VIDEO=600
```

---

## Replicate SDK Integration

### Installation

```bash
npm install replicate
```

### Basic Usage Pattern

```typescript
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

// Method 1: Run with polling (simple)
const output = await replicate.run(
  "model-owner/model-name:version-hash",
  { input: { param1: value1 } }
)

// Method 2: Create prediction and poll manually (more control)
let prediction = await replicate.predictions.create({
  version: "version-hash",
  input: { param1: value1 }
})

// Poll until complete
while (prediction.status === 'starting' || prediction.status === 'processing') {
  await new Promise(resolve => setTimeout(resolve, 2000))
  prediction = await replicate.predictions.get(prediction.id)
}

if (prediction.status === 'succeeded') {
  return prediction.output
} else {
  throw new Error(prediction.error)
}
```

---

## Implementation Phases

### Phase 1: Setup & Structure (Day 1, Hours 1-2)
- [ ] Install Replicate SDK: `npm install replicate`
- [ ] Create `/lib/video-generator.ts` with type definitions
- [ ] Update `/lib/storage.ts` with extended MeetingSession interface
- [ ] Create `/prompts` directory with configuration files
- [ ] Set up environment variables

### Phase 2: Music Generation (Day 1, Hours 3-4)
- [ ] Implement `generateMusic()` function
- [ ] Test Music 1.5 API with sample lyrics
- [ ] Add WAV file validation
- [ ] Implement retry logic
- [ ] Update session status tracking

### Phase 3: Voice Conversion (Day 1, Hours 5-6)
- [ ] Implement `convertVoice()` function
- [ ] Test singing voice conversion with Music 1.5 output
- [ ] Handle voice selection from config
- [ ] Validate audio output quality
- [ ] Error handling for conversion failures

### Phase 4: Avatar Video (Day 2, Hours 1-3)
- [ ] Set up default avatar image
- [ ] Implement `generateAvatar()` function
- [ ] Test OmniHuman with converted audio
- [ ] Handle 15-second audio limitation
- [ ] Validate MP4 output

### Phase 5: Integration (Day 2, Hours 4-5)
- [ ] Create background processing orchestrator
- [ ] Update `/api/generate/route.ts` for async processing
- [ ] Implement status polling endpoint
- [ ] Update meeting page with loading states
- [ ] End-to-end testing

### Phase 6: Polish & Error Handling (Day 2, Hours 6-7)
- [ ] Add comprehensive error messages
- [ ] Implement retry mechanisms
- [ ] Add logging for debugging
- [ ] Test failure scenarios
- [ ] Performance optimization

---

## Testing Strategy

### Unit Tests
- Test each generation function independently
- Mock Replicate API responses
- Validate error handling

### Integration Tests
1. **Happy Path:** Full pipeline from form submission to video display
2. **Failure Recovery:** Test retry logic at each stage
3. **Timeout Handling:** Simulate long-running processes
4. **Status Updates:** Verify session state transitions

### Manual Testing Checklist
- [ ] Submit employee info from manager page
- [ ] Verify immediate meeting link generation
- [ ] Open meeting link in new tab
- [ ] Verify "Please wait" loading state
- [ ] Monitor status transitions in browser console
- [ ] Confirm video loads when status becomes 'ready'
- [ ] Test webcam recording functionality
- [ ] Verify recording downloads on completion

---

## Performance Considerations

### Expected Processing Times
- **Lyrics Generation:** 5-10 seconds (15-second song constraint)
- **Music Generation:** 30-60 seconds (shorter due to 15-second output)
- **Voice Conversion:** 15-30 seconds (shorter due to 15-second input)
- **Avatar Video:** 60-120 seconds (optimized for 15-second audio)
- **Total:** ~2-4 minutes (faster due to 15-second constraint)

### Optimization Strategies
1. **Parallel Processing:** If possible, prepare assets in parallel (currently sequential)
2. **Caching:** Store generated content for debugging/reuse
3. **Progressive Loading:** Show partial results (e.g., display lyrics while music generates)
4. **Queue Management:** Implement job queue for multiple simultaneous requests

### Scalability Notes
- Current in-memory storage won't persist across server restarts
- For production: Migrate to PostgreSQL/MongoDB
- Consider Redis for session caching
- Implement webhook-based processing for better reliability

---

## Security & Privacy

### API Key Management
- Never commit API keys to Git
- Use `.env.local` (gitignored)
- Validate environment variables on startup

### Content Moderation
- Add profanity filter for user input
- Validate employee info length limits
- Sanitize inputs before passing to AI models

### Rate Limiting
- Implement per-IP rate limiting (5 requests/hour)
- Add CAPTCHA for production
- Monitor API usage costs

---

## Monitoring & Debugging

### Logging Strategy
```typescript
// Add to each processing stage
console.log(`[${meetingId}] Stage: ${stage}, Status: ${status}`)
console.log(`[${meetingId}] Output URL: ${outputUrl}`)
console.error(`[${meetingId}] Error in ${stage}:`, error)
```

### Metrics to Track
- Average processing time per stage
- Success/failure rates
- API costs per request
- User drop-off rates (meeting link clicks vs. video views)

---

## Future Enhancements

### Short-term (Post-Hackathon)
- [ ] Database migration for persistent storage
- [ ] Webhook-based processing (Replicate callbacks)
- [ ] Email notifications when video is ready
- [ ] Multiple avatar options
- [ ] Voice selection UI

### Long-term
- [ ] Custom voice cloning (upload manager's voice)
- [ ] Video stitching for >15 second songs
- [ ] Reactions analytics (facial expression analysis)
- [ ] Social sharing features
- [ ] Manager dashboard with history

---

## Cost Estimates

### Per Video Generation
- **OpenAI (Lyrics):** ~$0.01
- **Music 1.5:** $0.03
- **Voice Conversion:** $0.02-0.05 (estimate)
- **OmniHuman (Avatar):** $0.05-0.10 (estimate)
- **Total:** ~$0.11-0.19 per video

### Monthly Projections (100 videos)
- Total cost: $11-19
- Storage: Minimal (videos stored on Replicate)
- Hosting: DigitalOcean App Platform (~$5-10/month)

---

## Documentation References

1. **Replicate Node.js SDK:** https://github.com/replicate/replicate-javascript
2. **Music 1.5 Model:** https://replicate.com/minimax/music-1.5
3. **Singing Voice Conversion:** https://replicate.com/lucataco/singing_voice_conversion
4. **OmniHuman Avatar:** https://replicate.com/bytedance/omni-human
5. **Next.js API Routes:** https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

## Support & Troubleshooting

### Common Issues

**Issue:** "Replicate API timeout"
- **Solution:** Increase timeout values in environment variables
- **Workaround:** Implement webhook-based processing

**Issue:** "Voice conversion quality poor"
- **Solution:** Ensure Music 1.5 outputs WAV format
- **Solution:** Increase `diffusion_inference_steps` to 1500

**Issue:** "Avatar video audio mismatch"
- **Solution:** Verify audio file is accessible and valid WAV/MP3
- **Solution:** Check audio duration < 15 seconds

**Issue:** "Meeting shows 'Please wait' indefinitely"
- **Solution:** Check server logs for failed pipeline stage
- **Solution:** Verify Replicate API token is valid
- **Solution:** Check network connectivity to Replicate

---

## Questions for Product Team

Before implementation, clarify:
1. ✅ What should the music style/genre be? (Configurable in prompts/music-style.txt)
2. ✅ Which voice should be the default? (Configurable in prompts/voice-config.txt)
3. ⏳ Should managers be able to customize these settings?
4. ⏳ What should happen if video generation fails? (Show error message? Fallback video?)
5. ⏳ Is there a maximum wait time before showing an error?
6. ⏳ Should we email the meeting link or just display it?
7. ⏳ Do we need to store reactions/analytics?

---

## Appendix: File Structure

```
dumb_dump_songs/
├── app/
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts          # Enhanced with async processing
│   │   └── meeting/
│   │       └── [id]/
│   │           └── route.ts      # Add status polling
│   ├── manager/
│   │   └── page.tsx              # Form submission
│   └── meeting/
│       └── [id]/
│           └── page.tsx          # Add loading states & polling
├── lib/
│   ├── storage.ts                # Extended MeetingSession interface
│   └── video-generator.ts        # NEW: Background processing logic
├── prompts/                       # NEW: Editable configuration
│   ├── lyrics-generation.txt     # OpenAI prompt template
│   ├── music-style.txt           # Music 1.5 style prompt
│   └── voice-config.txt          # Default singer name
├── public/
│   └── avatar.jpg                # NEW: Default avatar image (optional)
├── docs/
│   └── IMPLEMENTATION_PLAN.md    # This document
├── .env.local                     # API keys (gitignored)
└── package.json                   # Add replicate dependency
```

---

**Document Version:** 1.0
**Last Updated:** 2025-10-25
**Author:** Claude Code
**Status:** Ready for Implementation

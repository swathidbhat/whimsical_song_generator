# Backend Setup Guide

This guide walks you through setting up the complete AI-powered termination song generation backend.

## Prerequisites

- Node.js 18+ installed
- Python 3.8+ installed (for Flask lyrics service)
- OpenAI API key
- Replicate API token
- Default avatar image (optional)

## Step 1: Install Dependencies

### Node.js Dependencies
```bash
npm install
```

The `replicate` package should already be installed. If not:
```bash
npm install replicate
```

### Python Dependencies (Flask Service)
```bash
cd teammate_integration
pip install -r requirements.txt
```

## Step 2: Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```bash
# Required
OPENAI_API_KEY=sk-proj-...                    # Get from https://platform.openai.com/api-keys
REPLICATE_API_TOKEN=r8_...                     # Get from https://replicate.com/account/api-tokens
NEXT_PUBLIC_BASE_URL=http://localhost:3000
VIDEO_SERVICE_URL=http://localhost:5000

# Optional (uses defaults if not set)
# DEFAULT_AVATAR_URL=https://your-cdn.com/avatar.jpg
```

## Step 3: Set Up Default Avatar Image

You need an image of a person/character for the AI avatar video.

**Option 1: Use a hosted image**
Set `DEFAULT_AVATAR_URL` in `.env.local` to a publicly accessible image URL.

**Option 2: Use a local image**
Place an image file at `/public/avatar.jpg` (the code will use this by default).

**Image Requirements:**
- Format: JPG, PNG, or WEBP
- Contains a human face or character
- Any aspect ratio (portrait, half-body, or full-body works)
- Works with realistic photos, cartoons, or stylized images

## Step 4: Customize Prompts (Optional)

Edit the prompt configuration files to customize the output:

### `/prompts/lyrics-generation.txt`
Currently handled by the Flask service (`teammate_integration/lyrics_api.py`).
To customize, edit the `PROMPT_TEMPLATE` in that file.

### `/prompts/music-style.txt`
Customize the music style for the song:
```
15 second song, very short, quick, upbeat, comedic pop, humorous tone, termination theme, corporate satire, fast-paced
```

### `/prompts/voice-config.txt`
Change the AI singer voice (available options):
- English: Taylor Swift, Adele, John Mayer, Bruno Mars, Beyoncé, Michael Jackson
- Mandarin/Cantonese: David Tao, Eason Chan, Feng Wang, Jian Li, Ying Na, Yijie Shi, Jacky Cheung, Faye Wong, Tsai Chin

Default:
```
Taylor Swift
```

## Step 5: Start the Services

You need to run **two** services simultaneously:

### Terminal 1: Flask Lyrics Service
```bash
cd teammate_integration
python lyrics_api.py
```

You should see:
```
* Running on http://0.0.0.0:5000
```

### Terminal 2: Next.js App
```bash
npm run dev
```

You should see:
```
ready - started server on 0.0.0.0:3000
```

## Step 6: Test the Integration

1. Open your browser to `http://localhost:3000/manager`
2. Fill in the employee information form:
   - Employee Name: "John Doe"
   - Employee Info: "Sales rep, 3 years at company, missed quota"
3. Click "Generate Termination Song"
4. Copy the meeting link
5. Open the meeting link in a **new tab** (or share it)
6. You should see:
   - Loading screen with progress indicators
   - Status updates as each stage completes:
     - ✅ Writing lyrics
     - ✅ Generating music
     - ✅ Converting voice
     - ✅ Creating video
7. After 2-4 minutes, the video should load and autoplay
8. Allow webcam access when prompted
9. Your reaction will be recorded automatically
10. The recording downloads when the video ends

## Troubleshooting

### "Failed to call video service"
- Make sure the Flask service is running on port 5000
- Check `VIDEO_SERVICE_URL` in `.env.local`
- Verify `OPENAI_API_KEY` is set correctly

### "Music generation failed"
- Check `REPLICATE_API_TOKEN` is valid
- Verify you have credits in your Replicate account
- Check the server console for detailed error messages

### "Voice conversion failed"
- Ensure the singer name in `/prompts/voice-config.txt` is spelled exactly as listed
- Check that the music file was generated successfully (should see a URL in logs)

### "Avatar generation failed"
- Verify `DEFAULT_AVATAR_URL` is publicly accessible
- OR ensure `/public/avatar.jpg` exists
- Check that the audio file is ≤15 seconds

### Video keeps showing "Please wait..."
- Check the browser console for errors
- Check the server logs for the meeting ID
- Verify all services are running
- Check if the session status is stuck (inspect via logs)

### Recording doesn't download
- Ensure webcam permissions are granted
- Check browser console for MediaRecorder errors
- Try in Chrome/Edge (best WebM support)

## Monitoring

Watch the server console for detailed logs:

```
[abc123] Starting background video generation
[abc123] Lyrics generated: [verse] John Doe...
[abc123] Stage: generating_music, Status: generating_music
[abc123] Music generation complete
[abc123] Stage: converting_voice, Status: converting_voice
[abc123] Voice conversion complete
[abc123] Stage: generating_video, Status: generating_video
[abc123] Avatar video generation complete
[abc123] Pipeline complete! Video URL: https://...
```

## Performance

Expected processing times:
- **Lyrics:** 5-10 seconds
- **Music:** 30-60 seconds
- **Voice:** 15-30 seconds
- **Video:** 60-120 seconds
- **Total:** ~2-4 minutes

## Cost per Generation

- OpenAI (lyrics): ~$0.01
- Music 1.5: $0.03
- Voice Conversion: ~$0.02-0.05
- OmniHuman: ~$0.05-0.10
- **Total:** ~$0.11-0.19 per video

## Production Deployment

For production deployment:

1. **Environment Variables:**
   - Set all required env vars in your hosting platform
   - Use production URLs for `NEXT_PUBLIC_BASE_URL`

2. **Database Migration:**
   - Replace in-memory storage with PostgreSQL/MongoDB
   - Update `/lib/storage.ts` with database client

3. **Avatar Hosting:**
   - Host avatar images on a CDN
   - Set `DEFAULT_AVATAR_URL` to CDN URL

4. **Flask Service:**
   - Deploy Flask service separately (e.g., Railway, Render)
   - Update `VIDEO_SERVICE_URL` to production endpoint
   - Use production WSGI server (gunicorn)

5. **Monitoring:**
   - Add error tracking (Sentry)
   - Set up logging service
   - Monitor API costs

6. **Optimization:**
   - Implement webhook-based processing (Replicate webhooks)
   - Add job queue (Bull, BullMQ)
   - Cache results for debugging

## Need Help?

- Check the implementation plan: `/docs/IMPLEMENTATION_PLAN.md`
- Review the codebase docs: `/CLAUDE.md`
- Check Flask service docs: `/teammate_integration/README.md`

## Next Steps

- Customize prompts for your use case
- Add more avatar options
- Implement user authentication
- Add analytics tracking
- Enable social sharing

# 🎵 Lyrics Generator Integration Guide

**For the teammate working on lyrics/video generation**

## Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
cd teammate_integration
pip install -r requirements.txt
```

### 2. Set Environment Variable

Create `.env` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Run the API

```bash
python lyrics_api.py
```

Server will start at: `http://localhost:5000`

### 4. Test It

```bash
curl -X POST http://localhost:5000/generate-video \
  -H "Content-Type: application/json" \
  -d '{
    "employeeName": "John Doe",
    "employeeInfo": "Sales rep, 3 years at company, missed quota"
  }'
```

Expected response:
```json
{
  "videoUrl": "https://...",
  "status": "ready",
  "lyrics": "... generated lyrics ..."
}
```

## Integration Steps

### Current Flow:

```
Next.js Web App → Flask API → OpenAI (lyrics) → ElevenLabs (voice) → Replicate (video)
     (Port 3000)    (Port 5000)
```

### What's Working Now:

1. ✅ Next.js app generates meeting links
2. ✅ Flask API generates lyrics with OpenAI
3. 🔄 Need: ElevenLabs voice synthesis
4. 🔄 Need: Replicate video generation

### What You Need to Add:

Edit `lyrics_api.py` around line 110 (after lyrics generation):

```python
# 1. Generate lyrics (DONE)
lyrics = generate_lyrics(emp)

# 2. Generate voice with ElevenLabs
import requests
ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY')
voice_response = requests.post(
    "https://api.elevenlabs.io/v1/text-to-speech/YOUR_VOICE_ID",
    headers={"xi-api-key": ELEVENLABS_API_KEY},
    json={"text": lyrics}
)
audio_url = voice_response.json()["audio_url"]

# 3. Generate video with Replicate (ByteDance model)
import replicate
output = replicate.run(
    "bytedance/some-model",  # Use ByteDance model (they're sponsors)
    input={
        "audio": audio_url,
        "prompt": f"AI avatar singing"
    }
)
video_url = output

# 4. Return real video URL
return jsonify({
    "videoUrl": video_url,
    "status": "ready",
    "lyrics": lyrics
})
```

## API Contract

### Input from Next.js:
```typescript
POST /generate-video
{
  "employeeName": "John Doe",
  "employeeInfo": "Sales rep, 3 years, missed quota..."
}
```

### Output to Next.js:
```typescript
{
  "videoUrl": "https://replicate.delivery/video123.mp4",
  "status": "ready" | "processing" | "failed",
  "lyrics": "... the generated song lyrics ..."
}
```

## Environment Variables You Need

Create `.env`:
```env
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
REPLICATE_API_TOKEN=...
```

## Testing Locally

1. **Start Flask API** (Terminal 1):
   ```bash
   python lyrics_api.py
   ```

2. **Start Next.js** (Terminal 2):
   ```bash
   npm run dev
   ```

3. **Test in browser**:
   - Go to http://localhost:3000/manager
   - Generate a song
   - It should call your Flask API!

## Troubleshooting

### "Connection refused" error?
- Make sure Flask is running on port 5000
- Check: `curl http://localhost:5000/health`

### CORS error in browser?
- Flask-CORS is already installed
- Check browser console for details

### OpenAI error?
- Check your API key in `.env`
- Make sure you have credits

## Next Steps

1. Get lyrics generation working (✅ done with this file)
2. Add ElevenLabs voice synthesis
3. Add Replicate video generation
4. Return real video URL
5. Test end-to-end!

## Questions?

Ask the web app teammate to check `app/api/generate/route.ts` - that's where it calls your API.

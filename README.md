# 🎵 Dumb Dump Songs

AI-powered web application that generates personalized termination songs delivered via a fake video meeting interface.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📋 Project Structure

```
├── app/
│   ├── manager/         # Manager dashboard (input form)
│   ├── meeting/[id]/    # Fake Zoom meeting interface
│   ├── api/
│   │   ├── generate/    # Create meeting & call video gen service
│   │   ├── meeting/[id]/# Fetch meeting data
│   │   └── record/      # Save reaction videos (optional)
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page (redirects to manager)
│   └── globals.css      # Global styles
├── lib/
│   └── storage.ts       # In-memory session storage
└── memory-bank/         # Project documentation
```

## 🎯 User Flow

### Manager Side
1. Go to `/manager`
2. Enter employee name and info
3. Click "Generate Termination Song"
4. Get shareable meeting link
5. Send link to employee

### Employee Side
1. Click meeting link
2. See realistic Zoom-like interface
3. AI avatar video plays (singing personalized song)
4. Webcam captures their reaction
5. Recording auto-downloads when video ends

## 🔗 Integration Guide for Teammates

### Video Generation Service Integration

**Current Status:** Using mock video URL for development

**What's needed:** Replace mock URL in `app/api/generate/route.ts`

#### Expected API Contract

**Endpoint:** Your video generation service should expose:

```typescript
POST /generate-video  // or whatever endpoint you create

Request Body:
{
  "employeeName": "John Doe",
  "employeeInfo": "Sales rep, 3 years, missed quota..."
}

Response:
{
  "videoUrl": "https://your-service.com/video123.mp4",
  "status": "ready" | "processing" | "failed"
}
```

#### Integration Steps

1. **Update `.env.local`:**
```env
VIDEO_SERVICE_URL=https://your-replicate-service.com/generate
VIDEO_SERVICE_API_KEY=your_api_key
```

2. **Update `app/api/generate/route.ts`:**

Find this section (line ~25):
```typescript
// TODO: Call teammate's video generation service
const mockVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
```

Replace with:
```typescript
// Call video generation service
const videoResponse = await fetch(process.env.VIDEO_SERVICE_URL!, {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.VIDEO_SERVICE_API_KEY}`
  },
  body: JSON.stringify({ employeeName, employeeInfo })
})
const { videoUrl } = await videoResponse.json()
```

### Gmail/Slack Integration (Person 4)

**Integration Point:** Add your data extraction here:

1. **Option 1 - Frontend:** Add to manager form
   - File: `app/manager/page.tsx`
   - Add "Import from Gmail/Slack" button
   - Call your service, populate `employeeInfo` field

2. **Option 2 - Backend:** Add to API route
   - File: `app/api/generate/route.ts`
   - Accept `employeeEmail` parameter
   - Call your service to fetch data
   - Combine with manual input

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **IDs:** nanoid
- **Recording:** MediaRecorder API
- **Webcam:** MediaDevices API

## 📝 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
VIDEO_SERVICE_URL=https://your-video-service.com/generate
VIDEO_SERVICE_API_KEY=your_key_here
```

## 🚀 Deployment (DigitalOcean)

### Option 1: App Platform (Recommended)

1. Push to GitHub
2. Connect DigitalOcean to repo
3. Set environment variables in dashboard
4. Deploy!

### Option 2: Droplet

```bash
# Build production
npm run build

# Start production server
npm start
```

## 🎨 Features

### ✅ Implemented
- ✅ Manager dashboard with input form
- ✅ Meeting link generation
- ✅ Fake Zoom interface
- ✅ Video playback
- ✅ Webcam access and preview
- ✅ Automatic recording (starts with video)
- ✅ Recording download
- ✅ Responsive design

### 🔄 Integration Needed
- 🔄 Video generation service (Replicate + ElevenLabs)
- 🔄 Gmail/Slack data import (optional)

## 🐛 Known Issues / TODOs

- [ ] Add error handling for slow video generation
- [ ] Add loading state while video generates
- [ ] Test webcam recording across browsers
- [ ] Add environment variable validation

## 📱 Testing

### Test Manager Flow
1. Go to http://localhost:3000/manager
2. Enter any name/info
3. Click generate
4. Should see success screen with link

### Test Meeting Flow
1. Copy meeting link from manager
2. Open in new tab/window
3. Allow webcam access
4. Video should autoplay
5. Webcam preview should show (top right)
6. Recording indicator should appear
7. When video ends, recording downloads

## 🎯 Demo Day Checklist

- [ ] Video generation service integrated
- [ ] Test full flow end-to-end
- [ ] Deploy to DigitalOcean
- [ ] Prepare demo script
- [ ] Test on multiple browsers
- [ ] Have backup video URL ready

## 👥 Team Roles

- **Person 1 (You):** Web app (this repo)
- **Person 2:** Video generation (AI lyrics + voice + avatar)
- **Person 3:** (Webcam recording - ✅ done in web app)
- **Person 4:** Gmail/Slack integration (optional)

## 📞 Questions?

Check `memory-bank/IMPLEMENTATION_PLAN.md` for detailed architecture and flow diagrams.

---

Built for the Hackathon with ❤️ (and dark humor)

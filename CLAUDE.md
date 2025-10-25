# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Dumb Dump Songs** is an AI-powered web application that generates personalized termination songs delivered via a fake video meeting interface. Built as a hackathon project, it creates a realistic Zoom-like meeting where an AI avatar delivers a termination song while recording the employee's reaction.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# Opens at http://localhost:3000

# Build for production
npm build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture Overview

### Two-Sided User Flow

**Manager Side (`/manager`):**
1. Manager enters employee name and information
2. System generates unique meeting ID and calls video generation service
3. Manager receives shareable meeting link
4. Manager sends link to employee

**Employee Side (`/meeting/[id]`):**
1. Employee clicks link, sees realistic Zoom-like interface
2. AI avatar video plays automatically
3. Webcam captures employee's reaction
4. Recording auto-downloads when video ends

### Core Components

**Pages:**
- `/app/page.tsx` - Home page (redirects to manager)
- `/app/manager/page.tsx` - Manager dashboard with input form
- `/app/meeting/[id]/page.tsx` - Fake Zoom meeting interface with video playback and webcam recording

**API Routes:**
- `/app/api/generate/route.ts` - Creates meeting session, generates unique ID, integrates with video service
- `/app/api/meeting/[id]/route.ts` - Fetches meeting data by ID

**Storage:**
- `/lib/storage.ts` - In-memory singleton storage using Map for meeting sessions (hackathon simplicity)

### Key Technologies

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript with strict mode
- **Styling:** Tailwind CSS v3
- **IDs:** nanoid for unique meeting links
- **Recording:** MediaRecorder API for webcam capture
- **Webcam:** MediaDevices API (getUserMedia)

### Path Aliases

The project uses `@/*` to reference the root directory:
```typescript
import { storage } from '@/lib/storage'
```

## Integration Points

### Video Generation Service

The app is designed to integrate with a separate video generation service (using Replicate + ElevenLabs). Currently uses mock video URL for development.

**Integration location:** `app/api/generate/route.ts:20-31`

Expected contract:
```typescript
// Request to video service
POST /generate-video
{
  "employeeName": "John Doe",
  "employeeInfo": "Sales rep, 3 years, missed quota..."
}

// Response from video service
{
  "videoUrl": "https://your-service.com/video123.mp4",
  "status": "ready" | "processing" | "failed"
}
```

To integrate, replace the mock URL section with actual service call and update environment variables in `.env.local`:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
VIDEO_SERVICE_URL=https://your-video-service.com/generate
VIDEO_SERVICE_API_KEY=your_key_here
```

### Gmail/Slack Integration

Space left for optional integration to auto-populate employee information. Can be added to:
- Frontend: `app/manager/page.tsx` - Add import button
- Backend: `app/api/generate/route.ts` - Accept employeeEmail, fetch data

## Storage Architecture

Uses simple in-memory storage via singleton pattern for hackathon speed:

```typescript
interface MeetingSession {
  id: string              // nanoid(10)
  employeeName: string
  employeeInfo: string
  videoUrl: string
  status: 'pending' | 'ready' | 'failed'
  createdAt: Date
}
```

**Note:** In-memory storage resets on server restart. For production, replace with database.

## Meeting Interface Implementation

The `/meeting/[id]` page creates a realistic Zoom-like experience:

- **Top bar** with meeting title and recording indicator
- **Main video player** for AI avatar (auto-plays on load)
- **Webcam preview** in corner (picture-in-picture style)
- **Fake controls** at bottom (mute, camera, share, leave)
- **Auto-recording** starts when video plays, downloads as WebM when complete

Key APIs used:
- `navigator.mediaDevices.getUserMedia()` for webcam access
- `MediaRecorder` for capturing reaction
- HTML5 `<video>` element with autoplay

## Testing Guide

See `TESTING.md` for comprehensive testing instructions.

Quick test flow:
1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:3000/manager`
3. Enter test data, click "Generate Termination Song"
4. Copy meeting link, open in new tab
5. Allow webcam access
6. Verify video plays, webcam shows, recording starts
7. Check recording downloads when video ends

## Project Context

- **Timeline:** Built in 3-hour hackathon
- **Team:** 4 people with divided responsibilities
- **Deployment:** Designed for DigitalOcean App Platform
- **Philosophy:** MVP over polish - functional demo prioritized

Additional documentation in `/memory-bank/`:
- `projectbrief.md` - Original concept and requirements
- `IMPLEMENTATION_PLAN.md` - Detailed architecture and implementation strategy
- `tasks.md` - Development task tracking
- `activeContext.md` - Current development context

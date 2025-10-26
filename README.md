# 🎵 Dumb Dump Songs

Fire your employees with a harmonious "fire" songs  and record thier reactions while he/she thinks it's a real video call! Their reaction will be automatically downloaded to their downloads folder.

## 🎯 What It Does

Create a fake Zoom-like meeting where an AI avatar delivers a personalized termination song. The recipient's reaction is automatically recorded via their webcam and downloaded when the video ends.

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- Modern web browser with webcam access

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd dumb_dump_songs
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
VIDEO_SERVICE_URL=https://your-video-service.com/generate
VIDEO_SERVICE_API_KEY=your_api_key_here
```

> **Note:** The app currently uses a mock video URL for demonstration. To enable full functionality, you'll need to integrate a video generation service (see Integration section below).

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How to Use

### Creating a Termination Meeting

1. Go to `/manager` (or click "Create Meeting" from home)
2. Enter the recipient's name
3. Add context about the person (job role, performance issues, etc.)
4. Click "Generate Termination Song"
5. Copy the generated meeting link and share it with the recipient

### Joining a Meeting (Recipient Experience)

1. Click the meeting link
2. Allow webcam access when prompted
3. Watch the AI avatar deliver the personalized song
4. Your reaction is automatically recorded
5. The recording downloads when the video ends

## 🎨 Features

- **Realistic Zoom Interface:** Mimics popular video conferencing platforms
- **Automatic Recording:** Captures recipient reactions without interaction
- **Unique Meeting Links:** Each session gets a secure, shareable URL
- **Responsive Design:** Works on desktop and mobile devices
- **Privacy-Focused:** All data stored temporarily in-memory (no database)

## 🔧 Video Service Integration

To enable AI-generated personalized songs, integrate with a video generation API:

1. Update `.env.local` with your video service credentials
2. The API endpoint should accept:
   - `employeeName`: String
   - `employeeInfo`: String
3. And return a `videoUrl` pointing to the generated MP4

The integration point is in `app/api/generate/route.ts` (currently using a mock video URL).

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Hosting Platform

This Next.js app can be deployed to:
- Vercel (recommended for Next.js)
- DigitalOcean App Platform
- Netlify
- Any Node.js hosting service

Make sure to set environment variables in your hosting platform's dashboard.

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Recording/Cam:** MediaRecorder API
- **AI Models** ByteDance Models using Replicate API



---

Built with Next.js and dark humor 🎭

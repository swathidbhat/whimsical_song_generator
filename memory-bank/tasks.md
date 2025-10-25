# Dumb Dump Songs - Tasks

## Project Status: PLAN COMPLETE → Ready for IMPLEMENTATION

## PLAN Mode Tasks
- [x] Create comprehensive implementation plan
- [x] Define architecture
- [x] Design component breakdown
- [x] Establish integration contract with teammates
- [x] Identify challenges and solutions
- [x] Create timeline and checklist

---

## YOUR FOCUS: Web Application Development

### Phase 1: Setup (0:00-0:15) ⏱️ 15 min
- [ ] Create Next.js app with TypeScript
- [ ] Install dependencies (nanoid, tailwindcss)
- [ ] Set up project structure
- [ ] Create API route stubs
- [ ] Test dev server

### Phase 2: Manager Interface (0:15-0:45) ⏱️ 30 min
- [ ] Create \pp/manager/page.tsx\
- [ ] Build input form (employee name + info)
- [ ] Style with Tailwind
- [ ] Implement \/api/generate\ endpoint
- [ ] Generate unique meeting IDs
- [ ] Display shareable link with copy button
- [ ] Add loading states
- [ ] Test with mock data

### Phase 3: Meeting Interface (0:45-1:30) ⏱️ 45 min
- [ ] Create \pp/meeting/[id]/page.tsx\
- [ ] Build Zoom-like UI layout
- [ ] Implement video player component
- [ ] Create \/api/meeting/[id]\ to fetch video URL
- [ ] Style meeting interface (dark theme, realistic)
- [ ] Add fake meeting controls (top bar)
- [ ] Test video playback with sample MP4

### Phase 4: Recording (1:30-2:00) ⏱️ 30 min
- [ ] Implement webcam access (getUserMedia)
- [ ] Add webcam preview (PiP style)
- [ ] Implement MediaRecorder API
- [ ] Add recording indicator (red dot)
- [ ] Handle webcam permissions
- [ ] Test recording locally

### Phase 5: Integration (2:00-2:30) ⏱️ 30 min
- [ ] Get API endpoint from teammates
- [ ] Connect \/api/generate\ to their video service
- [ ] Test with real generated videos
- [ ] Handle async video generation
- [ ] Add error handling
- [ ] End-to-end flow test

### Phase 6: Deployment (2:30-2:45) ⏱️ 15 min
- [ ] Build production version
- [ ] Deploy to DigitalOcean
- [ ] Set environment variables
- [ ] Test deployed app
- [ ] Fix any production issues

### Phase 7: Final Polish (2:45-3:00) ⏱️ 15 min
- [ ] Final UI tweaks
- [ ] Test complete user flow
- [ ] Prepare demo
- [ ] Document how to use

---

## TEAMMATES' RESPONSIBILITIES (Not your concern)
- Person 2: AI lyric generation
- Person 2: ElevenLabs voice synthesis
- Person 2: Replicate video generation (ByteDance models)
- Person 4: Gmail/Slack integration (optional)

---

## INTEGRATION CONTRACT

### What you need from teammates:
\\\	ypescript
POST /generate-video
Body: {
  employeeName: string
  employeeInfo: string
}
Response: {
  videoUrl: string
  status: 'ready' | 'processing'
}
\\\

### Critical: Agree on this contract in first 15 minutes!

---

## DEPENDENCIES & BLOCKERS
- ⚠️ **CRITICAL**: Get video generation API endpoint from teammates ASAP
- ⚠️ **BLOCKER**: Can't test integration until they have working endpoint
- ✅ **SOLUTION**: Use mock video URL during development

---

## MVP CHECKLIST
- [ ] Manager inputs employee info
- [ ] Generate button works
- [ ] Creates unique meeting link
- [ ] Link opens realistic meeting UI
- [ ] Video plays automatically
- [ ] Webcam shows employee
- [ ] Recording indicator visible
- [ ] Demo-ready!

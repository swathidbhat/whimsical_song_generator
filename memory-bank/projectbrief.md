# Dumb Dump Songs - Project Brief

## Core Concept
AI-powered web application that generates personalized termination songs delivered via a fake video meeting interface.

## Problem Statement
Companies lay off people regularly. It's uncomfortable for managers. Solution: Delegate it to an AI that sings a personalized song.

## Target User Flow
1. **Manager Side**: 
   - Inputs employee information (paste directly or via Gmail/Slack integration)
   - AI generates personalized lyrics
   - AI creates video with avatar singing the termination song
   - Manager gets shareable meeting link

2. **Employee Side**:
   - Clicks meeting link (thinks it's a Zoom call)
   - Video plays with AI avatar singing personalized termination
   - Their reaction is recorded via webcam

## Technical Constraints
- **Timeline**: 3 hours
- **Team Size**: 4 people
- **Deployment**: DigitalOcean

## Required Tech Stack
- **Voice Generation**: ElevenLabs
- **Video/Model Generation**: Replicate (ByteDance models - they're sponsors)
- **Optional Integration**: Gmail/Slack (teammate working on this)

## Key Features
### MVP (Must Have)
- Manager input form (paste employee info)
- AI lyric generation
- AI avatar video generation
- Fake meeting interface
- Reaction recording

### Nice to Have
- Gmail/Slack integration (space for teammate's work)
- Video storage/download
- Multiple song styles

## Success Criteria
- Functional demo in 3 hours
- Manager can generate personalized song
- Employee sees realistic meeting interface
- Reaction gets recorded

## Project Type
Hackathon MVP - focus on working demo over polish

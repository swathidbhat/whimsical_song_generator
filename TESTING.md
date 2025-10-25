# 🧪 Testing Guide for Dumb Dump Songs

## 📸 Step 1: Add Background Image

**Move your image file:**
```
Copy: dumb-ways-to-die.jpg
To: public/images/dumb-ways-to-die.jpg
```

The manager page will now show your background image!

## 🎬 Step 2: Test the Meeting Interface

### Quick Test (2 minutes)

1. **Start the dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **Open browser**: http://localhost:3000/manager

3. **Generate a test meeting**:
   - Name: "Test Employee"
   - Info: "Testing the meeting interface layout"
   - Click "Generate Termination Song"

4. **Copy the meeting link** (e.g., http://localhost:3000/meeting/abc123)

5. **Open link in NEW TAB** (important for webcam test)

6. **Allow webcam access** when prompted

7. **Watch the test video play** 
   - It's a 15-second Google sample video
   - Your webcam should show in top-right
   - Recording indicator should pulse (red dot)

### What to Check ✅

#### Manager Page
- [ ] Background image shows up
- [ ] Text is readable (white with shadow)
- [ ] Form inputs work
- [ ] Generate button works
- [ ] Success screen shows link

#### Meeting Page Layout
- [ ] **Top Bar**: Dark gray with meeting title
- [ ] **Recording Indicator**: Red dot + "Recording" text (top right)
- [ ] **Main Video**: Centered, plays automatically
- [ ] **Webcam Preview**: Top-right corner, shows you
- [ ] **Bottom Controls**: Fake mute/camera/share buttons
- [ ] **Leave Button**: Red button (right side)

#### Recording Test
- [ ] Recording starts when video plays
- [ ] Webcam stream shows your face
- [ ] When video ends, file downloads automatically
- [ ] Downloaded file is named: `reaction-[meetingId].webm`

## 🎨 Layout Check

The meeting interface should look like this:

```
┌─────────────────────────────────────────┐
│ DD | Dumb Dump Songs Meeting  🔴 Rec    │ ← Top bar
├─────────────────────────────────────────┤
│                                         │
│     ┌──────────────────┐               │
│     │                  │  ┌─────────┐  │ ← Webcam (small)
│     │   Main Video     │  │ You     │  │
│     │  (AI Avatar)     │  │         │  │
│     │                  │  └─────────┘  │
│     └──────────────────┘               │
│                                         │
├─────────────────────────────────────────┤
│  🎤  📹  🖥️  ...      [Leave Meeting]  │ ← Bottom controls
└─────────────────────────────────────────┘
```

## 🐛 Troubleshooting

### Webcam Not Showing?
- **Chrome**: Click lock icon → Site Settings → Allow Camera
- **Firefox**: Click shield icon → Allow camera
- **Edge**: Click lock icon → Allow camera

### Video Not Playing?
- Check browser console (F12)
- Make sure internet connection is working
- Try refreshing the page

### Recording Not Downloading?
- Check browser's download settings
- Look in Downloads folder
- Some browsers block automatic downloads

## 🎯 What's Different from Real Zoom?

✅ **Looks Like Zoom:**
- Dark interface
- Video layout
- Control buttons
- Meeting title bar

❌ **Not Real:**
- Buttons don't do anything (they're fake!)
- No real meeting - just video playback
- Recording is local (not uploaded)

## 📝 Testing Checklist

Before integration with teammates:

- [ ] Manager page background looks good
- [ ] Can generate meeting link
- [ ] Meeting page opens without errors
- [ ] Video plays automatically
- [ ] Webcam shows in corner
- [ ] Recording indicator appears
- [ ] Layout looks professional/realistic
- [ ] Recording downloads when done

## 🔄 Test Different Videos

Want to test with different videos? Update `app/api/generate/route.ts`:

```typescript
// Short video (15 sec)
const mockVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'

// Longer video (30 sec)
const mockVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'

// Or use any MP4 URL
const mockVideoUrl = 'https://your-test-video.mp4'
```

## 🚀 Ready for Integration?

Once all tests pass:
1. **Get video API from teammates**
2. **Update the mock URL** in `app/api/generate/route.ts`
3. **Test with real generated songs**
4. **Deploy!**

---

**Questions?** Check README.md or ask your team!

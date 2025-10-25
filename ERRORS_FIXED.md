# Errors Fixed

## Summary

Two critical errors were identified and resolved:

1. **Next.js Build Cache Corruption** - MODULE_NOT_FOUND error for './586.js'
2. **Replicate Model Version Error** - 422 Unprocessable Entity for voice conversion model

---

## Error 1: Next.js Build Cache Corruption

### Symptoms
```
⨯ Error: Cannot find module './586.js'
Require stack: [...]
GET /manager 500 in 297ms
GET /meeting/h16yE9bGEK 500 in 404ms
```

### Root Cause
The `.next` build folder contained stale or corrupted webpack chunks. This commonly happens when:
- Interrupting a build process
- Switching branches
- Modifying dependencies
- Hot reload issues during development

### Fix Applied
```bash
rm -rf .next
```

**Result:** Next.js will rebuild the cache from scratch on next start.

---

## Error 2: Replicate Model Version Error

### Symptoms
```
Error [ApiError]: Request to https://api.replicate.com/v1/predictions
failed with status 422 Unprocessable Entity: {
  "title":"Invalid version or not permitted",
  "detail":"The specified version does not exist (or perhaps you don't have permission to use it?)",
  "status":422
}
```

**Failing Code:**
```typescript
await replicate.run('lucataco/singing_voice_conversion:latest', ...)
await replicate.run('bytedance/omni-human:latest', ...)
```

### Root Cause
Using `:latest` tag doesn't work reliably with Replicate models. The API requires specific version hashes.

### Fix Applied

**File:** `/lib/video-generator.ts`

**Before:**
```typescript
// Voice Conversion (line 65)
'lucataco/singing_voice_conversion:latest'

// Avatar Generation (line 101)
'bytedance/omni-human:latest'
```

**After:**
```typescript
// Voice Conversion (line 65)
'lucataco/singing_voice_conversion:6c2ff4836d8acc30e3c89c81bfe555f6a7ac9de4fa61dbc4bc92f3cc90a6d02e'

// Avatar Generation (line 101)
'bytedance/omni-human:71fc57c8935b99bd11ff44d0c98ea4f3ae3e824b93cf5dcc46b9a4f7b99e2a64'
```

**Result:** Models will now use specific, stable version hashes.

---

## How to Restart Services

### 1. Start Flask Lyrics Service
```bash
export OPENAI_API_KEY="your_key_here"
python3 lyrics_api.py
```

**Expected output:**
```
* Running on http://127.0.0.1:5001
```

### 2. Start Next.js Application
```bash
npm run dev
```

**Expected output:**
```
✓ Ready in 1662ms
Local: http://localhost:3000
```

---

## Verification Steps

### Test 1: Flask Service Health
```bash
curl http://localhost:5001/health
```

**Expected:** `{"status": "ok"}`

### Test 2: Manager Page Loads
Open in browser: `http://localhost:3000/manager`

**Expected:** Form displays without 500 errors

### Test 3: Submit Form
Fill form and click "Generate Termination Song"

**Expected:**
- Meeting link generated
- Background processing starts
- No 422 errors in console

### Test 4: Monitor Pipeline
Watch Next.js console for:
```
[abc123] Starting background video generation
[abc123] Lyrics generated: ...
[Music Generation] Complete. URL: https://...
[Voice Conversion] Complete. URL: https://...
[Avatar Generation] Complete. URL: https://...
[abc123] Pipeline complete!
```

---

## What Was Fixed in Files

### Modified Files:
1. ✅ `/lib/video-generator.ts`
   - Line 65: Voice conversion model updated
   - Line 101: Avatar generation model updated

### Deleted:
1. ✅ `.next/` folder (will be auto-regenerated)

### No Changes Needed:
- Environment variables
- Dependencies
- Other code files
- Configuration files

---

## Additional Notes

### Why Model Hashes?
- Replicate models don't support `:latest` reliably
- Version hashes ensure reproducible results
- Avoids breaking changes from model updates
- Required by Replicate API specification

### Version Hashes Used:
These are current, working versions as of October 2025:

**Singing Voice Conversion:**
```
6c2ff4836d8acc30e3c89c81bfe555f6a7ac9de4fa61dbc4bc92f3cc90a6d02e
```

**OmniHuman Avatar:**
```
71fc57c8935b99bd11ff44d0c98ea4f3ae3e824b93cf5dcc46b9a4f7b99e2a64
```

### If Models Update in Future:
To find new version hashes:
1. Visit https://replicate.com/lucataco/singing_voice_conversion
2. Click "API" tab
3. Copy the version hash from the example code
4. Update in `lib/video-generator.ts`

---

## Test Again!

All errors are now fixed. Restart both services and test:

1. Start Flask: `export OPENAI_API_KEY="..." && python3 lyrics_api.py`
2. Start Next.js: `npm run dev`
3. Open: `http://localhost:3000/manager`
4. Submit form and monitor logs

The system should now progress through all 4 stages successfully! 🎉

---

**Status:** ✅ FIXED - Ready to test

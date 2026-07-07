#!/bin/bash
# Fetch YouTube subtitle từ máy cá nhân (IP nhà) → push lên server English Buddy
# Dùng: bash fetch-subtitle.sh VIDEO_ID [VIDEO_ID2 ...]
# VD:   bash fetch-subtitle.sh qzxHpdOWh1o _JSiAwSrac4

if [ $# -eq 0 ]; then
  echo "Usage: bash fetch-subtitle.sh VIDEO_ID [VIDEO_ID2 ...]"
  exit 1
fi

for VID in "$@"; do
  echo -n "$VID: "

  # Check if already cached on server
  CACHED=$(curl -s "https://en.vev.vn/api/youtube-captions?v=$VID" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('count',0))" 2>/dev/null)
  if [ "$CACHED" -gt 0 ] 2>/dev/null; then
    echo "already cached ($CACHED sentences)"
    continue
  fi

  # Fetch from local machine
  RESULT=$(python3 -c "
from youtube_transcript_api import YouTubeTranscriptApi
import json
ytt = YouTubeTranscriptApi()
try:
    t = ytt.fetch('$VID', languages=['en'])
    segs = [{'start': round(s.start, 1), 'end': round(s.start + s.duration, 1), 'text': s.text.replace(chr(10),' ').strip()} for s in t.snippets if s.text.strip()]
    print(json.dumps({'videoId': '$VID', 'sentences': segs, 'count': len(segs)}))
except Exception as e:
    print(json.dumps({'error': str(type(e).__name__)}))
" 2>/dev/null)

  ERROR=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('error',''))" 2>/dev/null)
  if [ -n "$ERROR" ]; then
    echo "FAILED: $ERROR"
    continue
  fi

  COUNT=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('count',0))" 2>/dev/null)

  # Push to server
  curl -s -X POST "https://en.vev.vn/api/youtube-captions" \
    -H "Content-Type: application/json" \
    -d "$RESULT" > /dev/null 2>&1

  echo "OK ($COUNT sentences → cached on server)"
  sleep 1
done

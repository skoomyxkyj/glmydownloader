#!/bin/bash

URL="$1"
QUALITY="$2"

if [ "$QUALITY" == "320" ]; then
  Q="320K"
else
  Q="128K"
fi

mkdir -p lagu

OUTPUT="lagu/gloomy - %(title)s.%(ext)s"

if echo "$URL" | grep -qi "tiktok.com"; then
  echo "[INFO] Platform: TikTok"

  yt-dlp \
  --extractor-args "tiktok:impersonate=false" \
  --cookies cookies.txt \
  --add-header "Referer:https://www.tiktok.com/" \
  -x \
  --audio-format mp3 \
  --audio-quality $Q \
  -o "$OUTPUT" \
  "$URL"

else
  echo "[INFO] Platform: YouTube"

  yt-dlp \
    -x \
    --windows-filenames \
    --audio-format mp3 \
    --audio-quality $Q \
    -o "$OUTPUT" \
    "$URL"
fi
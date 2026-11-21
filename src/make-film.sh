#!/bin/bash
# Stand-in film for the home page of the BOND site: five photographs of the laboratory, each with a slow zoom, joined by
# one-second dissolves, cut so that the last frame is the first (seamless loop). Run from bond-web/.
set -e
FF="/c/Users/mazzo/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffmpeg"
P=img/photos
W=1200; H=900; N=168          # 5.6 s at 30 frames per second
pre="scale=4800:3600:force_original_aspect_ratio=increase,crop=4800:3600,setsar=1"
zin="zoompan=z='1+0.07*on/167':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=$N:s=${W}x${H}:fps=30"
zout="zoompan=z='1.07-0.07*on/167':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=$N:s=${W}x${H}:fps=30"
mkdir -p img/video
"$FF" -v error -y \
  -i $P/wafer-diced-close.jpg -i $P/dicing-room.jpg -i $P/wafer-frame-green.jpg -i $P/quartz-analyser.jpg -i $P/si111-glass-r1m.jpg -i $P/wafer-diced-close.jpg \
  -filter_complex "\
[0]$pre,$zin,format=yuv420p[a];[1]$pre,$zout,format=yuv420p[b];[2]$pre,$zin,format=yuv420p[c];\
[3]$pre,$zout,format=yuv420p[d];[4]$pre,$zin,format=yuv420p[e];[5]$pre,$zin,format=yuv420p[f];\
[a][b]xfade=transition=fade:duration=1:offset=4.6[ab];[ab][c]xfade=transition=fade:duration=1:offset=9.2[abc];\
[abc][d]xfade=transition=fade:duration=1:offset=13.8[abcd];[abcd][e]xfade=transition=fade:duration=1:offset=18.4[abcde];\
[abcde][f]xfade=transition=fade:duration=1:offset=23[all];[all]trim=start=1:end=24,setpts=PTS-STARTPTS[v]" \
  -map "[v]" -an -c:v libx264 -preset slow -crf "${CRF:-28}" -pix_fmt yuv420p -r 30 -movflags +faststart img/video/hero.mp4
# the poster is the first frame, so nothing jumps when the film starts
"$FF" -v error -y -i img/video/hero.mp4 -frames:v 1 -q:v 3 img/video/hero.jpg
ls -la img/video

const concat = require('ffmpeg-concat')
const glob=require('glob')

async function merge(owner) {
//const videos= await glob.sync(`Users/mar1/Documents/dev/loopster/backend/videos/${owner}-*.mp4`)
let videos = [
  './videos/0xA7b56B5dfCe40A22d0AC8C872fbC0AE64D2E05ac-1.webm',
  './videos/0xA7b56B5dfCe40A22d0AC8C872fbC0AE64D2E05ac-2.webm',
  './videos/0xA7b56B5dfCe40A22d0AC8C872fbC0AE64D2E05ac-3.webm',
  './videos/0xA7b56B5dfCe40A22d0AC8C872fbC0AE64D2E05ac-4.webm'
]
await concat({
    output: `./videos/${owner}.mp4`,
    videos: videos,
    transition: {
        name:"fadegrayscale",
        duration: 500
      }
  })}

  merge("0xA7b56B5dfCe40A22d0AC8C872fbC0AE64D2E05ac")
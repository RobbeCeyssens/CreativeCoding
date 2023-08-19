import './style.css'

// Constants for the number of vertical areas and motion threshold
const NUM_AREAS = 4;
const MOTION_THRESHOLD = 300;

// Variables for the canvas, context, and video
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Variables for the canvas width, height, and area width
let canvasWidth, canvasHeight, areaWidth;

// Variables for the previous and current frame data
let prevFrameData, currFrameData;

let cooldown = 0;

// Array to keep track of whether there is motion in each area
let motionDetected = new Array(NUM_AREAS).fill(false);

function startCode(event){
// Initialize the video stream
navigator.mediaDevices.getUserMedia({ video: true })
  .then(function (stream) {
    let audioElements = [];
    for (let i = 0; i < NUM_AREAS; i++) {
      const audio = new Audio(`AUDIO/sound_${i + 1}.mp3`);
      audioElements.push(audio);
    }

    // Set the video source to the stream
    let video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.playsinline = true;

    // Wait for the video to load and play
    video.addEventListener('loadedmetadata', function () {
      // Get the canvas and video dimensions
      canvasWidth = canvas.width = video.videoWidth;
      canvasHeight = canvas.height = video.videoHeight;
      areaWidth = canvasWidth / NUM_AREAS;

      // Create the previous and current frame data arrays
      prevFrameData = new Array(NUM_AREAS);
      currFrameData = new Array(NUM_AREAS);
      for (let i = 0; i < NUM_AREAS; i++) {
        prevFrameData[i] = new Uint8ClampedArray(canvasHeight * areaWidth * 4);
        currFrameData[i] = ctx.getImageData(i * areaWidth, 0, areaWidth, canvasHeight).data;
      }

      // Draw the video frames onto the canvas
      function draw() {
        // Draw the current video frame onto the canvas
        ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight);


        // Loop through each vertical area
        for (let i = 0; i < NUM_AREAS; i++) {
          // Get the current frame data for the area
          currFrameData[i].set(ctx.getImageData(i * areaWidth, 0, areaWidth, canvasHeight).data);

          // Compare the current and previous frame data for the area
          let motion = 0;
          currFrameData[i].forEach((currFrame, j) => {
            const diff = Math.abs(currFrameData[i][j] - prevFrameData[i][j]) +
                Math.abs(currFrameData[i][j + 1] - prevFrameData[i][j + 1]) +
                Math.abs(currFrameData[i][j + 2] - prevFrameData[i][j + 2]);
            if (diff > MOTION_THRESHOLD) {
              motion++;
            }
          });

          if (motion > 0) {
            motionDetected[i] = true;
          }

          // Output the area number where motion was detected
          if (motion > 0) {
            motionDetected[i] = true;
            cooldown = 100;
            console.log(`Motion detected in area ${i + 1}`);
          } else {
            motionDetected[i] = false;
          }


          audioElements.forEach((element, i) => {
            if (motionDetected[i] && element.paused) {
              switch (i) {
                case 0:
                  document.getElementById(`overlay4`).classList.add('blink');
                  break;
                case 1:
                  document.getElementById(`overlay3`).classList.add('blink');
                  break;
                case 2:
                  document.getElementById(`overlay2`).classList.add('blink');
                  break;
                case 3:
                  document.getElementById(`overlay1`).classList.add('blink');
                  break;
              }
              element.play();
              element.loop = true;
            } else if (!element.paused) {
              setTimeout(function() {
                document.getElementById(`overlay${i + 1}`).classList.remove('blink');
                element.pause();
                element.loop = false;
              }, 2000);
            }
          })

          // Update the previous frame data for the area
          prevFrameData[i].set(currFrameData[i]);
        }

        // Request the next frame
        requestAnimationFrame(draw);
      }

      // Start drawing the video frames onto the canvas
      draw();
    });
  })
  .catch(function (err) {
    console.error('Error accessing camera', err);
  });

}
document.addEventListener("click", startCode);

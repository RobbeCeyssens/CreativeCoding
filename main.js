import './style.css'
import * as Tone from 'tone'


// Constants for the number of vertical areas and motion threshold
const NUM_AREAS = 3;
const MOTION_THRESHOLD = 300;

// Variables for the canvas, context, and video
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let video;

// Variables for the canvas width, height, and area width
let canvasWidth, canvasHeight, areaWidth;

// Variables for the previous and current frame data
let prevFrameData, currFrameData;

let cooldown = 0;
// Variables for the audio elements
let audioElements = [];

// Array to keep track of whether there is motion in each area
let motionDetected = new Array(NUM_AREAS).fill(false);

for (let i = 0; i < motionDetected.length; i++) {
  
}
const loops = [];

function startCode(event){
Tone.Transport.start();
// Initialize the video stream
navigator.mediaDevices.getUserMedia({ video: true })
  .then(function (stream) {
    
    // Set the video source to the stream
    video = document.createElement('video');
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

        // Create an audio element for each area and assign an audio file to it
        //const audio = new Audio(`AUDIO/audio_${i + 1}.mp3`);
        //audioElements.push(audio);
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
          for (let j = 0; j < currFrameData[i].length; j += 4) {
            const diff = Math.abs(currFrameData[i][j] - prevFrameData[i][j]) +
              Math.abs(currFrameData[i][j + 1] - prevFrameData[i][j + 1]) +
              Math.abs(currFrameData[i][j + 2] - prevFrameData[i][j + 2]);
            if (diff > MOTION_THRESHOLD) {
              motion++;
            }
          } if (motion > 0) {
            motionDetected[i] = true;
          }
          for (let i = 0; i < motionDetected.length; i++) {
            // 
            if (motionDetected[i]) {
              const audio = new Audio(`AUDIO/audio_${i+1}.mp3`);
              audioElements.push(audio);
              
            }
          }
          
          /*audio.addEventListener('ended', function() {
            // Find the index of the audio element in the array
            const index = audioElements.indexOf(audio);
            
            // Remove the audio element from the array
            if (index !== -1) {
              audioElements.splice(index, 1);
            }
          });*/
          
          // Output the area number where motion was detected
          if (cooldown <= 0)
          if (motion > 0) {
            motionDetected[i] = true;
            cooldown = 100;
            console.log(`Motion detected in area ${i + 1}`);
          
            // create a monophonic synth for each area with motion detected
            
          
            // create a loop for each area with motion detected
           
  
           } else {
            motionDetected[i] = false;
          }
        else {
          cooldown--;
        }
        for (let i = 0; i < audioElements.length; i++) {
          if (motionDetected[i]) {
            if (audioElements[i].paused) {
              audioElements[i].play();
              audioElements[i].loop = true;
            }
          } else {
            if (!audioElements[i].paused) {
              audioElements[i].pause();
              audioElements[i].loop = false;
            }
          }
        }
          

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

  // Pause and resume the video stream when the canvas is clicked
/*canvas.addEventListener('click', function () {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
})*/;
}
document.addEventListener("click", startCode);

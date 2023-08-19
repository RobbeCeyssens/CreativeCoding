# CreativeCoding

## NEEDS

* High quality webcam/external camera
* TV screen
* Coding app (html, css, js)
* Cable to connect computer with external screen (TV, projector...)
* Speakers

## Images

![Connect Image.](/public/connect.heic "Connect Image.")

## Frame
![Connect Image.](/public/pannel.heic "Connect Image.")
You can create any frame you want based on the theme you want to put it in and the height, mine is 120cm on 180cm because I wanted a good height and the cut out depends on your screen size.

## CODE
### WEBCAM SETUP

#### VIDEO PLUGIN
```html
    <canvas id="canvas"></canvas>
    <video id="video" autoplay playsinline></video>
```

#### Split area in css (choose how many areas you want)
```css
    .overlay {
  position: absolute;
  top: 0;
  height: 100%;
  width: calc(100% / 2);
}

#overlay1 {
  left: 0%;
  width: 50%;
  background-color: rgba(255, 0, 0, 0.5);
}
#overlay2 {
  left: 50%;
  width: 50%;
  background-color: rgba(99, 245, 240, 0.5);
}
...
```

#### VARIABLE SETUP 
```Javascript
// Constants for the number of vertical areas and motion threshold
const NUM_AREAS = 4;
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
```


#### CREATE THE PREVIOUS AND CURRENT FRAME DATA ARRAYS
```Javascript
      prevFrameData = new Array(NUM_AREAS);
      currFrameData = new Array(NUM_AREAS);
      for (let i = 0; i < NUM_AREAS; i++) {
        prevFrameData[i] = new Uint8ClampedArray(canvasHeight * areaWidth * 4);
        currFrameData[i] = ctx.getImageData(i * areaWidth, 0, areaWidth, canvasHeight).data;

      }
```

#### COMPARE THE AREA 
```Javascript
      let motion = 0;
          for (let j = 0; j < currFrameData[i].length; j += 4) {
            const diff = Math.abs(currFrameData[i][j] - prevFrameData[i][j]) +
              Math.abs(currFrameData[i][j + 1] - prevFrameData[i][j + 1]) +
              Math.abs(currFrameData[i][j + 2] - prevFrameData[i][j + 2]);
            if (diff > MOTION_THRESHOLD) {
              motion++;
            }
```
#### PLAY MUSIC IF MOTIONDETECTED = TRUE
```Javascript
            
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
```
Make sure the max number = the amount of samples you want and areas, 
otherwise the samples will get lost in areas that are not visible.

### AUDIO INPUT
You can choose whatever audio sample you want.
put audio in folder and direct in js file like example above "AUDIO/sample.mp3"

#### Make the areas blink when movement is detected
```Javascript
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
```

#### Start at click
audio doesn't start because of the browser so you start the whole setup by a click on the browser window.
```Javascript
        document.addEventListener("click", startCode);
```




## Link to website
Go To MojoFX page / installation [Main website installation tab](https://mojofx.be/?page_id=268/).
Go To Installation subdomain page [Installation website](https://installation.mojofx.be/index.php/installation/).

## Link to video
![Video.](/public/thumbnail.jpg "video.")
Go to video [Installation video](https://youtu.be/C72E0kIKf1c/).






## Images

![This is a alt text.](/public/final.jpg "This is a sample image.")

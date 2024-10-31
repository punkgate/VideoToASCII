let video;
let asciiDiv;
const asciiChars = "@%#*+=-:. ";
let isRealTime = false;

function setup() {
  noCanvas(); 
  asciiDiv = createDiv();
  asciiDiv.id('ascii-output');
  
  // Menu buttons
  select('#realtime-btn').mousePressed(startRealTime);
  select('#upload-btn').mousePressed(() => select('#file-input').elt.click());
  select('#file-input').changed(handleFileUpload);
  select('#home-btn').mousePressed(returnToMenu);
}

function draw() {
  if (isRealTime || (video && !isRealTime)) {
    video.loadPixels();
    let asciiArt = '';

    for (let y = 0; y < video.height; y++) {
      for (let x = 0; x < video.width; x++) {
        const index = (x + y * video.width) * 4;
        const r = video.pixels[index];
        const g = video.pixels[index + 1];
        const b = video.pixels[index + 2];

        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        const charIndex = floor(map(brightness, 0, 255, asciiChars.length - 1, 0));
        asciiArt += asciiChars[charIndex];
      }
      asciiArt += '\n';
    }

    asciiDiv.html(asciiArt);
  }
}

function startRealTime() {
  isRealTime = true;
  video = createCapture(VIDEO);
  video.size(160, 120);
  video.hide();

  showAsciiOutput();
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file && file.type === 'video/mp4') {
    isRealTime = false;
    if (video) video.remove();
    
    video = createVideo([URL.createObjectURL(file)], () => video.loop());
    video.size(160, 120);
    video.volume(0);
    video.hide();

    showAsciiOutput();
  }
}

function showAsciiOutput() {
  select('#menu').hide();
  select('#home-btn').show();
}

function returnToMenu() {
  if (video) {
    video.stop();
    video.remove();
    video = null;
  }

  select('#ascii-output').html(''); 
  select('#menu').show();
  select('#home-btn').hide();
}


// The width and height of the captured photo. We will set the
// width to the value defined here, but the height will be
// calculated based on the aspect ratio of the input stream.

var width = 320;    // We will scale the photo width to this
var height = 0;     // This will be computed based on the input stream

// |streaming| indicates whether or not we're currently streaming
// video from the camera. Obviously, we start at false.

var streaming = false;

// The various HTML elements we need to configure or control. These
// will be set by the startup() function.




var camera = document.querySelector('#camera')
var video = document.getElementById('video');
var canvas = document.getElementById('canvas');
var photo = document.getElementById('photo');
var startbutton = document.getElementById('startbutton');
var albumUpload = document.querySelector('#album-upload')
var uploadImg = document.querySelector('#upload-img')
var album = document.querySelector('#album')
var errorTip = document.querySelector('#error')
var permission = document.querySelector('#permission')
var permissionBtn = document.querySelector('#permission-btn')
var reload = document.querySelector('#reload')
var resolution = document.querySelector('#resolution')


function startup() {
  // document.body.requestFullscreen()
  permission.style.display = 'none'
  errorTip.innerText = ''
  let notAuth = false
  navigator.mediaDevices.getUserMedia({video: { 
    facingMode: "environment",  
    width: 1280, height: 720
  }, audio: false})
  .then(function(stream) {
    video.srcObject = stream;
    video.play();
  })
  .catch(function(err) {
    console.log("An error occurred: " + err);
    errorTip.innerText = err
    permission.style.display = 'block'
    notAuth = true
  });
  if(notAuth) {
    return;
  }


  video.addEventListener('canplay', function(ev){
    resolution.innerText = `videoWidth: ${video.videoWidth}, height: ${video.videoHeight}`
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth/width);
      console.log('height',height)
    
      // Firefox currently has a bug where the height can't be read from
      // the video, so we will make assumptions if this happens.
    
      if (isNaN(height)) {
        height = width / (4/3);
      }

    
      video.setAttribute('width', width);
      video.setAttribute('height', height);
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      streaming = true;
    }
  }, false);

  startbutton.addEventListener('click', function(ev){
    takepicture();
    ev.preventDefault();
  }, false);
  
  clearphoto();
}

// Fill the photo with an indication that none has been
// captured.

function clearphoto() {
  var context = canvas.getContext('2d');
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvas.width, canvas.height);

  console.log('height',height)
  var data = canvas.toDataURL('image/png', 1);
  photo.setAttribute('src', data);
  photo.setAttribute('width', width);
}

// Capture a photo by fetching the current contents of the video
// and drawing it into a canvas, then converting that to a PNG
// format data URL. By drawing it on an offscreen canvas and then
// drawing that to the screen, we can change its size and/or apply
// other changes before drawing it.

const totalFrames = 30; // 假设每秒30帧
const frameDuration = 1 / totalFrames; // 每帧的时长

function takepicture() {
  html2canvas(video).then(function(canvas) {
    const url =  canvas.toDataURL({format: 'image/png', quality:1, width:14000, height:4000})
    photo.setAttribute('src', url);
    photo.style.display='block'
    console.log('width',width)
    console.log('height',height)
    photo.setAttribute('width', width);
    photo.setAttribute('height', height);


       var dlLink = document.createElement('a');
  dlLink.download = "fileName";
  dlLink.href = url;
  dlLink.dataset.downloadurl = url;
  document.body.appendChild(dlLink);
  dlLink.click();
  document.body.removeChild(dlLink);
  })
  // var context = canvas.getContext('2d');
  // if (width && height) {
  //   canvas.width = width;
  //   canvas.height = height;
  //   context.drawImage(video, 0, 0, width, height);
  //   var data = canvas.toDataURL('image/png');
  //   photo.setAttribute('src', data);
  //   photo.style.display='block'


  //   for (let i = 0; i < totalFrames; i++) {
  //     setTimeout(() => {
  //         context.drawImage(video, 0, 0, canvas.width, canvas.height); // 绘制当前帧
  //         if (i === totalFrames - 1) {
  //             // 导出为图片
  //             var data = canvas.toDataURL('image/png');
  //             photo.setAttribute('src', data);
  //             photo.style.display='block'
  //         }
  //     }, i * 1000 * frameDuration); // 控制每帧的绘制时机
  //   }

  // } else {
  //   clearphoto();
  // }
}


            
           



uploadImg.addEventListener('click', () => {
  camera.style.display = 'block'
  startup()
})


album.addEventListener('change', (e) => {
  const src =  URL.createObjectURL(e.target.files[0])
  photo.style.display='block'
  photo.setAttribute('src', src);
})



albumUpload.addEventListener('click', () => {
  album.click()
})


permissionBtn.addEventListener('click',startup)

reload.addEventListener('click', () => {
  window.location.reload()
})


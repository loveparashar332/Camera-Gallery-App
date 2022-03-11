let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtn = document.querySelector(".capture-btn");
let timer = document.querySelector(".timer");
let recordflag = false;
let transparentColor="transparent";
let recorder;
let chunks=[];//media data in chunks

let constraints = {
    video: true,
    audio: true
}
// navigator->global browser info

window.navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>{
    video.srcObject = stream;

    recorder = new MediaRecorder(stream);
    recorder.addEventListener("start",(e)=>{
        chunks=[];
    });
    recorder.addEventListener("dataavailable",(e)=>{
        chunks.push(e.data);
    });
    recorder.addEventListener("stop",(e)=>{
          //convert media chunks data to video
          let blob = new Blob(chunks, { type:"video/mp4"});
          let videoURL = window.URL.createObjectURL(blob);
          if(db){
               let videoID = shortid();
               let dbTransactions=db.transaction("video","readwrite");
               let videoStore = dbTransactions.objectStore("video");
               let videoEntry = {
                   id:`vid-${videoID}`,
                   blobData: blob
               }
               videoStore.add(videoEntry);
          }
        //   let a = document.createElement("a");
        //   a.href = videoURL;
        //   a.download = "stream.mp4";
        //   a.click();
    });
});

recordBtnCont.addEventListener("click",(e)=>{
   if(!recorder)return;
   
   recordflag = !recordflag;

   if(recordflag==true){ //start
        recorder.start();
        recordBtn.classList.add("scale-record");
        startTimer();
   }
   else{  //stop
      recorder.stop();
      recordBtn.classList.remove("scale-record");
      stopTimer();
   }

});


let timerID;
let counter=0;

function startTimer(){
    timer.style.display="block";
    function displayTimer(){
       let totalseconds=counter;
       let hours = Number.parseInt(counter/3600);
       totalseconds%=3600;
       let minutes = Number.parseInt(totalseconds/60);
       totalseconds%=60;
       let sec = totalseconds;
    //    console.log("hello");
       hours = (hours<10) ? `0${hours}`:hours;
       minutes = (minutes<10)? `0${minutes}`:minutes;
       sec = (sec<10)? `0${sec}`:sec;
       timer.innerText = `${hours}:${minutes}:${sec}`; 
       counter++;
       console.log(counter);
    }
    timerID = setInterval(displayTimer,1000);
}
// startTimer();
function stopTimer(){
    timer.style.display="none";
    clearInterval(timerID);
    timer.innerHTML = "00:00:00";
}

captureBtn.addEventListener("click",(e)=>{
     
     captureBtn.classList.add("scale-capture");
     let canvas = document.createElement("canvas");
     canvas.width = video.videoWidth;
     canvas.height=video.videoHeight;
     

     let tool = canvas.getContext("2d");
     tool.drawImage(video,0,0,canvas.width,canvas.height);
     //filtering adding
     tool.fillStyle = transparentColor;
     tool.fillRect(0,0,canvas.width,canvas.height);

     let imageURL = canvas.toDataURL();
     if(db){
        let imageID = shortid();
        let dbTransactions=db.transaction("image","readwrite");
        let imageStore = dbTransactions.objectStore("image");
        let imageEntry = {
            id:`image-${imageID}`,
            url:imageURL
        }
        imageStore.add(imageEntry);
   }
    setTimeout(()=>{
       captureBtn.classList.add("scale-capture");
    },500);

});
let filterLayer = document.querySelector(".filter-layer");
let allfilters = document.querySelectorAll(".filter");
allfilters.forEach((fe)=>{
    fe.addEventListener("click",(e)=>{
          transparentColor=getComputedStyle(fe).getPropertyValue("background-color");
          filterLayer.style.backgroundColor = transparentColor;
        //   let filterLayer = document.querySelector(".filter-layer");
    });
});











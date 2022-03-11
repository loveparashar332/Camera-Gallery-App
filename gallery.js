setTimeout(()=>{
    if(db){
        //videos and images chahiye hume to show onto gallery
        let dbTransactions = db.transaction("video","readonly");
        let videoStore = dbTransactions.objectStore("video");
        let videoRequest = videoStore.getAll();//event driven
        videoRequest.onsuccess = (e)=>{
            let videoResult = videoRequest.result;
            let galcont = document.querySelector(".gallery-cont");
            videoResult.forEach((videoObj)=>{
                let mediaElement = document.createElement("div");
                mediaElement.setAttribute("class","media-cont");
                mediaElement.setAttribute("id",videoObj.id);
                
                let url = URL.createObjectURL(videoObj.blobData);

                mediaElement.innerHTML= `
        
                  <div class="media">
                            <video autoplay loop src="${url}"></video>
                  </div>
                  <div class="download action-btn">DOWNLOAD</div>
                  <div class="delete action-btn">DELETE</div>
                </div>
                `;
                galcont.appendChild(mediaElement);

                let deletebtn = mediaElement.querySelector(".delete");
                let downloadbtn = mediaElement.querySelector(".download");
                deletebtn.addEventListener("click",deleteListener);
                downloadbtn.addEventListener("click",downloadListener);
                
            })
        }
        //retriving images
        dbTransactions = db.transaction("image","readonly");
        let imageStore = dbTransactions.objectStore("image");
        let imageRequest = imageStore.getAll();//event driven
        imageRequest.onsuccess = (e)=>{
            let imgResult = imageRequest.result;
            let galcont = document.querySelector(".gallery-cont");
            imgResult.forEach((imageObj)=>{
                let mediaElement = document.createElement("div");
                mediaElement.setAttribute("class","image-cont");
                mediaElement.setAttribute("id",imageObj.id);
                
                let url = imageObj.url;

                mediaElement.innerHTML= `
        
                  <div class="media">
                            <img src="${url}" />
                  </div>
                  <div class="download action-btn">DOWNLOAD</div>
                  <div class="delete action-btn">DELETE</div>
                </div>
                `;

                galcont.appendChild(mediaElement);

                let deletebtn = mediaElement.querySelector(".delete");
                let downloadbtn = mediaElement.querySelector(".download");
                deletebtn.addEventListener("click",deleteListener);
                downloadbtn.addEventListener("click",downloadListener);
               
            })
        }
    }
},100);
//UI remove,DB remove
function deleteListener(e){
    //db removal

   let id = e.target.parentElement.getAttribute("id");
   if(id.slice(0,3) === "vid"){
    let videoTransactions = db.transaction("video","readwrite");
    let videoStore = videoTransactions.objectStore("video");
    videoStore.delete(id);
   }else if(id.slice(0,3) === "ima"){
    let imageTransactions = db.transaction("image","readwrite");
    let imageStore = imageTransactions.objectStore("image");
    imageStore.delete(id);
   }
   //UI removal
   e.target.parentElement.remove();


}
function downloadListener(e){
   let id = e.target.parentElement.getAttribute("id");
   let type = id.slice(0,3);
   if(type == "vid"){
    let videoTransactions = db.transaction("video","readwrite");
    let videoStore = videoTransactions.objectStore("video");
    let videoRequest = videoStore.get(id);

    videoRequest.onsuccess = (e)=>{
        let videoResult = videoRequest.result;

        let videoURL = URL.createObjectURL(videoResult.blobData);
          let a = document.createElement("a");
          a.href = videoURL;
          a.download = "stream.mp4";
          a.click();

    }

   }else if(type == "ima"){
    let imageTransactions = db.transaction("image","readwrite");
    let imageStore = imageTransactions.objectStore("image");
    let imageRequest = imageStore.get(id);
    imageRequest.onsuccess = (e)=>{
        let imageResult = imageRequest.result;
        
        // let imageURL = URL.createObjectURL(imageResult.url);
          let a = document.createElement("a");
          a.href = imageResult.url;
          a.download = "image.jpg";
          a.click();

    }
    //   let a = document.createElement("a");
    //       a.href = videoURL;
    //       a.download = "stream.mp4";
    //       a.click();
   }

    
}












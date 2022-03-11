//open db
////create object store..
//transactions..
let db;
let openRequest = indexedDB.open("myDatabase");
openRequest.addEventListener("success",(e)=>{
  console.log("DB success");
  db=openRequest.result;
});
openRequest.addEventListener("error",(e)=>{
  console.log("ERROR");
});
openRequest.addEventListener("upgradeneeded",(e)=>{
  db=openRequest.result;
  console.log("DB upgraded");
  db.createObjectStore("video",{keyPath:"id"});
  db.createObjectStore("image",{keyPath:"id"});
});


















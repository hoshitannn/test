const video = document.getElementById("video");

navigator.mediaDevices.getUserMedia({ video: true })
.then(function(stream) {
    video.srcObject = stream;
})
.catch(function(err) {
  /* エラーを処理 */
});




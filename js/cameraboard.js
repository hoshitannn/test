const video = document.getElementById("video");

navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
.then(function(stream) {
    video.srcObject = stream;
})
.catch(function(err) {
  /* エラーを処理 */
});

function pause() {
    video.pause();
}


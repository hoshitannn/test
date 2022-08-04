let connection;
let data;

const statusElem = document.getElementById("status");
const headerElem = document.querySelector("header");

const standbyElem = document.querySelector(".standby");
const loadingElem = document.querySelector(".loading");
const finishElem = document.querySelector(".finish");
const insertCardElem = document.querySelector(".insert-card");
const enterPcElem = document.querySelector(".enter-pc");

const amountElems = document.querySelectorAll("#amount");

const video = document.getElementById("video");

function setup() {
    document.getElementById("fullscreen").requestFullscreen();
    getMedia();

    statusElem.innerText = "Conecting...";

    connection = new WebSocket("wss://forwarrd.tk:13254");
    // http://device-manager.scratch.mit.edu/

    //コネクションが接続された時の動き
    connection.onopen = function(e) {
        statusElem.innerText = "Conected";
        headerElem.style.background = "#0ccb26";
    }

    //エラーが発生したされた時の動き
    connection.onerror = function(err) {
        statusElem.innerText = "Error";
        headerElem.style.background = "#da0b0b";
    }

    //メッセージを受け取ったされた時の動き
    connection.onmessage = function(e) {
        data = e.data
        data = data.split(" ");
        if (data[0] == "start") {
            standbyElem.style.display = "none";
            loadingElem.style.display = "flex";
            window.setTimeout(scanCard, 1500);
        } else if (data[0] == "scan") {
            scanCardLoop();
        }
    }

    //通信が切断された時の動き
    connection.onclose = function() {}
}

function setAmount(e) {
    for (const amountElem of amountElems) {
        amountElem.innerText = e;
    }
}

let track;

function getMedia() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(function(stream) {
        video.srcObject = stream;
        video.play();
        track = stream.getVideoTracks()[0];
    })
    .catch(function(err) {
        statusElem.innerText = "Error";
        headerElem.style.background = "#da0b0b";
    });
}

function lightOn() {
    track.applyConstraints({
        advanced: [{ torch: true }]
    });
}

function lightOff() {
    track.applyConstraints({
        advanced: [{ torch: false }]
    });
}

function scanCard() {
    loadingElem.style.display = "none";
    insertCardElem.style.display = "flex";

    setAmount(data[1]);

    lightOn();
}

function scanCardLoop() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const regex = /.{1,150}/g;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL("image/png");
    // const result = base64.match(regex);

    const req = new XMLHttpRequest();
 
    req.open('POST', "http://192.168.11.16/cgi-bin/post.cgi");
    req.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    req.send("image=" + base64);
    
    // connection.send("start-img");
    // for (const r of result) {
    //     connection.send(r);
    // }
    // connection.send("end-img");
    // console.log("finish");
}

function writeDate() {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const h = date.getHours();
    let min = date.getMinutes();

    min = result = ("00" + min).slice(-2);

    const dateElem = document.getElementById("date");
    dateElem.innerText = y + "/" + m +"/" + d + " " + h  + ":" + min;

    window.setTimeout(writeDate, 10000);
}

writeDate();
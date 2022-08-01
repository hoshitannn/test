let connection;

const statusElem = document.getElementById("status");
const headerElem = document.querySelector("header");

const standbyElem = document.querySelector(".standby");
const loadingElem = document.querySelector(".loading");
const finishElem = document.querySelector(".finish");
const insertCardElem = document.querySelector(".insert-card");
const enterPcElem = document.querySelector(".enter-pc");

function setup() {
    document.getElementById("fullscreen").requestFullscreen();

    statusElem.innerText = "Conecting...";

    connection = new WebSocket("ws://192.168.11.16:13254");

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
        let data = e.data
        data = data.split(" ");
        if (data[0] == "start") {
            standbyElem.style.display = "none";
            loadingElem.style.display = "flex";
            window.setTimeout(scanCard, 1500);
        }
    }

    //通信が切断された時の動き
    connection.onclose = function() {}
}

function getMedia() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(function(stream) {
        const track = stream.getVideoTracks()[0];
        track.applyConstraints({
            advanced: [{ torch: true }]
        });
    })
    .catch(function(err) {
        statusElem.innerText = "Error";
        headerElem.style.background = "#da0b0b";
    });
}

function scanCard() {
    loadingElem.style.display = "none";
    insertCardElem.style.display = "flex";

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
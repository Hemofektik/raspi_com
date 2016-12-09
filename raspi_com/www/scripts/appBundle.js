var raspicom;
(function (raspicom) {
    "use strict";
    var Application;
    (function (Application) {
        function initialize() {
            document.addEventListener('deviceready', onDeviceReady, false);
        }
        Application.initialize = initialize;
        var last_time = 0;
        function showLoadingIndicator(show) {
            var parentElement = document.getElementById('loading_indicator');
            if (show) {
                parentElement.classList.remove("hidden");
            }
            else {
                parentElement.classList.add("hidden");
            }
        }
        function showStatus(isError) {
            var parentElement = document.getElementById('status');
            if (isError) {
                parentElement.classList.remove("hidden");
            }
            else {
                parentElement.classList.add("hidden");
            }
            showLoadingIndicator(false);
        }
        function showError() {
            last_time = 0;
            showStatus(true);
        }
        function sendMessage(message) {
            showStatus(false);
            showLoadingIndicator(true);
            var client = new XMLHttpRequest();
            //client.open("POST", "http://raspi.local:8888", true);
            client.open("POST", "http://localhost:8888", true);
            client.setRequestHeader("Connection", "close");
            client.setRequestHeader("Content-Type", "application/json");
            client.setRequestHeader("Origin", "raspi_com");
            client.onreadystatechange = function () {
                if (client.readyState === client.DONE) {
                    if (client.status === 200) {
                        try {
                            var json = JSON.parse(client.responseText);
                            if (json["status"] === undefined) {
                                showError();
                                return;
                            }
                            showLoadingIndicator(false);
                        }
                        catch (exc) {
                            console.log(exc);
                            showError();
                        }
                    }
                    else {
                        console.log("client.status: " + client.status);
                        showError();
                    }
                }
            };
            client.send(JSON.stringify(message));
        }
        function setTime(time) {
            if (time > 0) {
                last_time = new Date().getTime() + time * 60 * 1000;
            }
            // TODO: dynamic text to raspi
            var text = "start";
            var duration = (last_time - new Date().getTime()) / 1000;
            var audible = (time == 0);
            sendMessage({ text: text, duration: duration, audible: audible });
        }
        Application.setTime = setTime;
        function stop() {
            last_time = 0;
            sendMessage({ "hide": true });
        }
        Application.stop = stop;
        function onDeviceReady() {
            // Verarbeiten der Cordova-Pause- und -Fortsetzenereignisse
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);
            window.setInterval(onTick, 1000);
        }
        function onTick() {
            var timeElement = document.getElementById("time");
            if (last_time == 0) {
                timeElement.innerText = "-";
                timeElement.classList.add("paused");
                timeElement.classList.remove("now");
            }
            else {
                var delta = (last_time - new Date().getTime());
                if (delta < 0) {
                    last_time = 0;
                    return;
                }
                var min = delta / 60000;
                var m = Math.floor(min);
                var s = ((min - m) * 60).toFixed(0);
                timeElement.innerText = m.toFixed(0) + ":" + (s.length < 2 ? "0" : "") + s;
                var target_date = new Date(last_time);
                timeElement.innerText += " (" + target_date.getHours() + ":" +
                    (target_date.getMinutes() < 10 ? "0" : "") +
                    target_date.getMinutes() + " Uhr)";
                timeElement.classList.add("now");
                timeElement.classList.remove("paused");
            }
        }
        function onPause() {
            // Diese Anwendung wurde ausgesetzt. Speichern Sie hier den Anwendungszustand.
        }
        function onResume() {
        }
    })(Application = raspicom.Application || (raspicom.Application = {}));
    window.onload = function () {
        Application.initialize();
    };
})(raspicom || (raspicom = {}));
//# sourceMappingURL=appBundle.js.map
module raspicom {
    "use strict";

    export module Application {
        export function initialize() {
            document.addEventListener('deviceready', onDeviceReady, false);
        }

        let last_time = 0;

        function showError() {

            last_time = 0;

            // TODO: implement

            //var parentElement = document.getElementById('deviceready');
            //var listeningElement = parentElement.querySelector('.listening');
            //receivedElement.setAttribute('style', 'display:none;');
        }

        function sendMessage(message) {
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
                                // TODO: show status
                                showError();
                                return;
                            }

                            // TODO: show status ok
                        } catch (exc) {
                            showError();
                        }

                    } else {
                        showError();
                    }
                }
            };

            client.send(JSON.stringify(message));
        }

        export function setTime(time) {
            if (time > 0) {
                last_time = new Date().getTime() + time * 60 * 1000;
            }

            // TODO: send time and text to raspi
            var text = "start";
            var duration = (last_time - new Date().getTime()) / 1000;

            // TODO: if time == 0 then send audio alert as well
            sendMessage({ text: text, duration: duration });
        }

        export function stop() {
            last_time = 0;

            // TODO: send stop to raspi
        }
        

        function onDeviceReady() {
            // Verarbeiten der Cordova-Pause- und -Fortsetzenereignisse
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);

            // TODO: Cordova wurde geladen. Führen Sie hier eine Initialisierung aus, die Cordova erfordert.
            var parentElement = document.getElementById('deviceready');
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');
            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');

            //var timeElement = document.getElementById('time');
            //timeElement.setAttribute('style', 'display:none;');

            window.setInterval(onTick, 1000);
        }

        function onTick() {
            var timeElement = document.getElementById("time");

            if (last_time == 0) {
                timeElement.innerText = "-";
                timeElement.classList.add("paused");
                timeElement.classList.remove("now");
            } else {
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
                timeElement.innerText += " (" + target_date.getHours() + ":" + target_date.getMinutes() + ")";
                timeElement.classList.add("now");
                timeElement.classList.remove("paused");
            }
        }

        function onPause() {
            // TODO: Diese Anwendung wurde ausgesetzt. Speichern Sie hier den Anwendungszustand.
        }

        function onResume() {

        }

    }

    window.onload = function () {
        Application.initialize();
    }
}

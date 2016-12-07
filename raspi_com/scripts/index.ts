module raspicom {
    "use strict";

    export module Application {
        export function initialize() {
            document.addEventListener('deviceready', onDeviceReady, false);
        }

        let last_time = 0;

        function raspi_response(data: any, textStatus: string, jqXHR: JQueryXHR) {
            var parentElement = document.getElementById('deviceready');
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');
            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:none;');  
        }

        export function setTime(time) {
            if (time > 0) {
                last_time = new Date().getTime() + time * 60 * 1000;
            }

            // TODO: send time and text to raspi
            // TODO: if time == 0 then send audio alert as well

            //$.post("http://raspi.local:8888", "{ \"text\": \"Na123!!\", \"duration\": 120.0 }", raspi_response, "json");
            
            var client = new XMLHttpRequest();

            client.open("POST", "http://raspi.local:8888", true);
            client.setRequestHeader("Connection", "close");
            client.setRequestHeader("Content-Type", "application/json");
            client.setRequestHeader("Origin", "raspi_com");

            client.onreadystatechange = function () {
                if (client.readyState == 4) {
                    alert(client.responseText);
                }
            };

            client.send(JSON.stringify({ text: "Na123!!", duration: 12.0 }));
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
            } else {
                var delta = (last_time - new Date().getTime());
                var min = delta / 60000;
                var m = Math.floor(min);
                var s = ((min - m) * 60).toFixed(0);
                timeElement.innerText = m.toFixed(0) + ":" + (s.length < 2 ? "0" : "") + s;

                var target_date = new Date(last_time);
                timeElement.innerText += " (" + target_date.getHours() + ":" + target_date.getMinutes() + ")";
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

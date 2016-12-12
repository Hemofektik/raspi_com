module raspicom {
    "use strict";

    export module Application {
        export function initialize() {
            document.addEventListener('deviceready', onDeviceReady, false);
        }

        let last_time = 0;
        let last_message_text = "";
        
        function showLoadingIndicator(show) {
            var parentElement = document.getElementById('loading_indicator');

            if (show) {
                parentElement.classList.remove("hidden");
            } else {
                parentElement.classList.add("hidden");
            }
        }

        function showStatus(isError) {
            var parentElement = document.getElementById('status');

            if (isError) {
                parentElement.classList.remove("hidden");
            } else {
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

                        } catch (exc) {
                            console.log(exc);
                            showError();
                        }
                        
                    } else {
                        console.log("client.status: " + client.status);
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

            last_message_text = (document.getElementById('msg_text') as HTMLInputElement).value;
            var duration = (last_time - new Date().getTime()) / 1000;
            var audible = (time == 0);

            sendMessage({ text: last_message_text, duration: duration, audible: audible });
        }

        export function stop() {
            last_time = 0;
            sendMessage({ "hide": true });
        }
        

        function onDeviceReady() {
            // Verarbeiten der Cordova-Pause- und -Fortsetzenereignisse
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);

            onResume();
            
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
                timeElement.innerText += " (" + target_date.getHours() + ":" +
                    (target_date.getMinutes() < 10 ? "0" : "") +
                    target_date.getMinutes() + " Uhr)";
                timeElement.classList.add("now");
                timeElement.classList.remove("paused");
            }
        }

        function onPause()
        {
            if (last_message_text.length > 0)
            {
                window.localStorage.setItem("last_message_text", last_message_text);
            }
        }

        function onResume()
        {
            var lst_msg_txt = window.localStorage.getItem("last_message_text") as string;
            if (lst_msg_txt != undefined && lst_msg_txt.length > 0)
            {
                last_message_text = lst_msg_txt;
                (document.getElementById('msg_text') as HTMLInputElement).value = lst_msg_txt;
            }
        }

    }

    window.onload = function () {
        Application.initialize();
    }
}

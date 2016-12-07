// Eine Einführung zur leeren Vorlage finden Sie in der folgenden Dokumentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// So debuggen Sie Code beim Seitenladen in Ripple oder auf Android-Geräten/-Emulatoren: Starten Sie die App, legen Sie Haltepunkte fest, 
// und führen Sie dann "window.location.reload()" in der JavaScript-Konsole aus.
module raspicom {
    "use strict";

    export module Application {
        export function initialize() {
            document.addEventListener('deviceready', onDeviceReady, false);
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
        }

        function onPause() {
            // TODO: Diese Anwendung wurde ausgesetzt. Speichern Sie hier den Anwendungszustand.
        }

        function onResume() {
            // TODO: Diese Anwendung wurde erneut aktiviert. Stellen Sie hier den Anwendungszustand wieder her.
        }

    }

    window.onload = function () {
        Application.initialize();
    }
}

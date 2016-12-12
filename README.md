# raspi_com
One-way communication (cherrypy based REST Service) of mobile phone/tablet to Raspberry Pi to show short messages

 * RaspberryPi 2+ @ Raspian
 * 5inch HDMI LCD V2 (to display messages via HTML5 @ htmlPy)
 * MusicMan BT-X7 NANO (to play sound fx)

# Raspberry Pi Setup

mark autostart.sh as executable

chmod +x autostart.sh

add the following line to /home/pi/.config/lxsession/LXDE-pi/autostart

@/home/pi/Desktop/raspi_com/autostart.sh

install dependencies:

* cherrypy
* htmlPy
* PyQt4

# App Setup

Either build the cordova app using Visual Studio 2015 for a platform of your choice or run the www/index.html in any browser.

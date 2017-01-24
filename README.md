# raspi_com
One-way communication (cherrypy based REST Service) of mobile phone/tablet to Raspberry Pi to show short and temporary messages.

 * RaspberryPi 2+ @ Raspian
 * 5inch HDMI LCD V2 (to display messages via HTML5 @ htmlPy)
 * MusicMan BT-X7 NANO (to play sound fx)

# Raspberry Pi Setup

It works best on default Raspian installation.

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

# Raspberry Pi Hardware Setup

 * Raspberry Pi 2 Modell B
 * 5 inch HDMI LCD V2 (See [instructions](http://www.waveshare.com/wiki/5inch_HDMI_LCD#Method_1._Driver_installation) on how to set it up)
   * 800x480 Pixel
   * XPT2046 Touch Controller
 * MusicMan BT-X7 NANO (optional)
 * [Power MOSFET IRFD9024](http://www.vishay.com/docs/91137/sihfd902.pdf) (optional)

The transistor is used to control the backlight of the LCD display manually via one of the I/O pins of the RaspberryPi. This does not only save energy but also looks much better when not displaying anything.


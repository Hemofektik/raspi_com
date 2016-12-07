#!/usr/bin/python

import htmlPy
import os
import sys
import cherrypy
import thread
import pyglet


from threading import Timer
from PyQt4.Qt import QEvent, QObject, qApp, Qt
from PyQt4.QtGui import QApplication, QCursor



class CallbackEventHandler(QObject):

    MAIN_THREAD_ID = 0

    def __init__(self):
        QObject.__init__(self)
        self.installEventFilter(self)

    def eventFilter(self, obj, event):
        return QObject.eventFilter(self, obj, event)

    def _doEvent(self, event):
        callback = event.__dict__.get('callback')
        args = event.__dict__.get('args')
        if callback is not None and args is not None:
            callback(*args)

    def event(self, event):
        if event.type() == QEvent.User:
            self._doEvent(event)
            return True
        return QObject.event(self, event)

    def postEventWithCallback(self, callback, *args):
        if thread.get_ident() == CallbackEventHandler.MAIN_THREAD_ID:
            # if we're in main thread, just fire off callback
            callback(*args)
        else:
            # send callback to main thread
            event = QEvent(QEvent.User)
            event.callback = callback
            event.args = args
            qApp.postEvent(self, event)

def set_monitor_on(state):
    pass
    #if sys.platform.startswith('linux'):
    #    import os
    #    os.system("xset dpms force on" if state else "xset dpms force off")
    #else:
    #    import win32gui
    #    import win32con#

    #    SC_MONITORPOWER = 0xF170
    #    win32gui.SendMessageTimeout(win32con.HWND_BROADCAST, win32con.WM_SYSCOMMAND, SC_MONITORPOWER, -1 if state else 2, 0, 100)
    #    return

class pyGUI(htmlPy.Object):
    # GUI callable functions have to be inside this class.

    def __init__(self):
        super(pyGUI, self).__init__()
        # Initialize the class here, if required.
        return

    @htmlPy.Slot()
    def screen_off(self):
        set_monitor_on(False)
        return

    @htmlPy.Slot()
    def screen_on(self):
        set_monitor_on(True)
        return

    @htmlPy.Slot()
    def javascript_function(self):
        # Any function decorated with @htmlPy.Slot decorater can be called
        # using javascript in GUI
        return

app = None
qtGuiHandler = None

def play_sound(filename):
    if sys.platform.startswith('linux'):
        from subprocess import Popen
        p = Popen(["aplay", filename])
    else:
        music = pyglet.resource.media(filename)
        music.play()

class QTGuiHandler(CallbackEventHandler):

    def __init__(self):
        CallbackEventHandler.__init__(self)
        self.timer_text = None
        self.timer_signal = None

    def _set_text_gui_thread(self, text):
        play_sound("mystic-flute.wav")
        app.evaluate_javascript("(function () {document.set_text('" + text + "');})()")

    def set_text(self, text, duration=5.0):
        self.postEventWithCallback(self._set_text_gui_thread, text)
        print("show '" + text + "' for "+ str(duration) + " seconds")

        if self.timer_text: 
            self.timer_text.cancel()
        if self.timer_signal: 
            self.timer_signal.cancel()

        self.timer_text = Timer(7, self.hide_text, ())
        self.timer_signal = Timer(duration, self.hide, ())
        self.timer_text.start()
        self.timer_signal.start()

    def _hide_gui_thread(self):
        app.evaluate_javascript("(function () {document.hide();})()")

    def hide(self):
        self.postEventWithCallback(self._hide_gui_thread)

    def _hide_text_gui_thread(self):
        app.evaluate_javascript("(function () {document.hide_text();})()")

    def hide_text(self):
        self.postEventWithCallback(self._hide_text_gui_thread)

class RESTService(object):
    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def index(self):
        data = cherrypy.request.json
        if "text" in data and "duration" in data:
            qtGuiHandler.set_text(data["text"], data["duration"])

        if "hide" in data:
            qtGuiHandler.hide()

        return {'key': data }

app = htmlPy.AppGUI(title=u"raspi_msg", maximized=False)
app.developer_mode = True

if sys.platform.startswith('linux'):
    app.window.showFullScreen()

app.template_path = os.path.abspath(".")
app.static_path = os.path.abspath(".")

app.template = ("index.html", {"username": "htmlPy_user"})

app.bind(pyGUI())

def CORS():
    cherrypy.response.headers["Access-Control-Allow-Origin"] = "*"

# Instructions for running application
if __name__ == "__main__":
    
    qtGuiHandler = QTGuiHandler()
    qtGuiHandler.set_text("Bereit")

    QApplication.setOverrideCursor(QCursor(Qt.BlankCursor))

    cherrypy.tools.CORS = cherrypy.Tool("before_finalize", CORS)
    cherrypy.tree.mount(RESTService(), '/')

    if sys.platform.startswith('linux'):
        cherrypy.config.update({'server.socket_host': 'raspi.local',
                                'server.socket_port': 8888})
    else:
        cherrypy.config.update({'server.socket_port': 8888})

    cherrypy.engine.start()

    # The driver file will have to be imported everywhere in back-end.
    # So, always keep app.start() in if __name__ == "__main__" conditional
    app.start()
    

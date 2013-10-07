#-------------------------------------------------
#
# Project created by QtCreator 2013-10-04T17:17:26
#
#-------------------------------------------------

QT       += core gui widgets network

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = magicclient
TEMPLATE = app

# Add SFML include directory, where SFML headers are located
INCLUDEPATH += $$PWD/SFML-2.1/include
DEPENDPATH += $$PWD/SFML-2.1/include

win32:LIBS += -L$$PWD/SFML-2.1/lib-win32/
win32:LIBS += -L$$PWD/SFML-2.1/bin/
unix: LIBS += -L$$PWD/SFML-2.1/lib/ -lsfml-window
LIBS += -lsfml-window
#SFML ends

#qhttpserver
INCLUDEPATH += $$PWD/qhttpserver/include
DEPENDPATH += $$PWD/qhttpserver/include

win32:LIBS += -L$$PWD/qhttpserver/lib-win32/
unix: LIBS += $$PWD/qhttpserver/lib
LIBS += -lqhttpserver

SOURCES += main.cpp pulse.cpp server.cpp window.cpp joystickmanager.cpp xinputGamepad.cpp

HEADERS  += pulse.h server.h window.h joystickmanager.h xinputGamepad.h

FORMS    += window.ui

RESOURCES += \
    systray.qrc

OTHER_FILES += \
    images/bad.svg \
    images/heart.svg \
    images/trash.svg \
    MyInfo.plist \
    ru.lproj/InfoPlist.strings

macx: QMAKE_INFO_PLIST = MyInfo.plist


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

INCLUDEPATH += $$PWD/http-parser

SOURCES += *.cpp $$PWD/http-parser/http_parser.c

HEADERS  += *.h $$PWD/http-parser/http_parser.h

FORMS    += *.ui

RESOURCES += \
    systray.qrc

OTHER_FILES += \
    images/bad.svg \
    images/heart.svg \
    images/trash.svg \
    MyInfo.plist \
    ru.lproj/InfoPlist.strings

macx: QMAKE_INFO_PLIST = MyInfo.plist


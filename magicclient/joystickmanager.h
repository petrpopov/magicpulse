#ifndef JOYSTICKMANAGER_H
#define JOYSTICKMANAGER_H

#include "pulse.h"
#include "xinputGamepad.h"

#include <QObject>
#include <QTimer>

class JoystickManager : public QObject
{
    Q_OBJECT
public:
    explicit JoystickManager(QObject *parent = 0);
    QList<Pulse *> getValues();
    QList<Pulse *> getValues(qint64 timestamp, int size, int page);

signals:
    void joystickReady(bool);

public slots:

private:
    XInput input;
    QTimer scanTimer;
    QTimer valTimer;

    QList<Pulse *> values;

    void init();
    void addValue(Pulse *pulse);

private slots:
    void checkJoystick();
    void configJoystick(bool);
    void scanJoystick();
};

#endif // JOYSTICKMANAGER_H

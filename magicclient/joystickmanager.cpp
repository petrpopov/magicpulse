#include "joystickmanager.h"

#include <QDateTime>

JoystickManager::JoystickManager(QObject *parent) :
    QObject(parent)
{
    init();
}

void JoystickManager::init()
{
    scanTimer.setInterval(15);
    connect(&scanTimer,SIGNAL(timeout()),this,SLOT(checkJoystick()));
    scanTimer.start();

    connect(this, SIGNAL(joystickReady(bool)), this, SLOT(configJoystick(bool)));
}

void JoystickManager::addValue(Pulse *pulse)
{
    int size = values.size();
    if( size <= 576000 )
    {
        values.prepend(pulse);
    }
    else
    {
        values.prepend(pulse);
        values.removeLast();
    }
}

QList<Pulse *> JoystickManager::getValues()
{
    return values;
}

QList<Pulse *> JoystickManager::getValues(qint64 timestamp, int size, int page)
{
    QDateTime time;
    time.setMSecsSinceEpoch(timestamp);

    QList<Pulse *> res;

    int i = 0;
    bool ok = false;

    for(i = values.size()-1; i >=0; i--)
    {
        Pulse *p = values.at(i);
        qint64 ts = p->getTimestamp();

        if( ts < timestamp )
            continue;

        ok = true;
        break;
    }

    if(!ok)
        return res;

    for(int j = 0; j < size; j++)
    {
        int k = i - page*size - j;
        if( k < 0 )
            break;

        res.append( values.at(k));
    }

    return res;
}

void JoystickManager::configJoystick(bool ready)
{
    if( ready == false )
        return;

    bool isActive = valTimer.isActive();
    if( !isActive )
    {
        valTimer.setInterval(50);
        connect(&valTimer,SIGNAL(timeout()),this,SLOT(scanJoystick()));
        valTimer.start();
    }
}

void JoystickManager::scanJoystick()
{
    if (!input.updateState())
        return;

    float val = (input.getHorizontal());
    qint64 ms = QDateTime::currentMSecsSinceEpoch();

    Pulse *pulse = new Pulse(val, ms);
    this->addValue(pulse);
}

void JoystickManager::checkJoystick()
{
    bool hasJoystick = input.initInput(0);
    if (hasJoystick)
    {
        emit joystickReady(true);
    }
    else
    {
        emit joystickReady(false);
    }
}

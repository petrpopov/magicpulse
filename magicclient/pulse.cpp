#include "pulse.h"

Pulse::Pulse(QObject *parent) :
    QObject(parent)
{
}

Pulse::Pulse(float value, qint64 timestamp, QObject *parent) : QObject(parent)
{
    this->value = value;
    this->timestamp = timestamp;
    this->time.setMSecsSinceEpoch(timestamp);
}

void Pulse::setValue(float value)
{
    this->value = value;
}

float Pulse::getValue()
{
    return this->value;
}

void Pulse::setTimestamp(qint64 timestamp)
{
    this->timestamp = timestamp;
    this->time.setMSecsSinceEpoch(timestamp);
}

qint64 Pulse::getTimestamp()
{
    return this->timestamp;
}

void Pulse::setTime(QDateTime time)
{
    this->time = time;
}

QDateTime Pulse::getTime()
{
    return this->time;
}

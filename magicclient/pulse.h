#ifndef PULSE_H
#define PULSE_H

#include <QDateTime>
#include <QObject>

class Pulse : public QObject
{
    Q_OBJECT
public:
    explicit Pulse(QObject *parent = 0);
    explicit Pulse(float value, qint64 timestamp, QObject *parent = 0);

public:
    void setValue(float value);
    float getValue();

    void setTimestamp(qint64 timestamp);
    qint64 getTimestamp();

    void setTime(QDateTime time);
    QDateTime getTime();

private:
    float value;
    qint64 timestamp;
    QDateTime time;

};

#endif // PULSE_H

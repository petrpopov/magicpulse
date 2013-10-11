#ifndef SERVER_H
#define SERVER_H

#include "joystickmanager.h"
#include "qhttprequest.h"

#include <QObject>
#include <QRegExp>
#include <qhttpresponse.h>

class Server : public QObject
{
    Q_OBJECT
public:
    explicit Server(JoystickManager *jManager, QObject *parent = 0);

    void start(int port);

private:
    QHttpServer *server;
    JoystickManager *jManager;

    QString getRequestParam(QString const& param, QHttpRequest *req);
    qint32 getRequestParamInt(QString const& param, QHttpRequest *req);

    qint64 getTimestamp(QRegExp exp);
    void error(QHttpResponse *resp);
    void error(const QString &message, QHttpResponse *resp);
    QString getBody(QString callbackNumber, QList<Pulse *> );

    void handleTimestamp(qint64 timestamp, QHttpRequest *req, QHttpResponse *resp);

private slots:
    void handle(QHttpRequest *req, QHttpResponse *resp);
};

#endif // SERVER_H

#include "server.h"

#include <qhttpserver.h>
#include <qhttprequest.h>
#include <qhttpresponse.h>
#include <QRegExp>
#include <QStringList>
#include <QDateTime>

Server::Server(JoystickManager *jManager, QObject *parent) : QObject(parent)
{
    this->jManager = jManager;

    server = new QHttpServer;
    connect(server, SIGNAL(newRequest(QHttpRequest*, QHttpResponse*)), this, SLOT(handle(QHttpRequest*, QHttpResponse*)));
}

void Server::start(int port)
{
    // let's go
    server->listen(QHostAddress::LocalHost, port);
}

void Server::handle(QHttpRequest *req, QHttpResponse *resp)
{
    QRegExp timeExp("/timestamp/([0-9]+)");
    const QString path = req->path();

    if( timeExp.indexIn(path) != -1 )
    {
        qint64 ts = getTimestamp(timeExp);
        if( ts < 0 ) {
            if( ts == -1 )
                return error("Wrong timestamp", resp);
            else if( ts == -2 )
                return error("NULL timestamp", resp);
            else if( ts == -3 )
                return error("Empty timestamp", resp);
        }

        QDateTime time;
        time.setMSecsSinceEpoch(ts);
        handleTimestamp(ts, req, resp);
    }


    return error("Incorrect request", resp);
}

void Server::handleTimestamp(qint64 timestamp, QHttpRequest *req, QHttpResponse *resp)
{
    resp->setHeader("Content-Type", "application/json");
    resp->writeHead(200);

    if( jManager == NULL )
        return error("Internal error: no jManager", resp);

    QString callback = getRequestParam("callback", req);

    qint32 size = getRequestParamInt("size", req);
    if( size < 0 )
        size = 250;

    qint32 page = getRequestParamInt("page", req);
    if( page < 0 )
        page = 0;

    QList<Pulse *> values = jManager->getValues(timestamp, size, page);

    QString res = getBody(callback, values);
    resp->end(res.toUtf8());
}

QString Server::getRequestParam(QString const& param, QHttpRequest *req)
{
    const QUrl localUrl = req->url();
    QString localQuery = localUrl.query();

    int paramIndex = localQuery.indexOf(param+"=");
    if( paramIndex < 0 )
        return "";

    QString paramValue = localQuery.right(localQuery.length()-paramIndex-param.length()-1);

    int shit = paramValue.indexOf(QChar('&'));
    if( shit > 0 )
        paramValue = paramValue.left(shit);

    paramValue = paramValue.trimmed();

    return paramValue;
}

qint32 Server::getRequestParamInt(QString const& param, QHttpRequest *req)
{
    QString val = getRequestParam(param, req);
    if( val.isEmpty() )
        return -1;

    bool ok = false;
    qint32 v = val.toInt(&ok);

    if( !ok )
        return -1;

    return v;
}

qint64 Server::getTimestamp(QRegExp exp)
{
    QString timestamp = exp.capturedTexts()[1];
    if(timestamp == NULL)
        return -2;

    timestamp = timestamp.trimmed();
    if( timestamp.isEmpty() || timestamp.isNull() )
        return -3;

    bool ok = false;
    qint64 ts = timestamp.toLongLong(&ok);

    if( !ok )
        return -1;

    return ts;
}

void Server::error(QHttpResponse *resp)
{
    this->error("You aren't allowed here!", resp);
}

void Server::error(const QString &message, QHttpResponse *resp)
{
    resp->writeHead(403);
    resp->end(message.toUtf8());
}

QString Server::getBody(QString callbackNumber, QList<Pulse *> values)
{
    QString pulse = "{value: '%1', timestamp: '%2'}";
    QString body = "";

    if( callbackNumber.isEmpty() )
        body = "{pulseData: [%1]}";
    else
        body = callbackNumber + "({pulseData: [%1]})";

    QString data = "";
    for(int i = 0; i < values.size(); i++)
    {
        Pulse * p = values.at(i);
        data += pulse.arg(p->getValue()).arg(p->getTimestamp());

        if( i != values.size()-1 )
            data += ",";
    }
    body = body.arg(data);

    return body;
}


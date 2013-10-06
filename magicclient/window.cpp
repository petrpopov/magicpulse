#include "window.h"
#include "ui_window.h"
#include "server.h"

#include <QMenuBar>
#include <QMessageBox>
#include <QtGui>

Window::Window(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::Window)
{
    ui->setupUi(this);

    createActions();
    createTrayIcon();

    trayIcon->show();

    connect(&jManager, SIGNAL(joystickReady(bool)),this, SLOT(joystickReady(bool)));

    Server *server = new Server(&jManager);
    server->start(9188);
}

void Window::joystickReady(bool ready)
{
    if( ready == true )
    {
        if( currentIcon == false )
        {
            currentIcon = true;

            trayIcon->setIcon(onIcon);
            ui->statusIconLabel->setPixmap(onPixmap);
            ui->statusLabel->setText(tr("Device connected"));
        }
    }
    else
    {
        if( currentIcon == true )
        {
            currentIcon = false;

            trayIcon->setIcon(offIcon);
            ui->statusIconLabel->setPixmap(offPixmap);
            ui->statusLabel->setText(tr("Device disconnected"));
        }
    }
}

void Window::closeEvent(QCloseEvent *event)
{
    if (trayIcon->isVisible() && !qApp->closingDown()) {
        /*QMessageBox::information(this, tr("Systray"),
                                 tr("The program will keep running in the "
                                    "system tray. To terminate the program, "
                                    "choose <b>Quit</b> in the context menu "
                                    "of the system tray entry."));*/
        hide();
        event->ignore();
    }
}

void Window::createActions()
{
    showAction = new QAction(tr("&Properties..."), this);
    quitAction = new QAction(tr("&Quit"), this);

    connect(showAction, SIGNAL(triggered()), this, SLOT(show()));
    connect(quitAction, SIGNAL(triggered()), qApp, SLOT(quit()));
}

void Window::createTrayIcon()
{
    offIcon = QIcon(":/images/power_off.png");
    onIcon = QIcon(":/images/power_on.png");

    offPixmap = QPixmap(":/images/power_off.png");
    onPixmap = QPixmap(":/images/power_on.png");

    trayIconMenu = new QMenu(this);
    trayIconMenu->addAction(showAction);
    trayIconMenu->addAction(quitAction);

    trayIcon = new QSystemTrayIcon(this);
    trayIcon->setContextMenu(trayIconMenu);

    currentIcon = false;
    trayIcon->setIcon(offIcon);
}

Window::~Window()
{
    delete ui;
    delete trayIcon;
    delete trayIconMenu;
    delete showAction;
    delete quitAction;
}

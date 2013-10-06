#ifndef WINDOW_H
#define WINDOW_H

#include "joystickmanager.h"

#include <QDialog>
#include <QSystemTrayIcon>
#include <QMenu>

namespace Ui {
class Window;
}

class QMenu;

class Window : public QDialog
{
    Q_OBJECT

public:
    explicit Window(QWidget *parent = 0);
    ~Window();

private slots:
    void joystickReady(bool ready);

private:
    void closeEvent(QCloseEvent *event);
    void createActions();
    void createTrayIcon();

    JoystickManager jManager;

    bool currentIcon;
    QIcon offIcon;
    QIcon onIcon;
    QPixmap offPixmap;
    QPixmap onPixmap;

    Ui::Window *ui;
    QAction *showAction;
    QAction *quitAction;
    QSystemTrayIcon *trayIcon;
    QMenu *trayIconMenu;
};

#endif // WINDOW_H

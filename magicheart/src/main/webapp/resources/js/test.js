var gamepadSupport =
{
    TYPICAL_BUTTON_COUNT: 16,
    TYPICAL_AXIS_COUNT: 4,
    ticking: false,
    gamepads: [],
    prevRawGamepadTypes: [],
    prevTimestamps: [],
    data: [],
    sendedData: [],

    init: function () {
        "use strict";

        console.log("initialiazing gamepads");

        var gamepadSupportAvailable = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads || (navigator.userAgent.indexOf('Firefox/') != -1);

        if (!gamepadSupportAvailable) {
            console.log("not available");
            //tester.showNotSupported();
        } else {
            window.addEventListener('MozGamepadConnected', gamepadSupport.onGamepadConnect, false);
            window.addEventListener('MozGamepadDisconnected', gamepadSupport.onGamepadDisconnect, false);
            if (!!navigator.webkitGamepads || !!navigator.webkitGetGamepads) {
                gamepadSupport.startPolling();
            }
        }
    },

    onGamepadConnect: function (event) {
        "use strict";

        console.log("gamepad connected");

        gamepadSupport.gamepads.push(event.gamepad);
        //tester.updateGamepads(gamepadSupport.gamepads);
        gamepadSupport.startPolling();
    },

    onGamepadDisconnect: function (event) {
        "use strict";

        console.log("gamepad disconnected");

        for (var i in gamepadSupport.gamepads) {
            if (gamepadSupport.gamepads[i].index == event.gamepad.index) {
                gamepadSupport.gamepads.splice(i, 1);
                break;
            }
        }
        if (gamepadSupport.gamepads.length == 0) {
            gamepadSupport.stopPolling();
        }
       // tester.updateGamepads(gamepadSupport.gamepads);
    },

    startPolling: function () {
        "use strict";

        console.log("start polling gamepad");

        if (!gamepadSupport.ticking) {
            gamepadSupport.ticking = true;
            gamepadSupport.tick();
        }
    },

    stopPolling: function () {
        "use strict";

        gamepadSupport.ticking = false;
    },

    tick: function () {
        "use strict";

        gamepadSupport.pollStatus();
        gamepadSupport.scheduleNextTick();
    },

    scheduleNextTick: function () {
        "use strict";

        if (gamepadSupport.ticking) {
            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(gamepadSupport.tick);
            } else if (window.mozRequestAnimationFrame) {
                window.mozRequestAnimationFrame(gamepadSupport.tick);
            } else if (window.webkitRequestAnimationFrame) {
                window.webkitRequestAnimationFrame(gamepadSupport.tick);
            }
        }
    },

    pollStatus: function () {
        "use strict";

        gamepadSupport.pollGamepads();

        for (var i in gamepadSupport.gamepads) {

            var gamepad = gamepadSupport.gamepads[i];

            if (gamepad.timestamp && (gamepad.timestamp == gamepadSupport.prevTimestamps[i])) {
                continue;
            }

            gamepadSupport.prevTimestamps[i] = gamepad.timestamp;
            gamepadSupport.updateDisplay(i);
        }
    },

    pollGamepads: function () {
        "use strict";

        var rawGamepads = (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) || navigator.webkitGamepads;

        if (rawGamepads) {
            gamepadSupport.gamepads = [];
            var gamepadsChanged = false;
            for (var i = 0; i < rawGamepads.length; i++) {
                if (typeof rawGamepads[i] != gamepadSupport.prevRawGamepadTypes[i]) {
                    gamepadsChanged = true;
                    gamepadSupport.prevRawGamepadTypes[i] = typeof rawGamepads[i];
                }
                if (rawGamepads[i]) {
                    gamepadSupport.gamepads.push(rawGamepads[i]);
                }
            }
            if (gamepadsChanged) {
                //tester.updateGamepads(gamepadSupport.gamepads);
            }
        }
    },

    updateDisplay: function (gamepadId) {
        "use strict";

        var gamepad = gamepadSupport.gamepads[gamepadId];

        gamepadSupport.data.push({value: gamepad.axes[0], timestamp: gamepad.timestamp});

        //console.log(gamepad.axes[0]);//, gamepadId, 'stick-1-axis-x', 'stick-1', true);
        //console.log(gamepad.axes[2], gamepadId, 'stick-2-axis-x', 'stick-2', true);

        var extraAxisId = gamepadSupport.TYPICAL_AXIS_COUNT;
        while (typeof gamepad.axes[extraAxisId] != 'undefined') {
        //    tester.updateAxis(gamepad.axes[extraAxisId], gamepadId, 'extra-axis-' + extraAxisId);
            extraAxisId++;
        }

        gamepadSupport.sendData(gamepadSupport.data);
    },

    sendData: function(data) {
        "use strict";

        var dataToSend = [];
        for( var i = 0; i < data.length; i++) {
            var pulse = data[i];

            var ok = true;
            for( var j = 0; j < gamepadSupport.sendedData.length; j++) {
                var sended = gamepadSupport.sendedData[j];

                if( pulse.timestamp === sended.timestamp ) {
                    ok = false;
                    break;
                }
            }

            if( ok === false ) {
                continue;
            }

            dataToSend.push(pulse);
        }

        for( var k = 0; k < dataToSend.length; k++ ) {
            gamepadSupport.sendedData.push(dataToSend[k]);
        }

        $.ajax({
            type: "POST",
            url: "/data/add",
            data: JSON.stringify( {pulse: dataToSend} ),
            contentType: 'application/json',
            mimeType: 'application/json',
            dataType: 'json',
            success: function() {

            },
            complete: function() {

            }
        });
    }
};
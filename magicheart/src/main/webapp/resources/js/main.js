$(function() {
    "use strict";

    var SIZE = 250;
    var API_URL = "http://localhost:9188/timestamp/";

    var clientId;
    var startTime;
    var stopTime;
    var sensorDataEnded = false;
    var page = 0;

    var sensorData = [];
    var sendedPage = 0;

    init();

    function init() {
        initPlayer();

        clientId = $('#clientId').text();

        $('#sendButton').click(function() {
            sendedPage = 0;
            sendSensorDataToServer();
        });
    }

    function initPlayer() {

        videojs("mainPlayer").ready(function() {
            var mainPlayer = this;

            mainPlayer.on("play", function() {
                var time = mainPlayer.currentTime();
                if( time === 0 ) {
                    console.log("Playing video from the beggining");
                    startTiming();
                }
                else {
                    console.log("Resuming video");
                }
            });

            mainPlayer.on("ended", function() {
                stopTiming(false);
            });

           /* mainPlayer.on("pause", function() {
                stopTiming(true);
            });*/
        });
    }

    function startTiming() {
        startTime = new Date().getTime();
    }

    function stopTiming(pause) {
        stopTime = new Date().getTime();
        loadAllData(pause);
    }

    function loadAllData(pause) {

        if( !startTime ) {
            return;
        }
        if( !stopTime ) {
            return;
        }

        sensorDataEnded = false;

        if( pause === false ) {
            sensorData = [];
        }


        var date = new Date(startTime);
        console.log("Prepare to loading data, loaded data size: " + sensorData.length);
        console.log("Start time is: " +date+ ", timestamp is: " +startTime );

        getSensorData(startTime, SIZE, page);
    }

    function getSensorData(timestampMs) {

        if( sensorDataEnded === true ) {
            return;
        }

        console.log("Loading sensor data with size: " + SIZE + " and page: " + page);

        /*$.ajax({
            crossDomain:true,
            type: "GET",
            url: API_URL+timestampMs+"?size="+SIZE+"&page="+page+"&callback=?",
            dataType: 'jsonp',
            jsonp: 'jsonp',
            async: true,
            contentType: "application/json",
            success: function(data) {
                processSensorData(data, timestampMs);
            }
        }); */

        $.getJSON(API_URL+timestampMs+"?size="+SIZE+"&page="+page+"&callback=?", function(data) {
            processSensorData(data, timestampMs);
        });
    }

    function processSensorData(data, timestampMs) {

        var pulseData = data.pulseData;
        if( pulseData.length === 0 ) {
            console.log("Sensor data ended: no new data");
            console.log("Sensor data size: " + sensorData.length);
            sensorDataEnded = true;
            return;
        }

        for(var i = 0; i < pulseData.length; i++) {
            var pulse = pulseData[i];
            var pTimestamp = pulse.timestamp;

            if( pTimestamp > stopTime ) {
                console.log("Sensor data ended: stopTimestamp found");
                sensorDataEnded = true;

                sendedPage = 0;
                sendSensorDataToServer();

                return;
            }

            if( sensorDataContains(pulse) === false ) {
                sensorData.push(pulse);
            }
        }

        page++;
        getSensorData(timestampMs);
    }

    function sensorDataContains(pulse) {
        if( !sensorData ) {
            return false;
        }
        if( sensorData.length === 0 ) {
            return false;
        }

        for(var i = 0; i < sensorData.length; i++) {
            var savedPulse = sensorData[i];
            if( savedPulse.timestamp === pulse.timestamp ) {
                console.log("Found the same pulse in client data. Omitting...");
                return true;
            }
        }

        return false;
    }

    function sendSensorDataToServer() {

        console.log("All data to send size: " + sensorData.length);

        var dataToSend = [];
        for(var i = 0; i < SIZE; i++) {
            var index = sendedPage*SIZE + i;
            if( index >= sensorData.length ) {
                break;
            }

            dataToSend.push(sensorData[index]);
        }

        if( dataToSend.length === 0 ) {
            console.log("All data sended to server");
            loadSendedData();
            return;
        }

        sendSensorDataPage(dataToSend);
    }

    function sendSensorDataPage(dataToSend) {

        console.log("Sending data page: " + sendedPage);

        $.ajax({
            type: "POST",
            url: "/data/add",
            data: JSON.stringify({pulse: dataToSend, clientId: clientId, pageNumber: sendedPage}),
            contentType: 'application/json',
            mimeType: 'application/json',
            dataType: 'json',
            complete: function() {
                console.log("Sended data page: " + sendedPage + " successfully");

                sendedPage++;
                sendSensorDataToServer();
            }
        });
    }

    function loadSendedData() {

        $.get("/data/values/"+clientId, function(data) {
            $('#table').children().remove();

            $.each(data, function(n, pulse) {
                $('#table').append($('<tr/>').append(
                    $('<td/>').text(new Date(pulse.timestamp))
                ).append(
                        $('<td/>').text(pulse.timestamp)
                    )
                    .append(
                        $('<td/>').text(pulse.value)
                    ));
            });
        });
    }
});


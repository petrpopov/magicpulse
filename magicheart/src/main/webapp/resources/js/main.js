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
                    var mes = "Playing video from the beggining";
                    console.log(mes);
                    $('#log').text( $('#log').text()+"\n" +mes );
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
        $('#log').text("");
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

        var mes1 = "Prepare to loading data, loaded data size: " + sensorData.length;
        console.log(mes1);
        $('#log').text( $('#log').text()+"\n" +mes1 );

        var mes2 = "Start time is: " +date+ ", timestamp is: " +startTime;
        console.log(mes2);
        $('#log').text( $('#log').text()+"\n" +mes2 );

        getSensorData(startTime, SIZE, page);
    }

    function getSensorData(timestampMs) {

        if( sensorDataEnded === true ) {
            return;
        }

        var mes = "Loading sensor data with size: " + SIZE + " and page: " + page;
        console.log(mes);
        $('#log').text( $('#log').text()+"\n" +mes );

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

            var mes1 = "Sensor data ended: no new data";
            var mes2 = "Sensor data size: " + sensorData.length;
            console.log(mes1);
            console.log(mes2);
            $('#log').text( $('#log').text()+"\n" +mes1 );
            $('#log').text( $('#log').text()+"\n" +mes2 );
            sensorDataEnded = true;
            return;
        }

        for(var i = 0; i < pulseData.length; i++) {
            var pulse = pulseData[i];
            var pTimestamp = pulse.timestamp;

            if( pTimestamp > stopTime ) {
                var mes = "Sensor data ended: stopTimestamp found";
                $('#log').text( $('#log').text()+"\n" +mes );
                console.log(mes);
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
                var mes = "Found the same pulse in client data. Omitting...";
                console.log(mes);
                $('#log').text( $('#log').text()+"\n" +mes );
                return true;
            }
        }

        return false;
    }

    function sendSensorDataToServer() {

        var mes = "All data to send size: " + sensorData.length;
        console.log(mes);
        $('#log').text( $('#log').text()+"\n" +mes );

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

        var mes = "Sending data page: " + sendedPage;
        console.log(mes);
        $('#log').text( $('#log').text()+"\n" +mes );

        $.ajax({
            type: "POST",
            url: "/data/add",
            data: JSON.stringify({pulse: dataToSend, clientId: clientId, pageNumber: sendedPage}),
            contentType: 'application/json',
            mimeType: 'application/json',
            dataType: 'json',
            complete: function() {
                var mes = "Sended data page: " + sendedPage + " successfully";
                console.log(mes);
                $('#log').text( $('#log').text()+"\n" +mes );

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


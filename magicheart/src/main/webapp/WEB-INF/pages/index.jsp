<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="sf" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="t" uri="http://tiles.apache.org/tags-tiles" %>

<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <link href="//vjs.zencdn.net/4.1/video-js.css" rel="stylesheet">

    <script src="//vjs.zencdn.net/4.1/video.js"></script>
    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script type="text/javascript" src="/resources/js/main.js"></script>
</head>

<body>

    <video id="mainPlayer" class="video-js vjs-default-skin"
           controls preload="auto" width="640" height="264"
           poster="http://video-js.zencoder.com/oceans-clip.png"
           data-setup='{"example_option":true}'>
        <source src="http://video-js.zencoder.com/oceans-clip.mp4" type='video/mp4' />
    </video>

    <span>id:</span><label id="clientId">${clientId}</label>
    <button id="sendButton">Send data</button>

    <div>
        <label>Результаты</label>
        <table id="table">

        </table>
    </div>



</body>
</html>
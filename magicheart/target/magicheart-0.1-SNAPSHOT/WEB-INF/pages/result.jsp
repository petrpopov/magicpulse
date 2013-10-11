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
    <title></title>
</head>
<body>
    <c:set var="count" value="0" scope="page" />

    <table>
        <thead>
            <th>
                Номер:
            </th>
            <th>
                Значение по оси X:
            </th>
            <th>
                Timestamp:
            </th>
        </thead>
        <c:forEach var="data" items="${data}">
            <tr>
                <td>
                    <c:set var="count" value="${count + 1}" scope="page"/>
                    <c:out value="${count}"></c:out>
                </td>
                <td>
                    <c:out value="${data.value}"></c:out>
                </td>

                <td>
                    <c:out value="${data.timestamp}"></c:out>
                </td>
            </tr>
        </c:forEach>
    </table>
</body>
</html>
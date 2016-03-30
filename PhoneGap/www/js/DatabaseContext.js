var db = null;

function connectDB() {
    db = window.openDatabase("madDiscovery9", 1.0, "Mad Discovery", 5000000); // name database, version, description, size of db (kb)
}

function createTable(callback) {
    //var query = "DROP TABLE EventTBL";
    //var query = "DROP TABLE ImageReport";
    //var query = "DROP TABLE TextReport";
    var query = "CREATE TABLE IF NOT EXISTS EventTBL";
    query += "(";
    query += "EventId INTEGER PRIMARY KEY,";
    query += "EventName TEXT,";
    query += "EventLocation TEXT,";
    query += "EventLat TEXT,";
    query += "EventLon TEXT,";
    query += "EventDate TEXT,";
    query += "EventOrgName TEXT,";
    query += "EventStatus INTEGER";
    query += ");";

    var query2 = "CREATE TABLE IF NOT EXISTS ImageReport";
    query2 += "(";
    query2 += "ImageReportId INTEGER PRIMARY KEY,";
    query2 += "EventId INTEGER,";
    query2 += "ReportDate TEXT,";
    query2 += "ImgURL TEXT,";
    query2 += "FOREIGN KEY (EventId) REFERENCES EventTBL(EventId)";
    query2 += ");";

    var query3 = "CREATE TABLE IF NOT EXISTS TextReport";
    query3 += "(";
    query3 += "TextReportID INTEGER PRIMARY KEY,";
    query3 += "EventId INTEGER,";
    query3 += "ReportDate TEXT,";
    query3 += "Comment TEXT,";
    query3 += "FOREIGN KEY (EventId) REFERENCES EventTBL(EventId)";
    query3 += ");";

    db.transaction(
        function (tx) { // to execute
            tx.executeSql(query);
            tx.executeSql(query2);
            tx.executeSql(query3);
        },
        function (err) { // to raise an error
            alert(err.message);
            console.log("CREATE TABLE ERROR. CODE: " + err.code + " Message: " + err.message);
        },
        function () { // to finish transaction
            console.log("CREATE TABLE OK");
            callback();
        }
    );
}

function getListEvent(updateUI) {
    var query = "SELECT * FROM EventTBL";

    db.transaction(
        function (tx) {
            tx.executeSql(query, [], function (tx, rs) { // rs = result set
                updateUI(rs);
            });
        }
    );
}

function getListTextReport(eventId, updateTextReportUI) {
    var query = "SELECT * FROM TextReport WHERE EventID = ?";

    db.transaction(
        function (tx) {
            tx.executeSql(query, [eventId], function (tx, rs) { // rs = result set
                updateTextReportUI(rs);
            });
        }
    );
}

function getListImageReport(eventId, updateImageReportUI) {
    var query = "SELECT * FROM ImageReport WHERE EventID = ?";

    db.transaction(
        function (tx) {
            tx.executeSql(query, [eventId], function (tx, rs) { // rs = result set
                updateImageReportUI(rs);
            });
        }
    );
}

function getEventById(eventId, callback) {
    var query = "SELECT * FROM EventTBL WHERE EventID = ?";

    db.transaction(
        function (tx) {
            tx.executeSql(query, [eventId], function (tx, rs) { // rs = result set
                callback(rs);
            });
        }
    );
}

function updateEvent(eventId, props, callback) {
    var query = "UPDATE EventTBL SET ";
    var hasProps = false;
    var values = [];
    for (var key in props) {
        var value = props[key];
        query = query.concat(key + "= ?, ");
        values.push(value);
        hasProps = true;
    }
    if (!hasProps) {
        alert("Nothing to update");
        return;
    }
    query = query.substring(0, query.length - 2);
    query = query.concat(" WHERE EventID = ?");
    values.push(eventId);

    db.transaction(
        function (tx) { // to execute
            tx.executeSql(query, values);
        },
        function (err) { // to raise an error
            alert("update error");
            console.log("INSERT ERROR. CODE: " + err.code + " Message: " + err.message);
        },
        function () { // to finish transaction
            console.log("update ok");
            callback();
        }
    );
}

function isEventExisted(eLat, eLon, eName, eOrg, callback) {
    var query = "SELECT * FROM EventTBL WHERE (EventLat = ? AND EventLon = ?) or (EventName = ? AND EventOrgName = ?)";

    db.transaction(
        function (tx) {
            tx.executeSql(query, [eLat, eLon, eName, eOrg], function (tx, rs) { // rs = result set
                callback(rs);
            });
        }
    );
}

function insertEvent(eName, eLoc, eLat, eLon, eDate, eOrg, callback) {
    var query = "INSERT INTO EventTBL";
    query += "(";
    query += "EventName, EventLocation, EventLat, EventLon, EventDate, EventOrgName, EventStatus";
    query += ")";
    query += "VALUES (?, ?, ?, ?, ?, ?, ?);";

    db.transaction(
        function (tx) { // to execute
            tx.executeSql(query, [eName, eLoc, eLat, eLon, eDate, eOrg, 1]);
        },
        function (err) { // to raise an error
            alert("insert error");
            console.log("INSERT ERROR. CODE: " + err.code + " Message: " + err.message);
        },
        function () { // to finish transaction
            console.log("INSERT OK");
            callback();
        }
    );
}

function insertTextReport(eventId, commentString, callback) {
    var query = "INSERT INTO TextReport";
    query += "(";
    query += "EventId, ReportDate, Comment";
    query += ")";
    query += "VALUES (?, ?, ?);";

    var commentDate = new Date().getTime();
    db.transaction(
        function (tx) { // to execute
            tx.executeSql(query, [eventId, commentDate, commentString]);
        },
        function (err) { // to raise an error
            alert("insert error");
            console.log("INSERT ERROR. CODE: " + err.code + " Message: " + err.message);
        },
        function () { // to finish transaction
            console.log("INSERT COMMENT OK");
            callback(commentString, commentDate);
        }
    );
}

function insertPhotoReport(eventId, photoPath, callback) {
    var query = "INSERT INTO ImageReport";
    query += "(";
    query += "EventId, ReportDate, ImgURL";
    query += ")";
    query += "VALUES (?, ?, ?);";

    db.transaction(
        function (tx) { // to execute
            tx.executeSql(query, [eventId, new Date().getTime(), photoPath]);
        },
        function (err) { // to raise an error
            alert("insert error");
            console.log("INSERT ERROR. CODE: " + err.code + " Message: " + err.message);
        },
        function () { // to finish transaction
            console.log("INSERT PHOTO OK");
            callback();
        }
    );
}
/*global $:false, jQuery:false, console:false */
$(document).ready(function($) {

    var device_id = null;
    var token = null;

    var record_flag = false;
    var socket_connected_flag = false;
    var record_total = 0; // for total record count saved
    var lap_total = 0;
    var special_tag = "none";
    var save_obj = []; // array for holding recording objects
    var special_tag_count = 1;
    var special_tag_count_element = null;

    var socket = io.connect('http://build.kiwiwearables.com:8080');

    var ac_x = new TimeSeries();
    var ac_y = new TimeSeries();
    var ac_z = new TimeSeries();

    var gy_x = new TimeSeries();
    var gy_y = new TimeSeries();
    var gy_z = new TimeSeries();

    var ma_x = new TimeSeries();
    var ma_y = new TimeSeries();
    var ma_z = new TimeSeries();

    var total;
    var taptotal = 0;
    var detectArrayCounter = 0;
    var isDetect = 0;
    var dontCheck = 0;
 
    var bufferSize = 10;   
    var threshold = 20;     
    var detectArray = new Array(bufferSize);

    function store_data(data) {
        if (record_flag) {
            data.lap = lap_total;
            data.special = special_tag;
            data.date = new Date();
            save_obj.push(data);
            record_total++;
            $('#label-holder').find("input");
            if (special_tag_count_element) {
                special_tag_count_element.html(parseInt(special_tag_count_element.html()) + 1);
            }
            $("#total-count").html(record_total);
        }
    }
    
    function createTimeline() {

        var color_x = '#6e97aa'; //blue
        var color_y = '#8fae53'; //green
        var color_z = '#c75d5d'; //red

        $("#ac-x").css("color", color_x);
        $("#ac-y").css("color", color_y);
        $("#ac-z").css("color", color_z);

        $("#gy-x").css("color", color_x);
        $("#gy-y").css("color", color_y);
        $("#gy-z").css("color", color_z);

        $("#ma-x").css("color", color_x);
        $("#ma-y").css("color", color_y);
        $("#ma-z").css("color", color_z);

        var ac_min = -16;
        var ac_max = 16;

        var chart_ac = new SmoothieChart({millisPerPixel: 10, grid: {fillStyle: '#ffffff', strokeStyle: '#f4f4f4', sharpLines: true, millisPerLine: 7000, verticalSections: 5}, timestampFormatter: SmoothieChart.timeFormatter, minValue: ac_min, maxValue: ac_max});

        chart_ac.addTimeSeries(ac_x, {lineWidth: 2, strokeStyle: color_x});
        chart_ac.addTimeSeries(ac_y, {lineWidth: 2, strokeStyle: color_y});
        chart_ac.addTimeSeries(ac_z, {lineWidth: 2, strokeStyle: color_z});
        chart_ac.streamTo(document.getElementById("chart-1"), 0);
        
        var gy_min = -360;
        var gy_max = 360;

        var chart_gy = new SmoothieChart({millisPerPixel: 10, grid: {fillStyle: '#ffffff', strokeStyle: '#f4f4f4', sharpLines: true, millisPerLine: 7000, verticalSections: 5}, timestampFormatter: SmoothieChart.timeFormatter, minValue: gy_min, maxValue: gy_max});

        chart_gy.addTimeSeries(gy_x, {lineWidth: 2, strokeStyle: color_x});
        chart_gy.addTimeSeries(gy_y, {lineWidth: 2, strokeStyle: color_y});
        chart_gy.addTimeSeries(gy_z, {lineWidth: 2, strokeStyle: color_z});
        chart_gy.streamTo(document.getElementById("chart-2"), 0);

        var ma_min = -1000;
        var ma_max = 1000;

        var chart_ma = new SmoothieChart({millisPerPixel: 10, grid: {fillStyle: '#ffffff', strokeStyle: '#f4f4f4', sharpLines: true, millisPerLine: 7000, verticalSections: 5}, timestampFormatter: SmoothieChart.timeFormatter, minValue: ma_min, maxValue: ma_max});

        chart_ma.addTimeSeries(ma_x, {lineWidth: 2, strokeStyle: color_x});
        chart_ma.addTimeSeries(ma_y, {lineWidth: 2, strokeStyle: color_y});
        chart_ma.addTimeSeries(ma_z, {lineWidth: 2, strokeStyle: color_z});
        chart_ma.streamTo(document.getElementById("chart-3"), 0);
               
    }

    function check_cookie() {

        var cookie = $.cookie('kiwi_move');

        if (cookie) {
            credentials = JSON.parse(cookie);
            device_id = credentials.device_id;
            token = credentials.password;

            if (socket_connected_flag) {
                socket.emit('auth', credentials);
            } else {
                alert("oops dashboard not online!")
            }
        }
    }

    var build_csv = function() {

        if (save_obj.length < 1)
            return;

        var csvLine;
        var csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "packet-type, device-id, accel-x,accel-y,accel-z,gyro-x,gyro-y,gyro-z,mag-x,mag-y,mag-z,lap,special tag" + "\n";
        save_obj.forEach(function(infoArray, index) {
            var count = 1;
            for (var key in infoArray) {
                if (infoArray.hasOwnProperty(key)) {
                    csvLine += (count < Object.keys(infoArray).length) ? infoArray[key] + "," : infoArray[key];
                }
                count++;
            }
            csvContent += (index + 1 < save_obj.length) ? csvLine + "\n" : csvLine;
            csvLine = "";
        });

        date = new Date();
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "KiwiMove-" + date.getFullYear() + "-" + (date.getMonth() + 1) + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds() + ".csv");
        link.click();
    };

    var log_out = function() {
        $.removeCookie('kiwi_move');

        // reset variables
        device_id = null;
        token = null;
        record_flag = false;
        record_total = 0; // for total record count saved
        lap_total = 0;
        special_tag = "none";
        save_obj = null; // array for holding recording objects
        special_tag_count = 1;
        special_tag_count_element = null;

        $('#login').show(200);
        $('#dashboard').hide();
    };

//     var emulator_handler = function() {
//         var ax = Math.random() * 10;
//         var ay = Math.random() * 10;
//         var az = Math.random() * 10;

//         var gx = Math.random() * 360;
//         var gy = Math.random() * 360;
//         var gz = Math.random() * 360;

// //        var rx = Math.random() * 360;
// //        var ry = Math.random() * 360;
// //        var rz = Math.random() * 360;

//         var device_id = 1234;

//         ac_x.append(new Date().getTime(), ax);
//         ac_y.append(new Date().getTime(), ay);
//         ac_z.append(new Date().getTime(), az);

//         rotate({x: gx, y: gy, z: gz})

//         data = {
//             accelerometer_x: ax,
//             accelerometer_y: ay,
//             accelerometer_z: az,
//             gyroscope_x: gx,
//             gyroscope_y: gy,
//             gyroscope_z: gz,
// //            rotation_x: rx,
// //            rotation_y: ry,
// //            rotation_z: rz,
//             id: device_id
//         };

//         store_data(data);
//     };

    var data_handler = function(data) {

        var data_clean = JSON.parse(data.message);

        $("#socket-connection").html("Testing panel - Active");

        // put accelerometer data into the graph
        ac_x.append(new Date().getTime(), data_clean.ax);
        ac_y.append(new Date().getTime(), data_clean.ay);
        ac_z.append(new Date().getTime(), data_clean.az);

        // put gyroscope data into the graph
        gy_x.append(new Date().getTime(), data_clean.gx);
        gy_y.append(new Date().getTime(), data_clean.gy);
        gy_z.append(new Date().getTime(), data_clean.gz);

        //put magnetometer data into the graph
        ma_x.append(new Date().getTime(), data_clean.mx);
        ma_y.append(new Date().getTime(), data_clean.my);
        ma_z.append(new Date().getTime(), data_clean.mz);

        store_data(data_clean);

        if (data_clean.packet_type==03){
            taptotal++;
            console.log(data_clean);
        }

        // //DTW detection system
        var dtw = DTW(data_clean);
        var total = dtw.total;

        if ((total <= threshold) && (dontCheck == 0)) {
            detectArrayCounter++; 

            //only count a motion if 10 predictions are counted
            if(detectArrayCounter >= bufferSize){
              isDetect++;
              start = new Date().getTime();
              $('#detect').toggleClass("detect-off");
              dontCheck = 1;

              setTimeout(function(){
                detectArrayCounter = 0;
                dontCheck = 0;
                $('#detect').toggleClass("detect-off");
              },1500);
            }
        }

        $('#prediction').html(total.toFixed(1));
        $('#taps').html(taptotal);
        //console.log(total);
    };

    var record_handler = function() {
        lap_total++;
        record_flag = (record_flag) ? false : true;
    };

    var record_sub_handler = function(e) {
        lap_total++;
        record_flag = e.is(":checked") ? true : false;
        special_tag_count_element = e.parent().parent().next().next().children();
        var special_row = $(e).closest(".special-row")[0];
        var row_num = $(special_row).attr("id").substring(2, 10);
        special_tag = e.is(":checked") ? $("#sp-label-" + row_num).val() : "none";
    };

    var remove_special_handler = function(e) {
        var anchor = $(e.currentTarget).closest("div");
        anchor.fadeOut(500, function() {
            anchor.remove();
        });
    };

    var add_special_handler = function(e) {
        special_tag_count++;
        var anchor = $(e.currentTarget).closest("div");
        var newrow = anchor.clone(); // clone the initial row
        $(newrow.children().children().next().next().next().children()[0]).text(0); // set newly added counter to 0 
        $(e.currentTarget.children[0]).attr("class", "icon-minus"); // change plus to minus of previouc icon row
        $(e.currentTarget).attr("class", "btn btn-xs btn-red remove adjust-align"); // add remove class to button
        $(e.currentTarget).unbind('click'); // remove old click listener
        $(e.currentTarget).on("click", remove_special_handler); // re-bind new remove handler
        newrow.closest("div").attr("id", "sp" + special_tag_count); // add tag id
        $(newrow.find("input")[0]).attr("value", "Special Tag " + special_tag_count); // add text label
        $(newrow.find("input")[0]).attr("id", "sp-label-" + special_tag_count);
        $(newrow.find("input")[1]).attr("id", "sp-" + special_tag_count);
        $($(newrow.find("li")[1]).find("input"));
        var newinput = $(newrow.find("input")[1]);
        $(newrow.find("li")[1]).html("");
        $(newrow.find("li")[1]).html(newinput);
        newrow.find("button").on("click", add_special_handler);
        newrow.insertAfter(anchor).hide().fadeIn(500);
        $("#label-holder :radio").iButton({change: record_sub_handler, allowRadioUncheck: true});
    };

    var collapse_section_handler = function(e) {

        var element = $(e.currentTarget).closest('div');

        $(element).next().slideToggle(200, function() {
            if ($(element).next().is(':visible')) {
                $(e.currentTarget.children[0]).attr("class", "icon-minus");
            } else {
                $(e.currentTarget.children[0]).attr("class", "icon-plus");
            }
        });
    };

    var socket_error_handler = function() {
        alert("could not connect - are you sure server is on? - turn on server and refresh page");
        $("#streamButton").iButton("toggle");
        $("#socket-connection").html("Testing panel - Not Connected");
        $("#socket-connection").css("color", "red");
        socket_connected_flag = false;
    };

    var socket_connect_handler = function() {
        $("#socket-connection").html("Testing panel - Connected");
        $("#socket-connection").css("color", "green");
        socket_connected_flag = true;
        check_cookie();
    };

    var socket_disconnect_handler = function() {
        $("#streamButton").iButton("toggle");
        $("#socket-connection").html("Testing panel - Disconnected");
        $("#socket-connection").css("color", "red");
        alert("woah ho ho - server disconnected");
        socket_connected_flag = false;
    };

    var auth_response_handler = function(data) {

        credentials = {
            device_id: device_id,
            password: token
        };

        if (data.message === "authenticated") {
            // save to client side cookie
            $.cookie('kiwi_move', JSON.stringify(credentials), {expires: 9999});

            // initiate listen command to socket
            socket.emit('listen', credentials);

            // this is used to update the code snippet with the users actual code
            $('#code-password').text("'" + token + "'")
            $('#code-device-id').text("'" + device_id + "'")
            
            $('#device-id-header-number').text(device_id);
            
            // show the dashboard and hide the login div
            $('#login').hide();
            $('#dashboard').fadeIn(200);
        } else {
            alert("incorrect Device ID and/or Token");
        }
    };

    var login_handler = function() {

        device_id = $('#device_id').val();
        token = $('#token').val();
        save_obj = [];
        credentials = {
            device_id: device_id,
            password: token
        };

        if (socket_connected_flag) {
            socket.emit('auth', credentials);
        } else {
            alert("oops dashboard not online!")
        }
    };

    $("#csv-advanced").on("click", function() {
        $("#label-holder :radio").iButton({change: record_sub_handler, allowRadioUncheck: true});
        $(".advanced").toggle(200);
        $("#iButton").iButton("disable");
    });

    $("#csv-reset").on("click", function() {
        record_flag = false;
        record_total = 0;
        lap_total = 0;
        save_obj = [];
        $(".advanced").fadeOut(200);
        $(".set-zero").html(0);
    });
    
    $('#csv-logout').on("click", log_out);
    $("#csv-save").on("click", build_csv);
    $('.expand').on("click", add_special_handler);
    $('.box-collapse').on("click", collapse_section_handler);
    $('.button-login').on("click", login_handler);
    $('.content-hide').hide();
    socket.on("error", socket_error_handler);
    socket.on("connect", socket_connect_handler);
    socket.on('auth_response', auth_response_handler);
    socket.on('listen_response', data_handler);
    socket.on("disconnect", socket_disconnect_handler);

    createTimeline();

//    setInterval(emulator_handler, 500); // emulator for testing until hardware available & stable

    $("#iButton").iButton({change: record_handler, allowRadioUncheck: true});
});
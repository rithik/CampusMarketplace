    var contents;
    var fromLatLong;
    var toLatLong;
    var drivingTime;
    var transitTime;
    var walkingTime;
    var bicyclingTime;

    var drivingDistance;
    var transitDistance;
    var walkingDistance;
    var bicyclingDistance;
    $(document).ready(function() {
        $("#submitButton").click(function() {

            $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + $("#from").val() + "&key=AIzaSyCJ9faDR8ah7Liqz3TdqCdhk-VQXXM0Vck&fo", function(res) {
                fromLatLong = res["results"][0]["geometry"]["location"]["lat"] + "," + res["results"][0]["geometry"]["location"]["lng"];
                console.log(fromLatLong);
                $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + $("#to").val() + "&key=AIzaSyCJ9faDR8ah7Liqz3TdqCdhk-VQXXM0Vck&fo", function(res) {
                    toLatLong = res["results"][0]["geometry"]["location"]["lat"] + "," + res["results"][0]["geometry"]["location"]["lng"];
                    console.log(toLatLong);
                    $.ajax({
                            method: "GET",
                            url: "worker.php",
                            data: { url: "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + fromLatLong + "&destinations=" + toLatLong + "&mode=driving&key=AIzaSyCJ9faDR8ah7Liqz3TdqCdhk-VQXXM0Vck&fo" }
                        })
                        .done(function(json_contents) {
                            contents = json_contents;
                            drivingTime = JSON.parse(json_contents)["rows"][0]["elements"][0]["duration"]["text"];
                            drivingDistance = (parseInt(JSON.parse(json_contents)["rows"][0]["elements"][0]["distance"]["text"].replace(/[^\d.]/g, '')) * 0.621371).toFixed(1) + " miles";
                            console.log(drivingTime);
                            $("#DrivingTime").html(drivingTime);
                            $("#DrivingD").html(drivingDistance);
                        });
                    $.ajax({
                            method: "GET",
                            url: "worker.php",
                            data: { url: "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + fromLatLong + "&destinations=" + toLatLong + "&mode=transit&key=AIzaSyCJ9faDR8ah7Liqz3TdqCdhk-VQXXM0Vck&fo" }
                        })
                        .done(function(json_contents) {
                            contents = json_contents;
                            if (JSON.parse(contents)["rows"][0]["elements"][0]["status"] == "ZERO_RESULTS") {
                                transitTime = "No Public Transportation options available";
                                transitDistance = "No Public Transportation options available";
                            }
                            else {
                                transitTime = JSON.parse(json_contents)["rows"][0]["elements"][0]["duration"]["text"];
                                transitDistance = (parseInt(JSON.parse(json_contents)["rows"][0]["elements"][0]["distance"]["text"].replace(/[^\d.]/g, '')) * 0.621371).toFixed(1) + " miles"
                            }
                            console.log(transitTime);
                            $("#TransitTime").html(transitTime);
                            $("#TransitD").html(transitDistance);
                        });
                    $.ajax({
                            method: "GET",
                            url: "worker.php",
                            data: { url: "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + fromLatLong + "&destinations=" + toLatLong + "&mode=walking&key=AIzaSyCJ9faDR8ah7Liqz3TdqCdhk-VQXXM0Vck&fo" }
                        })
                        .done(function(json_contents) {
                            contents = json_contents;
                            walkingTime = JSON.parse(json_contents)["rows"][0]["elements"][0]["duration"]["text"];
                            walkingDistance = (parseInt(JSON.parse(json_contents)["rows"][0]["elements"][0]["distance"]["text"].replace(/[^\d.]/g, '')) * 0.621371).toFixed(1) + " miles"
                            console.log(walkingTime);
                            $("#WalkingTime").html(walkingTime);
                            $("#WalkingD").html(walkingDistance);
                        });
                    $.ajax({
                            method: "GET",
                            url: "worker.php",
                            data: { url: "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + fromLatLong + "&destinations=" + toLatLong + "&mode=bicycling&key=AIzaSyCJ9faDR8ah7Liqz3TdqCdhk-VQXXM0Vck&fo" }
                        })
                        .done(function(json_contents) {
                            contents = json_contents;
                            bicyclingTime = JSON.parse(json_contents)["rows"][0]["elements"][0]["duration"]["text"];
                            bicyclingDistance = (parseInt(JSON.parse(json_contents)["rows"][0]["elements"][0]["distance"]["text"].replace(/[^\d.]/g, '')) * 0.621371).toFixed(1) + " miles"
                            console.log(bicyclingTime);
                            $("#BicyclingTime").html(bicyclingTime);
                            $("#BicyclingD").html(bicyclingDistance);
                        });

                });
            });
            lowestValue = Math.min(Math.min(drivingTime,walkingTime),Math.min(bicyclingTime,transitTime))
            $("#optimalPath").html(lowestValue);
        });
    });
    
    
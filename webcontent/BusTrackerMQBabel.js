/**
 * Lucas LaRocco
 */
class BusTrackerMQ {
  // Note: We could also have used a static Factory Method (as in previous code examples) to call the constructor.
  constructor() {
    $(document).ready(function () {
      // when document loads, do some initialization
      onload();
    }); // Note: Any "private" variables you create via "let x=..." will be visible to the "onload" function below and its
    // nested inner functions. (You probably don't need to declare any extra variables however).
    // The onLoad "private" member function is called when the document loads and is used to perform initialization.

    let onload = function () {
      // Note: local vars will be visible/accessible within inner functions below!
      let message = $("#message");
      message.hide();
      let timer = null; // an interval timer

      let update = 0; // update counter

      let startPoint = [43.044240, -87.906446]; // GPS lat/long location of MSOE athletic field

      let map = createMap(startPoint); // map this starting location (see code below) using MapQuest

      let loc = "MSOE Athletic Field" + startPoint[0].toFixed(3) + ", " + startPoint[1].toFixed(3);
      addMarker(map, startPoint, loc, "The place to be!"); // add a push-pin to the map
      // initialize button event handlers (note this shows an alternative to $("#id).click(handleClick)

      $("#start").on("click", doAjaxRequest);
      $("#stop").on("click", stopTimer);
      $("#report").on("click", generateReport); //NOTE: Remaining helper functions are all inner functions of onLoad; thus, they have
      // access to all vars declared within onLoad.
      // Create a MapQuest map centered on the specified position. If the map already exists, update the center point of the map per the specified position
      // param position - a GPS array of [lat,long] containing the coordinates to center the map around

      function createMap(position) {
        L.mapquest.key = 'zGIsdy5hRRVw4EZoz8j7J7ysG9jAHpIY'; // your key here!
        // 'map' refers to a <div> element with the ID map
        //map.addControl(L.mapquest.control()); // use alternate map control

        return L.mapquest.map('map', {
          center: position,
          layers: L.mapquest.tileLayer('map'),
          zoom: 14
        });
      } // end inner function displayMap
      // This function adds a "push-pin" marker to the existing map
      // param map - map object (returned from createMap method
      // param position - the [lat, long] position of the marker on the map
      // param description - text that appears next to the marker
      // param popup - the text that appears when a user hovers over the marker


      function addMarker(map, position, description, popup) {
        L.mapquest.textMarker(position, {
          text: description,
          title: popup,
          position: 'right',
          type: 'marker',
          icon: {
            primaryColor: '#FF0000',
            secondaryColor: '#00FF00',
            size: 'sm'
          }
        }).addTo(map);
      } // end inner function addMarker
      //Executes an ajax request to the server for data from the mongo server


      function generateReport() {
        fetch("http://localhost:3000/BusSpeed?spd=" + $("#route").val()).then(handleDBSuccess).catch(handleError);
      } // This function executes an Ajax request to the server


      function doAjaxRequest() {
        update++;
        $("#update").html(update);
        fetch("http://localhost:3000/Businfo?key=" + key + "&rt=" + $("#route").val()).then(handleSuccess).catch(handleError);

        if (timer === null) {
          timer = setInterval(doAjaxRequest, 5000);
        } // When started, it should cause doAjaxRequest to be called every 5 seconds

      } // end inner function doAjaxRequest
      // This function stops the timer and nulls the reference


      function stopTimer() {
        clearInterval(timer);
        timer = null;
        update = 0;
        $("#update").html(update);
      } // end inner function stopTimer
      // This function is called if the fetch request succeeds.
      // The response from the server is a Promise containing a json response!
      // Note that the Ajax request can succeed, but the response may indicate an error (e.g. if a bad route was specified)


      function handleSuccess(response) {
        let table = $("#table1");
        response.json().then(buses => {
          if (buses.hasOwnProperty("status")) {
            let error = buses["status"];
            handleError(error);
          } else if (buses["bustime-response"].hasOwnProperty("error")) {
            let error = buses["bustime-response"]["error"][0]["msg"];
            handleError(error);
          } else {
            message.hide();
            ReactDOM.render(React.createElement(BusTable, {
              data: buses["bustime-response"]["vehicle"]
            }), document.getElementById("table1"));
            table.show();

            for (let i = 0; i < buses["bustime-response"]["vehicle"].length; i++) {
              let index = buses["bustime-response"]["vehicle"][i];
              let bus = index["vid"];
              let dest = index["des"];
              let lat = index["lat"];
              let lon = index["lon"];
              let point = [Number(lat), Number(lon)];
              addMarker(map, point, dest, bus);
            }
          }
        });
      } // end inner function handleSuccess
      // This function is called if the Ajax request fails (e.g. network error, bad url, server timeout, etc)


      function handleError(error) {
        $("#table1").hide();
        message.html("Error processing Ajax request!\n" + error).show();
      } // end inner function handleError
      //Handles the data received from the mongo server and displays it in a table


      function handleDBSuccess(response) {
        let table = $("#table1");
        response.json().then(buses => {
          $("#update").html("Buses: " + buses.length);

          if (buses.length > 0) {
            message.hide();
            ReactDOM.render(React.createElement(BusTable, {
              data: buses
            }), document.getElementById("table1"));
            table.show();

            for (let i = 0; i < buses.length; i++) {
              let bus = buses[i]["vid"];
              let lat = buses[i]["lat"];
              let lon = buses[i]["lon"];
              let spd = buses[i]["spd"];
              let tmstmp = buses[i]["tmstmp"];
              let point = [Number(lat), Number(lon)];
              addMarker(map, point, bus + ':' + spd + 'MPH', tmstmp);
            }
          }
        });
      }
    }; // end onLoad "private" method

  } // end "public" constructor


} // end class BusTracker

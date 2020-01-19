/**
 * Lucas LaRocco
 */
//Creates the table where the bustime data will be displayed
class BusTable extends React.Component {
  render() {
    return React.createElement("table", {
      className: "table table-striped table-bordered table-condensed"
    }, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("th", null, "Bus"), React.createElement("th", null, "Route"), React.createElement("th", null, "Latitude"), React.createElement("th", null, "Longitude"), React.createElement("th", null, "Speed(MPH)"), React.createElement("th", null, "Time")), // Javascript in the middle of JSX needs to be delimited with {}
    this.props.data.map((entry, index) => React.createElement("tr", {
      key: index
    }, React.createElement("td", null, entry["vid"]), React.createElement("td", null, entry["rt"]), React.createElement("td", null, entry["lat"]), React.createElement("td", null, entry["lon"]), React.createElement("td", null, entry["spd"]), React.createElement("td", null, entry["tmstmp"])))));
  } // end render()


} // end class PhoneTable

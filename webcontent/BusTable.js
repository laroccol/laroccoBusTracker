/**
 * Lucas LaRocco
 */

//Creates the table where the bustime data will be displayed
class BusTable extends React.Component {
    render() {
        return <table className='table table-striped table-bordered table-condensed'>
            <tbody>
            <tr>
                <th>Bus</th>
                <th>Route</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Speed(MPH)</th>
                <th>Time</th>
            </tr>
            { // Javascript in the middle of JSX needs to be delimited with {}
                this.props.data.map((entry, index) =>
                    <tr key={index}>
                        <td>{entry["vid"]}</td>
                        <td>{entry["rt"]}</td>
                        <td>{entry["lat"]}</td>
                        <td>{entry["lon"]}</td>
                        <td>{entry["spd"]}</td>
                        <td>{entry["tmstmp"]}</td>
                    </tr>
                )
            }
            </tbody>
        </table>
    } // end render()
} // end class PhoneTable
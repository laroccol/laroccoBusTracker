// normally, this would be in a separate file (jsxCourselist.js or similar)
class Courselist extends React.Component {
  render() {
    return React.createElement("ul", {
      className: "list-group"
    }, // Javascript in the middle of JSX needs to be delimited with {}
    // NOTE: this.props.items exists because in the statement
    //   ReactDOM.render(<Courselist items={fallTrack.courses} />, document.getElementById("courselist"));
    // the 'items' (an arbitrary identifier) is assigned to fallTrack.courses,
    // and then passed to the Courselist constructor, where it is used to
    // augment the Courselist object's 'props' attribute.
    this.props.items.map((course, index) => React.createElement("li", {
      key: index,
      className: 'list-group-item ' + this.props.cssColor
    }, course.id + ' : ' + course.desc)));
  } // end render()


} // normally, this would be in a separate file (jsxApproach.js or similar)


class jsxApproach {
  constructor() {}

  static start() {
    $().ready(() => jsxApproach.onLoad());
  } // onLoad handling is usually used to perform initialization


  static onLoad() {
    // simulated response from Ajax call:
    let fallTrack = {
      curriculum: 'se',
      year: 'sophomore',
      term: 'fall',
      courses: [{
        id: 'se2030',
        desc: 'tools and practices'
      }, {
        id: 'cs2911',
        desc: 'network protocols'
      }, {
        id: 'ph2030',
        desc: 'modern physics'
      }, {
        id: 'ma2310',
        desc: 'discrete math'
      }]
    }; // simulated response from Ajax call:

    let winterTrack = {
      curriculum: 'se',
      year: 'sophomore',
      term: 'winter',
      courses: [{
        id: 'se2840',
        desc: 'web app dev'
      }, {
        id: 'cs2711',
        desc: 'computer org'
      }, {
        id: 'se2811',
        desc: 'software component design'
      }, {
        id: 'ch200',
        desc: 'general chemistry'
      }]
    }; // When the button is pressed, display the response

    $('#button').click(() => {
      //TODO (Homework): turn these three lines into a React component
      $('#program').html(fallTrack.curriculum);
      $('#year').html(fallTrack.year);
      $('#quarter').html(fallTrack.term); // NOTE: We are passing 'fallTrack.courses' to Courselist
      //   via the 'argument' items (an arbitrary identifier)

      ReactDOM.render(React.createElement(Courselist, {
        items: fallTrack.courses,
        cssColor: 'list-group-item-danger'
      }), document.getElementById("courselist"));
      ReactDOM.render(React.createElement(Courselist, {
        items: winterTrack.courses,
        cssColor: 'list-group-item-info'
      }), document.getElementById("courselist2"));
    }); // end click()
  } // end onLoad


} // end reactApproach


jsxApproach.start();

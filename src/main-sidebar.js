const {CONTENT_TO_ADDON_EVENT} = require("./constants");
const React = require("react");
const ReactDOM = require("react-dom");

const FormGroup = React.createClass({
  render() {
    const hasValue = this.props.value !== null && typeof this.props.value !== "undefined";
    return (<div className={"form-group" + (hasValue ? "" : " empty")}>
      <label>{this.props.label}</label>
      {this.props.image && this.props.value && <img width={this.props.image} src={this.props.value} />}
      {hasValue ? this.props.value : "(Not found)"}
    </div>);
  }
});

const Main = React.createClass({
  getInitialState() {
    return {
      metadata: {}
    };
  },
  componentDidMount() {
    const receive = event => {
      console.log("panel received event");
      this.setState({metadata: {}});
      this.setState({metadata: event.data});
    };
    window.addEventListener("message", function(event) {
      console.log("received port event");
      window.port = event.ports[0];
      window.port.onmessage = receive;
    });
  },
  render() {
    const {metadata} = this.state;
    return (<div className="container">
      <div className="column">
        <FormGroup label="URL" value={metadata.url} />
        <FormGroup label="Title" value={metadata.title} />
        <FormGroup label="Description" value={metadata.description} />
        <FormGroup label="Type" value={metadata.type} />
      </div>
      <div className="column">
        <FormGroup label="Favicon" value={metadata.icon_url} image={60} />
      </div>
      <div className="column">
        <FormGroup label="Image" value={metadata.image_url} image />
      </div>
    </div>);
  }
});

ReactDOM.render(<Main />, document.getElementById("content"));

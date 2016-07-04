const {CONTENT_TO_ADDON_EVENT} = require("./constants");
const React = require("react");
const ReactDOM = require("react-dom");

const FormGroup = React.createClass({
  render() {
    return (<div className="form-group">
        {this.props.children}
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
    return (<div>
      <FormGroup>
        <label>URL</label>
        {metadata.url}
      </FormGroup>
      <FormGroup>
        <label>Title</label>
        {metadata.title}
      </FormGroup>
      <FormGroup>
        <label>Type</label>
        {metadata.type}
      </FormGroup>
      <FormGroup>
        <label>Description</label>
        {metadata.description}
      </FormGroup>
      <FormGroup>
        <label>Favicon</label>
        <em>{metadata.icon_url}</em>
        <img src={metadata.icon_url || ""} />
      </FormGroup>
      <FormGroup>
        <label>Image</label>
        <em>{metadata.image_url}</em>
        <img src={metadata.image_url || ""} />
      </FormGroup>
    </div>);
  }
});

ReactDOM.render(<Main />, document.getElementById("content"));

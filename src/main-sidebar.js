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
    addon.port.on(CONTENT_TO_ADDON_EVENT, data => {
      this.setState({metadata: data});
    });
  },
  render() {
    const {metadata} = this.state;
    return (<div>
      <h2>{metadata.url}</h2>
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
        <img src={metadata.icon_url} />
      </FormGroup>
      <FormGroup>
        <label>Image</label>
        <em>{metadata.image_url}</em>
        <img src={metadata.image_url} />
      </FormGroup>
    </div>);
  }
});

ReactDOM.render(<Main />, document.getElementById("content"));

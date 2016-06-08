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
      <FormGroup>
        <label>Title</label>
        {metadata.title}
      </FormGroup>
      <FormGroup>
        <label>Description</label>
        {metadata.description}
      </FormGroup>
      <FormGroup>
        <label>Images</label>
        {metadata.images && metadata.images.map(image => <img src={image} />)}
      </FormGroup>
    </div>);
  }
});

ReactDOM.render(<Main />, document.getElementById("content"));

console.log("render");

//
//
// function render(data) {
//   if (!data) return "";
//   return `
// <p><label>title</label> ${data.title}</p>
// <p><label>icon</label> <img src="${data.icon}" />
// <p><label>favicon</label> <img src="${data.favicon}" />
// <p><label>description</label> ${data.description}</p>
// <p><label>image</label> <img src="${data.image}" /></p>
// ${data.images.map(img => {
//   return `<p><img src="${img}" /></p>`
// }).join("\n")}
//   `;
// }

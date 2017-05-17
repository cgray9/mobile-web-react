import React from 'react'

class Event extends React.Component {
    render() {
        return (<li onClick={this.props.onClick}>{this.props.text}</li>);
    }
};

export default Event;

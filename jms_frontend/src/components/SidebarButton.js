import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SidebarButton extends Component {
	constructor(props) {
		super(props)
		this.state = props;
	}

	render() {
		let title = this.state.title;
		let iconClass = "fa-" + this.state.icon;
		let link = this.state.link;
		return 	<li className="nav-item" role="presentation">
					<Link className="nav-link " to={ link }>
						<i className={"fas", iconClass}></i>
						<span>{ title }</span>
					</Link>
				</li>;
	}
}

export default SidebarButton;
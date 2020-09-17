import React, { Component } from 'react';
import SidebarButton from './SidebarButton.js';

var buttons = [
	{title: 'The Journal', minAuth: 0, link: 'index', icon: 'tachometer-alt'},
	{title: 'Members', minAuth: 3, link: 'members', icon: 'user'},
	{title: 'Articles', minAuth: 1, link: 'articles', icon: 'file-text'},
	{title: 'Department Overview', minAuth: 2, link: 'dept_info', icon: 'sitemap'},
	{title: 'Final Reviews', minAuth: 3, link: 'finalReviewArticles', icon: 'flag-checkered'},
	{title: 'WP Team', minAuth: 1, link: 'getArticlesWPTeam', icon: 'flag-checkered'},
	{title: 'Archive', minAuth: 1, link: 'archive', icon: 'archive'},
	{title: 'Admin', minAuth: 4, link: 'admin_sys', icon: 'cogs'},
	{title: 'Social Media', minAuth: 1, link: 'socialmedia_all_posts', icon: 'paper-plane'}	
];

var sidebarColor = {backgroundColor:"rgb(214,70,74)"};

class Sidebar extends Component {
	constructor(props) {
		super(props)
		this.state = {user: {authLevel:8}}
	}

	render() {
		var sidebarButtons = buttons.filter(button => {
			return button.minAuth <= this.state.user.authLevel;
		}).map(button => {
			return 	<SidebarButton  key={button.title} link={button.link}
									icon={button.icon}
									title={button.title} />;
		});
		return 	<nav className="navbar navbar-dark align-items-start sidebar sidebar-dark accordion" style={ sidebarColor }>
				    <div className="container-fluid d-flex flex-column p-0">
				        <a className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0" href="#">
				            <div className="sidebar-brand-icon rotate-n-15"><i className="fas fa-laugh-wink"></i></div>
				            <div className="sidebar-brand-text mx-3"><span>YSJournal</span></div>
				        </a>
				        <hr className="sidebar-divider my-0" />
				        <ul className="nav navbar-nav text-light" id="accordionSidebar" >
				        	{sidebarButtons}
				        </ul>
				        <div className="text-center d-none d-md-inline">
				        	<button className="btn rounded-circle border-0" id="sidebarToggle" type="button"></button>
				        </div>
				    </div>
				</nav>;
	}
}

export default Sidebar;
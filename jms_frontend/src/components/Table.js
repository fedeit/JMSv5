import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Import components
import Sidebar from './Sidebar.js';
import Footer from './Footer.js';
import Navbar from './Navbar.js';

// Import api
import { callApiFunction } from '../api/JMS_API.js'

const loginLogo = {
	backgroundImage: "url('assets/img/logo.png')"
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class Table extends Component {
	constructor(props) {
		super(props);
		this.state = {items: [], searchValue: ""}
	}

	componentDidMount() {
		this.loadData();
	}

	loadData() {
		callApiFunction(this.props.action, (list, error) => {
			if (error) return  alert(error);
			if (typeof list !== "undefined") {
				this.setState({items: list});
			}
		});
	}

	updateSearchValue(event) {
		this.setState({searchValue: event.target.value});
	}

	render() {
		let tableHeaders = new Set();
		let tableCols = this.props.headers;
		let tableItems = this.state.items
		.filter((item) => {
			console.log("Searching for " + this.state.searchValue.toLowerCase())
			return (item[tableCols[0]] + item[tableCols[1]] + item[tableCols[2]]).toLowerCase().indexOf(this.state.searchValue.toLowerCase()) !== -1
		})
		.map((row) => {
			let tds = [];
			tableCols.forEach(column => {
				if (column in row) {
					if (typeof row[column] !== "string") {
						row[column] = JSON.stringify(row[column]);
					}
					tds.push(<td className="userRowSearch"> { row[column] }</td>);
				}
			})

			if (typeof this.props.linkCols !== "undefined") {
				Object.keys(this.props.linkCols).forEach((title) => {
					tds.push(<Link className="btn btn-info" to={this.props.linkCols[title] + row["id"]}>{ title }</Link>);
				})
			}

			if (typeof this.props.triggerCols !== "undefined") {
				Object.keys(this.props.triggerCols).forEach((trigger) => {
					let action = this.props.triggerCols[trigger];
					tds.push(<button className="btn btn-warning" onClick={ (e) => {
						if (window.confirm("Are you sure you want to delete this user?")) {
							callApiFunction(action, (list, error) => {
								if (error) return  alert(error);
								window.alert("User deleted!");
								this.loadData();
							}, { id: row.id })
						}
					}}>{ trigger }</button>);
				})
			}
			return <tr>{ tds }</tr>;
		})
		tableCols.forEach( item => tableHeaders.add(<th>{ capitalizeFirstLetter(item) }</th>) )
		if (typeof this.props.linkCols !== "undefined") {
			Object.keys(this.props.linkCols).forEach( item => tableHeaders.add(<th>{ capitalizeFirstLetter(item) }</th>) )
		}
		if (typeof this.props.triggerCols !== "undefined") {
			Object.keys(this.props.triggerCols).forEach( item => tableHeaders.add(<th>{ capitalizeFirstLetter(item) }</th>) )
		}

		return	<div id="wrapper">
			        <Sidebar />
			        <div className="d-flex flex-column" id="content-wrapper">
			            <div id="content">
			                <Navbar />
			            <div className="container-fluid">
			                <h3 className="text-dark mb-4"> { this.props.title } </h3>
			                <div className="card shadow mb-4"></div>
			                <div className="card shadow">
			                    <div className="card-header py-3">
			                        <p className="text-primary m-0 font-weight-bold">{ this.props.tableName } - {tableItems.length} {this.props.title.toLowerCase()}</p>
			                    </div>
			                    <div className="card-body">
			                        <div className="row">
			                            <div className="col-md-6">
			                                <div className="text-md-right dataTables_filter" id="dataTable_filter">
			                                    <input type="search" className="form-control form-control-sm" aria-controls="dataTable" placeholder="Search" onChange={this.updateSearchValue.bind(this)} value={ this.state.searchValue } />
			                                </div>
			                            </div>
			                        </div>
			                        <div className="table-responsive table mt-2" id="dataTable" role="grid" aria-describedby="dataTable_info">
			                            <table className="table dataTable my-0" id="dataTable">
			                                <thead>
			                                	<tr>{ tableHeaders }</tr>
			                                </thead>
			                                <tbody>
			                                    { tableItems }
			                                </tbody>
			                            </table>
			                        </div>
			                    </div>
			                </div>
			            </div>
			        </div>
			        <Footer />
			    </div>
			    <a className="border rounded d-inline scroll-to-top" href="#page-top">
			        <i className="fas fa-angle-up"></i>
			    </a>
			</div>;
	}
}

export default Table;
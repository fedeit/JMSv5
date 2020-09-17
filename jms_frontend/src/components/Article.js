import React, { Component } from 'react';
import queryString from 'query-string';
import Sidebar from './Sidebar.js';
import Footer from './Footer.js';
import Navbar from './Navbar.js';

import { callApiFunction } from '../api/JMS_API.js'

let height30 = {
    height: "30px"
}

class Article extends Component {
    constructor(props) {
        super(props);
        this.state = { user: "federico.galbiati@icloud.com", staff: [], article: {notificationsSignedUp: [], editors: []}, id: queryString.parse(this.props.location.search).id }
    }

    componentDidMount() {
        callApiFunction('getAutocomplete', (staff, error) => {
            if (error) return  alert(error);
            if (typeof staff !== "undefined") {
                this.setState({staff: staff});
            } else {
                this.setState({staff: []});
            }
        })

        this.loadArticle();
    }

    loadArticle() {
        callApiFunction('getArticle', (article, error) => {
            if (error) return  alert(error);
            if (typeof article !== "undefined") {
                this.setState({article: article.data});
            } else {
                this.setState({article: { notificationsSignedUp: [] }});
            }
        }, {id: this.state.id})
    }

    signupUserForNotifications(event) {
        callApiFunction('signupForNotifications', (_, error) => {
            this.loadArticle();
            if (error) return alert(error);
            alert('Updated successfully!');
        }, { id: this.state.id, user: this.state.user, isSignup: event.target.checked})
    }

    saveArticle(event) {
        let params = { id: this.state.id, status: this.state.article.status };
        callApiFunction('saveArticle', (_, error) => {
            this.loadArticle();
            if (error) return alert(error);
            alert('Updated successfully!');
        }, params)
    }

    saveEditors(event) {
        let newEditor = "";
        let params = { id: this.state.id, editor: newEditor };
        callApiFunction('assignEditor', (_, error) => {
            this.loadArticle();
            if (error) return alert(error);
            alert('Updated successfully!');
        }, params)
    }

    render() {
        let article = this.state.article;
        if (typeof article.notificationsSignedUp === "undefined") {
            article.notificationsSignedUp = []
        }
        let editors = [];
        if (typeof article.editors !== "undefined") {
            editors = article.editors.map((editor) => {
                return (<tr><td>{ editor.type }</td><td>{editor.email}</td><td>{editor.timestamp}</td></tr>)
            })
        }

        return    <div id="wrapper">
                    <Sidebar />
                    <div className="d-flex flex-column" id="content-wrapper">
                        <div id="content">
                        <Navbar />
                        <div className="container-fluid">

                            <h3 className="text-dark mb-4">{ article.title }</h3>
                            <div className="card shadow mb-5">
                                <div className="card-header py-3">
                                    <p className="text-{article.color} m-0 font-weight-bold">Article Timeline</p>
                                </div>
                                <div className="card-body" style={{padding: "12px"}}>
                                    <div className="card shadow border-left-{article.color} py-2" style={{padding: "0px"}}>
                                        <div className="card-body">
                                            <div className="row align-items-center no-gutters">
                                                <div className="col mr-2">
                                                    <div className="text-uppercase text-{article.color} font-weight-bold text-xs mb-1"><span className="text-{article.color}">article timeline</span></div>
                                                    <div className="row no-gutters align-items-center">
                                                        <div className="col-auto">
                                                            <div className="text-dark font-weight-bold h5 mb-0 mr-3"><span>50%</span></div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="progress progress-sm">
                                                                <div className="progress-bar bg-{article.color}" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style={{width:"50%"}}><span className="sr-only">50%</span></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-auto"><i className="fas fa-clipboard-list fa-2x text-gray-300"></i></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6" style={{padding: "12px 0px 0px 12px"}}>
                                            <div className="card text-{article.color} border-{article.color} shadow border-left-{article.color} py-2">
                                                <div className="card-body" style={{padding:"0px 20px 0px 20px"}}>
                                                    <div className="row align-items-center no-gutters">
                                                        <div className="col mr-2">
                                                            <div className="text-uppercase text-{article.color} font-weight-bold text-xs mb-1"><span className="text-{article.color}" style={{color:"rgb(204,54,63)"}}>{article.status}</span></div>
                                                            <div className="row no-gutters align-items-center">
                                                                <div className="col-auto">
                                                                    <div className="text-dark font-weight-bold h5 mb-0 mr-3"><span className="text-{article.color}">20%</span></div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="progress progress-sm">
                                                                        <div className="progress-bar bg-{article.color}" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style={{width: "20%"}}><span className="sr-only">20%</span></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-auto"><i className="fas fa-clipboard-list fa-2x text-gray-300"></i></div>
                                                    </div><small className="form-text text-muted">Expected by: yesterday</small></div>
                                            </div>
                                        </div>
                                        <div className="col" style={{padding: "12px 12px 12px 12px"}}>
                                            <div className="card shadow border-left-primary py-2">
                                                <div className="card-body" style={{padding: "0px 20px 0px 20px"}}>
                                                    <div className="row align-items-center no-gutters">
                                                        <div className="col mr-2">
                                                            <div className="text-uppercase text-primary font-weight-bold text-xs mb-1"><span>Expected publication</span></div>
                                                            <div className="text-dark font-weight-bold h5 mb-0"><span>22 February 2020</span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="custom-control custom-switch">
                                                <input checked={ article.notificationsSignedUp.includes(this.state.user) } onChange={ this.signupUserForNotifications.bind(this) } className="custom-control-input" type="checkbox" id="notifications" />
                                            <label className="custom-control-label" for="notifications"><strong>Notify me about changes</strong></label></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-lg-4">
                                    <div className="card mb-3">
                                        <div className="card-body text-center shadow"><i className="fa fa-file-word-o" style={{height: "110px"}, {width: "110px"}, {fontSize: "110px"}, {margin: "20px"}}></i>
                                            <div className="mb-3"><a href={"https://drive.google.com/drive/u/1/folders/" + article.folder}><button className="btn btn-primary btn-sm" type="button">Go to Drive</button></a></div>
                                            <br /><div className="mb-3"><a href={"https://myrubric.ysjournal.com/get_rubric?id=" + article.id}><button className="btn btn-primary btn-sm" type="button">Go to BETA Rubric</button></a></div>

                                        </div>
                                    </div>
                                    <div className="card shadow mb-4">
                                        <div className="card-header py-3">
                                            <h6 className="text-primary font-weight-bold m-0">Comments</h6>
                                        </div>
                                        <div className="card-body">
                                            <form action={"/saveArticle?id=" + article.id} method='POST'>
                                                <textarea style={{width: "100%"}, {height: "150px"},{margin: "0px 0px 15px 0px"}} name="notes">{ article.notes }</textarea>
                                                <button className="btn btn-success btn-icon-split" style={{height: "33px"}}>
                                                    <span className="text-white-50 icon"><i className="fas fa-check"></i></span>
                                                    <span className="text-white text">Save Comments</span>
                                                </button>                                    
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-8">
                                    <div className="row mb-3 d-none">
                                        <div className="col">
                                            <div className="card text-white bg-primary shadow">
                                                <div className="card-body">
                                                    <div className="row mb-2">
                                                        <div className="col">
                                                            <p className="m-0">Performance</p>
                                                            <p className="m-0"><strong>65.2%</strong></p>
                                                        </div>
                                                        <div className="col-auto"><i className="fas fa-rocket fa-2x"></i></div>
                                                    </div>
                                                    <p className="text-white-50 small m-0"><i className="fas fa-arrow-up"></i>&nbsp;5% since last month</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="card text-white bg-success shadow">
                                                <div className="card-body">
                                                    <div className="row mb-2">
                                                        <div className="col">
                                                            <p className="m-0">Performance</p>
                                                            <p className="m-0"><strong>65.2%</strong></p>
                                                        </div>
                                                        <div className="col-auto"><i className="fas fa-rocket fa-2x"></i></div>
                                                    </div>
                                                    <p className="text-white-50 small m-0"><i className="fas fa-arrow-up"></i>&nbsp;5% since last month</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="card shadow mb-3">
                                                <div className="card-header py-3">
                                                    <p className="text-primary m-0 font-weight-bold">Article info</p>
                                                </div>
                                                <div className="card-body" style={{padding: "5px 20px 0px 20px;"}}>
                                                    <div className="form-row">
                                                        <div className="col">
                                                            <div className="form-group"><label for="title"><strong>Title</strong></label><input className="form-control" type="text" value={ article.title } name="title" style={{height: "30px"}} />
                                                            </div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="form-group"><label for="author"><strong>Email Address</strong></label><input className="form-control" type="email" value={article.author} name="author" style={{height: "30px"}} readOnly /></div>
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="col">
                                                            <div className="form-group"><label for="status"><strong>Status</strong><br/></label>
                                                                <select className="form-control form-control-sm custom-select custom-select-sm" style={{width: "120px"}, {margin: "0 20px 0 10px"}} name="status">
                                                                <option>{article.status}</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="form-group"><label for="subject"><strong>Subject</strong></label><input className="form-control" type="text" value={ article.subject } name="subject" style={{height: "30px"}}readOnly /></div>
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="col">
                                                            <div className="form-group"><label for="timestamp"><strong>Date Submitted</strong><br /></label><input className="form-control" type="text" value={ article.timestamp } name="timestamp" style={{height: "30px"}} readOnly /></div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="form-group"><label for="type"><strong>Submission type</strong></label><input className="form-control" type="text" value={ article.type } name="type" style={{height: "30px"}} readOnly /></div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group"><button onClick={ this.saveArticle.bind(this) } className="btn btn-primary btn-sm" type="submit" style={{height: "26px"}, {padding: "4px"}}>Save Changes</button></div>
                                                </div>
                                            </div>
                                            <div className="card shadow mb-3">
                                                <div className="card-header py-3">
                                                    <p className="text-primary m-0 font-weight-bold">Other info</p>
                                                </div>
                                                <div className="card-body">
                                                    <div className="form-row">
                                                        <div className="col">
                                                            <div className="form-group"><label for="bio"><strong>Author Biography</strong></label><textarea readOnly className="form-control" type="text" name="bio" style={height30}>{ article.bio }</textarea></div>
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="col">
                                                            <div className="form-group"><label for="summary"><strong>Summary</strong></label><textarea readOnly className="form-control" type="text" name="summary" style={height30}>{ article.summary }</textarea></div>
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="col">
                                                            <div className="form-group"><label for="firstname"><strong>First Name</strong></label><input className="form-control" type="text" value={article.firstname} name="firstname" style={height30} readOnly /></div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="form-group"><label for="lastname"><strong>Last Name</strong></label><input className="form-control" type="text" value={article.lastname} name="lastname" style={height30} readOnly /></div>
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="col">
                                                            <div className="form-group"><label for="bdate"><strong>Birth Date</strong></label><input className="form-control" type="text" value={article.bdate} name="bdate" style={height30} readOnly /></div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="form-group"><label for="competition"><strong>Competition</strong></label><input className="form-control" type="text" value={article.competition} name="competition" style={height30} readOnly /></div>
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="col">
                                                            <div className="form-group"><label for="country"><strong>Country</strong></label><input className="form-control" type="text" value={article.country} name="country" style={height30} readOnly /></div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="form-group"><label for="org"><strong>Organization</strong></label><input className="form-control" type="text" value={article.org} name="org" style={height30} readOnly /></div>
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="col">
                                                            <div className="form-group"><label for="orgaddress"><strong>Organization Address</strong></label><input className="form-control" type="text" value={article.orgaddress} name="orgaddress" style={height30} readOnly /></div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="form-group"><label for="teacheremail"><strong>Teacher</strong></label><input className="form-control" type="text" value={article.teacheremail} name="teacheremail" style={height30} readOnly /></div>
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="col">
                                                            <div className="form-group"><label for="reference"><strong>Reference</strong></label><input className="form-control" type="text" value={article.reference} name="reference" style={height30} readOnly /></div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="form-group"><label for="socialmedia-consent"><strong>Social Media Consent</strong></label><input className="form-control" type="text" value={article['socialmedia-consent']} name="socialmedia-consent" style={height30} readOnly /></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card shadow">
                                                <div className="card-header py-3">
                                                    <p className="text-primary m-0 font-weight-bold">Editors</p>
                                                </div>
                                                <div className="card-body">
                                                    <div className="table-responsive">
                                                        <table className="table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Editor Type</th>
                                                                    <th>Email</th>
                                                                    <th>Date Assigned</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                            { editors }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <nav className="navbar navbar-light navbar-expand bg-white shadow mb-4 topbar static-top">
                                                        <div className="container-fluid">
                                                                <div className="input-group">
                                                                    <div id="dropdown">
                                                                        <select className="custom-select" name="type">
                                                                            <option value="editor 1" selected>Editor 1</option>
                                                                            <option value="editor 2">Editor 2</option>
                                                                            <option value="technical editor 1">Technical Review Editor 1</option>
                                                                            <option value="technical editor 2">Technical Review Editor 2</option>
                                                                            <option value="final">Final</option>
                                                                            <option value="WP Admin">WP Admin</option>
                                                                            <option value="WP Reviewer">WP Reviewer</option>
                                                                          </select>
                                                                    </div>
                                                                    <input onChange={this._onChange} className="bg-light form-control border-0 small" type="text" placeholder="Search for user by email" name="editor" list="staff" />
                                                                        <datalist id="staff">
                                                                            { this.state.staff.map(email => <option key={email} value={email} />) }
                                                                        </datalist>
                                                                    <div className="input-group-append">
                                                                        <button className="btn btn-primary py-0" onClick={ this.saveEditors.bind(this) }>
                                                                            <i className="fas fa-check"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                        </div>
                                                    </nav>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>;
    }
}

export default Article;
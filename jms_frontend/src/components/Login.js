import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { callApiFunction } from '../api/JMS_API.js'

const loginLogo = {
	backgroundImage: "url('assets/img/logo.png')"
}

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = { error: undefined, message: undefined, email: "", password: "" };
		if (typeof props.error !== 'undefined') {
			this.state.error = <p style={ {color: "red"} }>{ props.error }</p>;
		}
		if (typeof props.message !== 'undefined') {
			this.state.message = <p style={ {color: "green"} }>{ props.message }</p>;
		}
	}

	handleInputChange(event) {
		const { value, name } = event.target;
		this.setState({
			[name]: value
		});
	}

	login(event) {
	  event.preventDefault();
	  callApiFunction('login', (res, err) => {
	  	if (err) {
		    console.error(err);
	    	window.alert('Error logging in please try again');
	    	return;
	  	}
	    if (res.status === 200) {
			this.props.history.push('/');
	    } else {
	    	this.setState({error: res.error});
	    	console.log(res);
	    }
	  }, {
	    body: this.state,
	    headers: {
	      ContentType: 'application/json'
	    }
	  });
	}

	render() {
		return  <div className="container">
			        <div className="row justify-content-center">
			            <div className="col-md-9 col-lg-12 col-xl-10">
			                <div className="card shadow-lg o-hidden border-0 my-5">
			                    <div className="card-body p-0">
			                        <div className="row">
			                            <div className="col-lg-6 d-none d-lg-flex">
			                                <div className="flex-grow-1 bg-login-image" style={ loginLogo }></div>
			                            </div>
			                            <div className="col-lg-6">
			                                <div className="p-5">
			                                    <div className="text-center">
			                                        <h4 className="text-dark mb-4">YSJ - Welcome to the JMS!</h4>
			                                    </div>
			                                    { this.state.message }
			                                    { this.state.error }
			                                    <form onSubmit={this.login.bind(this)}>
			                                        <div className="form-group">
			                                        	<input className="form-control form-control-user" type="email" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Username" name="email" value={this.state.email} onChange={this.handleInputChange.bind(this)} />
		                                        	</div>
			                                        <div className="form-group">
			                                        	<input className="form-control form-control-user" type="password" id="exampleInputPassword" placeholder="Password" name="password" value={this.state.password} onChange={this.handleInputChange.bind(this)}/>
		                                        	</div>
			                                        <button className="btn btn-primary btn-block text-white btn-user" type="submit">Login</button>
			                                    </form>
			                                    <Link to="resetPassword">Reset your password</Link>
			                                    <div className="text-center"></div>
				                            </div>
				                        </div>
				                    </div>
				                </div>
				            </div>
				        </div>
				    </div>
			    </div>;
	}
}

export default Login;
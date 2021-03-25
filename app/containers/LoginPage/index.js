import React from 'react';
import { push } from 'react-router-redux';

// Components
import Confirm from 'components/Confirm';
import { APILoading } from 'components/LoadingIndicator';

// Redux
import { connect } from 'react-redux';
import AuthRedux from 'reducers/AuthRedux';

import _ from 'lodash';
import './styles';

class LoginPage extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			params: {
				username: '',
				password: '',
			},
			dialog: {
				title: '', message: '', oneButton: true, onOK: null, onCancel: null,
			},
		};

		this.doLogin = this.doLogin.bind(this);
		this._handleKeyDown = this._handleKeyDown.bind(this);
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.auth.requestLoginFetching && !this.props.auth.requestLoginFetching) {
			if (this.props.auth.requestLoginError) {
				this.setState({
					dialog: {
						title: 'Thông báo',
						message: '<code>Tài khoản</code> hoặc </code>Mật khẩu</code> không đúng, xin vui lòng thử lại!',
						oneButton: true,
					},
				});
				this.alertModalRef.openModal();
			}
		}
	}

	_handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			this.doLogin();
		}
	}

	validate() {
		const { username, password } = this.state.params;
		if (!_.trim(username)) {
			this.setState({
				dialog: {
					title: 'Thông báo',
					message: 'Vui lòng nhập <code>Tài khoản</code>',
					oneButton: true,
				},
			});
			this.alertModalRef.openModal();
			return false;
		}

		if (!_.trim(password)) {
			this.setState({
				dialog: {
					title: 'Thông báo',
					message: 'Vui lòng nhập <code>Mật khẩu/code>',
					oneButton: true,
				},
			});
			this.alertModalRef.openModal();
			return false;
		}

		return true;
	}

	doLogin() {
		if (this.validate()) {
			this.props.requestLogin(this.state.params);
		}
	}

	render() {
		return (
			<div className="login-page">
				<div className="login-box">
					<div className="login-logo">
						<a
							href="#" onClick={(e) => {
								e.preventDefault();
							}}
						><b>WBS</b></a>
					</div>
					<div className="card">
						<div className="card-body login-card-body">
							<p className="login-box-msg">Đăng nhập để bắt đầu phiên làm việc</p>
							<div className="input-group mb-3">
								<input
									type="text" className="form-control" placeholder="Tài khoản"
									value={this.state.params.username}
									onChange={(event) => this.setState({
										params: {
											...this.state.params,
											username: event.target.value,
										},
									})}
									onKeyDown={this._handleKeyDown}
								/>
								<div className="input-group-append">
									<div className="input-group-text">
										<span className="fas fa-user"></span>
									</div>
								</div>
							</div>
							<div className="input-group mb-3">
								<input
									type="password" className="form-control" placeholder="Mật khẩu"
									value={this.state.params.password}
									onChange={(event) => this.setState({
										params: {
											...this.state.params,
											password: event.target.value,
										},
									})}
									onKeyDown={this._handleKeyDown}
								/>
								<div className="input-group-append">
									<div className="input-group-text">
										<span className="fas fa-lock"></span>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-7">
									<div className="icheck-primary">
										<input type="checkbox" id="remember" />
										<label htmlFor="remember">Ghi nhớ</label>
									</div>
								</div>
								<div className="col-5">
									<button
										type="submit"
										className="btn btn-primary btn-block btn-flat"
										disabled={this.props.auth.requestLoginFetching}
										onClick={this.doLogin}
									>
										{
											this.props.auth.requestLoginFetching
											&& <APILoading className="mr-1" />
										}Đăng nhập
									</button>
								</div>
							</div>
						</div>
					</div>

					<Confirm
						ref={(ref) => this.alertModalRef = ref}
						oneButton={this.state.dialog.oneButton}
						title={this.state.dialog.title}
						message={this.state.dialog.message}
						onOK={() => {
							_.invoke(this.state, 'dialog.onOK');
						}}
						onCancel={() => {
							_.invoke(this.state, 'dialog.onCancel');
						}}
					/>
				</div>
			</div>
		);
	}
}


const mapStateToProps = (state) => ({
	auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
	route: (url) => dispatch(push(url)),
	requestLogin: (params) => dispatch(AuthRedux.requestLogin(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);

import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';


import LoginPage from 'containers/LoginPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import WBSPage from 'containers/WBSPage/Loadable';

import Modal from 'react-modal';

import ReactGA from 'react-ga';
import AppConfig from 'config/AppConfig';

// DatePicker set default locale to vietnameses
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import vi from 'date-fns/locale/vi';

import _ from 'lodash';

// Redux
import { connect } from 'react-redux';

import { push } from 'react-router-redux';

import { formatDate } from 'utils/mixins';

import './styles';
registerLocale('vi', vi);
setDefaultLocale('vi');

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}


	componentDidUpdate(prevProps) {

	}


	render() {
		const { auth } = this.props;

		// LoggedIn
		const routes = (
			<section className="content">
				<Switch>
					<Route path="/" component={WBSPage} />

					{/* NotFound */}
					<Route component={NotFoundPage} status={404} />
				</Switch>
			</section>
		);

		return [
			routes
		];
	}
}


const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
	route: (url) => dispatch(push(url)),

});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
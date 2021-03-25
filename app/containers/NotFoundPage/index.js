import React from 'react';
import { Link } from 'react-router-dom';
import './styles';

export default class NotFound extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		return (
			<div id="notfound-page">
				<center>
					<h1><i className="fas fa-exclamation-triangle" style={{ color: '#a0a0a0', fontSize: '2em' }} /></h1>
					<h1>404 Not Found</h1>
					<p>Không tìm thấy nội dung phù hợp!</p>
					<Link to="/">
						<i className="fas fa-home"></i>
　Trang chủ
          </Link>
				</center>
			</div>
		);
	}
}

import React from 'react';
import { push } from 'react-router-redux';
import { Link } from 'react-router-dom';

import _ from 'lodash';

// Redux
import { connect } from 'react-redux';

import './styles';

class Footer extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section id="footer">
        <Link to="/" title="Tra cứu số điện thoại">Trang chủ</Link>
&nbsp;&nbsp;|&nbsp;&nbsp;
        <Link to="/info" title="Giới thiệu VNNUMBER.COM">Giới thiệu</Link>
&nbsp;&nbsp;|&nbsp;&nbsp;
        <Link to="/privacy" title="Điều khoản sử dụng VNNUMBER.COM">Điều khoản sử dụng</Link>
&nbsp;&nbsp;|&nbsp;&nbsp;
        <Link to="mailto:master@vnnumber.com" title="Liên hệ VNNUMBER.COM">Liên hệ</Link>
&nbsp;&nbsp;|&nbsp;&nbsp;
        <span className="text-muted">Copyright © 2018 VNNUMBER.COM All Rights Reserved.</span>
      </section>
    );
  }
}


const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  route: (url) => dispatch(push(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Footer);

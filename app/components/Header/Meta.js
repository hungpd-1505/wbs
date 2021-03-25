import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

class Meta extends PureComponent {
    static propTypes = {
      title: PropTypes.string,
      description: PropTypes.string,

      mobile: PropTypes.bool,
    }

    static defaultProps = {
      title: null,
      description: null,

      mobile: false,
    }

    render() {
      const title = this.props.title || 'Microworks';
      const description = this.props.description || 'Microworks giúp quản lý khách hàng hiệu quả trên Zalo';
      const viewport = this.props.mobile ? 'width=device-width, initial-scale=1.0' : '';

      return (
        <Helmet>
          <meta charSet="utf-8" />
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="viewport" content={viewport} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:site_name" content="microworks.me" />
        </Helmet>
      );
    }
}

export default Meta;

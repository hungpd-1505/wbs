import React, { PureComponent } from 'react';

// Components
import Modal from 'react-modal';
import PropTypes from 'prop-types';

// Library
import _ from 'lodash';

class Confirm extends PureComponent {
    static propTypes = {
      title: PropTypes.string,
      cancelButton: PropTypes.string,
      okButton: PropTypes.string,

      message: PropTypes.string,

      onCancel: PropTypes.func,
      onOK: PropTypes.func,

      oneButton: PropTypes.bool,
    }

    static defaultProps = {
      title: 'Xác nhận',
      cancelButton: 'Hủy',
      okButton: 'Đồng ý',

      message: 'Bạn có muốn ...?',

      onCancel: null,
      onOK: null,

      oneButton: false,
    }


    constructor(props) {
      super(props);
      this.state = {
        isShowModal: false,
      };

      this.closeModal = this.closeModal.bind(this);
      this.onAction = this.onAction.bind(this);
    }

    closeModal() {
      this.setState({
        isShowModal: false,
      });
      _.invoke(this.props, 'onCancel');
    }

    openModal() {
      this.setState({
        isShowModal: true,
      });
    }

    onAction() {
      this.setState({
        isShowModal: false,
      });
      _.invoke(this.props, 'onOK');
    }

    render() {
      const _class = ['modal-dialog'];
      _class.push(this.props.className || '');

      return (
        <Modal
          className={_class.join(' ')}
          shouldCloseOnOverlayClick={false}
          isOpen={this.state.isShowModal}
          onRequestClose={this.closeModal}
        >
          <div className="modal-header">
            {_.trim(this.props.title)}
          </div>
          <div className="modal-body" dangerouslySetInnerHTML={{ __html: _.trim(this.props.message) }}></div>
          {
            this.props.oneButton
              ? (
                <div className="modal-footer text-right">
                  <button type="button" className="btn btn-sm btn-default btn-sm" onClick={this.onAction}>{this.props.cancelButton}</button>
                </div>
              ) : (
                <div className="modal-footer justify-content-between">
                  <button type="button" className="btn btn-sm btn-default btn-sm" onClick={this.closeModal}>{this.props.cancelButton}</button>
                  <button type="button" className="btn btn-sm btn-primary btn-sm" onClick={this.onAction}>{this.props.okButton}</button>
                </div>
              )
          }

        </Modal>
      );
    }
}

export default Confirm;

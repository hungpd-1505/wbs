import React from 'react';
import { push } from 'react-router-redux';

import _ from 'lodash';

// Components
import Confirm from 'components/Confirm';
import Modal from 'react-modal';

// Redux
import { connect } from 'react-redux';

import { formatDate, formatTime } from 'utils/mixins';

import './styles';

class Header extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      announces: [],
      item: null,
      isShowAnnounceDialog: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.getAllAnnouncesFetching && !this.props.getAllAnnouncesFetching) {
      if (this.props.getAllAnnouncesSuccess) {
        this.setState({
          announces: this.props.announces,
        });
      }
      if (this.props.getAllAnnouncesError) {
        //
      }
    }
  }

  renderAnnounceDialog() {
    const { item } = this.state;
    if (item && this.state.announces && _.size(this.state.announces) > 0) {
      return (
        <Modal
          className="modal-lg"
          isOpen={this.state.isShowAnnounceDialog}
          shouldCloseOnOverlayClick={false}
          onRequestClose={() => {
            this.setState({
              isShowAnnounceDialog: false,
            });
          }}
        >
          <div className="modal-body">
            <div className="font-weight-bold text-uppercase border-bottom pb-2">
              {item.title}
              {' '}
              <small className="ml-2 text-muted">{formatDate(item.created_at)}</small>
            </div>
            <div className="pt-2" dangerouslySetInnerHTML={{ __html: item.content }} style={{ whiteSpace: 'pre-wrap' }} />
          </div>
          <div className="modal-footer align-items-center">
            <div className="form-check form-check-inline text-sm mr-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="mark_as_read"
                checked={this.state.noshowAgain}
                onChange={(e) => {
                  this.setState({
                    noshowAgain: e.target.checked,
                  });
                }}
              />
              <label className="form-check-label" htmlFor="mark_as_read">Không hiển thị lại thông báo này</label>
            </div>
            <button
              type="button"
              className="btn btn-default btn-sm"
              aria-label="Close"
              onClick={() => {
                if (this.state.noshowAgain) {
                  this.props.announceMarkAsRead([item.id]);
                }
                this.setState({
                  isShowAnnounceDialog: false,
                  noshowAgain: false, // reset input checked status
                });
              }}
            >
              Close
            </button>
          </div>
        </Modal>
      );
    }
    return null;
  }

  render() {
    // return (
    // 	<nav className="main-header navbar navbar-expand navbar-white navbar-light text-sm">

    // 	</nav>
    // )
    return null;
  }
}


const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  route: (url) => dispatch(push(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);

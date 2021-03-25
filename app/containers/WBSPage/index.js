import React from 'react';
import { push } from 'react-router-redux';

// Components
import Confirm from 'components/Confirm';
import { APILoading } from 'components/LoadingIndicator';
import Meta from 'components/Header/Meta';

// Redux
import { connect } from 'react-redux';

import _ from 'lodash';
import './styles';
import moment from 'moment';

class WBSPage extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			fromDate: '2021-03-20',
			toDate: '2021-05-15',
			totalDev: 18,
			totalQa: 5.5,
			costItem: [
				{
					title: 'Implement',
					key: 'implement',
					team: 'dev',
				},
				{
					title: 'Create TCs',
					key: 'create_test_case',
					team: 'qa',
				},
				{
					title: 'Execute test',
					key: 'execute_test',
					team: 'qa',
				},
				{
					title: 'Fix Bug',
					key: 'fix_bug',
					team: 'dev',
				},
			],
			wbs_data: [
				{
					id: 11855,
					index: 1,
					subject: 'Gửi sendbatch nhưng user không nhận được',
					mh: {
						implement: 329,
						create_test_case: 83,
						execute_test: 31,
						fix_bug: 16,
					},
				},
				{
					id: 11859,
					index: 2,
					subject: 'QR Code không kích hoạt khi booking từ staff account',
					mh: {
						implement: 26,
						create_test_case: 13,
						execute_test: 31,
						fix_bug: 16,
					},
				},
				{
					id: 11862,
					index: 0,
					subject: '[mynavi] [CR] アカウントに現状存在しないステータス（休止中）/ Thêm status（休止中）(pending)',
					mh: {
						implement: 33,
						create_test_case: 13,
						execute_test: 31,
						fix_bug: 16,
					},
				},
				{
					id: 11872,
					index: 3,
					subject: '[Bug] Sau khi cancel event thì có lỗi khi đặt lại event tại carousel',
					mh: {
						implement: 105,
						create_test_case: 13,
						execute_test: 31,
						fix_bug: 16,
					},
				},
			],
		};
	}

	isHoliday(date) {
		const ddd = date.format('dd');
		const ddmm = date.format('DD/MM');

		const isWeekend = (ddd == 'Sa' || ddd == 'Su');
		const isHoliday = (ddmm == '30/04' || ddmm == '01/05');

		return isWeekend || isHoliday;
	}

	isToday(date) {
		return date.format('YY-MM-DD') == moment().format('YY-MM-DD');
	}

	getWbsData() {
		// sort by index asc
		return _.sortBy(this.state.wbs_data, 'index');
	}

	getDataNorm(dateRange) {
		const wbs_data = _.cloneDeep(this.getWbsData());

		const data_norm = {};

		_.map(dateRange, (d) => {
			const dateObj = moment(d);

			let { totalDev } = this.state;
			let { totalQa } = this.state;

			if (!this.isHoliday(dateObj)) {
				const data = {};

				for (let i = 0; i < _.size(wbs_data); i++) {
					let implement = 0; let
						fix_bug = 0;
					let create_test_case = 0; let
						execute_test = 0;

					// // dev
					// implement
					if (totalDev > 0) {
						if (wbs_data[i].mh.implement >= totalDev) {
							implement = totalDev;
						} else {
							implement = wbs_data[i].mh.implement;
						}
						wbs_data[i].mh.implement -= implement;
						totalDev -= implement;
					}
					// fix_bug
					if (totalDev > 0) {
						if (wbs_data[i].mh.fix_bug >= totalDev) {
							fix_bug = totalDev;
						} else {
							fix_bug = wbs_data[i].mh.fix_bug;
						}
						wbs_data[i].mh.fix_bug -= fix_bug;
						totalDev -= fix_bug;
					}

					// // qa
					// create test case
					if (totalQa > 0 && implement > 0) {
						if (wbs_data[i].mh.create_test_case >= totalQa) {
							create_test_case = totalQa;
						} else {
							create_test_case = wbs_data[i].mh.create_test_case;
						}
						wbs_data[i].mh.create_test_case -= create_test_case;
						totalQa -= create_test_case;
					}

					// execute test
					if (totalQa > 0 && implement > 0) {
						if (wbs_data[i].mh.execute_test >= totalQa) {
							execute_test = totalQa;
						} else {
							execute_test = wbs_data[i].mh.execute_test;
						}
						wbs_data[i].mh.execute_test -= execute_test;
						totalQa -= execute_test;
					}

					data[wbs_data[i].id] = {
						mh: {
							implement,
							fix_bug,
							create_test_case,
							execute_test,
						},
					};
				}

				data_norm[d] = data;
			}
		});

		return data_norm;
	}

	render() {
		const fromDate = moment(this.state.fromDate).subtract(1, 'days');
		const toDate = moment(this.state.toDate);
		const runDate = _.clone(fromDate);

		const itemCount = moment.duration(toDate.diff(fromDate)).asDays();
		const dateRange = _.times(itemCount).map((i) => runDate.add(i = 0 ? 0 : 1, 'days').format('YYYY-MM-DD'));

		const wbs_data = this.getWbsData();

		const colHeaderWidth = [
			60, // PIC
			50, // Ver
			50, // MH
			50, // MD
			60, // Status
			60, // Team
		];

		const data_norm = this.getDataNorm(dateRange);

		return (
			<div className="wbs-page vh-100">
				<div className="row">
					<h3>WBS</h3>
				</div>
				<div className="row" style={{ height: 'calc(100% - 41px)' }}>
					{
						// HEADER
					}
					<div className="col h-100 bg-light bg-gradient" style={{ maxWidth: 480 }}>
						<div className="row wbs_row">
							<div className="col text-end">DEV</div>
						</div>
						<div className="row wbs_row">
							<div className="col text-end">QA</div>
						</div>
						<div className="row wbs_row">
							<div className="col border">Task</div>
							<div className="col border" style={{ maxWidth: colHeaderWidth[0] }}>PIC</div>
							<div className="col border" style={{ maxWidth: colHeaderWidth[1] }}>Ver</div>
							<div className="col border" style={{ maxWidth: colHeaderWidth[2] }}>MH</div>
							<div className="col border" style={{ maxWidth: colHeaderWidth[3] }}>MD</div>
							<div className="col border" style={{ maxWidth: colHeaderWidth[4] }}>Status</div>
							<div className="col border" style={{ maxWidth: colHeaderWidth[5] }}>Team</div>
						</div>
						{
							_.map(wbs_data, (ticket) => [
								<div className="row wbs_row">
									<div className="col border pe-0" title={ticket.subject}>
										<input
											type="text"
											className="text-input"
											value={ticket.subject}
										/>
									</div>
									<div className="col border" style={{ maxWidth: colHeaderWidth[5] }}>
										<a
											href="#up"
											className="btn-up"
											onClick={(e) => {
												e.preventDefault();
												const currentIndex = ticket.index;
												const newIndex = currentIndex - 1;
												if (newIndex >= 0) {
													const newData = _.map(this.state.wbs_data, (it) => {
														if (it.id == ticket.id) {
															_.set(it, 'index', newIndex);
														} else if (it.index == newIndex) {
															_.set(it, 'index', currentIndex);
														}
														return it;
													});
													this.setState({ wbs_data: newData });
												}
											}}
										>
											↑
					</a>
										<a
											href="#down"
											className="btn-down"
											onClick={(e) => {
												e.preventDefault();
												const currentIndex = ticket.index;
												const newIndex = currentIndex + 1;
												if (newIndex <= _.size(wbs_data)) {
													const newData = _.map(this.state.wbs_data, (it) => {
														if (it.id == ticket.id) {
															_.set(it, 'index', newIndex);
														} else if (it.index == newIndex) {
															_.set(it, 'index', currentIndex);
														}
														return it;
													});
													this.setState({ wbs_data: newData });
												}
											}}
										>
											↓
					</a>
									</div>
								</div>,
								_.map(this.state.costItem, (it) => {
									const cost = _.get(ticket, `mh.${it.key}`);
									return (
										<div className="row wbs_row">
											<div className="col border text-truncate">{it.title}</div>
											<div className="col border text-truncate" style={{ maxWidth: colHeaderWidth[0] }}></div>
											<div className="col border text-truncate" style={{ maxWidth: colHeaderWidth[1] }}></div>
											<div className="col border p-0" style={{ maxWidth: colHeaderWidth[2] }}>
												<input
													type="text"
													className="text-input text-center"
													value={cost}
													onChange={(e) => {
														const newData = _.map(this.state.wbs_data, (it) => {
															if (it.id == ticket.id) {
																_.set(it, `mh.${it.key}`, e.target.value);
															}
															return it;
														});
														this.setState({ wbs_data: newData });
													}}
												/>
											</div>
											<div className="col border text-truncate" style={{ maxWidth: colHeaderWidth[3] }}>{_.round(cost / 160, 2) || ''}</div>
											<div className="col border text-truncate" style={{ maxWidth: colHeaderWidth[4] }}></div>
											<div className="col border text-truncate" style={{ maxWidth: colHeaderWidth[5] }}>{_.upperCase(it.team)}</div>
										</div>
									);
								}),
							])
						}
					</div>
					{
						// DATA
					}
					<div className="col overflow-auto h-100">
						<div style={{ width: _.size(dateRange) * 28 }}>
							<div className="row wbs_row">
								{
									// DEV COST
									_.map(dateRange, (d) => {
										const dateObj = moment(d);

										const classes = ['col', 'wbs_col', 'border'];

										if (this.isToday(dateObj)) {
											classes.push('bg-warning');
										} else if (this.isHoliday(dateObj)) {
											classes.push('bg-light');
										}

										const cost = _.sumBy(_.values(_.get(data_norm, `${d}`, [])), (o) => _.toNumber(o.mh.implement) + _.toNumber(o.mh.fix_bug));
										return (
											<div className={classes.join(' ')}>{cost || ''}</div>
										);
									})
								}
							</div>
							<div className="row wbs_row">
								{
									// QA COST
									_.map(dateRange, (d) => {
										const dateObj = moment(d);

										const classes = ['col', 'wbs_col', 'border'];

										if (this.isToday(dateObj)) {
											classes.push('bg-warning');
										} else if (this.isHoliday(dateObj)) {
											classes.push('bg-light');
										}

										const cost = _.sumBy(_.values(_.get(data_norm, `${d}`, [])), (o) => _.toNumber(o.mh.create_test_case) + _.toNumber(o.mh.execute_test));
										return (
											<div className={classes.join(' ')}>{cost || ''}</div>
										);
									})
								}
							</div>
							<div className="row wbs_row">
								{
									// DATE HEADER
									_.map(dateRange, (d) => {
										const dateObj = moment(d);

										const classes = ['col', 'wbs_col', 'border'];

										if (this.isToday(dateObj)) {
											classes.push('bg-warning');
										} else if (this.isHoliday(dateObj)) {
											classes.push('bg-light');
										}

										return (
											<div className={classes.join(' ')}>{dateObj.format('DD')}</div>
										);
									})
								}
							</div>
							{
								// DATA
								_.map(wbs_data, (ticket) => _.map(_.concat([''], this.state.costItem), (it) => (
									<div className="row wbs_row">
										{
											_.map(dateRange, (d) => {
												const dateObj = moment(d);
												const classes = ['col', 'wbs_col', 'border'];
												if (this.isToday(dateObj)) {
													classes.push('bg-warning');
												} else if (this.isHoliday(dateObj)) {
													classes.push('bg-light');
												}
												const cost = _.get(data_norm, `${d}.${ticket.id}.mh.${it.key}`);
												if (cost) {
													const team = _.toLower(it.team);
													if (team == 'dev') {
														classes.push('bg-success');
													} else if (team == 'qa') {
														classes.push('bg-info');
													}
												}
												return (
													<div className={classes.join(' ')}>
														{cost || ''}
													</div>
												);
											})
										}
									</div>
								)))
							}
						</div>
					</div>
				</div>
			</div>
		);
	}
}


const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
	route: (url) => dispatch(push(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WBSPage);

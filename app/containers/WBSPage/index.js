import React from 'react'
import { push } from 'react-router-redux'

// Components
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync'

import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import Confirm from 'components/Confirm'
import { APILoading } from 'components/LoadingIndicator'
import Meta from 'components/Header/Meta'

// Redux
import { connect } from 'react-redux'
import AuthRedux from 'reducers/AuthRedux'

import _ from 'lodash'
import './styles'
import moment from 'moment'

import fileDownloader from 'utils/fileDownloader'

class WBSPage extends React.PureComponent {
	constructor(props) {
		super(props)

		this.state = {
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
			wbs_ticket_template: {
				id: 0,
				index: 0,
				subject: 'XXX',
				mh: {
					implement: {
						pic: '',
						status: '',
						value: 0
					},
					create_test_case: {
						pic: '',
						status: '',
						value: 0
					},
					execute_test: {
						pic: '',
						status: '',
						value: 0
					},
					fix_bug: {
						pic: '',
						status: '',
						value: 0
					},
				},
			},
			colHeaderWidth: [
				60, // PIC
				50, // Ver
				50, // MH
				50, // MD
				60, // Status
				60, // Team
			],

			// from storage
			sync_storage: {
				max_dev_hour_in_day: 24,
				max_qa_hour_in_day: 2400,
				fromDate: moment().format("YYYY-MM-01"),
				toDate: moment().add(1, 'months').format("YYYY-MM-DD"),
				totalDev: 18,
				totalQa: 5.5,
				wbs_data: [
					{
						id: 0,
						index: 1,
						subject: 'XXX',
						mh: {
							implement: {
								pic: '',
								status: '',
								value: 0
							},
							create_test_case: {
								pic: '',
								status: '',
								value: 0
							},
							execute_test: {
								pic: '',
								status: '',
								value: 0
							},
							fix_bug: {
								pic: '',
								status: '',
								value: 0
							},
						},
					},
				],
				members: []
			}
		}
	}

	componentDidMount() {
		const sync_storage = _.get(this.props.cache, 'SYNC_STORAGE')
		if (sync_storage) {
			this.setState({
				sync_storage
			})
		}
	}

	isHoliday(date) {
		const ddd = date.format('dd')
		const ddmm = date.format('DD/MM')

		const isWeekend = (ddd == 'Sa' || ddd == 'Su')
		const isHoliday = (ddmm == '30/04' || ddmm == '01/05')

		return isWeekend || isHoliday
	}

	isToday(date) {
		return date.format('YY-MM-DD') == moment().format('YY-MM-DD')
	}

	getWbsData() {
		// sort by index asc
		return _.sortBy(this.state.sync_storage.wbs_data, 'index')
	}

	getDataNorm(dateRange) {
		const wbs_data = _.cloneDeep(this.getWbsData())

		const data_norm = {}

		_.map(dateRange, (d) => {
			const dateObj = moment(d)

			let { totalDev, totalQa } = this.state.sync_storage
			totalDev = totalDev * 8
			totalQa = totalQa * 8

			if (!this.isHoliday(dateObj)) {
				const data = {}

				for (let i = 0; i < _.size(wbs_data); i++) {
					let implement = 0
					let fix_bug = 0
					let create_test_case = 0
					let execute_test = 0

					// dev: implement
					if (totalDev > 0) {
						const factor = _.min([totalDev, this.state.sync_storage.max_dev_hour_in_day])
						if (wbs_data[i].mh.implement.value >= factor) {
							implement = factor
						} else {
							implement = wbs_data[i].mh.implement.value
						}
						wbs_data[i].mh.implement.value -= implement
						totalDev -= implement
					}

					// qa: create test case
					if (totalQa > 0) {
						const factor = _.min([totalQa, this.state.sync_storage.max_qa_hour_in_day])
						if (wbs_data[i].mh.create_test_case.value >= factor) {
							create_test_case = factor
						} else {
							create_test_case = wbs_data[i].mh.create_test_case.value
						}
						wbs_data[i].mh.create_test_case.value -= create_test_case
						totalQa -= create_test_case
					}

					// qa: execute test
					if (totalQa > 0 && wbs_data[i].mh.implement.value == 0 && wbs_data[i].mh.create_test_case.value == 0) {
						const factor = _.min([totalQa, this.state.sync_storage.max_qa_hour_in_day])
						if (wbs_data[i].mh.execute_test.value >= factor) {
							execute_test = factor
						} else {
							execute_test = wbs_data[i].mh.execute_test.value
						}
						wbs_data[i].mh.execute_test.value -= execute_test
						totalQa -= execute_test
					}

					// dev: fix_bug
					if (totalDev > 0 && wbs_data[i].mh.execute_test.value == 0) {
						const factor = _.min([totalDev, this.state.sync_storage.max_dev_hour_in_day])
						if (wbs_data[i].mh.fix_bug.value >= factor) {
							fix_bug = factor
						} else {
							fix_bug = wbs_data[i].mh.fix_bug.value
						}
						wbs_data[i].mh.fix_bug.value -= fix_bug
						totalDev -= fix_bug
					}

					data[wbs_data[i].id] = {
						mh: {
							implement: {
								...wbs_data[i].mh.implement,
								value: implement
							},
							fix_bug: {
								...wbs_data[i].mh.fix_bug,
								value: fix_bug
							},
							create_test_case: {
								...wbs_data[i].mh.create_test_case,
								value: create_test_case
							},
							execute_test: {
								...wbs_data[i].mh.execute_test,
								value: execute_test
							},
						},
					}
				}

				data_norm[d] = data
			}
		})

		return data_norm
	}

	auto_sync() {
		setTimeout(() => {
			this.props.syncStorage('SYNC_STORAGE', this.state.sync_storage)
		}, 200)
	}

	renderWbsHeaderLeft() {
		return [
			<div className="row">
				<div className="col">
					<h1 className="fs-5 ps-2">WBS</h1>
				</div>
				<div className="col align-items-center d-flex" style={{
					minWidth: 200,
					maxWidth: 200,
					width: 200,
				}}>
					<table className="table table-bordered table-sm m-0">
						<tbody>
							<tr>
								<td className="bg-light bg-gradient" width={40}>Start</td>
								<td className="p-0">
									<div className="d-flex justify-content-between align-items-center">
										<DatePicker
											className="calendar-input"
											selectsStart
											startDate={moment(this.state.sync_storage.fromDate).toDate()}
											endDate={moment(this.state.sync_storage.toDate).toDate()}
											selected={moment(this.state.sync_storage.fromDate).toDate()}
											onChange={date => {
												this.setState({
													sync_storage: {
														...this.state.sync_storage,
														fromDate: moment(date).format('YYYY-MM-DD')
													}
												})
												this.auto_sync()
											}}
										/>
										<i className="bi bi-calendar-date me-1"></i>
									</div>
								</td>
							</tr>
							<tr>
								<td className="bg-light bg-gradient">End</td>
								<td className="p-0">
									<div className="d-flex justify-content-between align-items-center">
										<DatePicker
											className="calendar-input"
											selectsEnd
											startDate={moment(this.state.sync_storage.fromDate).toDate()}
											endDate={moment(this.state.sync_storage.toDate).toDate()}
											minDate={moment(this.state.sync_storage.fromDate).toDate()}
											selected={moment(this.state.sync_storage.toDate).toDate()}
											onChange={date => {
												this.setState({
													sync_storage: {
														...this.state.sync_storage,
														toDate: moment(date).format('YYYY-MM-DD')
													}
												})
												this.auto_sync()
											}}
										/>
										<i className="bi bi-calendar-date me-1"></i>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="col">
					<div className="row wbs_row">
						<div className="col align-items-center d-flex justify-content-end">DEV</div>
						<div className="col p-0 border border-top-0 editable-icon" style={{ maxWidth: 40 }}>
							<input
								type="text"
								className="text-input text-center"
								value={this.state.sync_storage.totalDev}
								onChange={(e) => {
									this.setState({
										sync_storage: {
											...this.state.sync_storage,
											totalDev: e.target.value
										}
									})
									this.auto_sync()
								}}
							/>

						</div>
					</div>
					<div className="row wbs_row">
						<div className="col align-items-center d-flex justify-content-end">QA</div>
						<div className="col p-0 border border-bottom-0 editable-icon" style={{ maxWidth: 40 }}>
							<input
								type="text"
								className="text-input text-center"
								value={this.state.sync_storage.totalQa}
								onChange={(e) => {
									this.setState({
										sync_storage: {
											...this.state.sync_storage,
											totalQa: e.target.value
										}
									})
									this.auto_sync()
								}}
							/>
						</div>
					</div>
				</div>
			</div>,
			<div className="row wbs_row bg-light bg-gradient">
				<div className="col border align-items-center justify-content-center d-flex">
					Task
						<a
						href="#add"
						className="btn p-0 ms-2 text-primary"
						title="Add new tasks"
						onClick={e => {
							e.preventDefault()
							const ticket_data = _.cloneDeep(this.state.wbs_ticket_template)
							ticket_data.index = _.size(this.state.sync_storage.wbs_data) + 1
							this.setState({
								sync_storage: {
									...this.state.sync_storage,
									wbs_data: [
										...this.state.sync_storage.wbs_data,
										ticket_data
									]
								}
							})
							this.auto_sync()
						}}
					><i className="bi bi-plus-circle-fill"></i></a>
				</div>
				<div className="col border align-items-center justify-content-center d-flex" style={{ maxWidth: this.state.colHeaderWidth[0] }}>PIC</div>
				<div className="col border align-items-center justify-content-center d-flex" style={{ maxWidth: this.state.colHeaderWidth[2] }}>MH</div>
				<div className="col border align-items-center justify-content-center d-flex" style={{ maxWidth: this.state.colHeaderWidth[3] }}>MD</div>
				<div className="col border align-items-center justify-content-center d-flex" style={{ maxWidth: this.state.colHeaderWidth[4] }}>Status</div>
				<div className="col border align-items-center justify-content-center d-flex" style={{ maxWidth: this.state.colHeaderWidth[5] }}>Team</div>
			</div>
		]
	}

	renderWbsHeaderRight(dateRange, data_norm) {
		return [
			<div className="row wbs_row">
				{
					// DEV COST
					_.map(dateRange, (d) => {
						const dateObj = moment(d)

						const classes = ['col', 'wbs_col', 'border']

						if (this.isToday(dateObj)) {
							classes.push('bg-warning')
						} else if (this.isHoliday(dateObj)) {
							classes.push('bg-light')
						}

						const cost = _.sumBy(_.values(_.get(data_norm, `${d}`, [])), (o) => (_.toNumber(o.mh.implement.value) + _.toNumber(o.mh.fix_bug.value)) / 8)
						return (
							<div className={classes.join(' ')}>{cost || ''}</div>
						)
					})
				}
			</div>,
			<div className="row wbs_row">
				{
					// QA COST
					_.map(dateRange, (d) => {
						const dateObj = moment(d)

						const classes = ['col', 'wbs_col', 'border']

						if (this.isToday(dateObj)) {
							classes.push('bg-warning')
						} else if (this.isHoliday(dateObj)) {
							classes.push('bg-light')
						}

						const cost = _.sumBy(_.values(_.get(data_norm, `${d}`, [])), (o) => (_.toNumber(o.mh.create_test_case.value) + _.toNumber(o.mh.execute_test.value)) / 8)
						return (
							<div className={classes.join(' ')}>{cost || ''}</div>
						)
					})
				}
			</div>,
			<div className="row wbs_row">
				{
					// DATE HEADER
					_.map(dateRange, (d) => {
						const dateObj = moment(d)

						const classes = ['col', 'wbs_col', 'border']

						if (this.isToday(dateObj)) {
							classes.push('bg-warning')
						} else if (this.isHoliday(dateObj)) {
							classes.push('bg-light')
						}

						return (
							<div className={classes.join(' ')}>{dateObj.format('DD')}</div>
						)
					})
				}
			</div>
		]
	}

	renderWbsDataLeft(wbs_data) {
		return _.map(wbs_data, (ticket) => [
			<div className="row wbs_row">
				<div className="col border d-flex flex-row pe-0 bg-primary align-items-center editable-icon" title={ticket.subject}>
					<input
						type="text"
						className="text-input text-center bg-light"
						style={{ width: 48 }}
						value={ticket.id}
						onChange={(e) => {
							const newData = _.map(_.cloneDeep(this.state.sync_storage.wbs_data), (o) => {
								if (o.index == ticket.index) {
									o.id = e.target.value
								}
								return o
							})
							this.setState({
								sync_storage: {
									...this.state.sync_storage,
									wbs_data: newData
								}
							})
							this.auto_sync()
						}}
					/>
					<input
						type="text"
						className="text-input"
						value={ticket.subject}
						onChange={(e) => {
							const newData = _.map(_.cloneDeep(this.state.sync_storage.wbs_data), (o) => {
								if (o.id == ticket.id) {
									o.subject = e.target.value
								}
								return o
							})
							this.setState({
								sync_storage: {
									...this.state.sync_storage,
									wbs_data: newData
								}
							})
							this.auto_sync()
						}}
					/>
				</div>
				<div className="col border align-items-center d-flex" style={{ maxWidth: this.state.colHeaderWidth[5] }}>
					<a
						href="#up"
						className="btn btn-sm p-0 text-success"
						onClick={(e) => {
							e.preventDefault()
							const currentIndex = ticket.index
							const newIndex = currentIndex - 1
							if (newIndex >= 0) {
								const newData = _.map(_.cloneDeep(this.state.sync_storage.wbs_data), (it) => {
									if (it.id == ticket.id) {
										_.set(it, 'index', newIndex)
									} else if (it.index == newIndex) {
										_.set(it, 'index', currentIndex)
									}
									return it
								})
								this.setState({
									sync_storage: {
										...this.state.sync_storage,
										wbs_data: newData
									}
								})
								this.auto_sync()
							}
						}}
					><i className="bi bi-arrow-up-circle"></i></a>
					<a
						href="#down"
						className="btn btn-sm p-0 ms-1 text-danger"
						onClick={(e) => {
							e.preventDefault()
							const currentIndex = ticket.index
							const newIndex = currentIndex + 1
							if (newIndex <= _.size(wbs_data)) {
								const newData = _.map(_.cloneDeep(this.state.sync_storage.wbs_data), (it) => {
									if (it.id == ticket.id) {
										_.set(it, 'index', newIndex)
									} else if (it.index == newIndex) {
										_.set(it, 'index', currentIndex)
									}
									return it
								})
								this.setState({
									sync_storage: {
										...this.state.sync_storage,
										wbs_data: newData
									}
								})
								this.auto_sync()
							}
						}}
					><i className="bi bi-arrow-down-circle"></i></a>
				</div>
			</div>,
			_.map(this.state.costItem, (it) => {
				const pic = _.get(ticket, `mh.${it.key}.pic`)
				const status = _.get(ticket, `mh.${it.key}.status`)
				const cost = _.get(ticket, `mh.${it.key}.value`)
				return (
					<div className="row wbs_row">
						<div className="col border align-items-center d-flex justify-content-end">{it.title}</div>
						<div className="col border align-items-center d-flex px-0" style={{ maxWidth: this.state.colHeaderWidth[0] }}>
							<select
								className="border-0 text-sm"
								style={{
									width: this.state.colHeaderWidth[0]
								}}
								title={pic}
								value={pic}
								onChange={e => {
									const newData = _.map(_.cloneDeep(this.state.sync_storage.wbs_data), (o) => {
										if (o.id == ticket.id) {
											_.set(o, `mh.${it.key}.pic`, e.target.value)
										}
										return o
									})
									this.setState({
										sync_storage: {
											...this.state.sync_storage,
											wbs_data: newData
										}
									})
									this.auto_sync()
								}}>
								<option value=""></option>
								{
									_.map(this.state.sync_storage.members || [], m => {
										return (
											<option value={m.name}>{m.name}</option>
										)
									})
								}
							</select>
						</div>
						<div className="col border align-items-center d-flex p-0 editable-icon" style={{ maxWidth: this.state.colHeaderWidth[2] }}>
							<input
								type="text"
								className="text-input text-center"
								value={cost}
								onChange={(e) => {
									const newData = _.map(_.cloneDeep(this.state.sync_storage.wbs_data), (o) => {
										if (o.id == ticket.id) {
											_.set(o, `mh.${it.key}.value`, e.target.value)
										}
										return o
									})
									this.setState({
										sync_storage: {
											...this.state.sync_storage,
											wbs_data: newData
										}
									})
									this.auto_sync()
								}}
							/>
						</div>
						<div className="col border align-items-center d-flex" style={{ maxWidth: this.state.colHeaderWidth[3] }}>{_.round(cost / 8, 1) || ''}</div>
						<div className="col border align-items-center d-flex px-0" style={{ maxWidth: this.state.colHeaderWidth[4] }}>
							<select
								className="border-0 text-sm"
								style={{
									width: this.state.colHeaderWidth[0]
								}}
								title={status}
								value={status}
								onChange={e => {
									const newData = _.map(_.cloneDeep(this.state.sync_storage.wbs_data), (o) => {
										if (o.id == ticket.id) {
											_.set(o, `mh.${it.key}.status`, e.target.value)
										}
										return o
									})
									this.setState({
										sync_storage: {
											...this.state.sync_storage,
											wbs_data: newData
										}
									})
									this.auto_sync()
								}}>
								<option value=''></option>
								<option value='DOING'>DOING</option>
								<option value='DONE'>DONE</option>
								<option value='PENDING'>PENDING</option>
							</select>
						</div>
						<div className="col border align-items-center d-flex" style={{ maxWidth: this.state.colHeaderWidth[5] }}>{_.upperCase(it.team)}</div>
					</div>
				)
			}),
		])
	}

	renderWbsDataRight(dateRange, wbs_data, data_norm) {
		return _.map(wbs_data, (ticket) => _.map(_.concat([''], this.state.costItem), (it) => (
			<div className="row wbs_row">
				{
					_.map(dateRange, (d) => {
						const dateObj = moment(d)
						const classes = ['col', 'wbs_col', 'border']
						if (this.isToday(dateObj)) {
							classes.push('bg-warning')
						} else if (this.isHoliday(dateObj)) {
							classes.push('bg-light')
						}
						const cost = _.get(data_norm, `${d}.${ticket.id}.mh.${it.key}.value`)
						if (cost) {
							const team = _.toLower(it.team)
							if (team == 'dev') {
								classes.push('bg-success')
							} else if (team == 'qa') {
								classes.push('bg-info')
							}
						}
						return (
							<div className={classes.join(' ')}>
								{_.round(cost / 8, 1) || ''}
							</div>
						)
					})
				}
			</div>
		)))
	}

	render() {
		const fromDate = moment(this.state.sync_storage.fromDate).subtract(1, 'days')
		const toDate = moment(this.state.sync_storage.toDate)
		const runDate = _.clone(fromDate)

		const itemCount = moment.duration(toDate.diff(fromDate)).asDays()
		const dateRange = _.times(itemCount).map((i) => runDate.add(i = 0 ? 0 : 1, 'days').format('YYYY-MM-DD'))

		const wbs_data = this.getWbsData()

		const data_norm = this.getDataNorm(dateRange)

		const leftSideWidth = 400

		return (
			<ScrollSync>
				<div className="wbs-page vh-100">
					<div className="row">
						<div className="col" style={{
							maxWidth: leftSideWidth,
						}}>
							{
								this.renderWbsHeaderLeft()
							}
						</div>
						<ScrollSyncPane group="two">
							<div className="col overflow-auto">
								<div style={{ width: _.size(dateRange) * 28 }}>
									{
										this.renderWbsHeaderRight(dateRange, data_norm)
									}
								</div>
							</div>
						</ScrollSyncPane>
					</div>

					<div className="row"
						style={{ height: 'calc(100% - 83px)' }}
					>
						<ScrollSyncPane group="one">
							<div className="col overflow-auto h-100" style={{
								maxWidth: leftSideWidth,
							}}>
								{
									this.renderWbsDataLeft(wbs_data)
								}
							</div>
						</ScrollSyncPane>
						<ScrollSyncPane group={['one', 'two']}>
							<div className="col overflow-auto h-100">
								<div style={{ width: _.size(dateRange) * 28 }}>
									{
										this.renderWbsDataRight(dateRange, wbs_data, data_norm)
									}
								</div>
							</div>
						</ScrollSyncPane>
					</div>

					<button
						className="btn btn-lg btn-warning position-fixed bottom-0 start-0"
						data-bs-toggle="offcanvas"
						data-bs-target="#offcanvasExample"
					>
						<i className="bi bi-gear"></i>
					</button>
					<div className="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
						<div className="offcanvas-header">
							<h5 className="offcanvas-title" id="offcanvasExampleLabel">Setting</h5>
							<button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
						</div>
						<div className="offcanvas-body">
							<div className="fs-6 mb-1">General</div>
							<div>
								<div className="row g-3 align-items-center">
									<div className="col-auto">
										<label className="col-form-label" style={{ width: 80 }}>Dev hours/day</label>
									</div>
									<div className="col-auto">
										<input type="text"
											className="form-control form-control-sm"
											value={this.state.sync_storage.max_dev_hour_in_day}
											onChange={e => {
												this.setState({
													sync_storage: {
														...this.state.sync_storage,
														max_dev_hour_in_day: e.target.value
													}
												})
												this.auto_sync()
											}}
										/>
									</div>
								</div>
								<div className="row g-3 align-items-center mt-1">
									<div className="col-auto">
										<label className="col-form-label" style={{ width: 80 }}>QA hours/day</label>
									</div>
									<div className="col-auto">
										<input type="text"
											className="form-control form-control-sm"
											value={this.state.sync_storage.max_qa_hour_in_day}
											onChange={e => {
												this.setState({
													sync_storage: {
														...this.state.sync_storage,
														max_qa_hour_in_day: e.target.value
													}
												})
												this.auto_sync()
											}}
										/>
									</div>
								</div>
							</div>

							<div className="fs-6 mt-4 mb-1">Backup & Restore</div>

							<div>
								<button
									className="btn btn-sm btn-primary"
									onClick={e => {
										fileDownloader(JSON.stringify(this.state.sync_storage), moment().format('YYYYMMDD') + '_wbs.json', 'application/json')
									}}
								>
									Backup
								</button>

								<input id="selectFile" type="file" hidden onChange={e => {
									const fileReader = new FileReader();
									fileReader.readAsText(e.target.files[0], "UTF-8");
									fileReader.onload = e => {
										try {
											this.setState({
												sync_storage: JSON.parse(e.target.result)
											})
											alert("Restore successfully!")
											this.auto_sync()
										} catch (e) {
											alert("System Error!")
											console.error(e)
										}
									}
								}} />
								<button
									className="btn btn-sm btn-info ms-4"
									onClick={e => {
										document.getElementById("selectFile").click()
									}}
								>
									Restore
								</button>
							</div>

							<div className="fs-6 mt-4 mb-1">
								Members
									<a
									href="#add-member"
									className="btn p-0 ms-2 text-primary"
									title="Add new member"
									onClick={e => {
										e.preventDefault()
										const members = this.state.sync_storage.members || []
										members.push({
											name: '',
											team: 'dev'
										})
										this.setState({
											sync_storage: {
												...this.state.sync_storage,
												members
											}
										})
										this.auto_sync()
									}}
								><i className="bi bi-plus-circle-fill"></i></a>
							</div>

							<table className="table table-bordered table-sm table-hover caption-top">
								<thead>
									<tr>
										<th width={20}>#.</th>
										<th width={40}>Team</th>
										<th>Name</th>
										<th width={40}></th>
									</tr>
								</thead>
								<tbody>
									{
										_.map(this.state.sync_storage.members || [], (it, idx) => {
											return (
												<tr>
													<td>{idx + 1}</td>
													<td>
														<select
															className="border"
															value={it.team}
															onChange={e => {
																const members = _.map(_.cloneDeep(this.state.sync_storage.members), (o, oix) => {
																	if (oix == idx) {
																		o.team = e.target.value
																	}
																	return o
																})
																this.setState({
																	sync_storage: {
																		...this.state.sync_storage,
																		members
																	}
																})
																this.auto_sync()
															}}>
															<option value="dev">DEV</option>
															<option value="qa">QA</option>
														</select>
													</td>
													<td>
														<input type="text"
															className="text-input p-1"
															value={it.name}
															onChange={e => {
																const members = _.map(_.cloneDeep(this.state.sync_storage.members), (o, oix) => {
																	if (oix == idx) {
																		o.name = e.target.value
																	}
																	return o
																})
																this.setState({
																	sync_storage: {
																		...this.state.sync_storage,
																		members
																	}
																})
																this.auto_sync()
															}}
														/>
													</td>
													<td className="text-center">
														<button
															className="btn btn-sm p-0 text-danger"
															onClick={e => {
																const members = []
																_.map(this.state.sync_storage.members, (o, oix) => {
																	if (oix !== idx) {
																		members.push(o)
																	}
																})
																this.setState({
																	sync_storage: {
																		...this.state.sync_storage,
																		members
																	}
																})
																this.auto_sync()
															}}
														>
															<i className="bi bi-person-x"></i>
														</button>
													</td>
												</tr>
											)
										})
									}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</ScrollSync>
		)
	}
}


const mapStateToProps = (state) => ({
	cache: state.auth.cache
})

const mapDispatchToProps = (dispatch) => ({
	route: (url) => dispatch(push(url)),
	syncStorage: (key, value) => dispatch(AuthRedux.setCache(key, value))
})

export default connect(mapStateToProps, mapDispatchToProps)(WBSPage)

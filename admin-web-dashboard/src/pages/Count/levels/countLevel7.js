import React, { Component } from 'react'
import './styles.css';
import { BrowserRouter as Route, Link } from 'react-router-dom';
import { CircularProgress, Snackbar } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab';

import BedModal from 'components/BedModal.js/bedModal';

import socketIOClient from "socket.io-client";
const ENDPOINT = "http://noobmaster69.us-east-1.elasticbeanstalk.com/"

const convertWardToNum = ward => {
	if (ward.slice(0, 1) === 'A') return ward.slice(1)
	else if (ward.slice(0, 1) === 'B') return parseInt(ward.slice(1)) + 30
	else if (ward.slice(0, 1) === 'C') return parseInt(ward.slice(1)) + 60
	else if (ward.slice(0, 1) === 'D') return parseInt(ward.slice(1)) + 90
}

class Count7 extends Component {
	constructor(props) {
		super(props)

		this.state = {
			modalVisible: false,
			id: null,
			visitors: [],
			patients: [],
			pDetails: [],
			quotaExceed: false,
			exceedBeds: ''
		}
	}

	componentDidMount = async () => {
		const socket = socketIOClient(ENDPOINT);
		try {
			let res = await fetch('http://noobmaster69.us-east-1.elasticbeanstalk.com/beds')
			res = await res.json()
			let level_7_visitors = res["Items"].filter((e => e["ID"].slice(0, 1) === "A"))
			this.setState({ visitors: level_7_visitors })
			let patients = await fetch('http://noobmaster69.us-east-1.elasticbeanstalk.com/patients')
			patients = await patients.json()
			let level7patients = res["Items"].filter((e => e["ID"].slice(0, 1) === "A"))
			this.setState({ patients: level7patients })
			this.getVisitorCount(2)

			console.log(this.state.visitors)

			let prev = -1

			socket.on('visitChange', async (data) => {
				let id = data.id
				let currNum = data.count
				console.log("ONVISITCHANGE", data.count)
				let unauthorisedState = await this.getUnauthorisedState()
				let quota = await this.getQuota()
				let approvedNumbers = await this.getCurrentApprovedNumber("A2")
				let bookedNumbers = await this.getCurrentBookedNumber("A2")
				if (currNum != prev) { //only setstate if the number is different
					console.log('if statement')
					let intermediateObj = this.state.patients
					for (let i = 0; i < intermediateObj.length; i++) { //loop through current visitor array
						if (intermediateObj[i]['ID'] === id) { //change relevant visitor count w matching id
							intermediateObj[i]['VisitorCount'] = currNum
							console.log(this.getQuota())
							console.log('quota', quota)
							console.log('booked', bookedNumbers)

							if (unauthorisedState) {

								if (intermediateObj[i]['VisitorCount'] > quota || intermediateObj[i]['VisitorCount'] > approvedNumbers) {
									console.log("QUOTAEXCEED")
									this.setState({ quotaExceed: true })
									this.setState({ exceedBeds: id })
								}

								if (id === this.state.exceedBeds && intermediateObj[i]['VisitorCount'] <= quota && intermediateObj[i]['VisitorCount'] <= approvedNumbers) {
									console.log('close')
									this.setState({ quotaExceed: false })
									this.setState({ exceedBeds: '' })
								}
							}
							else {
								if (intermediateObj[i]['VisitorCount'] > quota) {
									console.log("QUOTAEXCEED")
									this.setState({ quotaExceed: true })
									this.setState({ exceedBeds: id })

								}
								if (id === this.state.exceedBeds && intermediateObj[i]['VisitorCount'] <= quota) {
									console.log('close')
									this.setState({ quotaExceed: false })
									this.setState({ exceedBeds: '' })
								}
							}
						}
					}
					this.setState({ visitors: intermediateObj })
					prev = currNum
				} else {
					console.log('same')
				}
				// console.log(id, currNum)
			})

		} catch (err) {
			console.log(err)
		}
	}

	getQuota = async () => {
		try {
			let res = await fetch("http://noobmaster69.us-east-1.elasticbeanstalk.com/rules")
			res = await res.json()
			return res["Items"].filter(e => e["Field"] === "CountLimit")[0]["Value"]
		}
		catch (err) {
			console.log(err)
		}
	}

	getUnauthorisedState = async () => {
		try {
			let res = await fetch("http://noobmaster69.us-east-1.elasticbeanstalk.com/rules")
			res = await res.json()
			return res["Items"].filter(e => e["Field"] === "AuthBool")[0]["Value"]
		}
		catch (err) {
			console.log(err)
		}
	}
	getCurrentApprovedNumber = async (id) => {
		let currentPatientUUID
		try {
			let res = await fetch("http://noobmaster69.us-east-1.elasticbeanstalk.com/beds")
			res = await res.json()
			currentPatientUUID = res["Items"].filter(e => {
				return e["ID"] === id
			})
		} catch (err) {
			console.log(err)
		}
		try {
			let currentApprovedList = await fetch("http://noobmaster69.us-east-1.elasticbeanstalk.com/visits")
			currentApprovedList = await currentApprovedList.json()
			currentApprovedList = currentApprovedList["Items"].filter((e) => {
				return e["patientUUID"] === currentPatientUUID[0]["PatientUUID"] && e["ApptStatus"] === 3
			})
			return currentApprovedList.length
		} catch (err) {
			console.log(err)
		}
	}

	getCurrentBookedNumber = async (id) => {
		let currentPatientUUID
		try {
			let res = await fetch("http://noobmaster69.us-east-1.elasticbeanstalk.com/beds")
			res = await res.json()
			currentPatientUUID = res["Items"].filter(e => {
				return e["ID"] === id
			})
		} catch (err) {
			console.log(err)
		}
		try {
			let currentApprovedList = await fetch("http://noobmaster69.us-east-1.elasticbeanstalk.com/visits")
			currentApprovedList = await currentApprovedList.json()
			currentApprovedList = currentApprovedList["Items"].filter((e) => {
				return e["patientUUID"] === currentPatientUUID[0]["PatientUUID"] && e["ApptStatus"] === 0
			})
			return currentApprovedList.length
		} catch (err) {
			console.log(err)
		}
	}

	getVisitorCount = (id) => {
		if (this.state.patients.length > 0) {

			let count = this.state.visitors.filter(e => e["ID"] === "A" + (id).toString())
			console.log(count[0]['VisitorCount'])
			return count[0]["VisitorCount"]
		} else {
			return (<CircularProgress />)
		}
	}

	showModal = async (id) => {
		this.setState({ id })
		console.log(this.state.patients)

		let uuid = ''
		for (let i = 0; i < (this.state.patients).length; i++) {
			if (this.state.patients[i].ID == `A${id}`) {
				uuid = this.state.patients[i].PatientUUID
				break
			}
		}
		fetch(`http://noobmaster69.us-east-1.elasticbeanstalk.com/patients/details/${uuid}`)
			.then(response => response.json())
			.then(data => {
				let details = data.Item
				this.setState({ pDetails: details })
				fetch('http://noobmaster69.us-east-1.elasticbeanstalk.com/visits')
					.then(res => {
						return res.json()
					})
					.then(obj => {
						let allVisits = obj['Items']
						let today = (new Date()).toString()
						for (let i = 0; i < allVisits.length; i++) {
							// console.log(id, allVisits[i]['patientBed'])
							if (allVisits[i]['ApptStatus'] === 1) {
							}
						}
						this.setState({ modalVisible: true });

					})
			})
			.catch(err => { console.log(err) })
	}

	closeModal = () => {
		this.setState({ modalVisible: false });
	}

	handleClose = () => {
		this.setState({ quotaExceed: false })
	}

	render() {
		return (
			<div id="page_container">
				<div id="bed_container">

					<Snackbar open={this.state.quotaExceed} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} >
						<Alert severity="error" style={{ minHeight: 50, minWidth: 300 }}>
							<AlertTitle>QUOTA EXCEED</AlertTitle>
							Quota exceeded for bed {this.state.exceedBeds}
						</Alert>
					</Snackbar>
					<div className="row">
						{
							[1, 2, 3, 4, 5, 6].map((id) => {
								return (
									<>
										<div className="bed" id={"bed_" + id} onClick={() => { this.showModal(id) }}
											style={{ flexDirection: "column" }}>
											<div>BED A{id}</div>
											<div style={{ fontSize: 30 }}>{this.getVisitorCount(id)}</div>
										</div>
										<br />
									</>
								)
							})
						}
					</div>
					<div className="row">
						{
							[7, 8, 9, 10, 11, 12].map((id) => {
								return (
									<>
										<div className="bed" id={"bed_" + id} onClick={() => { this.showModal(id) }}
											style={{ flexDirection: "column" }}>
											<div>BED A{id}</div>
											<div style={{ fontSize: 30 }}>{this.getVisitorCount(id)}</div>
										</div>
										<br />
									</>
								)
							})
						}
					</div>
					<div className="row">
						{
							[13, 14, 15, 16, 17, 18].map((id) => {
								return (
									<>
										<div className="bed" id={"bed_" + id} onClick={() => { this.showModal(id) }}
											style={{ flexDirection: "column" }}>
											<div>BED A{id}</div>
											<div style={{ fontSize: 30 }}>{this.getVisitorCount(id)}</div>
										</div>
										<br />
									</>
								)
							})
						}
					</div>
					<div className="row">
						{
							[19, 20, 21, 22, 23, 24].map((id) => {
								return (
									<>
										<div className="bed" id={"bed_" + id} onClick={() => { this.showModal(id) }}
											style={{ flexDirection: "column" }}>
											<div>BED A{id}</div>
											<div style={{ fontSize: 30 }}>{this.getVisitorCount(id)}</div>
										</div>
										<br />
									</>
								)
							})
						}
					</div>
					<div className="row">
						{
							[25, 26, 27, 28, 29, 30].map((id) => {
								return (
									<>
										<div className="bed" id={"bed_" + id} onClick={() => { this.showModal(id) }}
											style={{ flexDirection: "column" }}>
											<div>BED A{id}</div>
											<div style={{ fontSize: 30 }}>{this.getVisitorCount(id)}</div>
										</div>
										<br />
									</>
								)
							})
						}
					</div>
				</div>
				<BedModal
					visible={this.state.modalVisible}
					closeModal={this.closeModal}
					id={this.state.id}
					details={this.state.pDetails}
					ward="A"
				/>

			</div>
		)
	}
}

export default Count7
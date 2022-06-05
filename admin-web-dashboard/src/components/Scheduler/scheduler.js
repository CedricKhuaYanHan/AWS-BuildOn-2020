import * as React from 'react';
import './index.css';
import { ScheduleComponent, ViewsDirective, ViewDirective, TimelineViews, Inject, ResourcesDirective, ResourceDirective, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';

import { extend, Internationalization, isNullOrUndefined } from '@syncfusion/ej2-base';
import SampleBase from './sample-base';
import * as dataSource from './datasource.json';
import { FormatListBulleted } from '@material-ui/icons';

export default class TimelineResource extends SampleBase {

    constructor() {
        super(...arguments);
        this.data = extend([], dataSource.roomData, null, true);
        this.instance = new Internationalization();
        // this.ownerData = [
        //     { text: 'Jammy', id: 1, color: '#ea7a57', capacity: 20, patient: 'Conference' },
        //     { text: 'Tweety', id: 2, color: '#7fa900', capacity: 7, patient: 'Cabin' },
        //     { text: 'Nestle', id: 3, color: '#5978ee', capacity: 5, patient: 'Cabin' },
        //     { text: 'Phoenix', id: 4, color: '#fec200', capacity: 15, patient: 'Conference' },
        //     { text: 'Mission', id: 5, color: '#df5286', capacity: 25, patient: 'Conference' },
        //     { text: 'Hangout', id: 6, color: '#00bdae', capacity: 10, patient: 'Cabin' },
        //     { text: 'Rick Roll', id: 7, color: '#865fcf', capacity: 20, patient: 'Conference' },
        //     { text: 'Rainbow', id: 8, color: '#1aaa55', capacity: 8, patient: 'Cabin' },
        //     { text: 'Swarm', id: 9, color: '#df5286', capacity: 30, patient: 'Conference' },
        //     { text: 'Photogenic', id: 10, color: '#710193', capacity: 25, patient: 'Conference' }
        // ];
        this.state = {
            headerData: [],
            scheduleData: []
        }
    }

    componentDidMount = async () => {
        // this.getSchedule()
        this.setState({
            headerData: await this.getBeds(),
            scheduleData: await this.getSchedule()
        })
    }

    getBeds = async () => {
        try {
            let res = await fetch('http://noobmaster69.us-east-1.elasticbeanstalk.com/beds')
            res = await res.json()
            res = res["Items"].filter((e) => {
                return e["ID"].slice(0, 1) === this.props.level
            })
            let headerObject = []
            res.forEach((e, index) => {

                headerObject.push({
                    text: e["ID"],
                    id: parseInt(e["ID"].slice(1)),
                    capacity: e["VisitorCount"],
                    patient: e["PatientUUID"] ? e["PatientName"] : (
                        <font color="green">
                            EMPTY
                        </font>
                    ),
                    color: ['#ea7a57', '#7fa900', '#5978ee', '#fec200', '#df5286'][index % 5]
                })
            })
            return headerObject.sort((a, b) => a['id'] - b['id'])
        } catch (err) {
            console.log(err)
        }
    }

    getSchedule = async () => {
        try {
            let res = await fetch('http://noobmaster69.us-east-1.elasticbeanstalk.com/visits')
            res = await res.json()
            let schedule = []
            for (let i = 1; i <= 30; i++) {
                schedule.push(
                    {
                        "Id": i,
                        "Subject": "No Visitation during this period",
                        "StartTime": "2020-01-01T06:00:00.000Z",
                        "EndTime": "2020-01-01T09:00:00.000Z",
                        "RecurrenceRule": "FREQ=DAILY;INTERVAL=1;",
                        "IsBlock": true,
                        "RoomId": i
                    }
                )
            }
            res = res["Items"].filter((e) => {
                return e["patientBed"].slice(0, 1) === this.props.level
            })
            res = res.forEach((e, index) => {
                let start = new Date(e["Start1"])
                let end = new Date(e['End1'])
                start = start.toUTCString()
                end = end.toUTCString()
                console.log(start)
                schedule.push({
                    "Id": index + 32,
                    "Subject": e["visitorName"],
                    "Description": "Status: " + ["Booked", "Pending", "Rejected", "Approved", "Archived"][e["ApptStatus"]],
                    "StartTime": e["Start1"] ? start : "2020-08-02T03:30:00.000Z",
                    "EndTime": e["End1"] ? end : "2020-08-02T05:30:00.000Z",
                    "RoomId": parseInt(e["patientBed"].slice(1))
                })
            })
            console.log(schedule)
            return schedule
        } catch (err) {
            console.log(err)
        }
    }
    getRoomName(value) {
        return value.resourceData[value.resource.textField];
    }
    getRoomPatient(value) {
        return value.resourceData.patient;
    }
    getRoomCapacity(value) {
        return value.resourceData.capacity;
    }
    isReadOnly(endDate) {
        return (endDate < new Date(2020, 6, 31, 0, 0));
    }
    resourceHeaderTemplate(props) {
        return (<div className="template-wrap">
            <div className="room-name">{this.getRoomName(props)}</div>
            <div className="room-patient">{this.getRoomPatient(props)}</div>
            <div className="room-capacity">{this.getRoomCapacity(props)}</div>
        </div>);
    }
    onActionBegin(args) {
        if (args.requestType === 'eventCreate' || args.requestType === 'eventChange') {
            let data;
            if (args.requestType === 'eventCreate') {
                data = args.data[0];
            }
            else if (args.requestType === 'eventChange') {
                data = args.data;
            }
            if (!this.scheduleObj.isSlotAvailable(data)) {
                args.cancel = true;
            }
        }
    }
    onEventRendered(args) {
        let data = args.data;
        if (this.isReadOnly(data.EndTime)) {
            args.element.setAttribute('aria-readonly', 'true');
            args.element.classList.add('e-read-only');
        }
    }
    onRenderCell(args) {
        if (args.element.classList.contains('e-work-cells')) {
            if (args.date < new Date(2020, 6, 31, 0, 0)) {
                args.element.setAttribute('aria-readonly', 'true');
                args.element.classList.add('e-read-only-cells');
            }
        }
        if (args.elementType === 'emptyCells' && args.element.classList.contains('e-resource-left-td')) {
            let target = args.element.querySelector('.e-resource-text');
            target.innerHTML = '<div class="name">Room</div><div class="patient">Patient</div><div class="capacity">Count</div>';
        }
    }
    onPopupOpen(args) {
        let data = args.data;
        if (args.type === 'QuickInfo' || args.type === 'Editor' || args.type === 'RecurrenceAlert' || args.type === 'DeleteAlert') {
            let target = (args.type === 'RecurrenceAlert' ||
                args.type === 'DeleteAlert') ? data.element[0] : args.target;
            if (!isNullOrUndefined(target) && target.classList.contains('e-work-cells')) {
                if ((target.classList.contains('e-read-only-cells')) ||
                    (!this.scheduleObj.isSlotAvailable(data))) {
                    args.cancel = true;
                }
            }
            else if (!isNullOrUndefined(target) && target.classList.contains('e-appointment') &&
                (this.isReadOnly(data.EndTime))) {
                args.cancel = true;
            }
        }
    }
    render() {
        return (
            <div className='schedule-control-section' style={{ marginTop: 50 }}>
                <div className='col-lg-12 control-section'>
                    <div className='control-wrapper'>
                        <ScheduleComponent cssClass='timeline-resource'
                            ref={schedule => this.scheduleObj = schedule} width='100%' height='650px'
                            selectedDate={new Date()} workHours={{ start: '11:00', end: '21:00' }}
                            timeScale={{ interval: 60, slotCount: 1 }} timezone='Singapore'
                            resourceHeaderTemplate={this.resourceHeaderTemplate.bind(this)}
                            eventSettings={{
                                dataSource: this.state.scheduleData,
                                fields: {
                                    id: 'Id',
                                    subject: { title: 'Summary', name: 'Subject' },
                                    location: { title: 'Location', name: 'Location' },
                                    description: { title: 'Comments', name: 'Description' },
                                    startTime: { title: 'From', name: 'StartTime' },
                                    endTime: { title: 'To', name: 'EndTime' }
                                }
                            }} eventRendered={this.onEventRendered.bind(this)} popupOpen={this.onPopupOpen.bind(this)} actionBegin={this.onActionBegin.bind(this)} renderCell={this.onRenderCell.bind(this)} group={{ enableCompactView: false, resources: ['MeetingRoom'] }}>
                            <ResourcesDirective>
                                <ResourceDirective field='RoomId' title='Room Patient' name='MeetingRoom' allowMultiple={FormatListBulleted} dataSource={this.state.headerData} textField='text' idField='id' colorField='color'>
                                </ResourceDirective>
                            </ResourcesDirective>
                            <ViewsDirective>
                                <ViewDirective option='TimelineDay' />
                                <ViewDirective option='TimelineWeek' />
                            </ViewsDirective>
                            <Inject services={[TimelineViews, Resize, DragAndDrop]} />
                        </ScheduleComponent>
                    </div>
                </div>

            </div>);
    }
}
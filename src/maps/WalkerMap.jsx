import React, { Component } from 'react';
import L from 'leaflet';
import './map.css'
import { Row, Col, Button, Modal } from 'antd'
import { isPointInPolygon, getDistance } from 'geolib'
import API from '../modules/API';
import { withRouter } from 'react-router'

const warning = Modal.warning;

class Map extends Component {
    constructor(props) {
        super(props)

        this.state = {
            lat: this.props.lat,
            long: this.props.long,
            userFence: this.props.fence,
            walkIsActive: false,
            startTime: "",
            endTime: "",
            walkLength: "",
            walkPath: [],
            currentUser: '',
        }
        this.fenceRender = L.polygon(this.state.userFence.fence, { lineCap: 'circle', color: '#324759', fillRule: "nonzero", })

        this.pathRender = L.polyline(this.state.walkPath, { lineCap: 'circle', color: '#256EFF' })

        this.marker = null
    }



    componentDidMount() {
        const currentUser = JSON.parse(sessionStorage.getItem("user"))
        this.setState({ user: currentUser })
        // create map
        this.map = L.map('map', { drawControl: true })
            .setView([this.props.lat, this.props.long], 17)
        // add tiles to map
        L.tileLayer("https://api.mapbox.com/styles/v1/sglavin85/cjwwh144ha2rx1cnz8qgmjfe6/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2dsYXZpbjg1IiwiYSI6ImNqd3dhdWh1OTBldWg0OWxna2VuZmVxMDIifQ.ME2N9N5umfgKgVu7vnC2cQ", {
            maxZoom: 18,
            id: 'mapbox.streets'
        }).addTo(this.map);


        this.fenceRender.addTo(this.map)
        this.map.fitBounds(this.state.userFence.fence)
    }

    trackWalk = () => {
        if (this.marker !== null) {
            this.marker.remove()
            this.marker = null
        }
        if (this.state.walkIsActive) {
            navigator.geolocation.getCurrentPosition(pos => {
                const lat = pos.coords.latitude;
                const long = pos.coords.longitude;
                this.map.setView([lat, long], 17);
                API.trackWalk(this.props.dog.id, { lat: lat, long: long })
                // add a marker to my location
                this.marker = L.marker([lat, long])
                this.marker.addTo(this.map);
                const currentPositionObj = { latitude: lat, longitude: long }
                const fenceArray = [...this.state.userFence.fence]
                const fenceObj = fenceArray.map(latLng => {
                    return { latitude: latLng[0], longitude: latLng[1] }
                })
                var isInFence = isPointInPolygon(currentPositionObj, fenceObj)
                if (!isInFence) {
                    this.showConfirm()
                }
                const currentPositionArray = [lat, long]
                const path = [...this.state.walkPath, currentPositionArray]
                this.setState({ walkPath: path }, () => {
                    // draw a polyline
                    this.pathRender.remove()
                    this.pathRender = L.polyline(this.state.walkPath, { lineCap: 'circle', color: '#324759' })
                    this.pathRender.addTo(this.map)
                })
            }, e => { console.warn(`Error(${e.code}): ${e.message}`) }, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        }
    }
    timeoutControl = null

    handleStart = () => {
        const start = new Date()
        this.setState({ walkIsActive: true, startTime: start }, () => {
            this.trackWalk()
            this.timeoutControl = setInterval(this.trackWalk, 15000)
        })
    }

    showConfirm = () => {
        warning({
            title: `You have left ${this.props.dog.name}'s digital fence!`,
            content: 'Please turn around',
            okText: 'Ok',
            okType: 'danger',
            onOk() { }
        });
    }

    convertLatLng = (latLngArray) => {
        const [latitude, longitude] = latLngArray
        return { latitude, longitude }
    }

    handleEnd = () => {
        API.deleteWalk(this.props.dog.id)
        clearInterval(this.timeoutControl)
        const end = new Date()
        this.setState({ walkIsActive: false, endTime: end }, () => {
            var timeDif = this.state.endTime - this.state.startTime
            timeDif /= 1000
            var timeDifInSeconds = Math.round(timeDif)
            this.setState({ walkLength: timeDifInSeconds })
            var distanceWalked = 0
            for (var i = 0; i < this.state.walkPath.length - 1; i++) {

                const pathObj1 = this.convertLatLng(this.state.walkPath[i])
                const pathObj2 = this.convertLatLng(this.state.walkPath[i + 1])
                const distanceOfLeg = getDistance(pathObj1, pathObj2, 0.3)
                distanceWalked = distanceWalked + distanceOfLeg

            }

            var walkCost = 10

            const distCost = distanceWalked * 0.005
            const timeCost = this.state.walkLength * 0.008
            const realWalkCost = distCost + timeCost
            if (realWalkCost > 10) {
                walkCost = realWalkCost
            }


            var newDate = new Date().toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "2-digit"
            })
            const obj = {
                ammount: walkCost.toFixed(2),
                date: newDate,
                distance: distanceWalked,
                dogName: this.props.dog.name,
                ownerId: this.props.owner.uid,
                ownerFirstName: this.props.owner.firstName,
                ownerLastName: this.props.owner.lastName,
                walkerId: this.state.user.uid,
                walkerFirstName: this.state.user.firstName,
                walkerLastName: this.state.user.lastName,
                path: this.state.walkPath,
                resolved: false,
                dogImg: this.props.dog.image
            }

            API.postInvoice(obj)
        })

        this.props.history.push(`/walkers/dogs/dog/${this.props.dog.id}`)
    }


    componentWillUnmount() {
        clearInterval(this.timeoutControl)
    }

    render() {
        return (
            <>

                <Row type="flex" justify="center">
                    <Col>

                        <Button type="primary" disabled={this.state.walkIsActive} onClick={() => this.handleStart()}>
                            Start Walk</Button>
                        <Button type="primary" disabled={!this.state.walkIsActive} onClick={() => this.handleEnd()}>
                            End Walk</Button>
                    </Col>
                </Row>
                <Row type="flex" justify="center">

                    <Col>
                    </Col>
                    <Col>
                        <div id="map"></div>
                    </Col>
                </Row>
            </>
        )
    }
}

export default withRouter(Map)
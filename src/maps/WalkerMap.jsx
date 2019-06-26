import React, { Component } from 'react';
import L from 'leaflet';
import './map.css'
import { Row, Col, Button, Modal } from 'antd'
import { isPointInPolygon, getDistance } from 'geolib'
import API from '../modules/API';
import { withRouter } from 'react-router'
import keys from '../../keys/Keys'

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

        //if the owner has a fence that is created then the render is added here not yet added to the map.

        this.fenceRender = L.polygon(this.state.userFence.fence, { lineCap: 'circle', color: '#324759', fillRule: "nonzero", })

        //path is empty at first but as the path is created this creates a reference for the path line.

        this.pathRender = L.polyline(this.state.walkPath, { lineCap: 'circle', color: '#256EFF' })

        //marker will reflect the current location of the walker, starts as null and sets when the first lat long points come in from the browser.

        this.marker = null
    }



    componentDidMount() {
        const currentUser = JSON.parse(sessionStorage.getItem("user"))
        this.setState({ user: currentUser })
        // create map
        this.map = L.map('map', { drawControl: true })
            .setView([this.props.lat, this.props.long], 17)
        // add tiles to map
        L.tileLayer(keys.mapbox, {
            maxZoom: 18,
            id: 'mapbox.streets'
        }).addTo(this.map);

        //adds the fence to the map
        this.fenceRender.addTo(this.map)

        //makes the map zoom out to fit the entire fence in the viewscreen
        this.map.fitBounds(this.state.userFence.fence)
    }


    //function to track the walk (fired every 15 seconds once walk begins)
    trackWalk = () => {
        //if there is a marker it removes the marker and resets marker to null
        if (this.marker !== null) {
            this.marker.remove()
            this.marker = null
        }
        if (this.state.walkIsActive) {
            //gets the lat and long positions from the browser and recenters the map to the current locatiion.
            navigator.geolocation.getCurrentPosition(pos => {
                const lat = pos.coords.latitude;
                const long = pos.coords.longitude;
                this.map.setView([lat, long], 17);
                //sends the current location to the database allowing the owner to watch the walk in real time.
                API.trackWalk(this.props.dog.id, { lat: lat, long: long })
                // add a marker to current location
                this.marker = L.marker([lat, long])
                this.marker.addTo(this.map);
                const currentPositionObj = { latitude: lat, longitude: long }
                //makes a clone of the fence in state to and converts it in to a format that the geolib function "isPointInPolygon" expects
                const fenceArray = [...this.state.userFence.fence]
                const fenceObj = fenceArray.map(latLng => {
                    return { latitude: latLng[0], longitude: latLng[1] }
                })
                //checks to ensure walker is still within the confines of the fence.
                var isInFence = isPointInPolygon(currentPositionObj, fenceObj)
                //if walker is not then an alert is shown to the walker to make them turn around.
                if (!isInFence) {
                    this.showConfirm()
                }
                //updates the path array with the current location
                const currentPositionArray = [lat, long]
                const path = [...this.state.walkPath, currentPositionArray]
                this.setState({ walkPath: path }, () => {
                    // draws the new line based off the updated path array
                    this.pathRender.remove()
                    this.pathRender = L.polyline(this.state.walkPath, { lineCap: 'circle', color: '#324759' })
                    this.pathRender.addTo(this.map)
                })
            }, e => { console.warn(`Error(${e.code}): ${e.message}`) }, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        }
    }

    timeoutControl = null

    //starts the walk

    handleStart = () => {
        const start = new Date()
        this.setState({ walkIsActive: true, startTime: start }, () => {
            this.trackWalk()
            //after firing the track walk function once sets an interval to refire the function every 15 seconds
            this.timeoutControl = setInterval(this.trackWalk, 15000)
        })
    }

    //displays the warning when the walker has left the dogs digital fence

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

    //fires once when the user clicks to end the walk

    handleEnd = () => {
        //clears the interval so that the track function stops firing every 15 seconds.
        clearInterval(this.timeoutControl)
        const end = new Date()
        this.setState({ walkIsActive: false, endTime: end }, () => {
            //subtracts the end time from the start t ime and returns the total time of the walk.
            var timeDif = this.state.endTime - this.state.startTime
            timeDif /= 1000
            var timeDifInSeconds = Math.round(timeDif)
            this.setState({ walkLength: timeDifInSeconds })
            var distanceWalked = 0
            //iterates over the walk path and computes the distance between each leg and then adds the distance to the variable distance walked which results in the total distance walked, function getDistance is provided by geolib
            for (var i = 0; i < this.state.walkPath.length - 1; i++) {

                const pathObj1 = this.convertLatLng(this.state.walkPath[i])
                const pathObj2 = this.convertLatLng(this.state.walkPath[i + 1])
                const distanceOfLeg = getDistance(pathObj1, pathObj2, 0.3)
                distanceWalked = distanceWalked + distanceOfLeg

            }
            //sets base walk cost at $10.50
            var walkCost = 10.50
            //gives distance and time values and then adds them together to determine a cost for the walk
            const distCost = distanceWalked * 0.005
            const timeCost = this.state.walkLength * 0.008
            const realWalkCost = distCost + timeCost
            // if the computer cost is under $10.50 then $10.50 is the cost of the walk but if it is above $10.50 then the computer value is used
            if (realWalkCost > 10.50) {
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
            //adds the invoice to the databse
            API.postInvoice(obj)
            //deletes the walk from the dog record which will alert the owner that the dog's walk has completed.
            API.deleteWalk(this.props.dog.id)
            this.props.history.push(`/walkers/dogs/dog/${this.props.dog.id}`)

        })
    }

    //in case the user leaves the page without hitting the end walk button then the interval function will be shut off and the walk will be deleted.

    componentWillUnmount() {
        clearInterval(this.timeoutControl)
        API.deleteWalk(this.props.dog.id)

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
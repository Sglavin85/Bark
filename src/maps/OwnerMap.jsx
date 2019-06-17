import React, { Component } from 'react';
import L from 'leaflet';
import './map.css'
import { Row, Col, Button } from 'antd'
import API from '../modules/API'

export default class Map extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lat: this.props.lat,
            long: this.props.long,
            userFence: [],
            activeMarker: [],
            isActiveCalculating: true
        }
        this.fenceRender = L.polygon(this.state.userFence, { lineCap: 'circle', color: '#324759', fillRule: "nonzero", })
    }




    // goToCurrentLocation = () => {
    //     if (!this.map) return;

    // navigator.geolocation.getCurrentPosition(pos => {
    //     const lat = pos.coords.latitude;
    //     const lon = pos.coords.longitude;

    //     this.map.setView([lat, lon], 14);

    // add a marker to my location
    //     L.marker([lat, lon])
    //         .bindPopup('This is your current <strong>Location</strong>')
    //         .addTo(this.map);
    // }, err => {
    //     console.log(err);
    // });

    // draw a polyline
    // L.polyline([
    //     [36.13427, -86.759205],
    //     [36.130111, -86.754999],
    //     [36.125431, -86.752424]
    // ]).addTo(this.map);
    // }

    componentDidMount() {
        // create map
        this.map = L.map('map', { drawControl: true })
            .setView([this.props.lat, this.props.long], 15)
        // add tiles to map
        L.tileLayer("https://api.mapbox.com/styles/v1/sglavin85/cjwwh144ha2rx1cnz8qgmjfe6/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2dsYXZpbjg1IiwiYSI6ImNqd3dhdWh1OTBldWg0OWxna2VuZmVxMDIifQ.ME2N9N5umfgKgVu7vnC2cQ", {
            maxZoom: 18,
            id: 'mapbox.streets'
        }).addTo(this.map);

        const handleMarkerDrag = (e) => {
            const startLoc = [...this.state.activeMarker]
            const fenceArray = [...this.state.userFence]

            const index = fenceArray.findIndex((item) => {
                return item[0] === startLoc[0] && item[1] === startLoc[1]
            })
            if (index !== -1) {
                fenceArray[index] = e.target._latlng
                this.setState({ userFence: fenceArray }, () => {
                    this.fenceRender.remove()
                    this.fenceRender = L.polygon(this.state.userFence, { lineCap: 'circle', color: '#324759', fillRule: "nonzero", })
                    this.fenceRender.addTo(this.map)
                })
            }
        }

        const changeActiveDragMarker = (e) => {

            const latLng = Object.values(e.target._latlng)
            this.setState({ activeMarker: latLng })
        }

        this.fenceRender.addTo(this.map)

        this.map.on('click', event => {

            const latLng = Object.values(event.latlng)
            const marker = L.marker(latLng, { draggable: true }).addTo(this.map)
            marker.on('dragstart', changeActiveDragMarker)
            marker.on('dragend', handleMarkerDrag)
            const fence = [...this.state.userFence, latLng]
            this.setState({ userFence: fence })
            this.fenceRender.setLatLngs(this.state.userFence)
        })
    }

    handleUndo = () => {
        let fenceArray = [...this.state.userFence]
        fenceArray.pop()
        this.setState({ userFence: fenceArray }, () => {
            this.fenceRender.remove()
            this.fenceRender = L.polygon(this.state.userFence, { lineCap: 'circle', color: '#324759', fillRule: "nonzero", })
            this.fenceRender.addTo(this.map)
        })
    }

    handleSave = () => {
        debugger
        let fenceArray = [...this.state.userFence]
        const fenceObj = {
            userId: this.props.user.uid,
            fence: fenceArray
        }
        console.log(fenceObj)
        API.postOwnerFence(fenceObj)
    }

    render() {
        return (
            <>
                <Row type="flex" justify="center">
                    <Col>
                        <h1>Create a fence</h1>
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col>

                        <Button type="primary" onClick={() => this.handleUndo()}>
                            Undo</Button>
                        <Button type="primary" onClick={() => this.handleSave()}>
                            Save</Button>
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
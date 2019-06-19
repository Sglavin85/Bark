import React, { Component } from 'react';
import L from 'leaflet';
import './map.css'
import { Row, Col, Button } from 'antd'
import API from '../modules/API'

const ButtonGroup = Button.Group

export default class Map extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lat: this.props.lat,
            long: this.props.long,
            userFence: this.props.fence[0].fence,
            activeMarker: [],
            isActiveCalculating: true
        }
        this.fenceRender = L.polygon(this.state.userFence, { lineCap: 'circle', color: '#324759', fillRule: "nonzero", })
        this.markers = []
        this.state.userFence.forEach(latLng => {
            const marker = L.marker(latLng, { draggable: true })
            this.markers.push(marker)
        })
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
        console.log(this.markers)


        const handleMarkerDrag = (e) => {

            const fenceArray = [...this.state.userFence]
            // debugger
            const index = fenceArray.findIndex((item) => {
                return item[0] === this.state.activeMarker[0] && item[1] === this.state.activeMarker[1]
            })
            if (index !== -1) {
                const newlatLng = Object.values(e.target._latlng)
                fenceArray[index] = newlatLng
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
            const marker = L.marker(latLng, { draggable: true })
            this.markers.push(marker)
            marker.addTo(this.map)
            marker.on('dragstart', changeActiveDragMarker)
            marker.on('dragend', handleMarkerDrag)
            const fence = [...this.state.userFence, latLng]
            this.setState({ userFence: fence })
            this.fenceRender.setLatLngs(this.state.userFence)
        })

        this.markers.forEach((marker) => {
            marker.on('dragstart', changeActiveDragMarker)
            marker.on('dragend', handleMarkerDrag)
            marker.addTo(this.map)
        })
    }


    handleUndo = () => {
        let fenceArray = [...this.state.userFence]
        fenceArray.pop()
        let lastMarker = this.markers.pop()
        lastMarker.remove()
        this.setState({ userFence: fenceArray }, () => {
            this.fenceRender.remove()
            this.fenceRender = L.polygon(this.state.userFence, { lineCap: 'circle', color: '#324759', fillRule: "nonzero", })
            this.fenceRender.addTo(this.map)
        })
    }

    handleClear = () => {
        debugger
        this.markers.forEach(marker => {
            marker.remove()
        })
        this.setState({ userFence: [] }, () => {
            this.fenceRender.remove()
            this.fenceRender = L.polygon(this.state.userFence, { lineCap: 'circle', color: '#324759', fillRule: "nonzero", })
            this.fenceRender.addTo(this.map)
        })

    }

    handleSave = () => {

        let fenceArray = [...this.state.userFence]
        const fenceObj = {
            userId: this.props.user.uid,
            fence: fenceArray
        }
        console.log(fenceObj)
        API.editFence(this.props.fence[0].id, fenceObj)
    }

    render() {
        return (
            <>
                <Row type="flex" justify="center">
                    <Col>
                        <h1>Create a Fence</h1>
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col>
                        <ButtonGroup>
                            <Button type="primary" onClick={() => this.handleSave()}>
                                Save</Button>
                            <Button type="primary" onClick={() => this.handleUndo()}>
                                Undo</Button>
                            <Button type="primary" onClick={() => this.handleClear()}>
                                Clear</Button>
                        </ButtonGroup>
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
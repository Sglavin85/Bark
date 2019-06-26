import React, { Component } from 'react';
import L from 'leaflet';
import './map.css'
import { Row, Col, Button } from 'antd'
import API from '../modules/API'
import keys from '../../keys/Keys'

const ButtonGroup = Button.Group

export default class Map extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lat: this.props.lat,
            long: this.props.long,
            userFence: this.props.fence,
            activeMarker: [],
            isActiveCalculating: true
        }

        //create fence
        this.fenceRender = L.polygon(this.state.userFence, { lineCap: 'circle', color: '#324759', fillRule: "nonzero", })
        //storage for markers
        this.markers = []
        //iterates over the fence to create a marker everytime a new point in the polygon is added
        this.state.userFence.forEach(latLng => {
            const marker = L.marker(latLng, { draggable: true })
            this.markers.push(marker)
        })
    }







    componentDidMount() {
        // create map

        this.map = L.map('map', { drawControl: true })
            .setView([this.props.lat, this.props.long], 17)
        // add tiles to map
        L.tileLayer(keys.mapbox, {
            maxZoom: 18,
            id: 'mapbox.streets'
        }).addTo(this.map);

        //logic to handle the change of the marker location which in turn changes the boundaries of the fence. is fired when the dragging of a marker is completed.

        const handleMarkerDrag = (e) => {

            const fenceArray = [...this.state.userFence]
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

        //stores the active drage marker in the state so that it can be referenced against the previous fence to know which point to update in the fences array. is fired when a user begins to drag a marker

        const changeActiveDragMarker = (e) => {

            const latLng = Object.values(e.target._latlng)
            this.setState({ activeMarker: latLng })
        }

        this.fenceRender.addTo(this.map)

        // on click logic for the map which adds a marker and adds the listeners for that marker for the drag start and drag end also adds the same point to the fence array. 

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

        //if the markers are passed in by props with an existing fence this will add the listeners to the markers that already exist.

        this.markers.forEach((marker) => {
            marker.on('dragstart', changeActiveDragMarker)
            marker.on('dragend', handleMarkerDrag)
            marker.addTo(this.map)
        })
    }

    //takes the last point out of the fence array and deletes it and also removes the associated marker.

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

    //clears the entire fence array and then deletes the fence that is stored in the database.
    handleClear = () => {

        this.markers.forEach(marker => {
            marker.remove()
        })
        this.setState({ userFence: [] }, () => {
            this.fenceRender.remove()
            this.fenceRender = L.polygon(this.state.userFence, { lineCap: 'circle', color: '#324759', fillRule: "nonzero", })
            this.fenceRender.addTo(this.map)
        })
        if (this.props.fence.length > 0) {
            API.deleteFence(this.props.fenceObj[0].id)
        }

    }

    //takes all of the point from the fence array and adds a user id to the obj and pushes that object up to the databse for future reference. If a fence existed prior to visiting this page and was passed in through props then it edits the existing fence rather than posting new fence all together.

    handleSave = () => {

        if (this.props.fence.length > 0) {

            let fenceArray = [...this.state.userFence]
            const fenceObj = {
                userId: this.props.user.uid,
                fence: fenceArray
            }
            API.editFence(this.props.fenceObj[0].id, fenceObj)
        } else {

            let fenceArray = [...this.state.userFence]
            const fenceObj = {
                userId: this.props.user.uid,
                fence: fenceArray
            }
            API.postOwnerFence(fenceObj)
        }
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
import React, { Component } from 'react';
import L from 'leaflet';
import '../../maps/map.css'
import { Row, Col } from 'antd'


export default class LiveWatch extends Component {
    constructor(props) {
        super(props)
        console.log(props)
        this.state = {
            walkPath: [],
            currentUser: '',
        }
        this.fenceRender = L.polygon(this.props.fence[0].fence, { lineCap: 'circle', color: '#324759', fillRule: "nonzero", })

        this.pathRender = null

        this.marker = null
    }



    componentDidMount() {
        this.pathRender = L.polyline(this.props.path, { lineCap: 'circle', color: '#05B2DC' })
        this.marker = L.marker(this.props.path[0])
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

        this.marker.addTo(this.map)
        this.fenceRender.addTo(this.map)
        this.map.fitBounds(this.props.fence[0].fence)

    }

    componentDidUpdate(prevProps) {
        if (this.props.path !== prevProps.path) {
            this.pathRender = ''
            this.pathRender = L.polyline(this.props.path, { lineCap: 'circle', color: '#05B2DC' })
            if (this.marker !== null) {
                this.marker.remove()
                this.marker = L.marker(this.props.path.pop())
            }
        }
    }



    render() {
        return (
            <>
                <Row type="flex" justify="center">
                    <Col>
                        <div id="map"></div>
                    </Col>
                </Row>
            </>
        )
    }
}


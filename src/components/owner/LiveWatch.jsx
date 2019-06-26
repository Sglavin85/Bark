import React, { Component } from 'react';
import L from 'leaflet';
import '../../maps/map.css'
import { Row, Col } from 'antd'
import keys from '../../keys/Keys'


export default class LiveWatch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            walkPath: [],
            currentUser: '',
        }
        this.fenceRender = L.polygon(this.props.fence[0].fence, { lineCap: 'circle', color: '#324759', fillRule: "nonzero", })

        this.pathRender = null

        this.marker = null
    }

    //this component is where the user can watch someone walk their dog. the fence is rendered based on the users fence that they made in the application. path and marker are declared in the constructor but not used until mount. this is so that they can be reset with each update. On Mount they path is rendered using the path array that is passed through props. and the marker is places on the last item in that array. then the may is created and centered on the lat long of the users address and then the marker, and the fence are added to the map. finally, the map is set to zoom so that the entire fence is within view of their viewscreen.



    componentDidMount() {
        this.pathRender = L.polyline(this.props.path, { lineCap: 'circle', color: '#05B2DC' })
        this.marker = L.marker(this.props.path[0])
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

        this.marker.addTo(this.map)
        this.fenceRender.addTo(this.map)
        this.map.fitBounds(this.props.fence[0].fence)

    }

    //every time props changes this function will update the path with the new coordinates added to them and the marker will be updated to reflect the current position of the walker.

    componentDidUpdate(prevProps) {
        if (this.props.path !== prevProps.path) {
            this.pathRender = ''
            this.pathRender = L.polyline(this.props.path, { lineCap: 'circle', color: '#05B2DC' })
            this.pathRender.addTo(this.map)
            if (this.marker !== null) {
                this.marker.remove()
                this.marker = L.marker(this.props.path.pop())
                this.marker.addTo(this.map)
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


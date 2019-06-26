import React, { Component } from 'react'
import { Row, Col, Button } from 'antd'
import '../../../maps/map.css'
import L from 'leaflet'
import API from '../../../modules/API'
import WalkerCard from '../../walker/WalkerCard'
import WalkerReviewModal from '../../walker/WalkerReviewModal'

const ButtonGroup = Button.Group


export default class PathModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ownerFence: [],
            lat: '',
            long: '',
            path: this.props.invoice.path,
            isWalkerPage: false,
            reviewModalVis: false

        }
    }

    //this view is what renders to show the details of a walk that has happened but has not yet been resolved. On Mount  we get the walker using ther id that is attached to the invoice and post that next to a map of the route that was walked which is saved as part fo the invoice object. We also get the fence that the owner uses for their dogs using the owners Id which is also attached to the invoice object. then we render the map and display the fence and the path.
    componentDidMount() {
        API.getWalker(this.props.invoice.walkerId)
            .then(walker => this.setState({ walker: walker }, () => { this.setState({ isWalkerReady: true }) }))
        API.getFence(this.props.invoice.ownerId)
            .then(fence => this.setState({ ownerFence: fence }, () => {
                API.getOwner(fence[0].userId)

                    .then(owner => this.setState({ lat: owner.lat, long: owner.long }, () => {
                        // create map
                        this.map = L.map('map')
                            .setView([this.state.lat, this.state.long], 17)
                        // add tiles to map
                        L.tileLayer("https://api.mapbox.com/styles/v1/sglavin85/cjwwh144ha2rx1cnz8qgmjfe6/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2dsYXZpbjg1IiwiYSI6ImNqd3dhdWh1OTBldWg0OWxna2VuZmVxMDIifQ.ME2N9N5umfgKgVu7vnC2cQ", {
                            maxZoom: 18,
                            id: 'mapbox.streets'
                        }).addTo(this.map);
                        const fenceRender = L.polygon(this.state.ownerFence[0].fence, { lineCap: 'circle', color: '#324759', fillRule: "nonzero", })
                        fenceRender.addTo(this.map)
                        const pathRender = L.polyline(this.state.path, { lineCap: 'circle', color: '#256EFF' })
                        pathRender.addTo(this.map)
                    }))
            }))
        API.getWalkerReviews(this.props.invoice.walkerId)
            .then(reviews => {
                const parsedReviews = Object.values(reviews)
                this.setState({ reviews: parsedReviews })
            })
    }

    //pushes the user back to the account page that they came from

    cancel = () => {
        this.props.history.goBack()
    }

    //modal visibility functions for the review modal that the owner can leave for the walker.
    modal = (modal) => {
        const stateToChange = { [modal]: true }
        this.setState(
            stateToChange
        )
    }

    cancelModal = (modal) => {
        const stateToChange = { [modal]: false }
        this.setState(
            stateToChange
        )
    }

    //if a user leaves a review then this will update all of the appropriate records and then update state so that the new review is reflected in their average reviews.

    updateDetails = () => {
        return API.getWalkerReviews(this.state.walker.uid)
            .then(reviews => {
                const reviewsArray = Object.values(reviews)
                this.setState({ reviews: reviewsArray })
            })
            .then(() => {
                API.getWalker(this.state.walker.uid)
                    .then(updatedWalker => this.setState({ walker: updatedWalker })
                    )
            })

    }

    render() {
        return (
            <>

                <Row type="flex" justify="center">
                    <Col>
                        <h1>{this.props.invoice.dogName}'s Walk</h1>
                        <Row type='flex' justify='center'>
                            <Col>
                                <ButtonGroup>
                                    <Button type="primary" onClick={() => this.modal("reviewModalVis")}>Review Walker</Button>

                                    <Button type="primary" onClick={this.cancel}>
                                        Go Back</Button>
                                </ButtonGroup>

                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row type="flex" justify="center">
                    <Col>
                        {this.state.isWalkerReady ? <div className="walkerCard">
                            <WalkerCard walker={this.state.walker} isWalkerPage={this.state.isWalkerPage} />
                        </div> : null
                        }
                    </Col>
                    <Col>
                        <div id="map"></div>
                    </Col>
                </Row>

                {
                    this.state.reviewModalVis ? <WalkerReviewModal
                        vis={this.state.reviewModalVis}
                        cancel={() => this.cancelModal('reviewModalVis')}
                        walker={this.state.walker}
                        update={this.updateDetails}
                        reviews={this.state.reviews}
                    /> : null
                }

            </>
        )
    }
}

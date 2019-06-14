import React, { Component } from 'react'
import { Rate, Row, Col, Button } from 'antd'
import '../walker/details.css'
import { PawIcon } from '../../modules/pawprint'
import API from '../../modules/API'
import Review from '../walker/Review'
import DogReviewModal from './DogReviewModal'


export default class DogDetails extends Component {
    state = {
        reviews: [],
        editModalVis: false,
        reviewModalVis: false,
        dog: {}
    }

    componentDidMount() {

        const thisDog = this.props.match.params.id
        API.getDog(thisDog).then(updatedDog => {
            this.setState({ dog: updatedDog })
        })
        API.getDogReviews(this.props.match.params.id)
            .then(reviews => {
                const parsedReviews = Object.values(reviews)
                this.setState({ reviews: parsedReviews })
            })
    }


    modal = (modal) => {
        const stateToChange = { [modal]: true }
        this.setState(
            stateToChange
        )
    }

    updateWalker = () => {
        var currentDog = this.props.match.params.id
        API.getDog(currentDog).then(updatedDog => {
            this.setState({ dog: updatedDog })
        })

    }

    cancelModal = (modal) => {
        const stateToChange = { [modal]: false }
        this.setState(
            stateToChange
        )
    }

    updateDetails = () => {
        return API.getDogReviews(this.props.match.params.id)
            .then(reviews => {
                const reviewsArray = Object.values(reviews)
                this.setState({ reviews: reviewsArray })
            })
            .then(() => {
                var currentDog = this.props.match.params.id
                API.getDog(currentDog).then(updatedDog => {
                    this.setState({ dog: updatedDog })
                })
            })

    }

    render() {

        const cardImg = { backgroundImage: `url(${this.state.dog.image})` }

        return (
            <>
                <Row type="flex" justify="center" >
                    <Col>
                        <Row type="flex" justify="center" gutter={16}>
                            <Col spand={8}>
                                <div className="dogImg" style={cardImg}></div>
                            </Col>
                            <Col span={8}>
                                <Row type="flex" justify="center" gutter={16}>
                                    <Col>
                                        <h1>{this.state.dog.name}</h1>
                                    </Col>
                                </Row>
                                <Row type="flex" justify="center" gutter={16}>
                                    <Col>
                                        <Rate character={<PawIcon />} allowHalf disabled value={this.state.dog.rating} />
                                    </Col>
                                    <Col>
                                        <p className="ratingCount">{this.state.reviews.length} review(s)</p>
                                    </Col>
                                    <div className="detailsLine"></div>
                                </Row>
                                <Row type="flex">
                                    <Col offset={2}>
                                        {/* <h2>{this.state.owner.city}, {this.state.owner.state}</h2> */}
                                        <h2>{this.state.dog.color} {this.state.dog.breed}</h2>
                                        <h2>Age: {this.state.dog.age} year(s) old</h2>
                                        <Row type="flex">
                                            <Col span={23}>
                                                <h3>Notes: {this.state.dog.notes}</h3>
                                            </Col>
                                        </Row>
                                        <h3>Temperament: {this.state.dog.temperment}</h3>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row type="flex" justify="center" gutter={16}>
                            {!this.props.isUser ?
                                (
                                    <>
                                        <Col>
                                            <div className="btnPush">
                                                <Button type="primary" onClick={() => this.modal("reviewModalVis")}>Review Dog</Button>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="btnPush">
                                                <Button type="primary" onClick={() => {
                                                    this.props.history.push(`/walkers/dogs/all`)
                                                }}>Go Back</Button>
                                            </div>
                                        </Col>
                                    </>
                                ) : (
                                    <Col>
                                        <div className="btnPush">
                                            <Button type="primary" onClick={() => this.modal("editModalVis")}>Edit Profile</Button>
                                        </div>
                                    </Col>)}
                        </Row>
                        <div className="hr"></div>
                        <Row type="flex" justify="center">
                            <Col>
                                <Row type="flex" justify='start'>
                                    <Col>
                                        <h1>Reviews</h1>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {!!this.state.reviews ? (
                                            this.state.reviews.map((review) => (
                                                <Review
                                                    {...this.props}
                                                    review={review}
                                                    key={review.id}
                                                />
                                            ))) : null}
                                    </Col>
                                </Row>

                            </Col>
                        </Row>
                    </Col>
                </Row>


                {
                    this.state.reviewModalVis ? <DogReviewModal
                        vis={this.state.reviewModalVis}
                        cancel={() => this.cancelModal('reviewModalVis')}
                        dog={this.state.dog}
                        update={this.updateDetails}
                        reviews={this.state.reviews}
                    /> : null
                }
            </>
        )
    }
}



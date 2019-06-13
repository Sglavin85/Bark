import React, { Component } from 'react'
import { Rate, Row, Col, Button } from 'antd'
import './details.css'
import { PawIcon } from '../../modules/pawprint'
import API from '../../modules/API'
import Review from './Review'
import EditProfileModal from './EditProfileModal'


export default class WalkerDetails extends Component {
    state = {
        reviews: [],
        editModalVis: false,
        reviewModalVis: false,
        isUser: false
    }

    componentDidMount() {
        API.getWalkerReviews(this.props.match.params.uid)
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
        var currentUser = JSON.parse(sessionStorage.getItem("user"))
        API.getWalker(currentUser.uid).then(walker => {
            sessionStorage.removeItem("user")
            sessionStorage.setItem("user", JSON.stringify(walker))
        })
            .then(() => this.cancelModal)
    }

    getAge = (DOB) => {
        var today = new Date();
        var birthDate = new Date(DOB);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age = age - 1;
        }

        return age;
    }


    cancelModal = (modal) => {
        const stateToChange = { [modal]: false }
        this.setState(
            stateToChange
        )
    }

    updateDetails = () => {
        const parsedReviews = API.getWalkerReviews(this.props.walker)
            .then(reviews => {
                const reviewsArray = Object.values(reviews)
                return reviewsArray
            })
        Promise.all(parsedReviews)
        this.setState({ reviews: parsedReviews })
    }

    render() {
        return (
            <>
                <Row type="flex" justify="center" >
                    <Col>
                        <Row type="flex" justify="center" gutter={16}>
                            <Col>
                                <img className="detailsImg" src={this.props.walker.image} alt="" />
                            </Col>
                            <Col>
                                <Row type="flex" justify="center" gutter={16}>
                                    <Col>
                                        <h1>{this.props.walker.firstName} {this.props.walker.lastName}</h1>
                                    </Col>
                                </Row>
                                <Row type="flex" justify="center" gutter={16}>
                                    <Col>
                                        <Rate character={<PawIcon />} allowHalf disabled value={this.props.walker.rating} />
                                    </Col>
                                    <Col>
                                        <p className="ratingCount">{this.state.reviews.length} review(s)</p>
                                    </Col>
                                    <div className="detailsLine"></div>
                                </Row>
                                <h2>{this.props.walker.city}, {this.props.walker.state}</h2>
                                <h2>Age: {this.getAge(this.props.walker.birthday)}</h2>
                                <h3>Bio: {this.props.walker.bio}</h3>
                            </Col>
                        </Row>
                        <Row type="flex" justify="center" gutter={16}>
                            {!this.props.isUser ?
                                (
                                    <>
                                        <Col>
                                            <div className="btnPush">
                                                <Button type="primary" onClick={() => this.modal("reviewModalVis")}>Review Walker</Button>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="btnPush">
                                                <Button type="primary" onClick={() => {
                                                    this.props.history.push(`/owners/walkers/all`)
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
                        <Row type="flex" justify='start'>
                            <Col>
                                <h1>Reviews</h1>
                            </Col>
                        </Row>
                        <Row type="flex" justify='start'>
                            {!!this.state.reviews ? (
                                this.state.reviews.map((review) => (
                                    <Review
                                        {...this.props}
                                        review={review}
                                        key={review.id}
                                    />
                                ))) : null}
                        </Row>

                    </Col>
                </Row>




                {
                    this.state.editModalVis ? <EditProfileModal
                        vis={this.state.editModalVis}
                        cancel={() => this.cancelModal("editModalVis")}
                        walker={this.props.walker}
                        update={this.updateDetails}
                    /> : null
                }

                {
                    this.state.reviewModalVis ? <Review
                        vis={this.state.reviewModalVis}
                        cancel={() => this.cancelModal('reviewModalVis')}
                        walker={this.props.walker}
                        update={this.updateDetails}
                        review={this.reviews}
                    /> : null
                }
            </>
        )
    }
}



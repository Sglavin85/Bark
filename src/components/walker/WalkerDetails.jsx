import React, { Component } from 'react'
import { Rate, Row, Col, Button } from 'antd'
import './details.css'
import { PawIcon } from '../../modules/pawprint'
import API from '../../modules/API'
import Review from './Review'
import EditProfileModal from './EditProfileModal'
import WalkerReviewModal from './WalkerReviewModal'


export default class WalkerDetails extends Component {
    state = {
        reviews: [],
        editModalVis: false,
        reviewModalVis: false,
        walker: {}
    }

    //on mount we set the state of the walker to the props that were passed in, if the user is the one looking at these details we will render the option to edit profile and if no we render a dog owner the option review the walker.

    componentDidMount() {
        const user = JSON.parse(sessionStorage.getItem('user'))
        this.setState({ walker: this.props.walker })
        if (!!this.props.isUser) {
            API.getWalkerReviews(user.uid)
                .then(reviews => {
                    const parsedReviews = Object.values(reviews)
                    this.setState({ reviews: parsedReviews })
                })
        } else {
            API.getWalkerReviews(this.props.match.params.uid)
                .then(reviews => {
                    const parsedReviews = Object.values(reviews)
                    this.setState({ reviews: parsedReviews })
                })
        }
    }

    //modal visibility logic

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

    // function to update the user in session storage if the person viewing this page is the user. ensures that changes are seen as soon as submit is clicked

    updateWalker = () => {
        var currentUser = JSON.parse(sessionStorage.getItem("user"))
        API.getWalker(currentUser.uid).then(walker => {
            sessionStorage.removeItem("user")
            sessionStorage.setItem("user", JSON.stringify(walker))
            let updatedUser = JSON.parse(sessionStorage.getItem("user"))
            this.setState({ walker: updatedUser })
        })

    }

    //computes age from the date of birth that is provided by the user on registration

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

    // if a review is made this ensure that the walkers average reviews and number of reviews is updated as soon as the review is submitted

    updateDetails = () => {
        return API.getWalkerReviews(this.props.walker.uid)
            .then(reviews => {
                const reviewsArray = Object.values(reviews)
                this.setState({ reviews: reviewsArray })
            })
            .then(() => {
                API.getWalker(this.props.walker.uid)
                    .then(updatedWalker => this.setState({ walker: updatedWalker })
                    )
            })

    }

    render() {
        const cardImg = { backgroundImage: `url(${this.state.walker.image})` }

        return (
            <>
                <Row type="flex" justify="center" >
                    <Col>
                        <Row type="flex" justify="center" gutter={16}>
                            <Col>
                                <div className="walkerImg" style={cardImg}></div>
                            </Col>
                            <Col>
                                <Row type="flex" justify="center" gutter={16}>
                                    <Col>
                                        <h1>{this.state.walker.firstName} {this.state.walker.lastName}</h1>
                                    </Col>
                                </Row>
                                <Row type="flex" justify="center" gutter={16}>
                                    <Col>
                                        <Rate character={<PawIcon />} allowHalf disabled value={this.state.walker.rating} />
                                    </Col>
                                    <Col>
                                        <p className="ratingCount">{this.state.reviews.length} review(s)</p>
                                    </Col>
                                    <div className="detailsLine"></div>
                                </Row>
                                <h2>{this.state.walker.city}, {this.state.walker.state}</h2>
                                <h2>Age: {this.getAge(this.state.walker.birthday)}</h2>
                                <h3>Bio: {this.state.walker.bio}</h3>
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




                {
                    this.state.editModalVis ? <EditProfileModal
                        vis={this.state.editModalVis}
                        cancel={() => this.cancelModal("editModalVis")}
                        walker={this.props.walker}
                        update={this.updateWalker}
                    /> : null
                }

                {
                    this.state.reviewModalVis ? <WalkerReviewModal
                        vis={this.state.reviewModalVis}
                        cancel={() => this.cancelModal('reviewModalVis')}
                        walker={this.props.walker}
                        update={this.updateDetails}
                        reviews={this.state.reviews}
                    /> : null
                }
            </>
        )
    }
}



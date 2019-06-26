import React, { Component } from 'react'
import { Modal, Row, Col, Button, Rate, Form, Input } from 'antd'
import { PawIcon } from '../../modules/pawprint'
import '../../auth/auth.css'
import API from '../../modules/API'

const { TextArea } = Input;

export default class WalkerReviewCard extends Component {

    state = {
        ownerId: "",
        reviewImg: "",
        ownerFirstName: "",
        ownerLastName: "",
        walkerId: this.props.walker.uid,
        review: "",
        rating: null,
        title: "",
        date: ""
    }

    //on componentDidMount a new date is generated for the review which is automatically addeed to the record for the person that is writting the review. Then all of the appropriate information that is not required as input for the review record is added to state.


    componentDidMount() {
        var currentUser = JSON.parse(sessionStorage.getItem("user"))
        var newDate = new Date().toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit"
        })
        const setState = {
            ownerId: currentUser.uid,
            ownerFirstName: currentUser.firstName,
            ownerLastName: currentUser.lastName,
            reviewImg: currentUser.image,
            date: newDate
        }
        this.setState(setState)

    }

    //function that takes the new rating and gets a new average for the dog and appends the record for the dog.

    newRatingAvg = (userObj) => {
        const reviews = this.props.reviews
        reviews.push(userObj)
        const ratingSum = reviews.reduce((acc, { rating }) => acc + rating, 0)
        const avgRating = ratingSum / reviews.length
        return Math.ceil(avgRating * 2) / 2
    }

    handleFieldChange = (e) => {
        const stateToChange = {};
        stateToChange[e.target.id] = e.target.value;
        this.setState(stateToChange);
    }

    handleSubmit = (obj) => {
        const newAvg = this.newRatingAvg(obj)
        API.addWalkerReview(obj)
            .then(() => {
                API.editWalkerProfile(obj.walkerId, { rating: newAvg })
                    .then(this.props.update)
                    .then(this.props.cancel)
            })
    }

    handleRating = (e) => {
        this.setState({ rating: e })
    }

    render() {
        return (
            <Modal
                visible={this.props.vis}
                width={600}
                mask={true}
                maskClosable={true}
                centered={true}
                onCancel={this.props.cancel}
                footer={[
                    <Row key={1} type="flex" justify="center">
                        <Col>
                            <Button type="primary" onClick={() => this.handleSubmit(this.state)}>
                                Submit</Button>
                            <Button type="secondary" onClick={() => this.props.cancel("editModalVis")}>
                                Cancel</Button>
                        </Col>
                    </Row>

                ]}>

                <Row type="flex" justify="center">

                    <Col span={18}><h1 className="login">Review {this.props.walker.firstName} {this.props.walker.lastName}</h1>
                        <Row type="flex" justify="center">
                            <Col>
                                <h2 className="rating">Rating:</h2>
                            </Col>
                            <Col>
                                <Rate character={<PawIcon />} allowHalf onChange={this.handleRating} />
                            </Col>
                        </Row>
                        <Form className="register-form" layout="vertical" labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} >
                            <Form.Item label="Title: ">
                                <Input id="title" onChange={this.handleFieldChange} />
                            </Form.Item>
                            <Form.Item label="Review: ">
                                <TextArea rows={4} id="review" onChange={this.handleFieldChange} />
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Modal>
        )
    }
}

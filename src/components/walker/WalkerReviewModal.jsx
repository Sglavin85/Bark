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

    handleFieldChange = (e) => {
        const stateToChange = {};
        stateToChange[e.target.id] = e.target.value;
        this.setState(stateToChange);
    }

    handleSubmit = (obj) => {
        API.addWalkerReview(obj)
            .then(this.props.update)
            .then(this.props.cancel)
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
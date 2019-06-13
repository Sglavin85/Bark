import React, { Component } from 'react'
import { Rate, Row, Col } from 'antd'
import './review.css'
import { PawIcon } from '../../modules/pawprint'


export default class Review extends Component {
    render() {
        const cardImg = { backgroundImage: `url(${this.props.review.reviewImg})` }

        return (
            <Row type="flex" justify="start">
                <Col>
                    <div className="imgContainer" style={cardImg}>
                    </div>
                </Col>
                <Col>
                    <Row type="flex" justify="start">
                        <Col>
                            <h2>{this.props.review.ownerFirstName} {this.props.review.ownerLastName}</h2>
                        </Col>
                    </Row>
                    <Row type="flex" justify="start">
                        <Col>
                            <p>{this.props.review.date}</p>
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col>
                            <div className="ratingMover">
                                <Rate character={<PawIcon />} allowHalf disabled value={this.props.review.rating} />
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <Row type="flex" justify="start" >
                        <Col offset={2}>
                            <h2>{this.props.review.title}</h2>
                        </Col>
                    </Row>
                    <Row type="flex" justify="start">
                        <Col offset={2}>
                            <p>{this.props.review.review}</p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}

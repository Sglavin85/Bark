import React, { Component } from 'react'
import { Card, Rate, Row, Col, Button } from 'antd'
import '../dogs/card.css'
import { PawIcon } from '../../modules/pawprint'
import { withRouter } from 'react-router-dom'

class WalkerCard extends Component {

    //for the card to display the walker the entire walker object is passed in as props and all the logic that is computer is to change the date of birth provided by the user into thier current age.

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

    render() {

        return (
            <div className="cardDiv">
                <Card hoverable
                    style={{ width: 400 }}
                    cover={
                        <img src={this.props.walker.image} alt={this.props.walker.firstName} />
                    }
                >
                    <Row type="flex" justify="center">
                        <Col>
                            <Rate character={<PawIcon />} allowHalf disabled defaultValue={this.props.walker.rating} />
                        </Col>
                    </Row>
                    <div className="cardLine"></div>
                    <h2>{this.props.walker.firstName} {this.props.walker.lastName}</h2>
                    <h3>{this.props.walker.city}, {this.props.walker.state}</h3>
                    <h3>Age: {this.getAge(this.props.walker.birthday)}</h3>
                    <p>Bio: {this.props.walker.bio}</p>
                    <Row type="flex" justify="center">
                        <Col>
                            {this.props.isWalkerPage ? <div className="reviewBtn">
                                <Button type="primary" onClick={() => {
                                    this.props.history.push(`/owners/walkers/user/${this.props.walker.uid}`)
                                }}>See Details</Button></div> : null}
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}

export default withRouter(WalkerCard)
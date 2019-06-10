import React, { Component } from 'react'
import { Card, Rate } from 'antd'
import '../dogs/card.css'
import { PawIcon } from '../../modules/pawprint'


export default class DogCard extends Component {

    componentDidMount() {

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


    render() {
        return (
            <div className="cardDiv">
                <Card hoverable
                    style={{ width: 400 }}
                    cover={
                        <img src={this.props.walker.image} alt={this.props.walker.firstName} />
                    }
                >
                    <div className="cardLine"></div>
                    <h2>{this.props.walker.firstName} {this.props.walker.lastName}</h2>
                    <h3>{this.props.walker.city} {this.props.walker.state}</h3>
                    <h3>Age: {this.getAge(this.props.walker.birthday)}</h3>
                    <p>Bio: {this.props.walker.bio}</p>
                    <Rate character={<PawIcon />} allowHalf disabled defaultValue={this.props.walker.rating} />
                </Card>
            </div>
        )
    }
}
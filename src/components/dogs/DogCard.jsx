import React, { Component } from 'react'
import { Card, Icon } from 'antd'
import './card.css'


export default class DogCard extends Component {

    state = {
        dogGender: "man"
    }

    componentDidMount() {
        if (this.props.dog.gender === "female") {
            this.setState({ isMale: "woman" })
        }
    }

    render() {
        return (
            <div className="cardDiv">
                <Card hoverable
                    style={{ width: 400 }}
                    actions={[<Icon theme="filled" type="edit" />, <Icon theme="filled" type="delete" />]}
                    cover={
                        <img src={this.props.dog.image} alt={this.props.dog.name} />
                    }
                >
                    <div className="cardLine"></div>
                    <h2>{this.props.dog.name}: {this.props.dog.age} old</h2>
                    <h3>{this.props.dog.color} {this.props.dog.breed}</h3>
                    <h3><Icon type={this.state.dogGender} /> {this.props.dog.gender}</h3>
                    <h4>Temperment: {this.props.dog.temperment}</h4>
                    <p>Notes: {this.props.dog.notes}</p>
                </Card>
            </div>
        )
    }
}

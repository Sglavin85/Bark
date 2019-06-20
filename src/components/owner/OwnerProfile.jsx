import React, { Component } from 'react'
import { Rate, Row, Col, Button } from 'antd'
import '../walker/details.css'
import { PawIcon } from '../../modules/pawprint'
import API from '../../modules/API'
import EditProfileModal from './EditProfileModal'



export default class WalkerDetails extends Component {

    state = {
        editModalVis: false,
        owner: {}
    }

    componentDidMount() {
        this.setState({ owner: this.props.user })
    }

    modal = (modal) => {
        const stateToChange = { [modal]: true }
        this.setState(
            stateToChange
        )
    }

    updateUser = () => {
        var currentUser = JSON.parse(sessionStorage.getItem("user"))
        API.getOwner(currentUser.uid).then(owner => {
            sessionStorage.removeItem("user")
            sessionStorage.setItem("user", JSON.stringify(owner))
            let updatedUser = JSON.parse(sessionStorage.getItem("user"))
            this.setState({ owner: updatedUser })
        })

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



    render() {
        const cardImg = { backgroundImage: `url(${this.props.user.image})` }

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
                                        <h1>{this.props.user.firstName} {this.props.user.lastName}</h1>
                                    </Col>
                                </Row>

                                <h2>{this.props.user.address}</h2>
                                <h2>{this.props.user.city}, {this.props.user.state}</h2>
                                <h3>Age: {this.getAge(this.props.user.birthday)}</h3>

                            </Col>
                        </Row>
                        <Row type="flex" justify="center" gutter={16}>
                            <Col>
                                <div className="btnPush">
                                    <Button type="primary" onClick={() => this.modal("editModalVis")}>Edit Profile</Button>
                                </div>
                            </Col>
                        </Row>

                    </Col>
                </Row>




                {
                    this.state.editModalVis ? <EditProfileModal
                        vis={this.state.editModalVis}
                        cancel={() => this.cancelModal("editModalVis")}
                        user={this.props.user}
                        update={this.updateUser}
                    /> : null
                }
            </>
        )
    }
}



import React, { Component } from 'react'
import { Row, Col, Button } from 'antd'
import '../walker/details.css'
import API from '../../modules/API'
import EditProfileModal from './EditProfileModal'



export default class WalkerDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: this.props.user,
            isStateSet: false
        }
    }

    state = {
        editModalVis: false,
    }

    //allows a user to see thier current profile and most importantly allows them to edit their profile through the use of a modal.

    componentDidMount() {
        var currentUser = JSON.parse(sessionStorage.getItem("user"))
        this.setState({ user: currentUser }, () => {
            this.setState({ isStateSet: true })
        })


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
    //updates the current user and updates the session storage item to reflect the updated profile. and then once all functions are complete the edit modal is closed which allows the user to see the changes that were made immediately.

    updateUser = () => {

        var currentUser = JSON.parse(sessionStorage.getItem("user"))
        API.getOwner(currentUser.uid).then(owner => {
            sessionStorage.removeItem("user")
            sessionStorage.setItem("user", JSON.stringify(owner))
            let updatedUser = JSON.parse(sessionStorage.getItem("user"))
            this.setState({ user: updatedUser }, () => {
                this.cancelModal('editModalVis')
            })
        })
    }

    //takes the Date of birth provided by the user and subtracts it from todays take which we then use to return the age of the user.

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
        const cardImg = { backgroundImage: `url(${this.state.user.image})` }

        return (
            <>
                {this.state.isStateSet ?

                    <Row type="flex" justify="center" >
                        <Col>
                            <Row type="flex" justify="center" gutter={16}>
                                <Col>
                                    <div className="walkerImg" style={cardImg}></div>
                                </Col>
                                <Col>
                                    <Row type="flex" justify="center" gutter={16}>
                                        <Col>
                                            <h1>{this.state.user.firstName} {this.state.user.lastName}</h1>
                                        </Col>
                                    </Row>

                                    <h2>{this.state.user.address}</h2>
                                    <h2>{this.state.user.city}, {this.state.user.state}</h2>
                                    <h3>Age: {this.getAge(this.state.user.birthday)}</h3>

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

                    : null}



                {
                    this.state.editModalVis ? <EditProfileModal
                        vis={this.state.editModalVis}
                        cancel={() => this.cancelModal("editModalVis")}
                        user={this.state.user}
                        update={this.updateUser}
                    /> : null
                }
            </>
        )
    }
}



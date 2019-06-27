import React, { Component } from 'react'
import API from '../../modules/API'
import { Row, Col, Card, Button } from 'antd'
import DogCard from '../dogs/DogCard'
import logo from '../../images/logo.png'
import './owner.css'
import CreateModal from './CreateModal'
import * as firebase from 'firebase/app';
import 'firebase/storage';

export default class OwnerDogs extends Component {

    state = {
        user: {},
        dogs: [],
        dogPage: true,
        createModalVis: false
    }

    // on mount gets the current user out of session storage and then gets that users dogs from the database. 
    componentDidMount() {
        console.log(this.props.refs)
        var currentUser = JSON.parse(sessionStorage.getItem("user"))
        API.getUserDogs(currentUser).then(userDogs => {
            const dogArray = Object.values(userDogs)
            this.setState({ dogs: dogArray })

        })
        this.setState({ user: currentUser })

    }

    //modal visibility logic

    modal = (modalName) => {
        const stateToChange = { [modalName]: true }
        this.setState(
            stateToChange
        );
    }

    cancelModal = (modalName) => {

        this.setState({
            [modalName]: false
        })
    }

    //create a dog logic that is passed to the create modal/

    handleCreateSubmit = (obj) => {
        const storageRef = firebase.storage().ref('profiles');
        const ref = storageRef.child(`${Date.now()}`);

        ref.put(obj.image)
            .then(data => data.ref.getDownloadURL())
            .then(url => {
                obj.image = url
                API.addUserDog(obj)
                this.updateDogs()
                this.cancelModal("createModalVis")
                this.props.turnOffRefs()
                this.props.turnOnRefs()
            })

        this.setState({
            createModalVis: false
        })
    }

    //an update logic that ensure that any changes to dogs or added dogs are reflected as soon as the submission is made to the database.

    updateDogs = () => {
        var currentUser = JSON.parse(sessionStorage.getItem("user"))
        API.getUserDogs(currentUser).then(userDogs => {
            const dogArray = Object.values(userDogs)
            this.setState({ dogs: dogArray })
        })
    }

    //maps over the array of  dogs and renders a card for each dog.

    makeDogCards = dogs => {
        if (this.state.dogs.length > 0) {
            const dogCards = dogs.map((dog, index) => (
                <Col key={index}>
                    <DogCard
                        turnOffRefs={this.props.turnOffRefs}
                        turnOnRefs={this.props.turnOnRefs}
                        dogPage={this.state.dogPage}
                        dog={dog}
                        key={index}
                        edit={this.editModal}
                        delete={this.deleteModal}
                        uid={this.props.user.uid}
                        update={this.updateDogs}
                    />
                </Col>)

            );
            return dogCards
        }
    }

    render() {

        const cardImg = { backgroundImage: `url(${logo})` }

        const firstName = this.state.user.firstName
        return (
            <>
                <Row type="flex" justify="center">
                    <Col>
                        <h1 className="homeTypeFace">{firstName}'s Dogs</h1>
                        <div className="firstHR"></div>
                        <Row type="flex" justify="center">
                            {this.makeDogCards(this.state.dogs)}
                            <Col>
                                <div className="addCard">
                                    <Card hoverable
                                        style={{ width: 400 }}
                                        cover={
                                            <div className="addCardBackground" style={cardImg}></div>
                                        }

                                    >
                                        <Row type="flex" justify="center">
                                            <Col>
                                                <Button size="large" type="primary" onClick={() => this.modal("createModalVis")}>Add A New Wagger</Button>
                                            </Col>
                                        </Row>
                                    </Card>
                                </div>

                            </Col>
                        </Row>
                    </Col>
                </Row>

                {this.state.createModalVis ? <CreateModal
                    vis={this.state.createModalVis}
                    submit={this.handleCreateSubmit}
                    cancel={this.cancelModal}
                    uid={this.props.user.uid}
                    update={this.updateDogs}
                /> : null}


            </>
        )
    }
}

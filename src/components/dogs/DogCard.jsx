import React, { Component } from 'react'
import { Card, Icon, Modal, Button, Rate, Row, Col } from 'antd'
import EditModal from '../owner/EditModal'
import './card.css'
import API from '../../modules/API';
import { PawIcon } from '../../modules/pawprint'

const confirm = Modal.confirm;

export default class DogCard extends Component {

    state = {
        dogGender: "man",
        editModalVis: false,
        deleteModalVis: false,
    }

    componentDidMount() {

        if (this.props.dog.gender === "female") {
            this.setState({ dogGender: "woman" })
        } else {
            this.setState({ dogGender: "man" })
        }
    }

    modal = (modalName) => {
        // debugger
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


    handleDeleteSubmit = async (id) => {
        await API.deleteUserDog(id)
        this.props.update()
    }

    showDeleteConfirm = () => {
        confirm({
            title: 'Are you sure delete this Wagger?',
            content: 'Deleted Dogs cannot be recovered.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => this.handleDeleteSubmit(this.props.dog.id)
            ,
            onCancel() {
            },
        });
    }



    render() {
        const cardImg = { backgroundImage: `url(${this.props.dog.image})` }
        return (
            <div className="cardDiv">
                <Card hoverable
                    style={{ width: 400 }}
                    actions={this.props.dogPage ? [<Icon theme="filled" type="edit" onClick={() => this.modal("editModalVis")} />, <Icon theme="filled" type="delete" onClick={this.showDeleteConfirm} />] : []}
                    cover={
                        <div className="backgroundImg" style={cardImg}></div>
                    }
                >
                    <Row type="flex" justify="center">
                        <Col>
                            <Rate character={<PawIcon />} allowHalf disabled defaultValue={this.props.dog.rating} />
                        </Col>
                    </Row>
                    <div className="cardLine"></div>
                    <h2>{this.props.dog.name}: {this.props.dog.age} year(s) old</h2>
                    <h3>{this.props.dog.color} {this.props.dog.breed}</h3>
                    <h3><Icon type={this.state.dogGender} /> {this.props.dog.gender}</h3>
                    <h4>Temperament: {this.props.dog.temperment}</h4>
                    <p>Notes: {this.props.dog.notes}</p>
                    <Row type="flex" justify="center">
                        <Col>
                            {this.props.isWalker ? <div className="reviewBtn">
                                <Button type="primary" onClick={() => {
                                    this.props.history.push(`/walkers/dogs/dog/${this.props.dog.id}`)
                                }}>See Details</Button>
                                <Button type="primary" onClick={() => {
                                    this.props.history.push(`/walkers/walks/${this.props.dog.id}`)
                                }}>
                                    Walk {this.props.dog.name}</Button></div> : null}
                        </Col>
                    </Row>
                </Card>

                {this.state.editModalVis ? <EditModal
                    dog={this.props.dog}
                    vis={this.state.editModalVis}
                    cancel={this.cancelModal}
                    uid={this.props.uid}
                    update={this.props.update}
                /> : null}

            </div>
        )
    }
}

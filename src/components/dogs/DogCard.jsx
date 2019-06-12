import React, { Component } from 'react'
import { Card, Icon, Modal } from 'antd'
import EditModal from '../owner/EditModal'
import './card.css'
import API from '../../modules/API';

const confirm = Modal.confirm;

export default class DogCard extends Component {

    state = {
        dogGender: "man",
        editModalVis: false,
        deleteModalVis: false,
    }

    componentDidMount() {
        if (this.props.dog.gender === "female") {
            this.setState({ isMale: "woman" })
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
            onOk() {
                this.handleDeleteSubmit(this.props.dog.id)
            },
            onCancel() {
            },
        });
    }



    render() {
        return (
            <div className="cardDiv">
                <Card hoverable
                    style={{ width: 400 }}
                    actions={this.props.dogPage ? [<Icon theme="filled" type="edit" onClick={() => this.modal("editModalVis")} />, <Icon theme="filled" type="delete" onClick={this.showDeleteConfirm} />] : []}
                    cover={
                        <img src={this.props.dog.image} alt={this.props.dog.name} />
                    }
                >
                    <div className="cardLine"></div>
                    <h2>{this.props.dog.name}: {this.props.dog.age} year(s) old</h2>
                    <h3>{this.props.dog.color} {this.props.dog.breed}</h3>
                    <h3><Icon type={this.state.dogGender} /> {this.props.dog.gender}</h3>
                    <h4>Temperament: {this.props.dog.temperment}</h4>
                    <p>Notes: {this.props.dog.notes}</p>
                </Card>
                {/* 
                {this.state.deleteModalVis ? <DeleteModal
                    vis={this.state.deleteModalVis}
                    cancel={this.cancelModal}
                    uid={this.props.uid}
                    update={this.props.update}
                /> : null} */}

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

import React, { Component } from 'react'
import { Row, Col, Modal, Form, Input, Button, Select } from 'antd'
import '../../auth/auth.css'
import * as firebase from 'firebase/app';
import 'firebase/storage';
import API from '../../modules/API'


const { TextArea } = Input;

const { Option } = Select;

export default class EditModal extends Component {
    state = {
        id: "",
        name: "",
        breed: "",
        age: "",
        color: "",
        temperment: "",
        notes: "",
        gender: "",
    }

    //this allows a dog to be edited after it has already been added. the entire dog object is passed to this component from higher and is then set to state. each input is that set with the value of that corresponding value and then once the editing is complete the entire object is reset on the database.

    componentDidMount = () => {
        this.setState({
            id: this.props.dog.id,
            name: this.props.dog.name,
            breed: this.props.dog.breed,
            age: this.props.dog.age,
            color: this.props.dog.color,
            temperment: this.props.dog.temperment,
            notes: this.props.dog.notes,
            gender: this.props.dog.gender,
            ownerId: this.props.uid

        })
    }

    handleFieldChange = (e) => {
        const stateToChange = {};
        stateToChange[e.target.id] = e.target.value;
        this.setState(stateToChange);
    }

    handleGenderChoice = (evt) => {
        this.setState({ gender: evt })
    }

    //handles the submit and ensures that the new additions are visible to the user immediately after hitting submit, this is done by using async and await which waits for everything to be done before getting the new object and updating the dog at the higher component and then wait for that update to complete before closing the modal.

    handleEditSubmit = async (dogObj) => {

        if (!!this.state.image) {
            const storageRef = firebase.storage().ref('profiles');
            const ref = storageRef.child(`${Date.now()}`);

            await ref.put(dogObj.image)
                .then(data => data.ref.getDownloadURL())
                .then(async (url) => {
                    dogObj.image = url
                    await API.editUserDogs(dogObj.id, dogObj)

                    await this.props.update()
                    this.props.cancel("editModalVis")
                })

        } else {
            await API.editUserDogs(dogObj.id, dogObj)
            await this.props.update()
            this.props.cancel("editModalVis")

        }
    }

    render() {
        return (
            <Modal
                visible={this.props.vis}
                width={600}
                mask={true}
                maskClosable={true}
                centered={true}
                onCancel={() => this.props.cancel("editModalVis")}
                footer={[
                    <Row key={1} type="flex" justify="center">
                        <Col>
                            <Button type="primary" onClick={() => this.handleEditSubmit(this.state)}>
                                Submit</Button>
                            <Button type="secondary" onClick={() => this.props.cancel("editModalVis")}>
                                Cancel</Button>
                        </Col>
                    </Row>

                ]}>
                <Row type="flex" justify="center">
                    <Col> <h1 className="login">Edit A Wagger</h1>
                        <Form className="register-form" layout="vertical" labelCol={{ span: 8 }} wrapperCol={{ span: 20 }} >
                            <Form.Item label="Upload a picture: ">
                                <Input id="picture" type="file" onChange={(e) => this.setState({ image: e.target.files[0] })} />
                            </Form.Item>
                            <Form.Item label="Name: ">
                                <Input value={this.state.name} id="name" onChange={this.handleFieldChange} />
                            </Form.Item>
                            <Form.Item label="Breed: ">
                                <Input value={this.state.breed} id="breed" onChange={this.handleFieldChange} />
                            </Form.Item>
                            <Form.Item label="Gender: ">
                                <Select id="gender" defaultValue={this.state.gender} onChange={this.handleGenderChoice}>
                                    <Option value="male">Male</Option>
                                    <Option value="female">Female</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Age(in years): ">
                                <Input value={this.state.age} id="age" onChange={this.handleFieldChange} />
                            </Form.Item>
                            <Form.Item label="Color: ">
                                <Input value={this.state.color} id="color" onChange={this.handleFieldChange} />
                            </Form.Item>
                            <Form.Item label="Temperament: ">
                                <Input value={this.state.temperment} id="temperment" onChange={this.handleFieldChange} />
                            </Form.Item>
                            <Form.Item label="Tell us about your dog: ">
                                <TextArea value={this.state.notes} rows={4} id="notes" onChange={this.handleFieldChange} />
                            </Form.Item>

                        </Form>
                    </Col>
                </Row>
            </Modal >
        )
    }
}

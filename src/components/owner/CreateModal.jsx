import React, { Component } from 'react'
import { Row, Col, Modal, Form, Input, Button, Select, Upload, message, Icon } from 'antd'
import '../../auth/auth.css'


const { TextArea } = Input;

const { Option } = Select;

export default class CreateModal extends Component {


    constructor(props) {
        super(props)
        this.state = {
            name: "",
            breed: "",
            age: "",
            color: "",
            temperment: "",
            notes: "",
            gender: "",
            image: [],
            ownerId: this.props.uid,
            loading: false
        }
    }

    state = {

    }


    handleFieldChange = (e) => {
        const stateToChange = {};
        stateToChange[e.target.id] = e.target.value;
        this.setState(stateToChange);
    }

    handleGenderChoice = (evt) => {
        this.setState({ gender: evt })
    }

    render() {

        return (
            <Modal
                visible={this.props.vis}
                width={600}
                mask={true}
                maskClosable={true}
                centered={true}
                onCancel={() => this.props.cancel("createModalVis")}
                footer={[
                    <Row key={1} type="flex" justify="center">
                        <Col>
                            <Button type="primary" onClick={() => this.props.submit(this.state)}>
                                Submit</Button>
                            <Button type="secondary" onClick={() => this.props.cancel("createModalVis")}>
                                Cancel</Button>
                        </Col>
                    </Row>

                ]}>
                <Row type="flex" justify="center">
                    <Col> <h1 className="login">Add A Wagger</h1>
                        <Form className="register-form" layout="vertical" labelCol={{ span: 8 }} wrapperCol={{ span: 20 }} >
                            <Form.Item label="Upload a picture: ">
                                <Input id="picture" type="file" onChange={(e) => this.setState({ image: e.target.files[0] })} />
                            </Form.Item>

                            <Form.Item label="Name: ">
                                <Input id="name" onChange={this.handleFieldChange} />
                            </Form.Item>
                            <Form.Item label="Breed: ">
                                <Input id="breed" onChange={this.handleFieldChange} />
                            </Form.Item>
                            <Form.Item label="Gender: ">
                                <Select id="gender" defaultValue="male" onChange={this.handleGenderChoice}>
                                    <Option value="male">Male</Option>
                                    <Option value="female">Female</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Age(in years): ">
                                <Input id="age" onChange={this.handleFieldChange} />
                            </Form.Item>
                            <Form.Item label="Color: ">
                                <Input id="color" onChange={this.handleFieldChange} />
                            </Form.Item>
                            <Form.Item label="Temperament: ">
                                <Input id="temperment" onChange={this.handleFieldChange} />
                            </Form.Item>
                            <Form.Item label="Tell us about your dog: ">
                                <TextArea rows={4} id="notes" onChange={this.handleFieldChange} />
                            </Form.Item>

                        </Form>
                    </Col>
                </Row>
            </Modal >
        )
    }
}

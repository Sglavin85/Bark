import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'antd'
import './navbar.css'

export default class OwnerLinks extends Component {
    state = {
        current: 'home',
    };

    handleClick = e => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    };

    render() {
        return (
            <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
                <Menu.Item key="home">
                    <Link className="nav-link" to="/owner-home">Home</Link>
                </Menu.Item>
                <Menu.Item key="myDogs">
                    <Link className="nav-link" to="/owner-dogs">My Dogs</Link>
                </Menu.Item>
                <Menu.Item key="myRoutes">
                    <Link className="nav-link" to="/owner-routes">My Routes</Link>
                </Menu.Item>
                <Menu.Item key="walkers">
                    <Link className="nav-link" to="/walkers">Walkers</Link>
                </Menu.Item>
                <Menu.Item key="account">
                    <Link className="nav-link" to="/owner-account">Account</Link>
                </Menu.Item>
                <Menu.Item key="logout">
                    <Link className="nav-link" to="/auth/login" onClick={this.props.logout}>Logout</Link>
                </Menu.Item>
            </Menu>
        )
    }
}

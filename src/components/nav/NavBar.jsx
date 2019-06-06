import React, { Component } from 'react'
import { Affix } from 'antd'
import logo from '../../images/logo_transparent.png'
import OwnerLinks from './OwnerLinks'
import WalkerLinks from './WalkerLinks'
import './navbar.css'

export default class NavBar extends Component {

    render() {
        return (
            <>
                <Affix >
                    <nav>
                        <div id="topNav">
                            <div id="logoContainer">
                                <img src={logo} alt="logo" id="nav-logo" />
                            </div>
                            {this.props.userLoggedIn ? (<div id="linksContainer">
                                {this.props.userIsOwner ? <OwnerLinks /> : <WalkerLinks />}
                            </div>) : null}
                        </div>
                    </nav>
                </Affix>
            </>
        )
    }
}

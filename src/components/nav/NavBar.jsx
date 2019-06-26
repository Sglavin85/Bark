import React, { Component } from 'react'
import logo from '../../images/logo_transparent.png'
import OwnerLinks from './OwnerLinks'
import WalkerLinks from './WalkerLinks'
import './navbar.css'
import { Button } from 'antd'

export default class NavBar extends Component {

    state = {
        logo: this.props.logo
    }

    componentDidMount() {
        if (this.props.userLoggedIn === true) {
            this.setState({ logo: null })
        }
        console.log(this.props.params)
    }

    render() {
        return (
            <>

                <nav>
                    <div id="topNav">
                        <div id="logoContainer" className='logoLogin'>
                            <img src={logo} alt="logo" className="nav-logo" />
                        </div>
                        {this.props.user ? (<div id="linksContainer">
                            {this.props.userIsOwner ? <OwnerLinks {...this.props} isDogBeingWalked={this.props.isDogBeingWalked} dog={this.props.dogBeingWalked} logout={this.props.logout} /> : <WalkerLinks {...this.props} logout={this.props.logout} />}
                        </div>) : null}
                    </div>
                </nav>
            </>
        )
    }
}

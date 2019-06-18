import React, { Component } from 'react'
import logo from '../../images/logo_transparent.png'
import OwnerLinks from './OwnerLinks'
import WalkerLinks from './WalkerLinks'
import './navbar.css'

export default class NavBar extends Component {

    state = {
        logo: this.props.logo
    }

    componentDidMount() {
        if (this.props.userLoggedIn === true) {
            this.setState({ logo: null })
        }
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
                            {this.props.userIsOwner ? <OwnerLinks logout={this.props.logout} /> : <WalkerLinks logout={this.props.logout} />}
                        </div>) : null}
                    </div>
                </nav>
            </>
        )
    }
}

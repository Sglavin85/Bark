import React, { Component } from 'react'
import { withRouter } from 'react-router'
import NavBar from './components/nav/NavBar'
import Foot from './components/footer/Footer'
import { Layout } from 'antd'
import ViewLogic from './views/ViewLogic'
import { logout } from './auth/userManager'
import { Route } from 'react-router-dom'
import AuthViews from './views/AuthViews';
import WalkerViews from './views/WalkerViews';
import OwnerViews from './views/OwnerViews'



const { Header, Content, Footer } = Layout

class Wag extends Component {


  state = {
    userLoggedIn: false,
    userIsOwner: false,
    user: null
  }

  login = (user, accountType) => {
    this.setState({ userLoggedIn: true, user: user })
    if (accountType === "owners") {
      this.setState({ userIsOwner: true })
      this.props.history.push(`/owners/home`)
    } else {
      this.props.history.push(`/walkers/home`)
    }
  }


  render() {
    return (
      <Layout className="layout">
        <div id="topStrip"></div>
        <Header>
          <NavBar userLoggedIn={this.state.userLoggedIn} userIsOwner={this.state.userIsOwner} />
        </Header>
        <Content>
          <Route path="/auth" render={(props) => {
            return <AuthViews {...props}
              loginState={this.props.loginState}
              login={this.login}
            />
          }}
          />

          <Route path="/owners" render={(props) => {
            return <OwnerViews user={this.state.user} userLoggedIn={this.props.userLoggedIn} />
          }}
          />

          <Route path="/walkers" render={(props) => {
            return <WalkerViews user={this.state.user} userLoggedIn={this.props.userLoggedIn} />
          }}
          />


        </Content>
        <Footer>
          <Foot />
        </Footer>
      </Layout>
    )
  }
}

export default withRouter(Wag)
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import NavBar from './components/nav/NavBar'
import Foot from './components/footer/Footer'
import { Layout } from 'antd'
import ViewLogic from './views/ViewLogic';
import { logout } from './auth/userManager'

const { Header, Content, Footer } = Layout

class Wag extends Component {


  state = {
    userLoggedIn: false,
    userIsOwner: false,
    user: null
  }

  login = (user, accountType) => {
    this.setState({ user: user })
    this.setState({ userLoggedIn: true })
    if (accountType === "owners") {
      this.setState({ userIsOwner: true })
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
          <ViewLogic login={this.login} userLoggedIn={this.state.userLoggedIn} userIsOwner={this.state.userIsOwner} />
        </Content>
        <Footer>
          <Foot />
        </Footer>
      </Layout>
    )
  }
}

export default withRouter(Wag)
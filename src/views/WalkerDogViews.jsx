import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import WalkerDogs from '../components/walker/WalkerDogs'
import DogDetails from '../components/dogs/DogDetails'
import API from '../modules/API'

export default class OwnerWalkerViews extends Component {
    state = {
        dogs: []
    }

    componentDidMount() {
        API.getAllDogs()
            .then(allDogs => {
                const dogArray = Object.values(allDogs)
                this.setState({ dogs: dogArray })
            })
    }



    isAuthenticated = () => sessionStorage.getItem("user") !== null



    render() {
        return (
            <>
                <Route exact path="/walkers/dogs/all" render={(props) => {
                    if (this.isAuthenticated()) {
                        return <WalkerDogs {...props} dog={this.state.dogs} user={this.props.user} />
                    } else {
                        return <Redirect to="/auth/login"
                        />
                    }
                }}
                />
                <Route exact path="/walkers/dogs/dog/:id" render={(props) => {
                    if (this.isAuthenticated()) {
                        let dog = this.state.dogs.find(dog =>
                            dog.id === props.match.params.id
                        )
                        if (!dog) {
                            dog = {
                                age: null,
                                breed: null,
                                color: null,
                                gender: null,
                                id: null,
                                image: null,
                                name: null,
                                notes: null,
                                ownerId: null,
                                rating: null,
                                temperment: null
                            }
                        }
                        return <DogDetails {...props}
                            dog={dog}
                        />
                    } else {
                        return <Redirect to="/auth/login" />
                    }
                }}
                />
            </>
        )
    }
}




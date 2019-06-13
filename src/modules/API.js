import * as firebase from 'firebase/app';
import 'firebase/auth'
const url = 'https://wag-app-d212c.firebaseio.com';

const API = {
    getUserDogs: function (user) {
        return fetch(`${url}/animals.json?orderBy="ownerId"&equalTo="${user.uid}"&print=pretty`
        ).then(response => response.json())
    },
    addUserDog: function (dog) {
        JSON.parse(JSON.stringify(dog))
        var myRef = firebase.database().ref('animals/').push();
        var key = myRef.key;
        dog.id = key
        firebase.database().ref(`animals/${dog.id}`).set(dog)
    },
    editUserDogs: function (dog) {
        JSON.parse(JSON.stringify(dog))
        return firebase.database().ref(`animals/${dog.id}`).update(dog)
    },
    deleteUserDog: function (dogId) {
        return firebase.database().ref(`animals/${dogId}`).remove()
    },
    getWalkers: function () {
        return fetch(`${url}/walkers.json`).then(response => response.json())
    },
    getWalkerReviews: function (walker) {
        return fetch(`${url}/walkerReviews.json?orderBy="walkerId"&equalTo="${walker}"&print=pretty`).then(response => response.json())
    },
    getOwner: function (ownerId) {
        return fetch(`${url}/owners/${ownerId}.json`).then(response => response.json())
    },
    addWalkerReview: function (review) {
        JSON.parse(JSON.stringify(review))
        var myRef = firebase.database().ref('walkerReviews/').push();
        var key = myRef.key;
        review.id = key
        return firebase.database().ref(`walkerReviews/${review.id}`).set(review)
    },
    getAllDogs: function () {
        return fetch(`${url}/animals.json`).then(response => response.json())
    },
    editWalkerProfile: function (walker) {
        JSON.parse(JSON.stringify(walker))
        return firebase.database().ref(`waklers/${walker.uid}`).update(walker)
    },
    getWalker: function (walkerId) {
        return fetch(`${url}/walkers/${walkerId}.json`).then(response => response.json())
    }
}

export default API
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
        firebase.database().ref(`animals/${dog.id}`).update(dog)
    },
    deleteUserDog: function (dogId) {
        firebase.database().ref(`animals/${dogId}`).remove()
    },
    getWalkers: function () {
        return fetch(`${url}/walkers.json`).then(response => response.json())
    }
}

export default API
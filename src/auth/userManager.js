import * as firebase from 'firebase/app';
import 'firebase/auth';

//This file handles all of the authentication and storage functions which allow the user to interact with firebase. For the sake of making it more readable I seperated these functions from the functions which interact with the real time database. The only interactions this file has with the databse is the intial registration for a new user.

const url = 'https://wag-app-d212c.firebaseio.com';

const setUserInSessionStorage = (user, accountType) => {
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('accountType', accountType)
}

//created a new account and passwork with firebase authentication then deletes the password from the OBJ and saves the remaining OBJ to session storage

export const registerUser = (user, accountType) => {
    return registerWithFirebase(user.email, user.password)
        .then(firebaseID => {
            delete user.password
            user.uid = firebaseID
            return saveUserToFirebaseServer(user, accountType)
        })
        .then(newUserFromFireBaseServer => {
            setUserInSessionStorage(newUserFromFireBaseServer, accountType)
            return newUserFromFireBaseServer;
        })
}

//saves new user to the firebase database

export const saveUserToFirebaseServer = (user, accountType) => {
    const userToAdd = user
    delete userToAdd.accountType
    firebase.database().ref(`${accountType}`).child(`${user.uid}`).set(userToAdd);
    setUserInSessionStorage(userToAdd, accountType);
    return userToAdd;
}

// gets a user from the server (for user after registration as the API file was not yet created)

export const getUser = (userId, accountType) => {
    return fetch(`${url}/${accountType}/${userId}.json`)
        .then(res => res.json());
}

//Check with firebase authentication to ensure that a user and password exists and that they match

const loginWithFirebase = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
}

export const login = (email, password, accountType) => {

    return loginWithFirebase(email, password)
        .then(credentials => getUser(credentials.user.uid, accountType))
        .then(user => {
            setUserInSessionStorage(user, accountType);
            return user;
        })
        .catch(function (_error) {
            alert("Username and password did not match")
        })
}

export const getUserFromSessionStorage = () => {
    const user = sessionStorage.getItem('user');

    if (!user) return null;

    return JSON.parse(user);
}

export const logout = () => {
    sessionStorage.removeItem('user');
}

//creates a new instance of firebase authentication using email and password

export const registerWithFirebase = (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(data => {
            return data.user.uid
        })
        .catch(function (_error) {
            alert("There was a problem registering you. Please try again.")

        });
}
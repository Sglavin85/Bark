import * as firebase from 'firebase/app';
import 'firebase/auth'

const url = 'https://wag-app-d212c.firebaseio.com';

const setUserInSessionStorage = (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));
}

export const registerUser = (user, accountType) => {
    return registerWithFirebase(user.email, user.password)
        .then(firebaseID => {
            delete user.password
            user.uid = firebaseID
            return saveUserToFirebaseServer(user, accountType)
        })
        .then(newUserFromFireBaseServer => {
            setUserInSessionStorage(newUserFromFireBaseServer)
            return newUserFromFireBaseServer;
        })
}

export const saveUserToFirebaseServer = (user, accountType) => {
    const userToAdd = user
    delete userToAdd.accountType
    firebase.database().ref(`${accountType}`).child(`${user.uid}`).set(userToAdd);
    setUserInSessionStorage(userToAdd);
    return userToAdd;
}


export const getUser = (userId, accountType) => {
    return fetch(`${url}/${accountType}/${userId}.json`)
        .then(res => res.json());
}

const loginWithFirebase = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
}

export const login = (email, password, accountType) => {

    return loginWithFirebase(email, password)
        .then(credentials => getUser(credentials.user.uid, accountType))
        .then(user => {
            setUserInSessionStorage(user);
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

export const registerWithFirebase = (email, password) => {
    debugger
    return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(data => {
            return data.user.uid
        })
        .catch(function (_error) {
            alert("There was a problem registering you. Please try again.")

        });
}
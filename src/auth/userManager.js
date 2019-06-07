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
    return fetch(`${url}/${accountType}.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userToAdd)
    })
        .then(res => res.json())
        .then(newUser => {
            setUserInSessionStorage(newUser);
            return newUser;
        });
}


export const getUser = (userId, accountType) => {
    return fetch(`${url}/${accountType}/${userId}`)
        .then(res => res.json());
}

const loginWithFirebase = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
}

export const login = (email, password) => {
    return loginWithFirebase(email, password)
        .then(firebaseID => {
            getUser(firebaseID)
                .then(user => {
                    setUserInSessionStorage(user);
                    return user;
                })
                .catch(function (_error) {
                    alert("Username and password did not match")
                })
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
    return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(data => {
            return data.user.uid
        })
        .catch(function (_error) {
            alert("There was a problem registering you. Please try again.")

        });
}
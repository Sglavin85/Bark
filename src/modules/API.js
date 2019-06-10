const url = 'https://wag-app-d212c.firebaseio.com';

const API = {
    getUserDogs: function (user) {
        return fetch(`${url}/animals.json?orderBy="ownerId"&equalTo="${user.uid}"&print=pretty`
        ).then(response => response.json())
    },
    editUserDogs: function (dog) {

    },
    getWalkers: function () {
        return fetch(`${url}/walkers.json`).then(response => response.json())
    }
}

export default API
const key = '7Tm1daAcxGchEAisRlK6zpiVoXG5uYrK'

const mapCalls = {
    getUserAddress: function (user) {
        const address = user.address.replace(' ', '+')
        return fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=${key}&location=${address},${user.city},${user.state},${user.zip}`).then(response => response.json())
    }
}

export default mapCalls
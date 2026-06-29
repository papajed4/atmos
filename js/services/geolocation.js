export function getUserLocation() {

    return new Promise((resolve, reject) => {

        if (!navigator.geolocation) {
            reject('Geolocation is not supported.');
            return;
        }

        navigator.geolocation.getCurrentPosition(

            (position) => {

                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });

            },

            (error) => {

                reject(
                    new Error(
                        'Location permission denied'
                    )
                );

            }

        );

    });

}
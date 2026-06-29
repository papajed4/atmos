export async function getCityName(latitude, longitude) {

    try {

        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );

        const data = await response.json();

        console.log(data);

        return (
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            data.address?.state ||
            data.display_name.split(',')[0] ||
            'Unknown Location'
        );

    } catch (error) {

        console.error('City Error:', error);

        return 'Unknown Location';

    }

}
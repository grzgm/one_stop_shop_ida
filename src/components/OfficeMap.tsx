import { GoogleMap, InfoWindow, MarkerF, useLoadScript } from '@react-google-maps/api';
import { officeInformationData } from '../assets/OfficeInformationData';

const mapStyles = {
    height: '400px',
    width: '100%',
};

interface OfficeMapProps {
    closestOfficeName?: string | undefined;
    switchOffice: (officeName: string) => void;
}

function OfficeMap({closestOfficeName, switchOffice }: OfficeMapProps) {
    const { isLoaded } = useLoadScript({
        // create .env.local file with VITE_GOOGLE_MAPS_API_KEY = "your_google_maps_api_key"
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? import.meta.env.VITE_GOOGLE_MAPS_API_KEY : "",
    });

    const markers = []

    for (let office of Object.values(officeInformationData)) {
        if (closestOfficeName && office.officeName == closestOfficeName) {
            console.log(closestOfficeName)
            markers.push(
                <MarkerF
                    key={office.officeName}
                    position={office.officeInformation.coords}
                    title={office.officeName}
                    onClick={() => switchOffice(office.officeName)}>
                    <InfoWindow position={office.officeInformation.coords}>
                        <div>Closest Office</div>
                    </InfoWindow>
                </MarkerF>)
        }
        else {
            markers.push(
                <MarkerF
                    key={office.officeName}
                    position={office.officeInformation.coords}
                    title={office.officeName}
                    onClick={() => switchOffice(office.officeName)} />)
        }
    }

    if (isLoaded) {
        return (
            <GoogleMap
                mapContainerStyle={mapStyles}
                center={officeInformationData['Utrecht'].officeInformation.coords}
                zoom={7}>
                {markers}
            </GoogleMap>
        );
    }
    return (<h1>Google Maps are loading...</h1>);
}

export default OfficeMap;

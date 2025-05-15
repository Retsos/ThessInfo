import { MapContainer, TileLayer } from 'react-leaflet';
import Styles from './map.module.css';

const map = () => {
    return (
        <>
            <div className={Styles.mapWrapper}>
                <MapContainer
                    center={[40.6401, 22.9444]}
                    zoom={12}
                    style={{ width: '100%', height: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </MapContainer>
            </div>

        </>
    )
}

export default map
import React from 'react'
import { Map as LeafletMap, TileLayer} from "react-leaflet";
import "./Map.css";
import { showDataOnMap } from '../utils/common';

function Map({ countries, dataType, center, zoom }) {
    return (
        <div className="map">

            <LeafletMap center={center} zoom={zoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href='http://osm.org/copyright'>OpeenStreet</a> contributors"
                />
                {showDataOnMap(countries, dataType)}

            </LeafletMap>

        </div>
    )
}

export default Map;

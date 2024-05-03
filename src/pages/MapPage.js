import React, { useEffect } from 'react';
import { useMapbox } from '../hooks/useMapbox';


const initialCenter = {
  lat: 37.8000,
  lng: -122.4700,
  zoom: 13.48,
};

export const MapPage = () => {

  const { coords, setRef, newMarker$, movementMarker$ } = useMapbox(initialCenter);

  useEffect(() => {
    newMarker$.subscribe((marker) => {
      // TODO: Nuevo marcador emitir
    });
  }, [newMarker$]);

  useEffect(() => {
    movementMarker$.subscribe((marker) => {
      // TODO: Nuevo marcador emitir
      console.log(marker);

    });

  }, [movementMarker$]);




  return (
    <>
      <div className='infoCoords'>
        Lng: {coords.lng} | Lat: {coords.lat} | Zoom: {coords.zoom}
      </div>
      <div
        ref={setRef}
        className='mapContainer' />
    </>
  );
};

import React, { useContext, useEffect } from 'react';
import { useMapbox } from '../hooks/useMapbox';
import { SocketContext } from '../context/SocketContext';


const initialCenter = {
  lat: 37.8000,
  lng: -122.4700,
  zoom: 13.48,
};

export const MapPage = () => {

  const { coords, setRef, newMarker$, movementMarker$ } = useMapbox(initialCenter);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    newMarker$.subscribe((marker) => {
      // TODO: Nuevo marcador emitir
      socket.emit("marker-new", marker);
    });
  }, [newMarker$, socket]);

  // Escuchar nuevos marcadores

  useEffect(() => {
    socket.on("marker-new", (marker) => {
      console.log(marker);
    });
  }, [socket]);


  useEffect(() => {
    movementMarker$.subscribe((marker) => {
      // TODO: Nuevo marcador emitir
      // console.log(marker);

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

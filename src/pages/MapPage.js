import React, { useContext, useEffect } from 'react';
import { useMapbox } from '../hooks/useMapbox';
import { SocketContext } from '../context/SocketContext';


const initialCenter = {
  lat: 37.8000,
  lng: -122.4700,
  zoom: 13.48,
};

export const MapPage = () => {

  const { coords, setRef, newMarker$, movementMarker$, addMarker, updatePositionMarker } = useMapbox(initialCenter);
  const { socket } = useContext(SocketContext);

  // Escuchar los marcadores existentes
  useEffect(() => {
    socket.on("markers-active", (markers) => {

      for (const key of Object.keys(markers)) {

        addMarker(markers[key], key);
      }
    });

  }, [socket, addMarker]);

  useEffect(() => {
    newMarker$.subscribe((marker) => {

      socket.emit("marker-new", marker);
    });
  }, [newMarker$, socket]);

  useEffect(() => {
    movementMarker$.subscribe((marker) => {
      socket.emit("marker-update", marker);
    });

  }, [movementMarker$, socket]);

  useEffect(() => {

    socket.on("marker-update", (marker) => {

      updatePositionMarker(marker);

    });
  }, [socket, updatePositionMarker])



  useEffect(() => {
    socket.on("marker-new", (marker) => {

      addMarker(marker, marker.id);
    });
  }, [socket, addMarker]);






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

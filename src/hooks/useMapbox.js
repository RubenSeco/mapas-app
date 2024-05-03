import mapboxgl from 'mapbox-gl';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Subject } from 'rxjs';
import { v4 } from "uuid";

mapboxgl.accessToken = 'pk.eyJ1IjoicnViZW4tc2VjbyIsImEiOiJjbHZsaHNqazUyOHFsMmpudmZ2dzcxY2dsIn0.xrRlIguHCV3ff4uKz82BEQ';


export const useMapbox = (initialCenter) => {

  // Referencia al DIV del mapa
  const mapDiv = useRef();
  const setRef = useCallback((node) => {
    mapDiv.current = node;
  }, []);


  // Referencia a los marcadores
  const markers = useRef({});

  // Observables de Rxjs
  const movementMarker = useRef(new Subject());
  const newMarker = useRef(new Subject());




  const mapa = useRef();
  const [coords, setCoords] = useState(initialCenter);

  const addMarker = useCallback((event) => {
    const { lng, lat } = event.lngLat;
    const marker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(mapa.current)
      .setDraggable(true);
    marker.id = v4();
    markers.current[marker.id] = marker.id;

    // TODO: Si el marcador tiene ID no emitir
    newMarker.current.next({
      id: marker.id,
      lng: lng,
      lat: lat,
    });

    // Escuchar movimientos del marcador
    marker.on("drag", ({ target }) => {
      const { id } = target;
      const { lng, lat } = target.getLngLat();

      // Emitir los cambios del marcador
      movementMarker.current.next({ id, lng, lat });
    });


  }, []);

  useEffect(() => {

    const map = new mapboxgl.Map({
      container: mapDiv.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [initialCenter.lng, initialCenter.lat],
      zoom: initialCenter.zoom
    });

    mapa.current = map;
  }, [initialCenter]);

  useEffect(() => {
    if (mapa.current) {
      mapa.current.on('move', () => {
        const { lng, lat } = mapa.current.getCenter();
        setCoords({
          lng: lng.toFixed(4),
          lat: lat.toFixed(4),
          zoom: mapa.current.getZoom().toFixed(2)
        });
      });
    }
  }, []);

  // Agregar marcadores cuando se hace click en el mapa 
  useEffect(() => {
    if (mapa.current) {
      mapa.current.on('click', addMarker);
    }
  }, [addMarker]);

  return {
    addMarker,
    coords,
    newMarker$: newMarker.current,
    movementMarker$: movementMarker.current,
    setRef,

  };
};
import React from 'react';
import { MapPage } from './pages/MapPage';
import "./index.css";
import { SocketProvider } from './context/SocketContext';

export const MapasApp = () => {
  return (
    <SocketProvider >
      <MapPage />
    </SocketProvider>
  );
};

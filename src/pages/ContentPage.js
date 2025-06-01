import React from 'react';
import FilmData from '../components/FilmData';
import VideoPlayer from '../components/VideoPlayer';
import PaymentPanel from '../components/PaymentPanel';

const ContentPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ flex: 2 }}>
        <FilmData filmId="12345" />
        <VideoPlayer />
        <div>
          <h3>tags</h3>
        </div>
      </div>
      <div style={{ flex: 1, marginLeft: '2rem' }}>
        <PaymentPanel />
      </div>
    </div>
  );
};

export default ContentPage;

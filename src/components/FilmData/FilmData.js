import React, { useState, useEffect, useCallback } from 'react';
import { BASE_URL } from '../../services/api';
import MaintenanceModal from '../MaintenanceModal';

const FilmData = ({ filmId }) => {
  const [filmData, setFilmData] = useState(null);
  const [error, setError] = useState(null);

  const fetchFilmData = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/film`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setFilmData(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    fetchFilmData();
  }, [filmId, fetchFilmData]);

  if (error) {
    return <MaintenanceModal onRetry={fetchFilmData} />;
  }

  if (!filmData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{filmData.title}</h2>
      <p>{filmData.description}</p>
      <p>Release Year: {filmData.year}</p>
      <p>Director: {filmData.director}</p>
    </div>
  );
};
export default FilmData;

import React, { useState, useEffect } from 'react';

const FilmData = ({ filmId }) => {
  const [filmData, setFilmData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFilmData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5001/api/film`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFilmData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFilmData();
  }, [filmId]);

  if (error) {
    return <div>Error: {error}</div>;
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

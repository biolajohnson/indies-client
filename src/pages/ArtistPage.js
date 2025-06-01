import React from 'react';
import { Link, useParams } from 'react-router-dom';

const contents = [
  {
    name: 'Ava Richardson',
    id: '1',
    role: 'Director, Writer',
    bio: 'Ava Richardson is an award-winning filmmaker known for her visually poetic storytelling and strong',
  },
];
const ArtistPage = () => {
  const { name } = useParams();
  return (
    <div>
      <h1>{name}</h1>
      <p>This is the artist page where you can find information about artists.</p>
      <p> view my content</p>
      <div>
        {contents.map((content) => (
          <div key={content.id}>
            <Link to={`/content/${content.id}`}>
              <strong>{content.name}</strong>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistPage;

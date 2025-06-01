import { Link } from 'react-router-dom';

const artists = [
  {
    name: 'Ava Richardson',
    id: '1',
    role: 'Director, Writer',
    bio: 'Ava Richardson is an award-winning filmmaker known for her visually poetic storytelling and strong female leads. With a background in marine biology and visual arts, she crafts narratives that explore the intersection of nature, identity, and belief.',
    birthYear: 1986,
    nationality: 'Canadian',
    website: 'https://www.avarichardsonfilms.com',
    social: {
      instagram: '@ava.richardson',
      twitter: '@ava_directs',
      imdb: 'https://www.imdb.com/name/nm1234567/',
    },
    notableWorks: [
      {
        title: 'Beneath the Horizon',
        year: 2024,
        role: 'Director',
      },
      {
        title: 'Saltwater Dreaming',
        year: 2021,
        role: 'Writer, Director',
      },
      {
        title: 'Fragments of Light',
        year: 2019,
        role: 'Co-Director',
      },
    ],
    awards: [
      {
        name: 'Sundance Special Jury Prize',
        year: 2021,
        work: 'Saltwater Dreaming',
      },
      {
        name: 'TIFF Rising Star',
        year: 2020,
      },
    ],
  },
];

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Indie Client</h1>
      <p>This is the home page of the Indie Client application.</p>
      <p>Here you can find various features and functionalities of the application.</p>
      <p>Explore the content, artists, and more!</p>
      <div>
        <ul>
          {artists.map((a) => {
            return (
              <li key={a.name}>
                <Link to={`/artist/${a.id}`}>
                  <strong>{a.name}</strong>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Home;

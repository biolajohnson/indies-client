import { BASE_URL } from '../../services/api';

function VideoPlayer() {
  return (
    <video width="100%" controls style={{ borderRadius: '8px' }}>
      <source src={`${BASE_URL}/api/video/stream`} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

export default VideoPlayer;

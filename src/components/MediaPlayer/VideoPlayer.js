import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { BASE_URL } from '../../services/api';

/**
 * VideoPlayer — supports both plain MP4 (legacy) and HLS adaptive streams.
 *
 * HLS context (Havaldar & Medioni, "Multimedia Systems"):
 *   The src prop points to a master.m3u8 playlist. hls.js fetches it, reads
 *   the available renditions (720p / 360p), and begins downloading 4-second
 *   .ts segments. It continuously measures download throughput vs. playback
 *   consumption and switches renditions mid-stream — this is adaptive bitrate
 *   rate adaptation in practice. On Safari, HLS is natively supported and
 *   hls.js hands control back to the browser via the canPlayType() check.
 */
function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const fullSrc = src
    ? src.startsWith('http') ? src : `${BASE_URL}${src}`
    : `${BASE_URL}/api/video/stream`;

  const isHls = fullSrc.includes('.m3u8');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (!isHls) {
      video.src = fullSrc;
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(fullSrc);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari has native HLS support — no hls.js needed.
      video.src = fullSrc;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [fullSrc, isHls]);

  return (
    <video
      ref={videoRef}
      width="100%"
      controls
      style={{ borderRadius: '8px' }}
    />
  );
}

export default VideoPlayer;

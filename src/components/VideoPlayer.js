function VideoPlayer() {
	return (
		<video width="1500" controls>
			<source src="http://127.0.0.1:5000/video/stream" type="video/mp4" />
			Your browser does not support the video tag.
		</video>
	);
}

export default VideoPlayer;

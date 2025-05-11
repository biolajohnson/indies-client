import "./App.css";
import VideoPlayer from "./components/VideoPlayer";
import PaymentPanel from "./components/PaymentPanel";

function App() {
	return (
		<div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
			<div style={{ flex: 2 }}>
				<h2>Film title</h2>
				<p>film description</p>
				<VideoPlayer />
				<div>
					<h3>tags</h3>
				</div>
			</div>
			<div style={{ flex: 1, marginLeft: "2rem" }}>
				<PaymentPanel />
			</div>
		</div>
	);
}

export default App;

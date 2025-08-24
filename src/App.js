import './App.css';

function App() {
  return (
    <div className="App">
      <div className="coming-soon-container">
        <img src={process.env.PUBLIC_URL + "/bm-soon.jpg"} className="coming-soon-image" alt="Coming Soon" />
        <h1 className="coming-soon-text">Coming Soon</h1>
      </div>
    </div>
  );
}

export default App;

import { useState } from 'react';
import { Art } from './components/Art';
import { Photography } from './components/Photography';
import { Updates } from './components/Updates';
import { Work } from './components/Work';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');

  const renderContent = () => {
    switch (currentScreen) {
      case 'screen-one':
        return <Art />;
      case 'screen-two':
        return <Photography />;
      case 'screen-three':
        return <Updates />;
      case 'screen-four':
        return <Work />;
      default:
        return (
          <div className="center-box">
            <button className="nav-button" onClick={() => setCurrentScreen('screen-one')}>
              Art
            </button>
            <button className="nav-button" onClick={() => setCurrentScreen('screen-two')}>
              Photography
            </button>
            <button className="nav-button" onClick={() => setCurrentScreen('screen-three')}>
              Updates
            </button>
            <button className="nav-button" onClick={() => setCurrentScreen('screen-four')}>
              Work
            </button>
          </div>
        );
    }
  };

  return (
    <div className="App">
      <button className="home-button" onClick={() => setCurrentScreen('home')}>
        <img src={process.env.PUBLIC_URL + '/home-icon.jpg?v=2'} alt="Home" className="home-icon" />
      </button>

      <div className="content">{renderContent()}</div>
    </div>
  );
}

export default App;

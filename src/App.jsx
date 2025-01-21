import React from 'react';
import ReactDOM from 'react-dom';

import Header from './Header.jsx';
import ActivityFeed from './pages/ActivityFeed.jsx';
import ActivityDetails from './pages/ActivityDetails.jsx';
import Archive from './pages/Archive.jsx';

const App = () => {
  return (
    <div className='container'>
      <Header/>
      <ActivityFeed />
      <ActivityDetails />
      <Archive/>
      <div className="container-view">Some activities should be here</div>
    </div>
  );
};

ReactDOM.render(<App/>, document.getElementById('app'));

export default App;

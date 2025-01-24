import React from "react";
import ReactDOM from "react-dom";
import Header from "./Header.jsx";
import ActivityFeed from "./component/ActivityFeed.jsx";

const App = () => {
  return (
    <div className="container">
      <Header />
      <ActivityFeed />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

export default App;

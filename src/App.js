import React from "react";
import SearchUserForm from "./components/SearchUserForm";
import SearchRepoForm from "./components/SearchRepoForm";

function App() {
  return (
    <div className="App">
      <div className="container">
        <SearchUserForm />
        <SearchRepoForm />
      </div>
    </div>
  );
}

export default App;

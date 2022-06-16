import { useCallback, useRef, useState } from "react";
import { octokit } from "./../utils";

const SearchRepoForm = () => {
  const inputRef = useRef();
  const [repos, setRepos] = useState([]);

  const handleClickSearch = useCallback(() => {
    const searchText = inputRef.current.value;

    octokit
      .request(
        `GET /search/repositories?q=${searchText}+language:javascript&sort=stars&order=desc`
      )
      .then((res) => setRepos(res.data.items))
      .catch((error) => console.log(error));
  }, []);
  return (
    <div className="search-form">
      <h3>Search repositories by a text</h3>
      <input type="text" ref={inputRef} placeholder="react" />
      <button onClick={() => handleClickSearch()}>Search</button>

      {repos && repos.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Url</th>
              <th>Language</th>
              <th>Owner</th>
              <th>Starts</th>
            </tr>
          </thead>
          <tbody>
            {repos.map((repo) => (
              <tr key={repo.id}>
                <td>
                  <a href={repo.html_url} target="_blank" rel="noreferrer">
                    {repo.html_url}
                  </a>
                </td>
                <td>{repo.language}</td>
                <td>{repo.name}</td>
                <td>{repo.stargazers_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SearchRepoForm;

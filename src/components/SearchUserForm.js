import { useCallback, useRef, useState } from "react";
import { octokit } from "./../utils";

const SearchUserForm = () => {
  const inputRef = useRef();
  const [contributions, setContributions] = useState([]);

  const handleSearchRepo = useCallback(() => {
    const [username, repo] = inputRef.current.value.split("/");

    octokit
      .request("GET /repos/{owner}/{repo}/contributors", {
        owner: username,
        repo: repo,
      })
      .then((res) => setContributions(res.data))
      .catch((error) => console.log(error));
  }, []);
  return (
    <div className="contribution-form">
      <h3>Search users of a specific repository</h3>
      <span>https://github.com/</span>
      <input
        type="text"
        ref={inputRef}
        required
        placeholder="joseprest/next.js-shift"
      />
      <button onClick={() => handleSearchRepo()}>Search</button>

      {contributions && contributions.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Type</th>
              <th>Contributions</th>
              <th>View on Github</th>
            </tr>
          </thead>
          <tbody>
            {contributions.map((user) => (
              <tr key={user.id}>
                <td>{`https://github.com/${user.login}`}</td>
                <td>{user.type}</td>
                <td>{user.contributions}</td>
                <td>
                  <a href={user.html_url} target="_blank" rel="noreferrer">
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SearchUserForm;

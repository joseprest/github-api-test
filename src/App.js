import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { octokit } from "./utils/octokit";

const schema = yup.object().shape({
  repoLink: yup.string().required(),
  searchText: yup.string().max(32).required(),
});
// import useGithub from "./hooks/useGithub";

function App() {
  // const { contributions } = useGithub("plugins");
  const [contributions, setContributions] = useState([]);
  const [repos, setRepos] = useState([]);
  const inputRef = useRef();
  const inputRepoRef = useRef();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmitHandler = (data) => {
    console.log({ data });
    reset();
  };
  // useEffect(() => {
  //   if (contributions && contributions.length > 0) {
  //     contributions.sort((a, b) =>
  //       a.contributions > b.contributions ? -1 : 1
  //     );
  //     console.log(contributions);
  //   }
  // }, [contributions]);

  const handleSearchRepo = useCallback(() => {
    const [username, repo] = inputRepoRef.current.value.split("/");

    octokit
      .request("GET /repos/{owner}/{repo}/contributors", {
        owner: username,
        repo: repo,
      })
      .then((res) => setContributions(res.data))
      .catch((error) => console.log(error));
  }, []);

  const handleClickSearch = () => {
    const searchText = inputRef.current.value;

    octokit
      .request(
        `GET /search/repositories?q=${searchText}+language:react&sort=stars&order=desc`
      )
      .then((res) => setRepos(res.data.items))
      .catch((error) => console.log(error));
  };
  return (
    <div className="App">
      <div className="container">
        <div className="contribution-form">
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <h3>Search users of a specific repository</h3>
            <span>https://github.com/</span>
            <input
              type="text"
              required
              ref={inputRepoRef}
              {...register("repoLink")}
              placeholder="joseprest/next.js-shift"
            />
            <p>{errors.email?.message}</p>
            <button onClick={() => handleSearchRepo()}>Search</button>
          </form>

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
      </div>
    </div>
  );
}

export default App;

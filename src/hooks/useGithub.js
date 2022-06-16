import { useEffect, useState } from "react";
import { octokit } from "../utils/octokit";
// eslint-disable-line
export default function useGithub(username, repo) {
  const [contributions, setContributions] = useState();
  useEffect(() => {
    const initLoad = () => {
      octokit
        .request("GET /repos/{owner}/{repo}/contributors", {
          owner: username,
          repo: repo,
        })
        .then((res) => setContributions(res.data))
        .catch((error) => console.log(error));
    };

    if (username && repo) {
      initLoad();
    }
  }, [username, repo]);

  return { contributions };
}

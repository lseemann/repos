const ACCESS_TOKEN = 'e238e21411d9c2185ca180b2c31cbe32f5e7ac23';

class Repo {
  constructor(config) {
    this.name = config.name;
    this.slug = config.slug;
    this.owner = config.owner;
    this.repo = config.repo;
    this.commit_log = [];
    this.data = {
      commits_year       : {name: 'Commits in the past year'              , value: 0},
      commits_six_months : {name: 'Commits the past 6 months'             , value: 0},
      commits_four_weeks : {name: 'Commits the past 4 weeks'              , value: 0},
      forks              : {name: 'Number of forks    '                   , value: 0},
      closed_issues      : {name: 'Issues closed in past 6 months'        , value: 0}
    }
  }

  updateData(callback) {
    Repo.getCommits(this.owner, this.repo)
      .then((json) => {
          this.commit_log = json;
          this.data.commits_year.value       = Repo.sumLastNMembers(json, 52);
          this.data.commits_six_months.value = Repo.sumLastNMembers(json, 26);
          this.data.commits_four_weeks.value = Repo.sumLastNMembers(json, 4);
      })
      .then(() => Repo.getForkCount(this.owner, this.repo))
        .then(json => {this.data.forks.value = json.forks_count})
      .then(() => Repo.getRecentlyClosedIssues(this.owner, this.repo))
        .then(json => this.data.closed_issues.value = json.total_count)
      .then(() => {if (typeof callback === 'function') callback()})
  }

  static getCommits(owner, repo) {
    return new Promise((resolve, reject) => {
      let endpoint = `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity?access_token=${ACCESS_TOKEN}`;
      fetch(endpoint)
        .then(response => {
          if (response.status !== 200) {
            reject(Error(response.statusText))
          }
          else {
            resolve(response.json())
          }
        })
    })
  }

  static getForkCount(owner, repo) {
    return new Promise((resolve, reject) => {
      let endpoint = `https://api.github.com/repos/${owner}/${repo}?access_token=${ACCESS_TOKEN}`;
      fetch(endpoint)
        .then(response => {
          if (response.status !== 200) {
            reject(Error(response.statusText))
          }
          else {
            resolve(response.json())
          }
        })
    })
  }

  static getRecentlyClosedIssues(owner, repo) {
    return new Promise((resolve, reject) => {
      let d = new Date();
      d.setMonth(d.getMonth() - 6);

      // Issues that have been closed in the past six months
      let endpoint  = `https://api.github.com/search/issues?q=repo:${owner}/${repo}+state:closed`;
          endpoint += `+closed:<${d.getFullYear()}-${d.getMonth() < 10 ? '0' + d.getMonth() : d.getMonth()}`;
          endpoint += `-${d.getDate() < 10 ? '0' + d.getDate() : d.getDate()}&access_token=${ACCESS_TOKEN}`;

      fetch(endpoint)
        .then(response => {
          if (response.status !== 200) {
            reject(Error(response.statusText))
          }
          else {
            resolve(response.json())
          }
        })
    })
  }

  static sumLastNMembers(json, n) {
    let commits = 0;
    for (var i = json.length - 1; i >= json.length - n; i--) {
      commits += json[i].total;
    };
    return commits

  }

} // End Repo class

export { Repo };
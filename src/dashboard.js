class Dashboard {
  constructor(config) {
    this.element = document.getElementById(config.id);
    this.repos = [];
  }

  addRepo(repo) {
    this.repos.push(repo)
  }

  createElements() {
    // For each repo, create a few elements in the DOM
    this.repos.forEach(repo => {
      let output = '';

      output += '<div class="repo">';
      output += `<h2>${repo.name}</h2>`;

      for (let key in repo.data) {
        output += `<div class="datum-outer" id="${repo.slug}-${key}-outer">`;
        output += `<div class="datum" id="${repo.slug}-${key}-datum">${repo.data[key].value}</div>`;
        output += `<div class="label">${repo.data[key].name}</div>`;
        output += '</div>';
      }
      output += '<h3>Weekly commit activity over the past year</h3>'
      output += `<svg class="commit-chart" id="${repo.slug}-commit-chart"></svg>`;
      output += '</div>'

      this.element.innerHTML += output;
    })

    // For each data point that we're tracking, create an element where we can later rank the repos
    let keys = Object.keys(this.repos[0].data),
        output = '';

    keys.forEach(key => {
      output += `<div class="ranking-table" id="${key}-ranked"></div>`;
    })
    this.element.innerHTML += output;
  }

  // Things that should be done every time there is new data.
  refresh() {
    Dashboard.updateElements(this.repos);
    Dashboard.drawCommitCharts(this.repos);
    Dashboard.rankRepos(this.element, this.repos);
  }

  // Tell each repo object to update its data, and send refresh as a callback
  // so that the dashboard is redrawn as soon as the data is retrieved
  updateRepoData() {
    Dashboard.clearClass('datum-updated');
    this.repos.forEach(repo => repo.updateData(this.refresh.bind(this)));
  }

  // Flow in the latest data to each repo’s panel in the dashboard.
  // If a data point has changed, give it a class that will make its background flash
  static updateElements(repos) {
    repos.forEach(repo => {
      for (let key in repo.data) {
        let element = document.getElementById(`${repo.slug}-${key}-datum`);
        if (repo.data[key].value != undefined) {
          if (element.innerHTML != Dashboard.intcomma(repo.data[key].value)) {
            element.innerHTML = Dashboard.intcomma(repo.data[key].value);
            element.classList.add('datum-updated');
          }
        }
      }
    })
  }

  // Draw a d3 bar chart showing the past year’s commit activity
  static drawCommitCharts(repos) {
    let max_week = 0;
    repos.forEach(repo => {
      let this_max = Math.max.apply(Math,repo.commit_log.map(function(o){return o.total;}));
      max_week = this_max > max_week ? this_max : max_week;
    })

    repos.forEach(repo => {
      let chart_el    = d3.select(`#${repo.slug}-commit-chart`),
          margin_left = 30,
          width       = parseInt(chart_el.style('width').replace('px','')) - margin_left,
          height      = parseInt(chart_el.style('height').replace('px','')),
          bar_width   = width / repo.commit_log.length ;

      let x = d3.scale.linear()
        .domain([0,repo.commit_log.length])
        .range([margin_left, width+margin_left])

      let y = d3.scale.linear()
        .domain([0, max_week])
        .range([height, 0]);

      let yAxis = d3.svg.axis()
        .orient("left")
        .scale(y)
        .ticks(4);

      chart_el.append('line')
        .attr('x1', x(0))
        .attr('x2', x(52))
        .attr('y1', y(0))
        .attr('y2', y(0))
        .attr('stroke','#aaa')

      // draw y axis with labels and move in from the size by the amount of padding
      chart_el.append("g")
        .attr("class", "axis")
          .attr("transform", "translate(30,0)")
          .call(yAxis);

      chart_el.selectAll(".bar")
        .data(repo.commit_log)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", (d,i) => x(i) )
        .attr("y", (d) => y(d.total) )
        .attr("height", (d) => height - y(d.total) )
        .attr("width", bar_width);
      })
    }

  static rankRepos(element, repos) {
    Dashboard.clearClass('highest');

    // These keys correspond to the data points available for each repo
    let keys = Object.keys(repos[0].data);

    keys.forEach(key => {
      // 1. Sort the repos by each key
      repos.sort(function(a, b) {
          return parseFloat(b.data[key].value) - parseFloat(a.data[key].value);
      });

      // 2. Add a “highest” class to the repo that leads for this data point
      let highest = repos[0],
          highest_el = document.getElementById(`${repos[0].slug}-${key}-outer`)
      highest_el.classList.add('highest')

      // 3. Draw a primitive bar chart ranking the repos from highest to lowest
      let output = `<h2>${repos[0].data[key].name}</h2>`,
          element = document.getElementById(`${key}-ranked`);

      repos.forEach((repo, index) => {
        let bar_width = repo.data[key].value / repos[0].data[key].value * 100;
        output += `<div class="ranking-row ${index === 0 ? 'ranking-top' : ''}">`;
        output += `<div class="ranking-name">${index + 1}. ${repo.name}</div>`;
        output += `<div class="ranking-datum">${Dashboard.intcomma(repo.data[key].value)}</div>`;
        output += '<div class="ranking-bar-outer">';
        output += `<div class="ranking-bar" style="width: ${bar_width}%;"></div>`;
        output += '</div>';
        output += '</div>';
      })

      element.innerHTML = output;
    })
  }

  // Helper function to remove all instances of a classname
  static clearClass(classname) {
    let elements = document.getElementsByClassName(classname);
    for (var i = elements.length - 1; i >= 0; i--) {
      elements[i].classList.remove(classname)
    };
  }

  // Helper function to humanize numbers
  static intcomma(value) {
    var origValue = String(value);
    var newValue = origValue.replace(/^(-?\d+)(\d{3})/, '$1,$2');
    if (origValue == newValue){
      return newValue;
    } else {
      return Dashboard.intcomma(newValue);
    }
  };
} // End Dashboard class

export { Dashboard };
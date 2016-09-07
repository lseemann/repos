# Repo Monitor

A dashboard to monitor any number of GitHub respositories.

## Demo

[This demonstration](http://www.seemann.com/luke/repos) monitors four popular frameworks.

### Methodology

We look at three metrics available from the GitHub API.

*Commits over time:* Looking at the past year’s worth of commits helps us understand the development patterns and levels of activity. Activity with Vue, for example, has trailed off considerably in the past few months, while Ember, which is the most active of the frameworks, has become increasingly active. In fact, as of this writing it just logged the busiest week of all the frameworks. (The week before Labor Day. Bust have been a big pre-holiday push.)

*Forks:* This offers a rough gauge of a project’s popularity. We could just as easily monitor stars, but forks indicates a slightly higher degree of interest and involvement. A downside is that the API doesn't appear to offer a historical record of forks or stars. A once-popular project may have been forked many times a long time ago yet fallen into obscurity since. For example, Angular has been forked almost three times as many times as React, but Angular has been around for twice as long. It might be more interesting to know how many times a project has been forked in the past six months.

*Closed issues:* This shows how much the community is participating in a project, but it's also an indicator of how actively the project owners are addressing concerns.

## How it works

The dashboard fetches data from the API on page load, then does so again every 60 seconds. Each time data is fetched from the API, the dashboard is automatically updated with any updates. The data does not change very often, but if it does, the figures will briefly flash orange to bring attention.

## Dependencies

* D3JS for charting
* whatwg-fetch to polyfill fetch

## Author

Luke Seemann
September 6, 2016
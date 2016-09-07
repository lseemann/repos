let d3 = require('d3')

import { Repo } from './repo';
import { Dashboard } from './dashboard';

let dashboard = new Dashboard({id: 'dashboard'});

dashboard.addRepo( new Repo ({
      name  : 'React',
      slug  : 'react',
      owner : 'facebook',
      repo  : 'react'
    }))

dashboard.addRepo( new Repo ({
      name  : 'Angular',
      slug  : 'angular',
      owner : 'angular',
      repo  : 'angular.js'
    }))

dashboard.addRepo( new Repo ({
      name  : 'Ember',
      slug  : 'ember',
      owner : 'emberjs',
      repo  : 'ember.js'
    }))

dashboard.addRepo( new Repo ({
      name  : 'Vue',
      slug  : 'vue',
      owner : 'vuejs',
      repo  : 'vue'
    }))

dashboard.createElements();
dashboard.updateRepoData();

// Updating once a minute should be sufficient and keep us within GitHub rate limits,
// even with a few concurrent users. Would need to adjust if number of frameworks grows.
window.setInterval(() => {dashboard.updateRepoData()}, 60000)
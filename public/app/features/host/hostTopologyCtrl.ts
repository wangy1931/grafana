import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import 'd3.graph';
import { coreModule } from 'app/core/core';

declare var window: any;

export class HostTopologyCtrl {
  heatmap: any;

  constructor (private backendSrv, private $scope) {
    this.init();
  }

  init() {
    var mockdata = [
      {
        "Movie Title": "Avatar",
        "parent": "20th Century Fox",
        "value": "$2,787,965,087",
        "Year": "2009"
      },
      {
          "Movie Title": "Titanic",
          "parent": "20th Century Fox",
          "value": "$2,186,772,302",
          "Year": "1997"
      },
      {
          "Movie Title": "Star Wars: The Force Awakens",
          "parent": "Walt Disney Studios",
          "value": "$2,066,247,462",
          "Year": "2015"
      },
      {
          "Movie Title": "Jurassic World",
          "parent": "Universal Pictures",
          "value": "$1,670,400,637",
          "Year": "2015"
      },
      {
          "Movie Title": "The Avengers",
          "parent": "Walt Disney Studios",
          "value": "$1,519,557,910",
          "Year": "2012"
      },
      {
          "Movie Title": "Furious 7",
          "parent": "Universal Pictures",
          "value": "$1,516,045,911",
          "Year": "2015"
      },
      {
          "Movie Title": "Avengers: Age of Ultron",
          "parent": "Walt Disney Studios",
          "value": "$1,405,413,868",
          "Year": "2015"
      },
      {
          "Movie Title": "Harry Potter and the Deathly Hallows -- Part 2",
          "parent": "Warner Bros. Pictures",
          "value": "$1,341,511,219",
          "Year": "2011"
      },
      {
          "Movie Title": "Frozen",
          "parent": "Walt Disney Studios",
          "value": "$1,287,000,000",
          "Year": "2013"
      },
      {
          "Movie Title": "Iron Man 3",
          "parent": "Walt Disney Studios",
          "value": "$1,215,439,994",
          "Year": "2013"
      },
      {
          "Movie Title": "Minions",
          "parent": "Universal Pictures",
          "value": "$1,159,398,397",
          "Year": "2015"
      },
      {
          "Movie Title": "Transformers: Dark of the Moon",
          "parent": "Paramount Pictures",
          "value": "$1,123,794,079",
          "Year": "2011"
      },
      {
          "Movie Title": "The Lord of the Rings: The Return of the King",
          "parent": "New Line Cinema",
          "value": "$1,119,929,521",
          "Year": "2003"
      },
      {
          "Movie Title": "Skyfall",
          "parent": "Columbia Pictures",
          "value": "$1,108,561,013",
          "Year": "2012"
      },
      {
          "Movie Title": "Transformers: Age of Extinction",
          "parent": "Universal Pictures",
          "value": "$1,104,054,072",
          "Year": "2014"
      },
      {
          "Movie Title": "The Dark Knight Rises",
          "parent": "Warner Bros. Pictures",
          "value": "$1,084,939,099",
          "Year": "2012"
      },
      {
          "Movie Title": "Pirates of the Caribbean: Dead Man's Chest",
          "parent": "Walt Disney Studios",
          "value": "$1,066,179,725",
          "Year": "2006"
      },
      {
          "Movie Title": "Toy Story 3",
          "parent": "Walt Disney Studios",
          "value": "$1,063,171,911",
          "Year": "2010"
      },
      {
          "Movie Title": "Pirates of the Caribbean: On Stranger Ties",
          "parent": "Walt Disney Studios",
          "value": "$1,045,713,802",
          "Year": "2011"
      },
      {
          "Movie Title": "Jurassic Park",
          "parent": "Universal Pictures",
          "value": "$1,029,939,903",
          "Year": "1993"
      },
      {
          "Movie Title": "Star Wars: Episode I -- The Phantom Menace",
          "parent": "20th Century Fox",
          "value": "$1,027,044,677",
          "Year": "1999"
      },
      {
          "Movie Title": "Alice in Wonderland",
          "parent": "Walt Disney Studios",
          "value": "$1,025,467,110",
          "Year": "2010"
      },
      {
          "Movie Title": "The Hobbit: An Unexpected Journey",
          "parent": "Warner Bros. Pictures",
          "value": "$1,021,103,568",
          "Year": "2012"
      },
      {
          "Movie Title": "The Dark Knight",
          "parent": "Warner Bros. Pictures",
          "value": "$1,004,558,444",
          "Year": "2008"
      },
      {
          "Movie Title": "The Lion King",
          "parent": "Walt Disney Studios",
          "value": "$987,483,777",
          "Year": "1994"
      },
      {
          "Movie Title": "Harry Potter and the Philosopher's Stone",
          "parent": "Warner Bros. Pictures",
          "value": "$974,755,371",
          "Year": "2001"
      },
      {
          "Movie Title": "Despicable Me 2",
          "parent": "Universal Pictures",
          "value": "$970,761,885",
          "Year": "2013"
      },
      {
          "Movie Title": "Zootopia",
          "parent": "Walt Disney Studios",
          "value": "$969,831,439",
          "Year": "2016"
      },
      {
          "Movie Title": "Pirates of the Caribbean: At World's End",
          "parent": "Walt Disney Studios",
          "value": "$963,420,425",
          "Year": "2007"
      },
      {
          "Movie Title": "Harry Potter and the Deathly Hallows -- Part 1",
          "parent": "Warner Bros. Pictures",
          "value": "$960,283,305",
          "Year": "2010"
      },
      {
          "Movie Title": "The Hobbit: The Desolation of Smaug",
          "parent": "Warner Bros. Pictures",
          "value": "$958,366,855",
          "Year": "2013"
      }
      ,
      {
          "Movie Title": "The Hobbit: The Battle of the Five Armies",
          "parent": "Warner Bros. Pictures",
          "value": "$956,892,078",
          "Year": "2014"
      },
      {
          "Movie Title": "Captain America: Civil War",
          "parent": "Walt Disney Studios",
          "value": "$940,892,078",
          "Year": "2016"
      },
      {
          "Movie Title": "Harry Potter and the Order of the Phoenix",
          "parent": "Warner Bros. Pictures",
          "value": "$939,885,929",
          "Year": "2007"
      },
      {
          "Movie Title": "Finding Nemo",
          "parent": "Walt Disney Studios",
          "value": "$936,743,261",
          "Year": "2003"
      },
      {
          "Movie Title": "Harry Potter and the Half-Blood Prince",
          "parent": "Warner Bros. Pictures",
          "value": "$934,416,487",
          "Year": "2009"
      },
      {
          "Movie Title": "The Lord of the Rings: The Two Towers",
          "parent": "New Line Cinema",
          "value": "$926,047,111",
          "Year": "2002"
      },
      {
          "Movie Title": "Shrek 2",
          "parent": "Walt Disney Studios",
          "value": "$919,838,758",
          "Year": "2004"
      },
      {
          "Movie Title": "Harry Potter and the Goblet of Fire",
          "parent": "Warner Bros. Pictures",
          "value": "$896,911,078",
          "Year": "2005"
      },
      {
          "Movie Title": "Spider-Man 3",
          "parent": "Columbia Pictures",
          "value": "$890,871,626",
          "Year": "2007"
      },
      {
          "Movie Title": "Ice Age: dawn of the Dinosaurs",
          "parent": "20th Century Fox",
          "value": "$886,686,817",
          "Year": "2009"
      },
      {
          "Movie Title": "Spectre",
          "parent": "Columbia Pictures",
          "value": "$880,674,609",
          "Year": "2015"
      },
      {
          "Movie Title": "Harry Potter and the Chamber of Secrets",
          "parent": "Warner Bros. Pictures",
          "value": "$878,979,634",
          "Year": "2002"
      },
      {
          "Movie Title": "Ice Age: Continental Drift",
          "parent": "20th Century Fox",
          "value": "$877,244,782",
          "Year": "2012"
      },
      {
          "Movie Title": "The Lord of the Rings: The Fellowship of the Rings",
          "parent": "New Line Cinema",
          "value": "$871,530,324",
          "Year": "2001"
      },
      {
          "Movie Title": "Batman v Superman: Dawn of Justice",
          "parent": "Warner Bros. Pictures",
          "value": "$868,814,243",
          "Year": "2016"
      },
      {
          "Movie Title": "The Hunger Games: Catching Fire",
          "parent": "Lionsgate Films",
          "value": "$865,011,746",
          "Year": "2013"
      },
      {
          "Movie Title": "Inside Out",
          "parent": "Walt Disney Studios",
          "value": "$857,427,711",
          "Year": "2015"
      },
      {
          "Movie Title": "Star Wars: Episode III -- Revenge of the Sith",
          "parent": "20th Century Fox",
          "value": "$848,754,768",
          "Year": "2005"
      },
      {
          "Movie Title": "Transformers: Revenge of the Fallen",
          "parent": "Universal Pictures",
          "value": "$836,303,693",
          "Year": "2009"
      }
    ];

    this.heatmap = window.d3.select('#heatmap').relationshipGraph({
      blockSize: 36,
      spacing: 2,
      showTooltip: true,
      maxChildCount: 10,
      showKeys: true,
      thresholds: [ 1000000000, 2000000000, 3000000000 ],
      colors: [ '#3288BD', '#66C2A5', '#ABDDA4', '#E6F598', '#f6faaa', '#FEE08B', '#FDAE61', '#F46D43', '#D53E4F', '#9E0142' ],
    }).data(mockdata);
  }
};

coreModule.controller('HostTopologyCtrl', HostTopologyCtrl);

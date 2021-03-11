//Create an array which stores the data from 'API'
let arr = [];
//Create an array to store the desired data
let arrNew = [];
makeChart();
mapMaker();

//Fetch API data
async function fetchInformation() {
  const response = await fetch("https://api.covid19api.com/summary");
  let myData = await response.json();
  arr.push(myData);

  let nordicCountries = ["Sweden", "Norway", "Denmark", "Finland", "Iceland"];
  for (i = 0; i < nordicCountries.length; i++) {
    let objCountry = {};
    objCountry.Country = nordicCountries[i];
    arrNew.push(objCountry);
  }
  for (i = 0; i < arr[0].Countries.length; i++) {
    for (j = 0; j < nordicCountries.length; j++) {
      if (arr[0].Countries[i].Country == nordicCountries[j]) {
        arrNew[j].Confirmed = arr[0].Countries[i].TotalConfirmed;
        arrNew[j].dailyCases = arr[0].Countries[i].NewConfirmed;
      }
    }
  }
}

//create an interractive map that can show data when we clicked
//Use Mapbox to create the map
async function mapMaker() {
  mapboxgl.accessToken =
    "pk.eyJ1IjoibWlja2V5bHVsdSIsImEiOiJja2dmOGl3bTExMHltMnpudjZ6dnl2dG0zIn0.Hl54Q8Q7Qv5dv4eHITmSEg";

  await fetchInformation();

  var map = new mapboxgl.Map({
    container: "map", // container id
    style: "mapbox://styles/mickeylulu/ckgja5fop14hf19pe8fx4w90p",
    center: [5.012428562445153, 65.5214306163086],
    zoom: 3.1,
    attributionControl: false,
  });
  //Create a popup box
  var popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat([-18.975806269547697, 71.72226495963893])
    .setHTML("<h3><nobr>Country Daily Cases</nobr></h3>")
    .addTo(map);

  map.on("load", function () {
    // Add an image to use as a custom marker
    map.loadImage(
      "images/purple.png",

      function (error, image) {
        if (error) throw error;
        map.addImage("custom-marker", image);
        // Add a GeoJSON source with 3 points.
        map.addSource("points", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {
                  description:
                    "<strong>Sweden<br></strong>" + arrNew[0].dailyCases,
                },
                geometry: {
                  type: "Point",
                  coordinates: [16.684527642743543, 63.43311752611106],
                },
              },
              {
                type: "Feature",
                properties: {
                  description:
                    "<strong>Norway<br></strong>" + arrNew[1].dailyCases,
                },
                geometry: {
                  type: "Point",
                  coordinates: [8.148141078649466, 61.45700879194642],
                },
              },
              {
                type: "Feature",
                properties: {
                  description:
                    "<strong>Denmark<br></strong>" + arrNew[2].dailyCases,
                },
                geometry: {
                  type: "Point",
                  coordinates: [9.251966893115707, 56.20422592022724],
                },
              },
              {
                type: "Feature",
                properties: {
                  description:
                    "<strong>Finland<br></strong>" + arrNew[3].dailyCases,
                },
                geometry: {
                  type: "Point",
                  coordinates: [27.06022141984154, 65.70921166261448],
                },
              },
              {
                type: "Feature",
                properties: {
                  description:
                    "<strong>Iceland<br></strong>" + arrNew[4].dailyCases,
                },
                geometry: {
                  type: "Point",
                  coordinates: [-18.270531065795694, 65.03384859571538],
                },
              },
            ],
          },
        });
        // Add a symbol layer
        map.addLayer({
          id: "symbols",
          type: "symbol",
          source: "points",
          layout: {
            "icon-image": "custom-marker",
            "icon-allow-overlap": true,
            "icon-size": 0.04,
          },
        });
      }
    );

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on("click", "symbols", function (e) {
      var coordinates = e.features[0].geometry.coordinates.slice();
      var description = e.features[0].properties.description;
      var num = e.popup;
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
    });

    // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
    map.on("mouseenter", "symbols", function () {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "symbols", function () {
      map.getCanvas().style.cursor = "";
    });
  });
}

//Generate two line charts, using fetched information
async function makeChart() {
  await fetchInformation();

  //Line chart for the cases of nordic countries
  var ctx = document.getElementById("barChart").getContext("2d");
  var barChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Sweden", "Norway", "Denmark", "Finland", "Iceland"],
      datasets: [
        {
          label: ".",
          data: [
            arrNew[0].Confirmed,
            arrNew[1].Confirmed,
            arrNew[2].Confirmed,
            arrNew[3].Confirmed,
            arrNew[4].Confirmed,
          ],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
          ],
          borderColor: [
            "rgba(255,99,132,1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 3,
        },
      ],
    },
    options: {
      legend: {
        display: false,
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.yLabel;
          },
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: "white",
              beginAtZero: true,
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              fontColor: "white",
            },
            scaleLabel: {
              display: true,
              labelString: "Nordic Countries Total Cases",
              fontSize: 20.0,
              fontColor: "white",
            },
          },
        ],
      },
    },
  });

  //Calculate the todtal cases all over the world
  function totalDataToday() {
    let sum = 0;
    for (i = 0; i < arr[0].Countries.length; i++) {
      sum = sum + arr[0].Countries[i].TotalConfirmed;
    }
    return sum;
  }

  //Line cahrt for the world total cases
  var ctx = document.getElementById("lineChart").getContext("2d");
  var lineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Janurary", "March", "June", "September", "Now"],
      datasets: [
        {
          label: "WorldWideTotal Cases",
          data: [9826, 808965, 10290065, 33777627, totalDataToday()],
          backgroundColor: ["rgba(255, 99, 132, 0.2)"],
          borderColor: ["rgba(255,99,132,1)"],
          pointBorderColor: [
            "rgba(54, 162, 235, 1)",
            "rrgba(54, 162, 235, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(54, 162, 235, 1)",
          ],
          borderWidth: 3,
        },
      ],
    },
    options: {
      legend: {
        labels: {
          fontColor: "white",
          fontSize: 18,
        },
      },
      scales: {
        yAxes: [
          {
            type: "linear",
            ticks: {
              fontColor: "white",
              beginAtZero: true,
              stepsize: 5000,
              min: 5000,
              max: 50000000,
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              fontColor: "white",
            },
          },
        ],
      },
    },
  });
}

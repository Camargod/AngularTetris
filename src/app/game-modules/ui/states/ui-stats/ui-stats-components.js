var gameStats = [
    {
      value: 280,
      color:"#F7464A",
      highlight: "#FF5A5E",
      label: "1 contra 1"
    },
    {
      value: 150,
      color: "#46BFBD",
      highlight: "#5AD3D1",
      label: "1 contra 2"
    },
    {
      value: 100,
      color: "#FDB45C",
      highlight: "#FFC870",
      label: "1 contra 3"
    },
    {
      value: 40,
      color: "#949FB1",
      highlight: "#A8B3C5",
      label: "1 contra 4"
    },
    {
      value: 20,
      color: "#4D5360",
      highlight: "#616774",
      label: "1 contra 5"
    }
  ];

  var ctx = document.getElementById("gameStats").getContext("2d");
  ctx.canvas.width = 180;
  ctx.canvas.height = 180;
  window.myDoughnut = new Chart(ctx).Doughnut(gameStats, {});
  
  var champData = {
      labels: ["Padrão", "Noir", "Tech", "Retro"],
      datasets: [
          {
              label: "Data",
              fillColor: "rgba(220,220,220,0.5)",
              strokeColor: "rgba(220,220,220,0.8)",
              highlightFill: "rgba(220,220,220,0.75)",
              highlightStroke: "rgba(220,220,220,1)",
              data: [65, 59, 80, 81]
          },
          {
              label: "Data 2",
              fillColor: "rgba(151,187,205,0.5)",
              strokeColor: "rgba(151,187,205,0.8)",
              highlightFill: "rgba(151,187,205,0.75)",
              highlightStroke: "rgba(151,187,205,1)",
              data: [28, 48, 40, 19]
          }
      ]
  };
  var ctx = document.getElementById("champData").getContext("2d");
  window.myBarChart = new Chart(ctx).Bar(champData, {responsive: true});
  
  var roleStats = [
      {
          value: 300,
          color:"#F7464A",
          highlight: "#FF5A5E",
          label: "Agressivo"
      },
      {
          value: 225,
          color: "#46BFBD",
          highlight: "#5AD3D1",
          label: "Line Maker"
      },
      {
          value: 240,
          color: "#FDB45C",
          highlight: "#FFC870",
          label: "Pacificador"
      }
  ];
  var ctx = document.getElementById("roleStats").getContext("2d");
  ctx.canvas.width = 200;
  ctx.canvas.height = 180;
  window.myPolarArea = new Chart(ctx).PolarArea(roleStats, {responsive: false});
  
  var timeData = {
      labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio"],
      datasets: [
          {
              label: "Esse Ano",
              fillColor: "rgba(220,220,220,0.2)",
              strokeColor: "rgba(220,220,220,1)",
              pointColor: "rgba(220,220,220,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(220,220,220,1)",
              data: [65, 59, 80, 81, 56]
          },
          {
              label: "Último Ano",
              fillColor: "rgba(151,187,205,0.2)",
              strokeColor: "rgba(151,187,205,1)",
              pointColor: "rgba(151,187,205,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(151,187,205,1)",
              data: [28, 48, 40, 19, 86]
          }
      ]
  };
  var ctx = document.getElementById("timeData").getContext("2d");
  window.myLineChart = new Chart(ctx).Line(timeData, {responsive: true});
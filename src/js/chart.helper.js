'use strict';
const Chart = require('chart.js');

Chart.defaults.global.elements.arc.borderColor = '#232429';
// Chart.defaults.global.elements.arc.borderWidth = 5;
Chart.defaults.global.elements.arc.backgroundColor = 'rgba(255,255,255,0.5)';
Chart.defaults.global.elements.line.backgroundColor = 'rgba(255,255,255,0.5)';
Chart.defaults.global.elements.rectangle.backgroundColor = 'rgba(255,255,255,0.5)';
Chart.defaults.global.elements.rectangle.borderColor = 'rgba(255,255,255,0.5)';
Chart.defaults.global.elements.point.backgroundColor = 'rgba(255,255,255,0.5)';
Chart.defaults.global.elements.point.borderColor = 'rgba(255,255,255,0.5)';
Chart.defaults.global.elements.line.borderColor = 'rgba(255,255,255,0.5)';
Chart.defaults.global.animation.duration = 0;
Chart.defaults.global.defaultFontColor = '#fefefe';
Chart.defaults.global.defaultFontSize = 12;
Chart.defaults.global.defaultColor = 'rgba(255,255,255,0.1)';
// Chart.defaults.global.legend.fontColor = '#fefefe';
Chart.defaults.global.legend.position = 'bottom';

const red = '#D55E55';
const green = '#1FAA8E';

const mypiechart = new Chart('myChart', {
  type: 'pie',
  data: {
    labels: ['Income', 'Expense'], // data label
    datasets: [
      {
        data: [20, 30], // data
        backgroundColor: [green, red]
      },
      // {
      //   data: [60, 30], // data
      // }
    ]
  },
  options: {
    title: {
      display: true,
      text: 'Weekly Cashflow'
    },
    legend: {
      labels: {
        generateLabels: function (chart) {
          const data = chart.data;
          if (data.labels.length && data.datasets.length) {
            return data.labels.map((label, i) => {
              const meta = chart.getDatasetMeta(0);
              const style = meta.controller.getStyle(i);
              console.log(`${label}:${i}`)
              return {
                text: `${label}: RM ${data.datasets[0].data[i]}`,
                fillStyle: style.backgroundColor,
                strokeStyle: style.borderColor,
                lineWidth: style.borderWidth,
                hidden: isNaN(data.datasets[0].data[i]) || meta.data[i].hidden,
                // Extra data used for toggling the correct item
                index: i
              };
            });
          }
          return [];
        }
      },
      position: 'right'
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          const label = data.labels[tooltipItem.index] || '';
          const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] || '';
          return `${label} RM ${value}`;
        }
      }
    }
  }
});

const balanceChart = new Chart('myline', {
  type: 'line',
  data: {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'balance',
        data: [200, 180, 170, 160, 150, 140, 135],
        lineTension: 0,
        fill: false
      }
    ]
  },
  options: {
    title: {
      display: true,
      text: 'Daily Balance'
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: true
    },
    // defaultFontSize: 10,
    scales: {
      xAxes: [
        {
          gridLines: {
            color: 'rgba(255,255,255,0.2)'
          },
          ticks: {
            fontSize: 12,
          },
          ticks: {
            callback: (value) => `${value.slice(0, 3)}`
          }
        }
      ],
      yAxes: [{
        gridLines: {
          color: 'rgba(255,255,255,0.2)'
        },
        ticks: {
          beginAtZero: true,
          max: 300,
          fontSize: 12,
        },
      }]
    },

  }
});


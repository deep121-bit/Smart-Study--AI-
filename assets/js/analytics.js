const chartDefaults = {
  color: '#94A3B8',
  gridColor: 'rgba(248,250,252,0.06)',
};

window.addEventListener('load', () => {
  if (!window.Chart) return;

  new Chart(document.getElementById('lineChart'), {
    type: 'line',
    data: {
      labels: Array.from({ length: 14 }, (_, i) => `D${i + 1}`),
      datasets: [{
        label: 'Accuracy %',
        data: [62,65,60,70,74,71,78,80,76,84,82,88,85,90],
        borderColor: '#22D3EE',
        backgroundColor: 'rgba(34,211,238,0.15)',
        fill: true, tension: .4, pointRadius: 0,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: chartDefaults.color, maxTicksLimit: 7 }, grid: { display: false } },
        y: { ticks: { color: chartDefaults.color }, grid: { color: chartDefaults.gridColor } }
      }
    }
  });

  new Chart(document.getElementById('pieChart'), {
    type: 'doughnut',
    data: {
      labels: ['DSA', 'DBMS', 'OS', 'Networks', 'Aptitude'],
      datasets: [{
        data: [28, 18, 22, 14, 18],
        backgroundColor: ['#6366F1', '#22D3EE', '#10B981', '#F59E0B', '#EF4444'],
        borderColor: '#111827', borderWidth: 3,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { color: chartDefaults.color, boxWidth: 10, padding: 14, font: { size: 11 } } } }
    }
  });

  new Chart(document.getElementById('radarChart'), {
    type: 'radar',
    data: {
      labels: ['DSA', 'DBMS', 'OS', 'Networks', 'Aptitude', 'System Design'],
      datasets: [{
        label: 'Accuracy',
        data: [82, 74, 91, 68, 88, 60],
        backgroundColor: 'rgba(99,102,241,0.25)',
        borderColor: '#6366F1',
        pointBackgroundColor: '#22D3EE',
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          angleLines: { color: chartDefaults.gridColor },
          grid: { color: chartDefaults.gridColor },
          pointLabels: { color: chartDefaults.color, font: { size: 11 } },
          ticks: { display: false, backdropColor: 'transparent' },
          suggestedMin: 0, suggestedMax: 100,
        }
      }
    }
  });

  new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
      labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
      datasets: [{
        label: 'Hours',
        data: [14.5, 16.2, 12.8, 19.0],
        backgroundColor: '#6366F1',
        borderRadius: 8, barPercentage: .55,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: chartDefaults.color }, grid: { display: false } },
        y: { ticks: { color: chartDefaults.color }, grid: { color: chartDefaults.gridColor } }
      }
    }
  });

  /* heatmap */
  const heatmap = document.getElementById('heatmap');
  if (heatmap) {
    let html = '';
    for (let i = 0; i < 182; i++) {
      const r = Math.random();
      let cls = 'bg-white/5';
      if (r > 0.85) cls = 'bg-primary';
      else if (r > 0.65) cls = 'bg-primary/60';
      else if (r > 0.4) cls = 'bg-primary/30';
      html += `<span class="w-full aspect-square rounded-sm ${cls}"></span>`;
    }
    heatmap.innerHTML = html;
  }
});

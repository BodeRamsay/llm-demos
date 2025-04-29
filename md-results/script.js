const data = [
    {jurisdiction: "Allegany", harris: 9231, trump: 22141, oliver: 130, stein: 136, kennedy: 363, others: 136, total: 32137},
    {jurisdiction: "Anne Arundel", harris: 171945, trump: 128892, oliver: 2141, stein: 2429, kennedy: 3375, others: 2790, total: 311572},
    {jurisdiction: "Baltimore City", harris: 195109, trump: 27984, oliver: 892, stein: 3222, kennedy: 1875, others: 1672, total: 230754},
    {jurisdiction: "Baltimore County", harris: 249958, trump: 149560, oliver: 2240, stein: 4195, kennedy: 3858, others: 3104, total: 412915},
    {jurisdiction: "Calvert", harris: 23438, trump: 29361, oliver: 297, stein: 232, kennedy: 554, others: 309, total: 54191},
    {jurisdiction: "Caroline", harris: 4860, trump: 11053, oliver: 84, stein: 99, kennedy: 180, others: 54, total: 16330},
    {jurisdiction: "Carroll", harris: 36867, trump: 62273, oliver: 845, stein: 629, kennedy: 1182, others: 855, total: 102651},
    {jurisdiction: "Cecil", harris: 17628, trump: 33871, oliver: 291, stein: 286, kennedy: 536, others: 219, total: 52831},
    {jurisdiction: "Charles", harris: 63454, trump: 26145, oliver: 334, stein: 828, kennedy: 889, others: 447, total: 92097},
    {jurisdiction: "Dorchester", harris: 6954, trump: 9390, oliver: 57, stein: 138, kennedy: 191, others: 42, total: 16772},
    {jurisdiction: "Frederick", harris: 82409, trump: 68753, oliver: 970, stein: 1378, kennedy: 1494, others: 1110, total: 156114},
    {jurisdiction: "Garrett", harris: 3456, trump: 11983, oliver: 75, stein: 48, kennedy: 223, others: 53, total: 15838},
    {jurisdiction: "Harford", harris: 62453, trump: 83050, oliver: 1023, stein: 935, kennedy: 1559, others: 1070, total: 150090},
    {jurisdiction: "Howard", harris: 124764, trump: 49425, oliver: 1246, stein: 3341, kennedy: 1712, others: 1803, total: 182291},
    {jurisdiction: "Kent", harris: 5251, trump: 5561, oliver: 60, stein: 82, kennedy: 114, others: 60, total: 11128},
    {jurisdiction: "Montgomery", harris: 386581, trump: 112637, oliver: 2416, stein: 8009, kennedy: 4276, others: 5302, total: 519221},
    {jurisdiction: "Prince George's", harris: 347038, trump: 45008, oliver: 1038, stein: 5369, kennedy: 3428, others: 2128, total: 404009},
    {jurisdiction: "Queen Anne's", harris: 11273, trump: 20200, oliver: 174, stein: 153, kennedy: 336, others: 211, total: 32347},
    {jurisdiction: "Saint Mary's", harris: 23531, trump: 33582, oliver: 409, stein: 352, kennedy: 669, others: 411, total: 58954},
    {jurisdiction: "Somerset", harris: 4054, trump: 5805, oliver: 32, stein: 85, kennedy: 114, others: 47, total: 10137},
    {jurisdiction: "Talbot", harris: 11119, trump: 11125, oliver: 109, stein: 120, kennedy: 194, others: 163, total: 22830},
    {jurisdiction: "Washington", harris: 27260, trump: 44054, oliver: 363, stein: 513, kennedy: 811, others: 331, total: 73332},
    {jurisdiction: "Wicomico", harris: 21513, trump: 24065, oliver: 205, stein: 371, kennedy: 544, others: 214, total: 46912},
    {jurisdiction: "Worcester", harris: 12431, trump: 19632, oliver: 139, stein: 184, kennedy: 342, others: 153, total: 32881},
  ];
  
  const candidates = ["harris", "trump", "oliver", "stein", "kennedy", "others"];
  let countyChart = null;
  
  function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  function calculateTotals() {
      let totals = {harris: 0, trump: 0, oliver: 0, stein: 0, kennedy: 0, others: 0, total: 0};
  
      for (const county of data) {
          for (const key of candidates.concat("total")) {
              totals[key] += county[key];
          }
      }
      return totals;
  }
  
  function fillStatewideTable() {
      const totals = calculateTotals();
      const tbody = document.querySelector("#statewide-table tbody");
      candidates.forEach(candidate => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
              <td>${capitalize(candidate)}</td>
              <td>${totals[candidate]}</td>
              <td>${((totals[candidate] / totals.total) * 100).toFixed(2)}%</td>
          `;
          tbody.appendChild(tr);
      });
  }
  
  function fillCountyDropdown() {
      const select = document.getElementById("county-select");
      data.forEach(county => {
          const option = document.createElement("option");
          option.value = county.jurisdiction;
          option.textContent = county.jurisdiction;
          select.appendChild(option);
      });
  }
  
  function fillCountyTable(countyName) {
      const county = data.find(c => c.jurisdiction === countyName);
      const tbody = document.querySelector("#county-table tbody");
      tbody.innerHTML = "";
  
      const sortedCandidates = [...candidates].sort((a, b) => county[b] - county[a]);
  
      sortedCandidates.forEach(candidate => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
              <td>${capitalize(candidate)}</td>
              <td>${county[candidate]}</td>
              <td>${((county[candidate] / county.total) * 100).toFixed(2)}%</td>
          `;
          tbody.appendChild(tr);
      });
  
      const labels = sortedCandidates.map(candidate => capitalize(candidate));
      const votes = sortedCandidates.map(candidate => county[candidate]);
  
      if (countyChart) {
          countyChart.destroy();
      }
  
      const ctx = document.getElementById('county-chart').getContext('2d');
      countyChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: labels,
              datasets: [{
                  label: 'Votes',
                  data: votes,
                  backgroundColor: '#0077cc',
                  borderColor: '#005fa3',
                  borderWidth: 1
              }]
          },
          options: {
              indexAxis: 'y',
              responsive: true,
              scales: {
                  x: {
                      beginAtZero: true
                  }
              },
              plugins: {
                  legend: {
                      display: false
                  },
                  tooltip: {
                      callbacks: {
                          label: context => `${context.raw} votes`
                      }
                  }
              }
          }
      });
  }
  
  fillStatewideTable();
  fillCountyDropdown();
  document.getElementById("county-select").addEventListener("change", (e) => {
      fillCountyTable(e.target.value);
  });
  
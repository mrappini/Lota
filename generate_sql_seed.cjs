const fs = require('fs');

function generateDate(dayOfWeek, hour, minute) {
  const date = new Date();
  const currentDay = date.getDay();
  const distanceToTargetDay = dayOfWeek - currentDay;
  date.setDate(date.getDate() + distanceToTargetDay);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

function randomUser() {
  return 'usr_' + Math.random().toString(36).substring(2, 11);
}

function getRandomStatus(weights) {
  const sum = weights.green + weights.yellow + weights.red;
  let rand = Math.random() * sum;
  if (rand < weights.green) return 'green';
  rand -= weights.green;
  if (rand < weights.yellow) return 'yellow';
  return 'red';
}

const pReports = [];
const cReports = [];

function addReports(domain, day, hour, count, weights) {
  for (let i = 0; i < count; i++) {
    const min = Math.floor(Math.random() * 60);
    const ts = generateDate(day, hour, min);
    const status = getRandomStatus(weights);
    const user = randomUser();
    
    if(domain === 'parking') {
      pReports.push(`('${ts}', '${status}', '${user}')`);
    } else {
      cReports.push(`('${ts}', '${status}', '${user}')`);
    }
  }
}

addReports('parking', 4, 8, 10, { green: 8, yellow: 2, red: 0 });
addReports('parking', 4, 9, 10, { green: 5, yellow: 4, red: 1 });
addReports('parking', 4, 10, 15, { green: 2, yellow: 6, red: 7 });
addReports('parking', 4, 11, 20, { green: 0, yellow: 5, red: 15 });
addReports('parking', 4, 12, 10, { green: 7, yellow: 3, red: 0 });
addReports('parking', 4, 14, 10, { green: 8, yellow: 2, red: 0 });
addReports('parking', 4, 18, 10, { green: 6, yellow: 4, red: 0 });

addReports('parking', 5, 8, 8, { green: 7, yellow: 1, red: 0 });
addReports('parking', 5, 10, 10, { green: 6, yellow: 4, red: 0 });
addReports('parking', 5, 11, 12, { green: 5, yellow: 5, red: 2 });
addReports('parking', 5, 12, 8, { green: 8, yellow: 0, red: 0 });

addReports('cafeteria', 4, 10, 5, { green: 5, yellow: 0, red: 0 });
addReports('cafeteria', 4, 11, 15, { green: 2, yellow: 10, red: 3 });
addReports('cafeteria', 4, 12, 25, { green: 0, yellow: 5, red: 20 });
addReports('cafeteria', 4, 13, 20, { green: 2, yellow: 15, red: 3 });
addReports('cafeteria', 4, 18, 12, { green: 10, yellow: 2, red: 0 });

addReports('cafeteria', 5, 11, 10, { green: 5, yellow: 5, red: 0 });
addReports('cafeteria', 5, 12, 18, { green: 2, yellow: 10, red: 6 });
addReports('cafeteria', 5, 13, 15, { green: 8, yellow: 7, red: 0 });
addReports('cafeteria', 5, 18, 10, { green: 9, yellow: 1, red: 0 });

let sql = 'TRUNCATE TABLE public.parking_status;\nTRUNCATE TABLE public.cafeteria_status;\n\n';
sql += 'INSERT INTO public.parking_status (timestamp, status_texto, user_id) VALUES\n';
sql += pReports.join(',\n') + ';\n\n';

sql += 'INSERT INTO public.cafeteria_status (timestamp, status_texto, user_id) VALUES\n';
sql += cReports.join(',\n') + ';\n';

fs.writeFileSync('reset_and_seed.sql', sql);
console.log('SQL generated to reset_and_seed.sql');

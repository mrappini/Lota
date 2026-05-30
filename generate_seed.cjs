const fs = require('fs');

const DAYS = 7;
const PARKING_REPORTS_PER_DAY = 35;
const CAFETERIA_REPORTS_PER_DAY = 35;

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function randomStatus(hour, isCafeteria) {
  const r = Math.random();
  if (isCafeteria) {
    // Bandejao peaks: 11:30 - 13:30 (11, 12, 13)
    if (hour >= 11 && hour <= 13) {
      return r > 0.3 ? 'red' : (r > 0.1 ? 'yellow' : 'green');
    } else {
      return r > 0.8 ? 'yellow' : 'green';
    }
  } else {
    // Parking peaks: 07:00-09:00 and 17:00-19:00
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      return r > 0.4 ? 'red' : (r > 0.1 ? 'yellow' : 'green');
    } else if (hour >= 10 && hour <= 16) {
      return r > 0.5 ? 'yellow' : (r > 0.2 ? 'red' : 'green');
    } else {
      return 'green';
    }
  }
}

let sql = `-- Seed file generated for Lota App\n\n`;

function generateInserts(tableName, isCafeteria, reportsPerDay) {
  let tableSql = `\n-- DADOS PARA ${tableName.toUpperCase()}\n`;
  const now = new Date();
  
  for (let d = 0; d < DAYS; d++) {
    for (let i = 0; i < reportsPerDay; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - d);
      
      // Random hour between 7 and 20
      const hour = Math.floor(Math.random() * (20 - 7 + 1)) + 7;
      const minute = Math.floor(Math.random() * 60);
      const second = Math.floor(Math.random() * 60);
      
      date.setHours(hour, minute, second);
      
      const status = randomStatus(hour, isCafeteria);
      const isoStr = date.toISOString();
      const userId = generateUUID();
      
      tableSql += `INSERT INTO public.${tableName} (status_texto, timestamp, user_id) VALUES ('${status}', '${isoStr}', '${userId}');\n`;
    }
  }
  return tableSql;
}

sql += generateInserts('parking_status', false, PARKING_REPORTS_PER_DAY);
sql += generateInserts('cafeteria_status', true, CAFETERIA_REPORTS_PER_DAY);

fs.writeFileSync('seed_data.sql', sql, 'utf8');
console.log('seed_data.sql generated successfully with ' + (DAYS * (PARKING_REPORTS_PER_DAY + CAFETERIA_REPORTS_PER_DAY)) + ' rows.');

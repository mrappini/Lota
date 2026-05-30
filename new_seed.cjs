const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltam variáveis de ambiente no .env");
  process.exit(1);
}

const WebSocket = require('ws');
const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: { transport: WebSocket }
});

// Gera uma data específica para testes
function generateDate(dayOfWeek, hour, minute) {
  const date = new Date();
  const currentDay = date.getDay(); // 0 (Sun) - 6 (Sat)
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

const reports = [];

function addReports(domain, day, hour, count, weights) {
  for (let i = 0; i < count; i++) {
    const min = Math.floor(Math.random() * 60);
    const ts = generateDate(day, hour, min);
    reports.push({
      domain,
      status_texto: getRandomStatus(weights),
      timestamp: ts,
      user_id: randomUser()
    });
  }
}

// 4 = Thursday, 5 = Friday
// PARKING THURSDAY
addReports('parking', 4, 8, 10, { green: 8, yellow: 2, red: 0 });
addReports('parking', 4, 9, 10, { green: 5, yellow: 4, red: 1 });
addReports('parking', 4, 10, 15, { green: 2, yellow: 6, red: 7 }); // Maior movimento 10h
addReports('parking', 4, 11, 20, { green: 0, yellow: 5, red: 15 }); // Muito vermelho 11h
addReports('parking', 4, 12, 10, { green: 7, yellow: 3, red: 0 }); // De boa
addReports('parking', 4, 14, 10, { green: 8, yellow: 2, red: 0 }); // De boa
addReports('parking', 4, 18, 10, { green: 6, yellow: 4, red: 0 }); // De boa

// PARKING FRIDAY
addReports('parking', 5, 8, 8, { green: 7, yellow: 1, red: 0 });
addReports('parking', 5, 10, 10, { green: 6, yellow: 4, red: 0 });
addReports('parking', 5, 11, 12, { green: 5, yellow: 5, red: 2 });
addReports('parking', 5, 12, 8, { green: 8, yellow: 0, red: 0 });

// CAFETERIA THURSDAY
addReports('cafeteria', 4, 10, 5, { green: 5, yellow: 0, red: 0 });
addReports('cafeteria', 4, 11, 15, { green: 2, yellow: 10, red: 3 }); // Amarelos a partir das 11h
addReports('cafeteria', 4, 12, 25, { green: 0, yellow: 5, red: 20 }); // Maior movimento 12h, muitos vermelhos
addReports('cafeteria', 4, 13, 20, { green: 2, yellow: 15, red: 3 }); // 13h amarelo majoritario
addReports('cafeteria', 4, 18, 12, { green: 10, yellow: 2, red: 0 }); // 18h maioria verde, pequenos pontinhos amarelos

// CAFETERIA FRIDAY
addReports('cafeteria', 5, 11, 10, { green: 5, yellow: 5, red: 0 }); 
addReports('cafeteria', 5, 12, 18, { green: 2, yellow: 10, red: 6 }); // Mesma coisa mas menos vermelhos
addReports('cafeteria', 5, 13, 15, { green: 8, yellow: 7, red: 0 }); 
addReports('cafeteria', 5, 18, 10, { green: 9, yellow: 1, red: 0 });

async function run() {
  console.log("Apagando dados existentes...");
  await supabase.from('parking_status').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('cafeteria_status').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const pReports = reports.filter(r => r.domain === 'parking').map(({domain, ...rest}) => rest);
  const cReports = reports.filter(r => r.domain === 'cafeteria').map(({domain, ...rest}) => rest);

  console.log(`Inserindo ${pReports.length} registros no estacionamento...`);
  const { error: e1 } = await supabase.from('parking_status').insert(pReports);
  if (e1) console.error(e1);

  console.log(`Inserindo ${cReports.length} registros no bandejão...`);
  const { error: e2 } = await supabase.from('cafeteria_status').insert(cReports);
  if (e2) console.error(e2);

  console.log("Banco populado com sucesso para Quinta e Sexta!");
}

run();

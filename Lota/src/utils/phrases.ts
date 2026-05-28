import { StatusType } from '../types';

export function getDayName(dayIndex: number): string {
  const days = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado'
  ];
  return days[dayIndex] || 'Dia';
}

export function getContextualPhrase(dayOfWeek: number, status: StatusType): string {
  // Phrases grouped by day and status
  const phrases: Record<number, Record<StatusType, string[]>> = {
    1: { // Segunda
      green: [
        'Início de semana com fluxo livre nas guaritas. Pode vir direto.',
        'Semana começando tranquila, sem fila de carros por aqui.',
        'Fluxo excelente para garantir sua vaga de início de semana rápida.'
      ],
      yellow: [
        'Movimentação típica de segunda. Fila de carros ativa, mas avançando rápido.',
        'Fluxo moderado no acesso. Tempo para estacionar está bem de boa.',
        'Fila padrão de início de ciclo. O ritmo das guaritas está constante.'
      ],
      red: [
        'Fluxo intenso de início de semana. Trânsito acumulado no acesso.',
        'Fila de carros se estendendo pelo acesso principal da Gávea.',
        'Horário de pico ativo. Espera maior para conseguir vaga agora.'
      ]
    },
    2: { // Terça
      green: [
        'Terça-feira super tranquila. Acesso liberado para as vagas.',
        'Entrada direta no estacionamento. Sem fila de espera na guarita.',
        'Aproveite a terça-feira com fluxo totalmente livre.'
      ],
      yellow: [
        'Movimento de carros regular. A fila está correndo bem.',
        'Tempo de espera na guarita em nível aceitável e ritmo constante.',
        'Fila moderada na entrada. Linha fluindo sem grandes travamentos.'
      ],
      red: [
        'Terça-feira com pico de lotação. Fila de carros extensa.',
        'Trânsito lento no acesso do campus. Longa espera estimada.',
        'Fila travada antes das guaritas. Se puder, ajuste seu horário.'
      ]
    },
    3: { // Quarta
      green: [
        'Quarta-feira com fluxo livre. Vagas acessíveis direto.',
        'Sossego no meio da semana. Sem filas de carros no momento.',
        'Movimento bem calmo, ideal para estacionar sem stress.'
      ],
      yellow: [
        'Meio de semana com fluxo padrão. Fila ativa mas se movendo.',
        'Nível moderado de carros na entrada. Espera super suportável.',
        'Guaritas com fluxo constante. Ritmo normal de quarta-feira.'
      ],
      red: [
        'Quarta com grande volume de carros. Fila demorada para entrar.',
        'Tempo de espera elevado hoje. Muitas vagas ocupadas.',
        'Fila de veículos acumulada no acesso. Evite o pico se puder.'
      ]
    },
    4: { // Quinta
      green: [
        'Quinta-feira com fluxo livre. Ótimo momento para estacionar.',
        'Caminho aberto na entrada. Acesso rápido e prático.',
        'Zero fila nas cancelas. Entrada direta.'
      ],
      yellow: [
        'Fluxo regular de quinta-feira. Tempo de espera super aceitável.',
        'Fila mediana nas cancelas. O atendimento está fluindo.',
        'Movimento padrão. Dá para trocar as músicas no carro de boa.'
      ],
      red: [
        'Quinta-feira com fluxo travado na entrada. Espera bem alta.',
        'Acesso lento pelo grande volume de veículos na Gávea.',
        'Fila dando a volta na via de acesso. Tráfego carregado agora.'
      ]
    },
    5: { // Sexta
      green: [
        'Sexta-feira muito tranquila. Entrada livre e sem esperas.',
        'Sextou com fluxo totalmente livre nas cancelas.',
        'Aproveite o fluxo de sexta. Subida livre de carros.'
      ],
      yellow: [
        'Movimento típico de sexta-feira. Fila pequena e fluindo.',
        'Acesso leve e tempo de espera bem baixo para entrar.',
        'Fila tranquila, caminhando rápido para você estacionar e relaxar.'
      ],
      red: [
        'Fila acumulada para estacionar em plena sexta. Espera alta.',
        'Tráfego bem pesado no acesso hoje. Entrada demorada.',
        'Subida do estacionamento congestionada. Fluxo travado.'
      ]
    },
    6: { // Sábado
      green: [
        'Sábado sem movimentação. Acesso super livre.',
        'Fluxo totalmente aberto e tranquilo no final de semana.',
        'Aproveite o sábado com zero fila por aqui.'
      ],
      yellow: [
        'Movimento brando de sábado. Fila pequena nas cancelas.',
        'Tempo de espera muito baixo e ritmo agradável.',
        'Poucos veículos circulando. Estacionamento tranquilo.'
      ],
      red: [
        'Afluência incomum para sábado. Fila longa na entrada.',
        'Movimento intenso e demorado nas cancelas.',
        'Tempo de espera elevado hoje. Planeje sua entrada.'
      ]
    },
    0: { // Domingo
      green: [
        'Domingo relaxado nas cancelas. Sem fluxo de espera.',
        'Caminho completamente livre. Pode passar direto.',
        'Tranquilidade total para acessar as vagas hoje.'
      ],
      yellow: [
        'Fluxo sob controle e bem de boa. Pouca disputa por vaga.',
        'Movimento sutil no acesso ao campus, fluindo suavemente.',
        'Ritmo constante e tranquilo para o dia de hoje.'
      ],
      red: [
        'Volume incomum de veículos para domingo. Longa fila.',
        'Trânsito de acesso carregado e lento na guarita.',
        'Tempo de espera inesperadamente alto. Recomenda-se aguardar.'
      ]
    }
  };

  const dayPhrases = phrases[dayOfWeek] || phrases[1]; // fallback to Monday (1)
  const choices = dayPhrases[status];
  
  // Return a deterministic phrase based on the hour to prevent shifting on every re-render
  const now = new Date();
  const index = now.getHours() % choices.length;
  return choices[index];
}

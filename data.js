export const VERSION = 1;
export const RELEASE = '0.1.0';
export const RESOURCES = ['gold','food','wood','stone','herbs'];
export const RESOURCE_LABELS = {gold:'Monedas',food:'Comida',wood:'Madera',stone:'Piedra',herbs:'Hierbas'};
export const RESOURCE_SYMBOLS = {gold:'◈',food:'◆',wood:'♠',stone:'⬟',herbs:'✿'};
export const TOOLS = [
  {id:'blanket',name:'Manta remendada',desc:'Recuperas energía un 25% más rápido.',cost:{gold:18},tier:1,icon:'🧣'},
  {id:'basket',name:'Cesta resistente',desc:'+1 comida al buscar provisiones.',cost:{gold:25},tier:1,icon:'🧺'},
  {id:'axe',name:'Hacha de leñador',desc:'+2 madera por cada recolección.',cost:{gold:48},tier:1,icon:'🪓'},
  {id:'boots',name:'Botas de camino',desc:'+4 energía máxima y +10% a las ganancias de mendigar.',cost:{gold:65},tier:1,icon:'🥾'},
  {id:'pickaxe',name:'Pico de hierro',desc:'Desbloquea la extracción de piedra.',cost:{gold:90,wood:8},tier:1,icon:'⛏️'},
  {id:'campfire',name:'Hoguera protegida',desc:'El hambre crece un 35% más despacio.',cost:{gold:40,wood:8},tier:1,icon:'🔥'},
  {id:'shelter',name:'Refugio de madera',desc:'Asciendes a trabajador. Desbloqueas 2 plazas de empleados y mejoras tu descanso.',cost:{gold:120,wood:24},tier:1,icon:'🏕️'},
  {id:'hearth',name:'Hogar comunitario',desc:'+2 plazas de trabajadores y recuperación de energía mejorada.',cost:{gold:145,wood:20,stone:4},tier:2,icon:'🏠'},
  {id:'storage',name:'Cobertizo-almacén',desc:'Duplica la capacidad de todos los recursos materiales.',cost:{gold:145,wood:22,stone:8},tier:2,icon:'📦'},
  {id:'stall',name:'Puesto del mercado',desc:'¡Asciendes a comerciante! Desbloquea al vendedor automático y concluye el prólogo.',cost:{gold:310,wood:38,stone:12},tier:2,icon:'🏪'}
];
export const WORKERS = [
  {id:'woodcutter',name:'Leñador',desc:'Recolecta madera de manera automática.',icon:'🪓',baseCost:85,wage:.035,output:{wood:.16},req:'shelter'},
  {id:'forager',name:'Recolectora',desc:'Recoge comida, ideal para vivir sin preocupaciones.',icon:'🌾',baseCost:75,wage:.032,output:{food:.13},req:'shelter'},
  {id:'quarrier',name:'Cantero',desc:'Extrae piedra para construir los siguientes edificios.',icon:'⛏️',baseCost:110,wage:.055,output:{stone:.10},req:'pickaxe'},
  {id:'trader',name:'Vendedor',desc:'Vende automáticamente la madera que exceda de la reserva indicada.',icon:'🧑‍💼',baseCost:170,wage:.065,output:{},req:'stall'}
];
export const CONTRACTS = [
  {name:'Leña para la posada',needs:{wood:12},reward:85},
  {name:'Raciones de camino',needs:{food:10},reward:55},
  {name:'Remedios del boticario',needs:{herbs:4},reward:75},
  {name:'Piedras para el molino',needs:{stone:8},reward:94},
  {name:'La cocina del castillo',needs:{food:16},reward:94},
  {name:'Reparación de carromatos',needs:{wood:21},reward:160},
  {name:'Un encargo de la ermita',needs:{wood:6,food:5},reward:91},
  {name:'Obras del camino',needs:{stone:10,wood:8},reward:162},
  {name:'Herborista del camino',needs:{herbs:6,food:6},reward:145}
];
export const QUESTS = [
  {id:'feet',title:'Primeras monedas',desc:'Consigue 25 monedas en total trabajando o vendiendo.',check:s=>s.stats.goldEarned>=25,reward:{gold:12,xp:10}},
  {id:'survive',title:'Una noche más',desc:'Reúne 8 raciones de comida y 10 de madera.',check:s=>s.stats.foodEarned>=8 && s.stats.woodEarned>=10,reward:{gold:20,xp:18}},
  {id:'tool',title:'Herramientas de verdad',desc:'Compra una cesta, un hacha o un pico.',check:s=>['basket','axe','pickaxe'].some(id=>s.owned[id]),reward:{food:8,xp:20}},
  {id:'home',title:'Un techo propio',desc:'Construye tu refugio de madera.',check:s=>!!s.owned.shelter,reward:{gold:65,food:10,xp:35}},
  {id:'partner',title:'Ya no estás solo',desc:'Contrata tu primer trabajador.',check:s=>Object.values(s.workers).reduce((a,b)=>a+b,0)>=1,reward:{gold:40,xp:40}},
  {id:'steady',title:'Un oficio que prospera',desc:'Consigue 750 monedas a lo largo de la partida.',check:s=>s.stats.goldEarned>=750,reward:{gold:100,xp:60}},
  {id:'merchant',title:'El primer negocio',desc:'Construye tu propio puesto del mercado.',check:s=>!!s.owned.stall,reward:{gold:250,xp:100}}
];
export const EVENTS = [
  {id:'stranger',title:'El viajero cansado',text:'Un caminante hambriento te ofrece una pequeña bolsa a cambio de provisiones.',requires:s=>s.stats.foodEarned>=4,choices:[
    {title:'Darle 2 de comida',desc:'Pierdes provisiones, ganas 25 monedas y experiencia.',cost:{food:2},reward:{gold:25,xp:8},log:'El viajero te recuerda con gratitud.'},
    {title:'Desearle suerte',desc:'No gastas recursos.',cost:{},reward:{xp:2},log:'El viajero continúa su camino.'}
  ]},
  {id:'oldwoman',title:'La cabaña de la anciana',text:'Una anciana te pide ayuda para reparar su puerta antes del anochecer.',requires:s=>s.stats.woodEarned>=14,choices:[
    {title:'Compartir 5 de madera',desc:'Ganas 12 comida y algo de experiencia.',cost:{wood:5},reward:{food:12,xp:12},log:'La anciana comparte su despensa contigo.'},
    {title:'Pedir un pago',desc:'Entregas madera por 45 monedas.',cost:{wood:5},reward:{gold:45,xp:4},log:'Acepta tu precio, aunque sin entusiasmo.'},
    {title:'Seguir tu camino',desc:'Sin cambios.',cost:{},reward:{},log:'Has decidido no intervenir.'}
  ]},
  {id:'merchant',title:'Un trato sospechosamente bueno',text:'Un comerciante ambulante compra madera para una obra urgente.',requires:s=>s.stats.goldEarned>=240,choices:[
    {title:'Venderle 10 madera',desc:'Obtienes 90 monedas.',cost:{wood:10},reward:{gold:90,xp:10},log:'Cerráis un buen acuerdo.'},
    {title:'Pedir noticias del reino',desc:'Obtienes experiencia.',cost:{},reward:{xp:25},log:'Aprendes de los mercados y sus rutas.'}
  ]},
  {id:'storm',title:'La tormenta se acerca',text:'Las primeras lluvias fuertes amenazan la ruta comercial. Los vecinos te piden ayuda.',requires:s=>!!s.owned.shelter,choices:[
    {title:'Aportar 40 monedas',desc:'La comunidad te lo agradece. +45 XP y 5 hierbas.',cost:{gold:40},reward:{xp:45,herbs:5},log:'Ayudaste a asegurar el camino.'},
    {title:'Organizar provisiones',desc:'Entregas 6 comida a cambio de experiencia.',cost:{food:6},reward:{xp:30,gold:20},log:'La gente consigue proteger sus reservas.'},
    {title:'Quedarte en casa',desc:'Sin coste.',cost:{},reward:{},log:'Esperaste a que la tormenta pasara.'}
  ]},
  {id:'charter',title:'Permiso para vender',text:'Un funcionario ha oído hablar de tu crecimiento y te ofrece registrar tu nuevo puesto.',requires:s=>!!s.owned.stall,choices:[
    {title:'Registrar el puesto',desc:'Consigues un sello de reconocimiento. +80 XP.',cost:{gold:50},reward:{xp:80},log:'Tu puesto ha sido reconocido por la autoridad local.'},
    {title:'Vender por tu cuenta',desc:'Ganas 30 monedas, aunque sin licencia formal.',cost:{},reward:{gold:30},log:'Has decidido conservar tu independencia.'}
  ]}
];
export const ACHIEVEMENTS = [
  {id:'first',name:'De la nada',desc:'Consigue tu primera moneda.',check:s=>s.stats.goldEarned>0},
  {id:'wood',name:'Astillas en las manos',desc:'Recoge 100 de madera en total.',check:s=>s.stats.woodEarned>=100},
  {id:'forage',name:'Experto en provisiones',desc:'Consigue 75 de comida en total.',check:s=>s.stats.foodEarned>=75},
  {id:'coins',name:'Bolsa pesada',desc:'Gana 1.000 monedas a lo largo de la partida.',check:s=>s.stats.goldEarned>=1000},
  {id:'shelter',name:'Dejar atrás el barro',desc:'Construye tu refugio.',check:s=>s.owned.shelter},
  {id:'team',name:'Un pequeño equipo',desc:'Contrata 3 trabajadores.',check:s=>Object.values(s.workers).reduce((a,b)=>a+b,0)>=3},
  {id:'cure',name:'Manos sanadoras',desc:'Reúne 10 hierbas a lo largo de la partida.',check:s=>s.stats.herbsEarned>=10},
  {id:'contracts',name:'De palabra',desc:'Completa 5 encargos.',check:s=>s.stats.contracts>=5},
  {id:'trader',name:'La primera tienda',desc:'Funda tu puesto comercial.',check:s=>s.owned.stall}
];
export const BASE_PRICES = {food:5,wood:7,stone:10,herbs:15};
export const ICONS = {gold:'🪙',food:'🍞',wood:'🪵',stone:'🪨',herbs:'🌿'};

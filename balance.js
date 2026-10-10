window.WinterRushData = {
  T: {
    logFuel: 8,
    cook: { steak: 2.5 }, burn: 35,
    price: { steak: 10, fish: 12, leather: 25, hide: 4 },
    tanTime: [0, 3, 1.6],          // seconds per leather good by artisan level
    fisherCatch: 2.2,              // seconds per fish for a fisher NPC
    pet: { hits: [0, 15, 40, 80, 140], dmg: [1, 2, 3, 4, 6], cd: [1, .9, .8, .7, .6], scale: [.55, .65, .78, .9, 1.05] },
    calmTime: 70, firstCalm: 80, warnTime: 8, stormTime: 25,
    stormBurn: 2.5, stormSlow: .35,
    fieldBears: 3, maxFieldBears: 6, bearHp: 4, bossEvery: 4,
    wolfPackSize: 2, maxWolves: 6, wolfSpawn: 20, hurtGrace: .8,
    max: { wood: 40, meat: 30, grill: 18, counter: 16, hide: 20, fishStock: 20, leather: 16 },
  },
  UP: {
    bag:     { name: '가방',      icon: '🎒', costs: [30, 60, 120, 240], vals: [8, 12, 16, 22, 30] },
    axe:     { name: '도끼',      icon: '🪓', costs: [40, 90, 180],      vals: [1, 2, 3, 4] },
    boots:   { name: '장화',      icon: '🥾', costs: [30, 70, 150],      vals: [5, 5.8, 6.6, 7.4] },
    gate:    { name: '정문 강화',  icon: '🛡️', costs: [80, 160, 300],     vals: [0, 1, 2, 3] },
    helper:  { name: '나무꾼',    icon: '👷', costs: [100, 250],         vals: [0, 1, 2] },
    cart:    { name: '장작 수레',  icon: '🛒', costs: [120, 260],         vals: [4, 8, 12] },
    server:  { name: '서빙 직원',  icon: '🧑‍🍳', costs: [150, 350],         vals: [0, 1, 2] },
    hunter:  { name: '사냥꾼',    icon: '🏹', costs: [200, 450],         vals: [0, 1, 2] },
    cabin:   { name: '오두막',    icon: '🏠', costs: [180, 360, 600],    vals: [0, 1, 2, 3] },
    fishing: { name: '낚시터',    icon: '🎣', costs: [400],              vals: [0, 1] },
    clerk:   { name: '판매 점원',  icon: '🧑‍💼', costs: [200, 450],         vals: [1, 2, 3] },
    artisan: { name: '가죽 장인',  icon: '🧵', costs: [150, 350],         vals: [0, 1, 2] },
    fisher:  { name: '낚시꾼',    icon: '🪝', costs: [250, 500],         vals: [0, 1, 2] },
  },
};

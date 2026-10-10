window.WinterRushData = {
  T: {
    logFuel: 8,
    cook: { steak: 2.5 }, burn: 35,
    price: { steak: 10, sfish: 18, leather: 25, hide: 4, pizza: 40 },
    burnGrow: .15, burnMax: 2.2,   // fire burns faster each blizzard survived (×1 → ×2.2)
    smoke: { time: 3.5, fishPerLog: 1, stormUse: 1.5 },   // oven: 1 log per fish, 1.5 logs in a blizzard
    ovenTime: [3.5, 2.6, 1.8], ovenCap: [18, 24, 30],   // fish oven level: seconds per fish, fish stacked on top
    playerFishTime: 2.2,           // seconds per fish when the player fishes  // stage 2 fish oven: slow roast on the oven top, 1 log cooks 2 fish
    tanPerLog: 1,                  // artisan's small fire: 1 log per hide (1.5 in a blizzard)
    padDwell: .5,                  // seconds standing still on a pad before it starts taking coins
    tanTime: [0, 2, 1.2],          // seconds per leather good by artisan level
    staff: {                       // one worker per job; levels raise mastery
      helperCarry: [0, 4, 8, 12], helperSpeed: [0, 3.4, 4, 4.8], helperChop: [0, .8, .6, .45],
      serverCarry: [0, 6, 10, 14], serverSpeed: [0, 3.6, 4.4, 5.2], serverIv: [0, .15, .1, .06],
      hunterDmg: [0, 2, 3, 4], hunterCd: [0, .7, .55, .4],
      clerkSlots: [1, 2, 2, 3], clerkIv: [.35, .28, .2, .14],
      hunterCarry: [0, 6, 9, 12], hunterHides: [0, 4, 6, 8],   // meat / hides a hunter carries home by level
    farmerCarry: [0, 4, 8], farmerSpeed: [0, 3.4, 4.2], pizzaChefCarry: [0, 4, 8], pizzaChefSpeed: [0, 3.6, 4.4],
    fisherCatch: [0, 2.6, 1.9], fisherCarry: [0, 6, 10],
    },
    combat: { autoInterval: .75, manualSwing: .24, comboWindow: 1.6, critChance: .15, slamEvery: 4, tapRange: 2.7 },
    alpha: { every: 3, hp: 12, meat: 4, coins: 80, pupChance: .6 },   // every 3rd wolf pack (from the 2nd blizzard) brings an alpha
    pet: { tameMeat: 8, hits: [0, 15, 40, 80, 140], dmg: [1, 2, 3, 4, 6], cd: [1, .9, .8, .7, .6], scale: [.55, .65, .78, .9, 1.05] },
    calmTime: 70, firstCalm: 80, warnTime: 8, stormTime: 25,
    stormBurn: 3.5, stormSlow: .35,
    fieldBears: 5, maxFieldBears: 9, bearRespawn: 5, bearHp: 4, bossEvery: 4,
    wolfPackSize: 3, maxWolves: 10, wolfSpawn: 14, wolfStartSold: 8, hurtGrace: .8,
    hideChance: { bear: .35, wolf: .2 },   // hides drop only sometimes; bosses/alpha/beasts always drop theirs
    leatherShop: { iv: 2.4, maxQ: 6, slots: 2 },
    axeChop: [.42, .34, .27, .21, .19, .17, .15],   // seconds per chop by axe level
    // hero power = axe + boots + coat + cape levels; field animals get tougher and new beasts appear
    powerHp: { bear: .6, wolf: .34, alpha: 1, boss: 2 },
    beasts: {
      every: 25, coinsPer: 3,
      chief:   { name: '대장 곰', power: 4,  hp: 20, hpPer: 3, dmg: 2, spd: 2.8, scale: 1.45, meat: 6,  coins: 60,  hides: 1, max: 1 },
      saber:   { name: '검치호',  power: 7,  hp: 12, hpPer: 2, dmg: 2, spd: 4.4, scale: 1.1,  meat: 4,  coins: 50,  hides: 1, max: 2, trophy: 'pelt' },
      mammoth: { name: '매머드',  power: 11, hp: 45, hpPer: 4, dmg: 3, spd: 2.2, scale: 1,    meat: 10, coins: 160, hides: 2, max: 1, trophy: 'tusk' },
    },
    // legendary gear crafted from beast trophies (coins + 🐯 pelts / 🦣 tusks)
    legend: { coatBlock: [0, .08, .16], coatHp: [0, 2, 4], axeDmg: [0, 5, 12], slamR: [0, .8, 1.6] },
    tower: { cd: [1.2, .9, .6], dmg: [2, 4, 7], range: 11 },   // gate Lv4-6
    // stage 3 (큰 화로): garden → veg, veg + meat + logs → pizza, smith processes beast trophies
    garden: { grow: 12 },          // seconds for a plot to ripen
    pizzaTime: 3.2,                // seconds per pizza in the pizza oven (1 veg + 1 meat + 1 log)
    smithTime: [0, 8, 4],          // seconds per trophy processed by smith level
    armor: { boots: [0, .04, .08, .12], coat: [0, .08, .16, .24] },   // chance to block a hit
    max: { vegCrate: 20, pzVeg: 12, pzMeat: 12, pzWood: 12, pizza: 16, forgeRaw: 10, tanWood: 16, wood: 40, meat: 30, grill: 18, counter: 16, hide: 20, fishCrate: 20, fishRaw: 30, ovenWood: 12, fishSmoked: 12, fishStock: 20, leather: 16, tanFuel: 8 },
  },
  UP: {
    bag:     { name: '가방',      icon: '🎒', costs: [30, 60, 120, 240], vals: [8, 12, 16, 22, 30] },
    axe:     { name: '도끼',      icon: '🪓', costs: [40, 90, 200, 450, 900, 1600], vals: [1, 2, 3, 4, 6, 8, 11], stage: [1, 1, 1, 2, 2, 2] },
    boots:   { name: '장화',      icon: '🥾', costs: [30, 80, 200],      vals: [5, 5.8, 6.6, 7.4] },
    cape:    { name: '망토',      icon: '🦸', costs: [100, 300, 700, 1200], vals: [5, 6, 7, 8, 9], stage: [1, 1, 2, 2] },   // max HP
    coat:    { name: '외투',      icon: '🧥', costs: [60, 180, 400],     vals: [0, 1, 2, 3] },
    gate:    { name: '정문 강화',  icon: '🛡️', costs: [80, 200, 450, 900, 1800, 3200], vals: [0, 1, 2, 3, 3, 3, 3], stage: [1, 1, 1, 2, 2, 2] },   // Lv4+ watchtowers
    helper:  { name: '나무꾼',    icon: '👷', costs: [100, 220, 450],    vals: [0, 1, 2, 3] },
    server:  { name: '서빙 직원',  icon: '🧑‍🍳', costs: [150, 300, 600],    vals: [0, 1, 2, 3] },
    hunter:  { name: '사냥꾼',    icon: '🏹', costs: [200, 500, 1000],    vals: [0, 1, 2, 3], stage: [1, 1, 2] },
    cabin:   { name: '오두막',    icon: '🏠', costs: [180, 450, 900],    vals: [0, 1, 2, 3] },
    fishing: { name: '2단계 낚시터', icon: '🎣', costs: [400],            vals: [0, 1] },
    clerk:   { name: '판매 점원',  icon: '🧑‍💼', costs: [200, 500, 1000],    vals: [0, 1, 2, 3] },
    artisan: { name: '가죽 장인',  icon: '🧵', costs: [200, 500],         vals: [0, 1, 2] },
    fisher:  { name: '낚시꾼',    icon: '🪝', costs: [300, 700],         vals: [0, 1, 2] },
    helper2: { name: '나무꾼 2', icon: '👷', costs: [500], vals: [0, 1], stage: [2] },
    hunter2: { name: '사냥꾼 2', icon: '🏹', costs: [700], vals: [0, 1], stage: [2] },
    oven:    { name: '화덕',      icon: '🔥', costs: [300, 700],         vals: [0, 1, 2], stage: [2, 2] },
    saberCoat: { name: '검치호 갑옷', icon: '🐯', costs: [600, 1500], mats: { pelt: [2, 4] }, vals: [0, 1, 2], stage: [2, 2] },
    tuskAxe:   { name: '매머드 뿔 도끼', icon: '🦣', costs: [900, 2200], mats: { tusk: [1, 3] }, vals: [0, 1, 2], stage: [2, 2] },
    statue:    { name: '명성 동상', icon: '🗿', costs: [500, 900, 1600, 2800, 5000, 9000, 16000, 30000], vals: [0, 6, 12, 18, 24, 30, 36, 42, 48], stage: [2, 2, 2, 2, 2, 2, 2, 2] },   // +% to every sale
    fisher2:   { name: '낚시꾼 2', icon: '🪝', costs: [800], vals: [0, 1], stage: [2] },
    hearth:    { name: '큰 화로', icon: '🔥', costs: [3000], vals: [0, 1], stage: [2] },   // → stage 3
    farmer:    { name: '농부', icon: '🧑‍🌾', costs: [600, 1300], vals: [0, 1, 2], stage: [3, 3] },
    pizzaChef: { name: '피자 요리사', icon: '👨‍🍳', costs: [800, 1600], vals: [0, 1, 2], stage: [3, 3] },
    pizzaClerk: { name: '피자 점원', icon: '🧑‍💼', costs: [500, 1000, 1800], vals: [0, 1, 2, 3], stage: [3, 3, 3] },
    smith:     { name: '대장장이', icon: '⚒️', costs: [700, 1500], vals: [0, 1, 2], stage: [3, 3] },
    helper3:   { name: '나무꾼 3', icon: '👷', costs: [1200], vals: [0, 1], stage: [3] },
    hunter3:   { name: '사냥꾼 3', icon: '🏹', costs: [1500], vals: [0, 1], stage: [3] },
    fishClerk: { name: '생선 점원', icon: '🧑‍💼', costs: [200, 500, 1000],  vals: [0, 1, 2, 3], stage: [2, 2, 2] },
  },
};

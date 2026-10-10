window.WinterRushData = {
  T: {
    logFuel: 8,
    cook: { steak: 2.5 }, burn: 35,
    price: { steak: 10, sfish: 18, leather: 25, hide: 4 },
    burnGrow: .15, burnMax: 2.2,   // fire burns faster each blizzard survived (×1 → ×2.2)
    smoke: { time: 3.5, fishPerLog: 1, stormUse: 1.5 },   // oven: 1 log per fish, 1.5 logs in a blizzard
    ovenTime: [3.5, 2.6, 1.8], ovenCap: [18, 24, 30],   // fish oven level: seconds per fish, fish stacked on top
    playerFishTime: 2.2,           // seconds per fish when the player fishes  // stage 2 fish oven: slow roast on the oven top, 1 log cooks 2 fish
    tanPerLog: 1,                  // artisan's small fire: 1 log per hide (1.5 in a blizzard)
    padDwell: .5,                  // seconds standing still on a pad before it starts taking coins
    tanTime: [0, 3, 1.6],          // seconds per leather good by artisan level
    staff: {                       // one worker per job; levels raise mastery
      helperCarry: [0, 4, 8, 12], helperSpeed: [0, 3.4, 4, 4.8], helperChop: [0, .8, .6, .45],
      serverCarry: [0, 6, 10, 14], serverSpeed: [0, 3.6, 4.4, 5.2], serverIv: [0, .15, .1, .06],
      hunterDmg: [0, 2, 3, 4], hunterCd: [0, .7, .55, .4],
      clerkSlots: [1, 2, 2, 3], clerkIv: [.35, .28, .2, .14],
      fisherCatch: [0, 3.2, 2.4], fisherCarry: [0, 6, 10],
    },
    combat: { autoInterval: .75, manualSwing: .24, comboWindow: 1.6, critChance: .15, slamEvery: 4, tapRange: 2.7 },
    alpha: { every: 3, hp: 12, meat: 4, coins: 80, pupChance: .6 },   // every 3rd wolf pack (from the 2nd blizzard) brings an alpha
    pet: { tameMeat: 8, hits: [0, 15, 40, 80, 140], dmg: [1, 2, 3, 4, 6], cd: [1, .9, .8, .7, .6], scale: [.55, .65, .78, .9, 1.05] },
    calmTime: 70, firstCalm: 80, warnTime: 8, stormTime: 25,
    stormBurn: 3.5, stormSlow: .35,
    fieldBears: 5, maxFieldBears: 9, bearRespawn: 5, bearHp: 4, bossEvery: 4,
    wolfPackSize: 3, maxWolves: 10, wolfSpawn: 14, wolfStartSold: 8, hurtGrace: .8,
    max: { wood: 40, meat: 30, grill: 18, counter: 16, hide: 20, fishCrate: 20, fishRaw: 30, ovenWood: 12, fishSmoked: 12, fishStock: 20, leather: 16, tanFuel: 8 },
  },
  UP: {
    bag:     { name: '가방',      icon: '🎒', costs: [30, 60, 120, 240], vals: [8, 12, 16, 22, 30] },
    axe:     { name: '도끼',      icon: '🪓', costs: [40, 90, 180],      vals: [1, 2, 3, 4] },
    boots:   { name: '장화',      icon: '🥾', costs: [30, 70, 150],      vals: [5, 5.8, 6.6, 7.4] },
    gate:    { name: '정문 강화',  icon: '🛡️', costs: [80, 160, 300],     vals: [0, 1, 2, 3] },
    helper:  { name: '나무꾼',    icon: '👷', costs: [100, 220, 450],    vals: [0, 1, 2, 3] },
    server:  { name: '서빙 직원',  icon: '🧑‍🍳', costs: [150, 300, 600],    vals: [0, 1, 2, 3] },
    hunter:  { name: '사냥꾼',    icon: '🏹', costs: [200, 400, 700],    vals: [0, 1, 2, 3], stage: [1, 1, 2] },
    cabin:   { name: '오두막',    icon: '🏠', costs: [180, 360, 600],    vals: [0, 1, 2, 3] },
    fishing: { name: '2단계 낚시터', icon: '🎣', costs: [400],            vals: [0, 1] },
    clerk:   { name: '판매 점원',  icon: '🧑‍💼', costs: [200, 400, 700],    vals: [0, 1, 2, 3] },
    artisan: { name: '가죽 장인',  icon: '🧵', costs: [150, 350],         vals: [0, 1, 2] },
    fisher:  { name: '낚시꾼',    icon: '🪝', costs: [250, 500],         vals: [0, 1, 2] },
    helper2: { name: '나무꾼 2', icon: '👷', costs: [350], vals: [0, 1], stage: [2] },
    hunter2: { name: '사냥꾼 2', icon: '🏹', costs: [450], vals: [0, 1], stage: [2] },
    oven:    { name: '화덕',      icon: '🔥', costs: [250, 500],         vals: [0, 1, 2], stage: [2, 2] },
    fishClerk: { name: '생선 점원', icon: '🧑‍💼', costs: [200, 400, 700],  vals: [0, 1, 2, 3], stage: [2, 2, 2] },
  },
};

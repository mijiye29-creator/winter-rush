window.WinterRushData = {
  T: {
    logFuel: 6,                   // seconds of fire per log (before hearth levels)
    cook: { steak: 2.5 }, burn: 35,
    meatPerSteak: [1, 2, 2], grillFeed: .45,   // by village stage: raw meat per steak; seconds between grill loads
    price: { steak: 12, sfish: 18, leather: 32, hide: 4, meat: 2, pizza: 100, sushi: 150, craft: 280, pelt: 150, tusk: 220 },   // pelt/tusk: rare trophies beyond what legendary gear still needs sell automatically
    guard: { baseCost: 600, costPerStorm: 200, max: 3 },   // only used to refund old 경비 보급 stock
    burnGrow: .15, burnMax: 2.2,   // fire burns faster each blizzard survived (×1 → ×2.2)
    smoke: { time: 3.5, fishPerLog: 1, stormUse: 1.5 },   // oven: 1 log per fish, 1.5 logs in a blizzard
    ovenTime: [3.5, 2.6, 1.8], ovenCap: [18, 24, 30],   // fish oven level: seconds per fish, fish stacked on top
    playerFishTime: 2.2,           // seconds per fish when the player fishes  // stage 2 fish oven: slow roast on the oven top, 1 log cooks 2 fish
    padDwell: .5,                  // seconds standing still on a pad before it starts taking coins
    tanTime: [0, 2, 1.2],          // seconds per leather good by artisan level
    staff: {                       // one worker per job; levels raise mastery
      helperCarry: [0, 4, 8, 12], helperSpeed: [0, 3.4, 4, 4.8], helperChop: [0, .8, .6, .45],
      serverCarry: [0, 6, 10, 14], serverSpeed: [0, 3.6, 4.4, 5.2], serverIv: [0, .15, .1, .06],
      hunterDmg: [0, 1, 2, 4, 7, 10], hunterCd: [0, .9, .7, .45, .34, .26],
      shopSlots: 3, shopIv: .14,   // every shop serves 3 customers at once, one item every .14 s (no clerks)
      hunterCarry: [0, 6, 8, 16, 20, 26], hunterHides: [0, 4, 6, 8, 10, 12],   // meat / hides a hunter carries home by mastery level 1-5
      hunterStage: { speed: [1, 1.15, 1.3, 1.45], carry: [0, 2, 8, 12], dmg: [0, 1, 3, 5], hp: [12, 16, 20, 26] },
      hunterHp: [0, 0, 3, 6, 10, 14], hunterBlock: [0, 0, .15, .25, .35, .45],   // by hunter mastery: extra hp, chance to shrug off a bite
      hunterFeed: .8,   // hunters carry meat straight to the grill / pizza meat tile while it is below 80% full
      hunterFlee: .35, hunterKite: 2.1, hunterBeastLv: 4,   // retreat home below 35% hp, step back from bears closer than 2.1, fight saber/mammoth/chief only from mastery Lv4   // by village stage 1-4 (hearth Lv6/10/15): new coat + weapon each stage
    farmerCarry: [0, 4, 8], farmerSpeed: [0, 3.4, 4.2], pizzaChefCarry: [0, 4, 8], pizzaChefSpeed: [0, 3.6, 4.4],
    fisherCatch: [0, 1.9, 1.4, 1], fisherCarry: [0, 8, 12, 16],   // seconds per fish / fish per trip by fisher mastery
    },
    // 🦸 hero growth: one pad, 2 levels per village stage. Each level changes looks, speed, weapon, kill and slam effects
    hero: {
      title: ['견습 사냥꾼', '숲 사냥꾼', '설원 전사', '얼음 전사', '불꽃 기사', '폭풍 기사', '빙하 수호자', '전설의 사냥꾼', '오로라 영웅'],
      speed: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9], dmg: [1, 2, 3, 4, 6, 8, 11, 15, 20], hp: [5, 6, 7, 8, 9, 10, 11, 12, 13],
      block: [0, .05, .09, .13, .17, .21, .26, .31, .36], atk: [.75, .71, .67, .63, .59, .56, .53, .5, .46],
      coat: [0, 1, 1, 2, 2, 3, 4, 4, 5], boots: [0, 1, 1, 1, 2, 3, 3, 4, 5], cape: [0, 0, 1, 2, 3, 4, 5, 5, 6],   // look index per hero level
      bag: [10, 16, 22, 28, 34, 40, 46, 52, 60],
      dangerPct: .4, rushLv: 3, rushMul: 1.4,   // ♥ badge over the head at ≤40% health; from hero Lv3, danger also gives ×1.4 move speed   // 🎒 bag size per hero level (no separate bag pad)
      kill: ['먼지', '나무 조각', '불티', '금빛 별', '얼음 파편', '화염', '번개', '빙하 분수', '오로라'],
    },
    // 🔥 what each hearth level opens (index = levels bought). stage: village expansion, say: the "이제 할 수 있는 것" card
    // wall / guard: gate defence now grows with the hearth itself (no separate 돌담 / 경비 보급 pads)
    hearth: [
      { open: ['fire', 'hero'], say: ['🪓 나무를 베어 모닥불에 넣기', '🐻 곰 사냥 → 고기 굽기 → 스테이크 팔기'] },
      { open: ['helper', 'helperUp'], say: ['👷 나무꾼 고용: 장작을 대신 날라요'] },
      { open: ['server', 'serverUp'], say: ['🧑‍🍳 서빙 직원 고용: 스테이크를 진열대로 옮겨요'] },
      { open: ['hunter', 'hunterUp'], say: ['🏹 사냥꾼 고용: 곰을 잡아 고기를 가져와요'] },
      { open: [], sale: 3, say: ['🏪 단골손님이 늘어요: 모든 판매가 +3%'] },
      { guard: 1, open: ['fisher', 'fisherUp', 'oven'], stage: 2, say: ['🎣 얼음 구멍에서 낚시하기', '🔥 생선 화덕에 생선 + 장작 → 생선구이 팔기', '🪝 낚시꾼 고용', '🧣 직원 목도리 · 🏹 사냥꾼 합성 활: 빨라지고 더 많이 날라요', '🛡️ 경비 강화: 눈보라 습격 곰 1마리 더 막기'] },
      { open: [], sale: 3, say: ['🐟 생선구이 단골: 모든 판매가 +3%', '👷 두 번째 나무꾼 · 🏹 사냥꾼 고용 가능'] },
      { guard: 1, open: ['artisan', 'artisanUp'], say: ['🟫 가죽이 떨어져요: 가죽 공방에 가져가기', '🧵 가죽 장인 고용 → 가죽 제품 팔기', '🛡️ 경비 강화: 눈보라 습격 곰 1마리 더 막기'] },
      { open: [], sale: 3, say: ['👜 가죽 제품 입소문: 모든 판매가 +3%'] },
      { wall: 1, open: ['farmer', 'farmerUp', 'pizzaChef', 'pizzaChefUp', 'pizzaOven'], stage: 3, say: ['🥬 텃밭 채소 + 고기 + 생선 + 장작 → 피자', '🧑‍🌾 농부 · 👨‍🍳 피자 쉐프 고용', '🐻 곰이 더 많이 나와요 · 🏹 사냥꾼 4명까지', '🎩 직원 털모자 · 🏹 사냥꾼 석궁: 더 세고 튼튼해요', '🧱 울타리 강화: 돌담 · 습격 곰 1마리 덜 옴'] },
      { guard: 1, open: ['warehouse'], say: ['🏚️ 큰 창고: 재료가 한곳에 모이고 배달원이 날라요', '🛡️ 경비 강화: 눈보라 습격 곰 1마리 더 막기'] },
      { guard: 1, open: ['smith', 'smithUp', 'saberCoat', 'tuskAxe'], say: ['⚒️ 대장간: 검치호 가죽 · 매머드 뿔로 전설 장비 만들기', '🐯 검치호 · 🦣 매머드는 대장장이를 고용하면 나타나요', '🛡️ 경비 강화: 눈보라 습격 곰 1마리 더 막기'] },
      { wall: 1, open: [], say: ['🧱 울타리 강화: 두꺼운 돌담 · 습격 곰 1마리 덜 옴'] },
      { guard: 1, open: ['statue'], say: ['🗿 명성 동상: 모든 판매가 상승', '🛡️ 경비 강화: 눈보라 습격 곰 1마리 더 막기'] },
      { guard: 1, open: ['boat', 'sushiChef', 'sushiChefUp'], stage: 4, say: ['🚤 어선으로 참치 잡기', '🍣 참치 + 생선 + 채소 + 장작 → 초밥', '🍣 초밥 쉐프 고용', '❄️ 직원 방한 파카 · 🏹 사냥꾼 얼음 활: 가장 빠르고 강해요', '🚣 부두 끝에서 배 타고 바다로: 참치 작살 · 범고래 전투 · 🦭 바다표범 친구', '🛡️ 경비 강화: 눈보라 습격 곰 1마리 더 막기'] },
      { open: ['crane'], say: ['🏗️ 부두 크레인: 어획량 ↑, 적재 칸에 쌓이면 배달원이 창고로 옮겨요'] },
      { guard: 1, open: [], sale: 5, say: ['💰 모든 판매가 +5%', '🛡️ 경비 강화: 눈보라 습격 곰 1마리 더 막기'] },
      { guard: 1, open: [], sale: 10, say: ['🌌 오로라 모닥불 완성! 모든 판매가 +10%', '🛡️ 경비 강화: 눈보라 습격 곰 1마리 더 막기'] },
    ],
    combat: { autoInterval: .75, manualSwing: .24, comboWindow: 1.6, critChance: .15, slamEvery: 4, tapRange: 2.7 },
    alpha: { every: 3, hp: 12, meat: 4, coins: 80, pupChance: .6 },   // every 3rd wolf pack (from the 2nd blizzard) brings an alpha
    pet: { tameMeat: 8, tameFish: 6, sealPup: .35, guard: 12,   // guard: pets chase sea thieves (penguins…) within this range of the hero or the dock   // 🦭 seal pups (stage 4 floes) are tamed with fish; one wolf + one seal pet at most
      hits: [0, 15, 40, 80, 140], dmg: [1, 2, 3, 4, 6], cd: [1, .9, .8, .7, .6], scale: [.55, .65, .78, .9, 1.05] },
    calmTime: 70, firstCalm: 80, warnTime: 8, stormTime: 25,
    stormBurn: 3.5, stormSlow: .35,
    bearMeat: [3, 4, 5, 6],   // meat per field bear by village stage 1-4
    campRegen: .8,             // seconds per heart regained inside the village (was 2.5)
    fieldBears: 7, maxFieldBears: 12, bearRespawn: 4, stageBears: [0, 3, 7, 11], stageRespawn: [4, 3.5, 2, 1.6],   // pizza/sushi eat meat: more bears and faster respawn by village stage 1-4
    bearHp: 4, bossEvery: 4,
    wolfPackSize: 3, maxWolves: 10, wolfSpawn: 14, stageWolves: [0, 3, 6, 9], stagePack: [0, 0, 1, 1], stageWolfSpawn: [14, 12, 10, 8],   // later stages: more and bigger packs, more meat
    wolfStartSold: 8, hurtGrace: .8,
    hideChance: { bear: .6, wolf: .35 },   // hides drop only sometimes; bosses/alpha/beasts always drop theirs
    leatherShop: { iv: 3.5, maxQ: 5, slots: 2 },   // customers only come while there is stock (leather + hides) to serve them
    axeChop: [.42, .34, .27, .21, .19, .17, .15, .13, .12],   // seconds per chop by axe level
    // hero power = hero level + legendary gear; field animals get tougher and new beasts appear (trophy beasts only from hearth Lv12, when the gear pads open)
    powerHp: { bear: 1.2, wolf: .7, alpha: 2, boss: 4 },
    beasts: {
      every: 25, coinsPer: 6,
      penguin: { name: '난폭한 펭귄', power: 0, hp: 3, hpPer: .4, dmg: 1, spd: 3.6, scale: 1, meat: 0, coins: 8, hides: 0, max: 15 },
      seal:    { name: '바다표범', power: 0, hp: 10, hpPer: 1, dmg: 1, spd: 3, scale: 1, meat: 2, coins: 20, hides: 0, max: 2, blubber: 2, loot: { whide: 1 } },
      walrus:  { name: '바다코끼리 대장', power: 0, hp: 60, hpPer: 4, dmg: 3, spd: 2.2, scale: 1, meat: 6, coins: 300, hides: 0, max: 1, blubber: 3, loot: { ivory: 2, whide: 2 } },
      orca:    { name: '범고래', power: 0, hp: 90, hpPer: 5, dmg: 3, spd: 4.2, scale: 1, meat: 0, coins: 500, hides: 0, max: 1, blubber: 4 },
      chief:   { name: '대장 곰', power: 2,  hp: 20, hpPer: 6, dmg: 2, spd: 2.8, scale: 1.45, meat: 6,  coins: 60,  hides: 1, max: 1 },
      saber:   { name: '검치호',  power: 4,  hp: 12, hpPer: 4, dmg: 2, spd: 4.4, scale: 1.1,  meat: 4,  coins: 50,  hides: 1, max: 2, trophy: 'pelt' },
      mammoth: { name: '매머드',  power: 6,  hp: 45, hpPer: 8, dmg: 3, spd: 2.2, scale: 1,    meat: 10, coins: 160, hides: 2, max: 1, trophy: 'tusk' },
    },
    // legendary gear crafted from beast trophies (coins + 🐯 pelts / 🦣 tusks)
    legend: { coatBlock: [0, .08, .16], coatHp: [0, 2, 4], axeDmg: [0, 5, 12], slamR: [0, .8, 1.6] },
    tower: { cd: [1.2, .9, .6], dmg: [2, 4, 7], range: 11 },   // gate Lv4-6
    // stage 3 (큰 화로): garden → veg, veg + meat + logs → pizza, smith processes beast trophies
    garden: { grow: 16, harborGrow: 8 },
    pizzaTime: [3.2, 2.4, 1.7],    // seconds per pizza batch by pizza oven level (1 log per batch)
    pizzaChefWoodKeep: 12,         // the pizza chef only takes logs from the hearth pile above this many
    pizzaRecipe: { veg: 2, meat: 4, fish: 3 }, pizzaRecipeHarbor: { veg: 1, meat: 4, fish: 3 },
    smithTime: [0, 8, 4],          // seconds per trophy processed by smith level
    warehouse: { cap: [0, 800, 1200, 1600, 2000, 2400] },   // slots per warehouse level
    courier: { carry: [0, 20, 24, 28, 32, 36], speed: [0, 5.5, 5.8, 6.1, 6.4, 6.7] },   // delivery workers, by warehouse level: mixed loads up to this many items
    fireLv: .08,                  // each hearth level: a log burns 8% longer
    econ: { cost: [1, 1.5, 2.2, 3], sale: [1, 1.5, 2.2, 3] },   // by village stage 1-4: upgrade/hire prices and every sale (shops, wages, traders, surplus) scale together
    wage: { every: 60, per: 8 },   // per staff each payday (stage 3), paid from the wallet
    // stage 4 (빙하 항구): boats, tuna, sushi, sea animals, sea fog
    harbor: {
      boatTime: [0, 9, 8, 7], boatFish: [0, 5, 7, 5], boatTuna: [0, 0, 1, 4],   // by boat tier: 쪽배 / 그물배 / 원양선
      sushiTime: [0, 3, 2], chefCarry: 6,
      crane: { mul: [1, 1.2, 1.4, 1.6, 1.8], cap: [20, 40, 60, 80, 100], unload: [3, 1.6, 1.2, .8, .5], haul: .2 },   // by crane level: catch ×, 🏗️ loading-tile slots, seconds to unload; couriers haul from 20% full
      fogEvery: 110, fogDur: 25,   // sea fog
      penguinEvery: 45, penguinPack: 5, sealEvery: 30, walrusEvery: 180, blubberFuel: 18,
      harpoon: .7, schoolSize: 4,
      sushiRecipe: { tuna: 1, fish: 1, veg: 1, log: 1 },   // logs only feed the hearth, fish oven, pizza oven and sushi
    },
    craftTime: 5,                  // walrus ivory (smith) / walrus hide (artisan) → 🏺 craft goods sold at the leather stall
    trade: { every: 90, rush: .85, max: [0, 0, 0, 250, 500], keep: 15, keepBy: { meat: 150, fish: 80, veg: 50, log: 80, tuna: 40, hide: 30, blubber: 20 }, price: { log: 2, veg: 3, meat: 3, fish: 4, hide: 6, tuna: 12, blubber: 5 } },   // stage 3 wagon / stage 4 ship buy warehouse surplus above `keep`; a near-full warehouse (rush) calls them early
    feast: { every: 180, dur: 60, need: { meat: 15, veg: 15, fish: 10 }, saleMul: 1.3, staffMul: 1.2 },   // stage 3+ village feast
    staffBurn: .04,                // the main hearth burns 4% faster per staff member
    armor: { boots: [0, .04, .08, .12, .16, .2], coat: [0, .08, .16, .24, .3, .36] },   // chance to block a hit
    max: { ivory: 10, whide: 10, craft: 10, suWood: 10, suTuna: 10, suFish: 10, suVeg: 10, sushi: 16, blubber: 10, vegCrate: 20, pzVeg: 12, pzMeat: 24, pzFish: 16, pzWood: 12, pizza: 16, forgeRaw: 10, wood: 40, meat: 30, grill: 18, counter: 16, hide: 20, fishCrate: 20, fishRaw: 30, ovenWood: 12, fishSmoked: 12, fishStock: 20, leather: 16 },
  },
  UP: {
    // 🔥 the hearth is the only gate: each level opens the pads listed in T.hearth[level] (Lv6 / Lv10 / Lv15 expand the village)
    fire:    { name: '모닥불', icon: '🔥', costs: [40, 80, 150, 250, 400, 600, 900, 1200, 2000, 1400, 1700, 2000, 2400, 3000, 2400, 3200, 4500], vals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] },
    hero:    { name: '주인공 성장', icon: '🦸', costs: [60, 150, 300, 600, 1000, 1600, 2500, 4000], vals: [0, 1, 2, 3, 4, 5, 6, 7, 8], stage: [1, 1, 2, 2, 3, 3, 4, 4] },   // 2 levels per village stage
    // hire pads (vals = workers) and their 강화 pads (vals = mastery level shared by every worker of that job)
    helper:  { name: '나무꾼',    icon: '👷', hire: 1, costs: [100, 500, 1200], vals: [0, 1, 2, 3], stage: [1, 2, 3] },
    helperUp: { name: '나무꾼',   icon: '👷', up: 'helper', costs: [220, 450], vals: [1, 2, 3] },
    server:  { name: '서빙 직원',  icon: '🧑‍🍳', hire: 1, costs: [150], vals: [0, 1] },
    serverUp: { name: '서빙 직원', icon: '🧑‍🍳', up: 'server', costs: [300, 600], vals: [1, 2, 3] },
    hunter:  { name: '사냥꾼',    icon: '🏹', hire: 1, costs: [200, 700, 1500, 2600], vals: [0, 1, 2, 3, 4], stage: [1, 2, 3, 3] },   // 4th hunter with the pizza stage
    hunterUp: { name: '사냥꾼',   icon: '🏹', up: 'hunter', costs: [500, 1000, 1800, 3000], vals: [1, 2, 3, 4, 5], stage: [1, 2, 3, 4] },   // mastery Lv4 with the pizza stage, Lv5 with the harbor; each level adds gear
    fisher:  { name: '낚시꾼',    icon: '🪝', hire: 1, costs: [300, 800, 1600, 2800], vals: [0, 1, 2, 3, 4], stage: [2, 2, 3, 4] },   // 3rd with the pizza stage, 4th with the harbor
    fisherUp: { name: '낚시꾼',   icon: '🪝', up: 'fisher', costs: [700, 1800], vals: [1, 2, 3], stage: [2, 3] },
    oven:    { name: '생선 화덕',  icon: '🔥', costs: [300, 700], vals: [0, 1, 2] },
    artisan: { name: '가죽 장인',  icon: '🧵', hire: 1, costs: [200], vals: [0, 1] },
    artisanUp: { name: '가죽 장인', icon: '🧵', up: 'artisan', costs: [500], vals: [1, 2] },
    farmer:  { name: '농부', icon: '🧑‍🌾', hire: 1, costs: [600], vals: [0, 1] },
    farmerUp: { name: '농부', icon: '🧑‍🌾', up: 'farmer', costs: [1300], vals: [1, 2] },
    pizzaChef: { name: '피자 쉐프', icon: '👨‍🍳', hire: 1, costs: [600], vals: [0, 1] },
    pizzaChefUp: { name: '피자 쉐프', icon: '👨‍🍳', up: 'pizzaChef', costs: [1400], vals: [1, 2] },
    pizzaOven: { name: '피자 화덕', icon: '🍕', costs: [800, 1800], vals: [0, 1, 2] },
    warehouse: { name: '큰 창고', icon: '🏚️', costs: [2000, 3500, 6000, 9000, 13000], vals: [0, 1, 2, 3, 4, 5], stage: [3, 3, 3, 4, 4] },   // each level: +1 courier (up to 5), more room
    smith:   { name: '대장장이', icon: '⚒️', hire: 1, costs: [700], vals: [0, 1] },
    smithUp: { name: '대장장이', icon: '⚒️', up: 'smith', costs: [1500], vals: [1, 2] },
    saberCoat: { name: '검치호 갑옷', icon: '🐯', costs: [600, 1500], mats: { pelt: [2, 4] }, vals: [0, 1, 2] },
    tuskAxe:   { name: '매머드 뿔 창', icon: '🦣', costs: [900, 2200], mats: { tusk: [1, 3] }, vals: [0, 1, 2] },
    wall:    { name: '돌담', icon: '🧱', costs: [1500, 3000], vals: [0, 1, 2] },   // −1 raider per level
    guard:   { name: '경비 보급', icon: '🛡️', costs: [0], vals: [0, 0] },   // not a level: buys one guard per blizzard (T.guard)
    statue:  { name: '명성 동상', icon: '🗿', costs: [500, 900, 1600, 2800, 5000, 9000, 16000, 30000], vals: [0, 6, 12, 18, 24, 30, 36, 42, 48] },   // +% to every sale
    boat:    { name: '어선', icon: '🚤', costs: [1500, 3000, 6000, 4000], vals: [0, 1, 2, 3, 4] },   // Lv1-3 boat tier, Lv4 a second boat
    crane:   { name: '부두 크레인', icon: '🏗️', costs: [1200, 2500, 4500, 7000], vals: [0, 1, 2, 3, 4] },
    sushiChef: { name: '초밥 쉐프', icon: '🍣', hire: 1, costs: [2500], vals: [0, 1] },
    sushiChefUp: { name: '초밥 쉐프', icon: '🍣', up: 'sushiChef', costs: [5000], vals: [1, 2] },
  },
};

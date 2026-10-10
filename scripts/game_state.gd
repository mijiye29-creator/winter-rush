extends RefCounted

const WIDTH := 7
const HEIGHT := 9
const VILLAGE := Vector2i(3, 3)
const MARKET := Vector2i(2, 3)
const LEVEL_TILE := Vector2i(4, 3)
const EXPAND_TILE := Vector2i(3, 2)
const TREES := [Vector2i(1, 4), Vector2i(5, 4), Vector2i(1, 6), Vector2i(5, 6)]
const ORES := [Vector2i(0, 7), Vector2i(6, 7)]
const BUILDING_CELLS := [Vector2i(2, 2), Vector2i(4, 2), Vector2i(3, 1)]
const BUILDING_NAMES := ["집", "작업장", "망루"]

var player := Vector2i(3, 4)
var wood := 0
var ore := 0
var coins := 0
var xp := 0
var level := 1
var expansions := 0
var village_hp := 10
var turn := 0
var enemies: Array[Vector2i] = []
var finished := false
var won := false


func tile_at(cell: Vector2i) -> String:
	if cell == VILLAGE:
		return "village"
	if cell == MARKET:
		return "market"
	if cell == LEVEL_TILE:
		return "level"
	if cell == EXPAND_TILE:
		return "expand"
	if cell in TREES:
		return "tree"
	if cell in ORES:
		return "ore"
	if building_at(cell) != "":
		return "building"
	return "ground"


func building_at(cell: Vector2i) -> String:
	var index := BUILDING_CELLS.find(cell)
	if index >= 0 and index < expansions:
		return BUILDING_NAMES[index]
	return ""


func move_to(cell: Vector2i) -> String:
	if finished:
		return "게임이 끝났어요. R 또는 화면을 눌러 다시 시작하세요."
	if cell.x < 0 or cell.x >= WIDTH or cell.y < 0 or cell.y >= HEIGHT:
		return "지도 밖으로 갈 수 없어요."
	if abs(cell.x - player.x) + abs(cell.y - player.y) != 1:
		return "바로 옆 칸을 눌러 이동하세요."

	player = cell
	turn += 1
	var message := "이동했어요."
	var enemy_index := enemies.find(cell)
	if enemy_index >= 0:
		enemies.remove_at(enemy_index)
		xp += 2
		message = "침입자를 막았어요! 경험치 +2"
	else:
		match tile_at(cell):
			"tree":
				wood += 1
				xp += 1
				message = "나무를 모았어요. 경험치 +1"
			"ore":
				ore += 1
				xp += 1
				message = "광석을 캤어요. 경험치 +1"
			"market":
				var earned := wood * 3 + ore * 5
				coins += earned
				wood = 0
				ore = 0
				message = "자원을 팔아 %d원을 벌었어요." % earned
			"level":
				var cost := level * 3
				if xp >= cost:
					xp -= cost
					level += 1
					message = "레벨 %d 달성!" % level
				else:
					message = "레벨업에는 경험치 %d가 필요해요." % cost
			"expand":
				var cost := (expansions + 1) * 10
				if expansions >= BUILDING_NAMES.size():
					message = "마을을 모두 확장했어요."
				elif coins >= cost:
					coins -= cost
					expansions += 1
					village_hp += 3
					message = "%s 건설! 마을 체력 +3" % BUILDING_NAMES[expansions - 1]
				else:
					message = "확장에는 %d원이 필요해요." % cost

	_advance_enemies()
	if turn % 6 == 0:
		_spawn_enemy()
		message += " 침입자가 나타났어요!"
	if village_hp <= 0:
		village_hp = 0
		finished = true
		message = "마을이 함락됐어요. 다시 도전해 보세요."
	elif expansions >= 3 and level >= 3:
		finished = true
		won = true
		message = "승리! 마을을 세 번 확장하고 레벨 3에 도달했어요."
	return message


func _advance_enemies() -> void:
	var next_enemies: Array[Vector2i] = []
	for enemy in enemies:
		var delta := VILLAGE - enemy
		var next_cell := enemy
		if abs(delta.x) >= abs(delta.y) and delta.x != 0:
			next_cell.x += 1 if delta.x > 0 else -1
		elif delta.y != 0:
			next_cell.y += 1 if delta.y > 0 else -1
		if next_cell == VILLAGE:
			village_hp -= 1
		elif next_cell != player and next_cell not in next_enemies:
			next_enemies.append(next_cell)
		else:
			next_enemies.append(enemy)
	enemies = next_enemies


func _spawn_enemy() -> void:
	var spawn := Vector2i(0, 0) if (turn / 6) % 2 == 1 else Vector2i(6, 8)
	if spawn != player and spawn not in enemies:
		enemies.append(spawn)

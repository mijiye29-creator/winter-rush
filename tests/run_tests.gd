extends SceneTree

const GameState = preload("res://scripts/game_state.gd")
var failures := 0


func _initialize() -> void:
	_test_gather_sell_expand()
	_test_level_defense_and_loss()
	_test_wave_and_victory()
	_test_visible_expansion()
	print("GameState tests: %d failure(s)" % failures)
	quit(1 if failures > 0 else 0)


func _check(condition: bool, description: String) -> void:
	if not condition:
		failures += 1
		push_error(description)


func _test_gather_sell_expand() -> void:
	var game = GameState.new()
	_check(game.move_to(Vector2i(1, 4)).contains("옆 칸"), "nonadjacent move is rejected")
	_check(game.turn == 0, "invalid move does not advance time")
	game.move_to(Vector2i(2, 4))
	game.move_to(Vector2i(1, 4))
	_check(game.wood == 1 and game.xp == 1, "tree gives wood and XP")
	game.move_to(Vector2i(2, 4))
	game.move_to(Vector2i(2, 3))
	_check(game.coins == 3 and game.wood == 0, "market sells and clears inventory")
	game.coins = 10
	game.move_to(Vector2i(3, 3))
	game.move_to(Vector2i(3, 2))
	_check(game.expansions == 1 and game.coins == 0 and game.village_hp == 13, "expansion costs coins and protects village")


func _test_level_defense_and_loss() -> void:
	var game = GameState.new()
	game.xp = 3
	game.move_to(Vector2i(4, 4))
	game.move_to(Vector2i(4, 3))
	_check(game.level == 2 and game.xp == 0, "level tile spends XP")
	game.enemies.append(Vector2i(5, 3))
	game.move_to(Vector2i(5, 3))
	_check(game.enemies.is_empty() and game.xp == 2, "moving into enemy defends village")
	game.village_hp = 1
	game.enemies.append(Vector2i(2, 3))
	game.move_to(Vector2i(6, 3))
	_check(game.finished and game.village_hp == 0, "enemy reaching village ends game")


func _test_wave_and_victory() -> void:
	var game = GameState.new()
	for index in 6:
		game.move_to(Vector2i(2, 4) if index % 2 == 0 else Vector2i(3, 4))
	_check(game.turn == 6 and game.enemies.size() == 1, "enemy wave spawns after six valid turns")
	game.expansions = 3
	game.level = 3
	game.move_to(Vector2i(2, 4))
	_check(game.finished and game.won, "three expansions and level three win the game")


func _test_visible_expansion() -> void:
	var game = GameState.new()
	var first: Vector2i = GameState.BUILDING_CELLS[0]
	_check(game.building_at(first) == "" and game.tile_at(first) == "ground", "unbuilt space starts empty")
	game.move_to(Vector2i(3, 3))
	game.move_to(Vector2i(3, 2))
	_check(game.expansions == 0 and game.building_at(first) == "", "unaffordable expansion creates no building")
	for index in 3:
		game.coins = (index + 1) * 10
		game.move_to(Vector2i(3, 3))
		game.move_to(Vector2i(3, 2))
		var site: Vector2i = GameState.BUILDING_CELLS[index]
		_check(game.building_at(site) == GameState.BUILDING_NAMES[index], "paid expansion creates its building")
		_check(game.tile_at(site) == "building", "built space is visible to the map")
	_check(game.expansions == 3 and game.coins == 0, "all three expansion prices are paid")
	game.coins = 100
	game.move_to(Vector2i(3, 3))
	game.move_to(Vector2i(3, 2))
	_check(game.expansions == 3 and game.coins == 100, "completed village cannot buy a fourth building")

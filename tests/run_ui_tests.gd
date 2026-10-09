extends SceneTree

const MainScene = preload("res://scenes/Main.tscn")
const GameState = preload("res://scripts/game_state.gd")
var failures := 0


func _initialize() -> void:
	call_deferred("_run")


func _run() -> void:
	var main = MainScene.instantiate()
	root.add_child(main)
	_check(not ProjectSettings.get_setting("input_devices/pointing/emulate_mouse_from_touch"), "touch should not create a second mouse move")
	var layout: Dictionary = main._layout()
	var cell: int = layout.cell
	var target := Vector2i(2, 4)
	var touch := InputEventScreenTouch.new()
	touch.pressed = true
	touch.position = layout.origin + Vector2((target.x + 0.5) * cell, (target.y + 0.5) * cell)
	main._input(touch)
	_check(main.game.player == target and main.game.turn == 1, "touch moves one adjacent tile once")
	var key := InputEventKey.new()
	key.pressed = true
	key.keycode = KEY_R
	main._input(key)
	_check(main.game.player == Vector2i(3, 4) and main.game.turn == 0, "restart resets the game")
	_check_phone_readability(main)
	print("UI input tests: %d failure(s)" % failures)
	quit(1 if failures > 0 else 0)


func _check(condition: bool, description: String) -> void:
	if not condition:
		failures += 1
		push_error(description)


# The 720px canvas is about half size on a phone: 24px text ≈ 12dp, an 88px tile ≈ 44dp touch target.
func _check_phone_readability(main) -> void:
	for font_size in [main.HUD_FONT, main.MESSAGE_FONT, main.TILE_FONT, main.FOOTER_FONT]:
		_check(font_size >= 24, "phone text is at least 24px (about 12dp)")
	var layout: Dictionary = main._layout()
	_check(layout.cell >= 88, "tiles stay at least 88px (about 44dp) for touch")
	var font := ThemeDB.fallback_font
	var longest := "게임이 끝났어요. R 또는 화면을 눌러 다시 시작하세요. 침입자가 나타났어요!"
	var wrapped := font.get_multiline_string_size(longest, HORIZONTAL_ALIGNMENT_LEFT, main.size.x - 40, main.MESSAGE_FONT)
	_check(wrapped.y <= font.get_height(main.MESSAGE_FONT) * 2 + 1, "long messages fit in two lines")
	var footer_bottom: float = layout.origin.y + layout.cell * GameState.HEIGHT + 134 + main.HUD_FONT * 0.3
	_check(footer_bottom <= main.size.y, "restart hint stays on screen")

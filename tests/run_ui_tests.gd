extends SceneTree

const MainScene = preload("res://scenes/Main.tscn")
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
	print("UI input tests: %d failure(s)" % failures)
	quit(1 if failures > 0 else 0)


func _check(condition: bool, description: String) -> void:
	if not condition:
		failures += 1
		push_error(description)

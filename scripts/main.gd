extends Control

const GameState = preload("res://scripts/game_state.gd")
const LABELS := {
	"tree": "나무", "ore": "광석", "market": "시장",
	"level": "성장", "expand": "확장", "village": "마을",
	"ground": ""
}
const COLORS := {
	"tree": Color("307c61"), "ore": Color("627487"),
	"market": Color("c58338"), "level": Color("8070b9"),
	"expand": Color("b4777e"), "village": Color("546e9a"),
	"ground": Color("cfdfdf")
}

# The 720px canvas is drawn at about half size on a phone, so 24px is roughly the 12dp minimum.
const HUD_FONT := 28
const MESSAGE_FONT := 26
const TILE_FONT := 26
const FOOTER_FONT := 24
const GRID_TOP := 250.0
const FOOTER_SPACE := 160.0

var game = GameState.new()
var message := "옆 칸을 눌러 움직이세요. 나무와 광석을 모아 시장에서 팔아요."


func _ready() -> void:
	queue_redraw()


func _layout() -> Dictionary:
	var cell := floori(min((size.x - 32.0) / GameState.WIDTH, (size.y - GRID_TOP - FOOTER_SPACE) / GameState.HEIGHT))
	cell = maxi(cell, 16)
	var origin := Vector2((size.x - cell * GameState.WIDTH) / 2.0, GRID_TOP)
	return {"cell": cell, "origin": origin}


func _draw() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color("ecf5f5"))
	var font := ThemeDB.fallback_font
	_text(font, "WINTER RUSH", Vector2(20, 46), 34, Color("173b4a"))
	_text(font, "돈 %d   나무 %d   광석 %d   경험치 %d" % [game.coins, game.wood, game.ore, game.xp], Vector2(20, 96), HUD_FONT)
	_text(font, "레벨 %d   확장 %d/3   마을 체력 %d   턴 %d" % [game.level, game.expansions, game.village_hp, game.turn], Vector2(20, 136), HUD_FONT)
	# Long messages wrap onto a second line instead of running off the right edge.
	draw_multiline_string(font, Vector2(20, 186), message, HORIZONTAL_ALIGNMENT_LEFT, size.x - 40, MESSAGE_FONT, 2, Color("173b4a"))
	var layout := _layout()
	var cell: int = layout.cell
	var origin: Vector2 = layout.origin
	for y in GameState.HEIGHT:
		for x in GameState.WIDTH:
			var point := Vector2i(x, y)
			var kind := game.tile_at(point)
			var rect := Rect2(origin + Vector2(x * cell, y * cell), Vector2(cell - 2, cell - 2))
			draw_rect(rect, COLORS[kind])
			var label: String = LABELS[kind]
			if point in game.enemies:
				draw_rect(rect.grow(-4), Color("bd4249"))
				label = "적"
			if point == game.player:
				draw_rect(rect.grow(-4), Color("f2d96b"))
				label = "나"
			if label != "":
				draw_string(font, rect.position + Vector2(0, cell * 0.58), label, HORIZONTAL_ALIGNMENT_CENTER, cell - 2, TILE_FONT, Color.WHITE if label != "나" else Color("173b4a"))
	var footer_y := origin.y + cell * GameState.HEIGHT + 34
	_text(font, "방향키 / WASD / 옆 칸 터치", Vector2(20, footer_y), FOOTER_FONT)
	_text(font, "시장: 판매   성장: 레벨업   확장: 마을 강화", Vector2(20, footer_y + 32), FOOTER_FONT)
	_text(font, "목표: 확장 3회 + 레벨 3   |   R: 처음부터", Vector2(20, footer_y + 62), FOOTER_FONT)
	if game.finished:
		_text(font, "화면을 눌러 다시 시작", Vector2(20, footer_y + 100), HUD_FONT, Color("bd4249"))


func _text(font: Font, value: String, position: Vector2, font_size: int, color := Color("334d56")) -> void:
	draw_string(font, position, value, HORIZONTAL_ALIGNMENT_LEFT, -1, font_size, color)


func _input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_R:
			_restart()
			return
		var direction := Vector2i.ZERO
		match event.keycode:
			KEY_UP, KEY_W: direction = Vector2i.UP
			KEY_DOWN, KEY_S: direction = Vector2i.DOWN
			KEY_LEFT, KEY_A: direction = Vector2i.LEFT
			KEY_RIGHT, KEY_D: direction = Vector2i.RIGHT
		if direction != Vector2i.ZERO:
			message = game.move_to(game.player + direction)
			queue_redraw()
	elif event is InputEventScreenTouch and event.pressed:
		_tap(event.position)
	elif event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		_tap(event.position)


func _tap(position: Vector2) -> void:
	if game.finished:
		_restart()
		return
	var layout := _layout()
	var cell: int = layout.cell
	var relative: Vector2 = position - layout.origin
	if relative.x < 0 or relative.y < 0:
		return
	var target := Vector2i(floori(relative.x / cell), floori(relative.y / cell))
	message = game.move_to(target)
	queue_redraw()


func _restart() -> void:
	game = GameState.new()
	message = "새 마을에서 다시 시작해요."
	queue_redraw()

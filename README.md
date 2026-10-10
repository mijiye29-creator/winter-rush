# winter-rush
한겨울 숲속 마을 모바일 게임 개발 프로젝트

## 윈터 러시
나무를 베고, 북극곰을 사냥해 고기를 굽고, 마을 주민에게 팔아 업그레이드하세요.
주기적으로 몰려오는 **눈보라** 동안 모닥불이 꺼지지 않게 지키고, 마을을 습격하는 **곰**을 막아야 합니다.

- 기획서: [`docs/GDD.md`](docs/GDD.md)
- 플레이 가능한 프로토타입: [`prototype/index.html`](prototype/index.html)

## 프로토타입 실행
빌드가 필요 없습니다. `prototype/index.html`을 브라우저로 열면 됩니다(three.js를 CDN에서 불러오므로 인터넷 연결 필요).

```bash
cd prototype && python3 -m http.server 8000
# 휴대폰과 PC가 같은 와이파이라면 휴대폰에서 http://<PC-IP>:8000 접속
```

조작: 화면을 드래그해 이동(가상 조이스틱), PC는 WASD 또는 방향키.

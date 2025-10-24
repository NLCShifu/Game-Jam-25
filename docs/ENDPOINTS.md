# Endpoints

## HTTP endpoints

| Method | Endpoint | Headers | Body | Response | Description |
|--------|---------|--------|------|---------|-------------|
| POST | /rooms | - | { "title": "My Room" } | { "room_id": "uuid-room-1234" } | Créer une room |
| POST | /rooms/{room_id}/join | - | { "display_name": "Boss" } | { "session_id": "uuid-session-1234", "room_id": "uuid-room-1234" } | Joindre une room et obtenir session_id |
| POST | /rooms/{room_id}/leave | session_id | - | { "status": "ok", "message": "Left room successfully" } | Quitter une room |
| GET  | /rooms/{room_id}/participants | session_id | - | { "participants": [ { "session_id": "uuid-session-1234", "display_name": "Boss", "joined_at": "2025-10-24T14:00:00Z" } ] } | Lister les participants de la room |
| GET  | /rooms/{room_id} | session_id | - | { "room_id": "uuid-room-1234", "title": "My Room", "participant_count": 2 } | Obtenir les informations d’une room |

## Websocket endpoints

- `/ws/meta/{room_id}?session_id=...`

Example:

```
{
  "own_life": 2,
  "their_life": 1,
  "own_name": "Simon",
  "thier_name": "Romain",
}
```

- `/ws/video/{room_id}?session_id=...`

Blob video.

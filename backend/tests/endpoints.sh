# Creating a game

response=$(curl -X POST http://127.0.0.1:8000/rooms?title=caca)

room_id=$(echo "$response" | jq -r '.["room_id"]')

echo "Created room at: $room_id \n"

curl http://127.0.0.1:8000/rooms/$room_id

curl -X POST http://127.0.0.1:8000/rooms/$room_id/join -d "{\"display_name\":\"player1\"}" -H "Content-Type: application/json"

curl http://127.0.0.1:8000/rooms/$room_id

#!/bin/bash

echo "🚀 Starting ELEVARE..."

# Kill existing processes on used ports
kill $(lsof -t -i:27017) 2>/dev/null
kill $(lsof -t -i:5000) 2>/dev/null
kill $(lsof -t -i:8000) 2>/dev/null
kill $(lsof -t -i:3000) 2>/dev/null
sleep 1

# MongoDB
mkdir -p /tmp/mongodb-data
gnome-terminal -- bash -c "mongod --dbpath /tmp/mongodb-data --bind_ip 127.0.0.1 --port 27017; exec bash" 2>/dev/null \
|| xterm -title "MongoDB" -e "mongod --dbpath /tmp/mongodb-data --bind_ip 127.0.0.1 --port 27017; bash" &

sleep 2

# Backend
gnome-terminal -- bash -c "cd ~/projects/ELEVARE/backend && node server.js; exec bash" 2>/dev/null \
|| xterm -title "Backend" -e "cd ~/projects/ELEVARE/backend && node server.js; bash" &

# AI Services
gnome-terminal -- bash -c "cd ~/projects/ELEVARE/ai-services && source venv/bin/activate && python3 main.py; exec bash" 2>/dev/null \
|| xterm -title "AI Services" -e "cd ~/projects/ELEVARE/ai-services && source venv/bin/activate && python3 main.py; bash" &

# Frontend
gnome-terminal -- bash -c "cd ~/projects/ELEVARE/frontend && npm run dev; exec bash" 2>/dev/null \
|| xterm -title "Frontend" -e "cd ~/projects/ELEVARE/frontend && npm run dev; bash" &

sleep 5
echo "✅ All services started!"
echo "🌐 Open: http://localhost:3000"

#!/bin/bash
# TechInHausa Newsletter Startup Script

echo "=================================================="
echo " Starting TechInHausa Newsletter Website"
echo "=================================================="

# Check if Python is available
if command -v python3 &>/dev/null; then
    echo "Starting local web server on port 3000 using Python 3..."
    echo "Opening http://localhost:3000 in your browser..."
    (sleep 1 && open "http://localhost:3000") &
    python3 -m http.server 3000
elif command -v node &>/dev/null; then
    echo "Starting server on port 3000 using Node.js..."
    echo "Opening http://localhost:3000 in your browser..."
    (sleep 1 && open "http://localhost:3000") &
    node server.js
else
    echo "Opening index.html directly in default browser..."
    open index.html
fi

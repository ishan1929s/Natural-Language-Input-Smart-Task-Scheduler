#!/bin/bash

cd /workspace/backend

# Kill any existing processes
pkill -f "node.*server.js" 2>/dev/null || true
sleep 2

# Start server in background
PORT=3001 node src/server.js &
SERVER_PID=$!

echo "Server PID: $SERVER_PID"
echo "Waiting for server to start..."
sleep 15

# Run tests
echo "Running tests..."
PORT=3001 node test-backend.js
TEST_EXIT=$?

# Cleanup
echo "Cleaning up..."
kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true

exit $TEST_EXIT

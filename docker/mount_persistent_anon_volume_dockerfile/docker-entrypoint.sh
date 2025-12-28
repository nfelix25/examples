#!/usr/bin/env bash

DIR="/app/quotes"

if [ -z "$(ls -A "$DIR")" ]; then
  echo "Quotes directory is empty. Creating sample quotes..."

  echo '{"quote": "The only limit to our realization of tomorrow is our doubts of today.", "author": "Franklin D. Roosevelt"}' > "$DIR/quote_1.txt"
  echo '{"quote": "In the middle of every difficulty lies opportunity.", "author": "Albert Einstein"}' > "$DIR/quote_2.txt"
  echo '{"quote": "What you get by achieving your goals is not as important as what you become by achieving your goals.", "author": "Zig Ziglar"}' > "$DIR/quote_3.txt"

  echo "Sample quotes created."
else
  echo "Quotes directory is not empty. No action taken."
fi

# Start the main application - exec "$@" replaces the current shell process with a new program specified by the script's arguments passed in by the CMD instruction in the Dockerfile.
exec "$@"
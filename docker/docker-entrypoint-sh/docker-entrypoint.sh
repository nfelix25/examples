#!/bin/bash

# Check if a filename argument was provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <filename>"
    exit 1
fi

# The filename is the first argument passed to the script
FILE_NAME="$1"

# Content to write to the file
CONTENT="Hello, this is a message written by the script."

# Write the content to the specified file, overwriting any existing content
echo "$CONTENT" > "$FILE_NAME"

# Check if the write operation was successful
if [ $? -eq 0 ]; then
    echo "Successfully wrote to $FILE_NAME"
    echo "Content of $FILE_NAME:"
    cat "$FILE_NAME"
else
    echo "Failed to write to $FILE_NAME"
    exit 1
fi


# Docker CP Example

A minimal example demonstrating `docker cp` to copy files to/from a running container.

## How it works

1. The container runs a Node.js app that watches for `input.txt`
2. You copy a file INTO the container using `docker cp`
3. The app processes it and creates `output.txt`
4. You copy the result OUT of the container using `docker cp`

## Usage

```bash
# Build the image
docker build -t docker-cp-demo .

# Run container in background
docker run -d --name myapp docker-cp-demo

# Watch the logs
docker logs -f myapp

# Create a test file
echo "hello world" > input.txt

# Copy file INTO container
docker cp input.txt myapp:/app/

# Wait a moment, then copy file OUT of container
docker cp myapp:/app/output.txt .

# Check the result
cat output.txt

# Cleanup
docker stop myapp
docker rm myapp
```

## Key Commands

- `docker cp <host-path> <container>:<container-path>` - Copy TO container
- `docker cp <container>:<container-path> <host-path>` - Copy FROM container

FROM ubuntu:latest

# Copy the custom entrypoint script into the image
COPY docker-entrypoint.sh /usr/local/bin/

# Make the script executable
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set the entrypoint to the script (exec form recommended)
ENTRYPOINT ["docker-entrypoint.sh"]

# Provide a default argument (this is passed to the entrypoint script) - filename in this demo
CMD ["out.txt"]


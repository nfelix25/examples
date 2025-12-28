FROM ubuntu

# Set environment variable to prevent interactive prompts
# -y flag below ENV DEBIAN_FRONTEND=noninteractive

COPY --from=docker:latest /usr/local/bin/docker /usr/local/bin/docker

RUN apt-get update

# Use -y flag to auto-confirm installation
RUN apt-get install -y nodejs

COPY ./log.js ./log.js

CMD ["node", "log.js"]

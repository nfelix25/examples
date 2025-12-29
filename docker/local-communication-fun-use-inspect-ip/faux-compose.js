// Use execSync to run a mongo docker container and then use inspect to get the IP
const { execSync } = require('child_process');
require('dotenv').config();

const PORT = process.env.PORT || 4000;

function runMongoContainerAndGetIP() {
  try {
    // Check if faux-mongo container is already running
    const checkCommand =
      'docker ps --filter "name=faux-mongo" --format "{{.Names}}"';
    const existingContainer = execSync(checkCommand).toString().trim();

    let containerId;
    if (existingContainer === 'faux-mongo') {
      console.log(
        'MongoDB container already running, using existing container'
      );
      containerId = 'faux-mongo';
    } else {
      // Run a mongo container in detached mode
      console.log('Starting new MongoDB container');
      const runCommand = 'docker run -d --rm --name faux-mongo mongo:latest';
      containerId = execSync(runCommand).toString().trim();
    }

    // Inspect the container to get its IP address
    const inspectCommand = `docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${containerId}`;
    const containerIP = execSync(inspectCommand).toString().trim();

    return containerIP;
  } catch (error) {
    console.error('Error getting MongoDB container IP:', error);
    return null;
  }
}

const mongoIP = runMongoContainerAndGetIP();

console.log('MongoDB Container IP Address:', mongoIP);

// Now run the local dockerfile service with the obtained IP as build-arg
if (mongoIP) {
  try {
    const buildCommand = `docker build --build-arg MONGO_IP=${mongoIP} -t local-service .`;
    execSync(buildCommand, { stdio: 'inherit' });
    console.log('Local service built successfully with MongoDB IP:', mongoIP);

    const runCommand = `docker run --env-file .env -d --rm --name local-service -p ${PORT}:${PORT} local-service`;
    execSync(runCommand, { stdio: 'inherit' });
    console.log(`Local service is running on port ${PORT}`);
  } catch (error) {
    console.error('Error building local service:', error);
  }
}

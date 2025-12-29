// Use execSync to run a mongo docker container and then use inspect to get the IP
const { execSync } = require('child_process');
require('dotenv').config();

const MONGO_CONTAINER_NAME = process.env.MONGO_CONTAINER_NAME || 'faux-mongo';
const PORT = process.env.PORT || 4000;
const NETWORK_NAME = process.env.NETWORK_NAME || 'faux-network';

// Create a custom network if it doesn't exist
try {
  const networkCheckCommand = `docker network ls --filter "name=${NETWORK_NAME}" --format "{{.Name}}"`;
  const existingNetwork = execSync(networkCheckCommand).toString().trim();

  if (existingNetwork !== NETWORK_NAME) {
    console.log(`Creating Docker network: ${NETWORK_NAME}`);
    const createNetworkCommand = `docker network create ${NETWORK_NAME}`;
    execSync(createNetworkCommand);
  } else {
    console.log(`Docker network ${NETWORK_NAME} already exists`);
  }
} catch (error) {
  console.error('Error creating Docker network:', error);
  process.exit(1);
}

try {
  // Check if mongo container is already running
  const checkCommand = `docker ps --filter "name=${MONGO_CONTAINER_NAME}" --format "{{.Names}}"`;
  const existingContainer = execSync(checkCommand).toString().trim();

  let containerId;
  if (existingContainer === MONGO_CONTAINER_NAME) {
    console.log('MongoDB container already running, using existing container');
    containerId = MONGO_CONTAINER_NAME;
  } else {
    // Run a mongo container in detached mode
    console.log('Starting new MongoDB container');
    const runCommand = `docker run -d --rm --name ${MONGO_CONTAINER_NAME} --network ${NETWORK_NAME} mongo:latest`;
    containerId = execSync(runCommand).toString().trim();
  }
} catch (error) {
  console.error('Error starting MongoDB container:', error);
  process.exit(1);
}

try {
  const buildCommand = `docker build -t local-service .`;
  execSync(buildCommand, { stdio: 'inherit' });

  const runCommand = `docker run --env-file .env -d --rm --name local-service --network ${NETWORK_NAME} -p ${PORT}:${PORT} local-service`;
  execSync(runCommand, { stdio: 'inherit' });
  console.log(`Local service is running on port ${PORT}`);
} catch (error) {
  console.error('Error building local service:', error);
}

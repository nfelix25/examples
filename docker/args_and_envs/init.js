const { execSync } = require('child_process');

const args = process.argv.slice(2);
const PORT = parseInt(args[0], 10);

// Throw is PORT is not a number
if (isNaN(PORT)) {
  throw new Error('PORT argument must be a number');
}

const BUILD_ARGS = {
  IMAGE_NAME: 'docker-args-envs-example',
  INTERNAL_PORT: PORT,
  EXTERNAL_PORT: PORT + 1,
};

console.log('Build Arguments:', BUILD_ARGS);

const dockerBuildCommand = `docker build --build-arg INTERNAL_PORT=${BUILD_ARGS.INTERNAL_PORT} --build-arg EXTERNAL_PORT=${BUILD_ARGS.EXTERNAL_PORT} -t ${BUILD_ARGS.IMAGE_NAME} .`;
const dockerRunCommand = `docker run -d -p ${BUILD_ARGS.EXTERNAL_PORT}:${BUILD_ARGS.INTERNAL_PORT} --rm ${BUILD_ARGS.IMAGE_NAME}`;

// Execute the docker build command
try {
  console.log('Executing build command:', dockerBuildCommand);
  const buildOutput = execSync(dockerBuildCommand, { encoding: 'utf-8' });
  console.log('Docker build command executed successfully:', buildOutput);
} catch (error) {
  console.error('Error executing docker build command:', error.message);
}

// Execute the docker run command

try {
  console.log('Executing run command:', dockerRunCommand);
  const dockerRunOutput = execSync(dockerRunCommand, {
    encoding: 'utf-8',
  });
  console.log('Docker run command executed successfully:', dockerRunOutput);
} catch (error) {
  console.error('Error executing docker run command:', error.message);
}

// Ping the running container to verify it's up
try {
  const pingCommand = `curl http://localhost:${BUILD_ARGS.EXTERNAL_PORT}`;
  console.log('Pinging the server with command:', pingCommand);
  const pingOutput = execSync(pingCommand, { encoding: 'utf-8' });
  console.log('Ping output:', pingOutput);
} catch (error) {
  console.error('Error pinging the server:', error.message);
}

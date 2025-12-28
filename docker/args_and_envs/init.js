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

// INTERNAL_PORT will be mapped to an ENV variable inside the container as PORT via build-arg/Dockerfile
const build_arg_1 = `--build-arg INTERNAL_PORT=${BUILD_ARGS.INTERNAL_PORT}`;

// EXTERNAL_PORT will be used to map the container port to the host machine port at runtime and EXPOSE via build-arg/Dockerfile
const build_arg_2 = `--build-arg EXTERNAL_PORT=${BUILD_ARGS.EXTERNAL_PORT}`;

// MESSAGE will be passed as an ENV variable at runtime, then returned in the response by the server
const MESSAGE = 'The sweet sweet sounds.';

const dockerBuildCommand = `docker build ${build_arg_1} ${build_arg_2} -t ${BUILD_ARGS.IMAGE_NAME} .`;

// ALso using env file to pass STYLES variable
const dockerRunCommand = `docker run --env-file ._env --env MESSAGE="${MESSAGE}" -d -p ${BUILD_ARGS.EXTERNAL_PORT}:${BUILD_ARGS.INTERNAL_PORT} --rm ${BUILD_ARGS.IMAGE_NAME}`;

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

const { execSync } = require('child_process'); 

execSync("docker build -t nfelix25/docker-test-repo:tagname . && docker push nfelix25/docker-test-repo:tagname && docker run nfelix25/docker-test-repo:tagname", { encoding: "utf-8" });

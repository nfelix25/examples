const fs = require('fs');
const readline = require('readline');

//docker run -v PATH/output.txt:/output.txt -it IMAGE_NAME

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt the user for input
rl.question('Please enter the content you want to write to the file: ', (userInput) => {
  const fileName = 'output.txt';

  // Write the user input to a file asynchronously
  fs.writeFile(fileName, userInput, (err) => {
    if (err) {
      console.error('An error occurred while writing to the file:', err);
    } else {
      console.log(`Successfully wrote the input to ${fileName}`);
    }
    // Close the readline interface after the operation is complete
    rl.close();
  });
});


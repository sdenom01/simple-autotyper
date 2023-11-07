const robot = require('robotjs');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

// Create readline interface for input
const rl = readline.createInterface({ input, output });

// Function to delay for a given number of milliseconds
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to type out the message with a delay between each character
async function typeMessage(message, charDelayMs) {
  for (const char of message) {
    robot.typeString(char);
    await sleep(charDelayMs); // Wait after each character
  }
}

// Function to ask for user input
function askQuestion(query) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

// Main function to ask for user input and start the typing process
async function startTypingProcess() {
  const message = await askQuestion('Enter the message you want to type: ');
  const charDelaySec = parseFloat(await askQuestion('Enter the keystroke delay in seconds: '));
  const loopDelaySec = parseFloat(await askQuestion('Enter the delay between messages in seconds: '));

  // Convert seconds to milliseconds
  const charDelayMs = charDelaySec * 1000;
  const loopDelayMs = loopDelaySec * 1000;

  console.log(`Will start sending messages with a delay of ${charDelaySec} seconds between each character and a loop delay of ${loopDelaySec} seconds.`);

  // Function to handle the typing and the delay
  async function handleTyping() {
    await typeMessage(message, charDelayMs);
    robot.keyTap('enter'); // Press enter after the message is typed
    await sleep(loopDelayMs); // Wait before starting the next message
  }

  // Call handleTyping to start the process
  await handleTyping();

  // Set an interval to call handleTyping repeatedly
  setInterval(handleTyping, message.length * charDelayMs + loopDelayMs);

  // Listen for the 'q' key to stop the script
  input.on('keypress', async (str, key) => {
    if (key.sequence === 'q') {
      console.log('Script has been stopped by the user.');
      rl.close();
      process.exit();
    }
  });
}

// Start the process
startTypingProcess();

// Make sure the script listens for keypress events
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

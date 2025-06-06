// Import the readline module for handling command line input/output
const readline = require('readline');

// Import the fs (filesystem) module for reading/writing files
const fs = require('fs');

// Create a readline interface for command line interaction
const rl = readline.createInterface({
  input: process.stdin,   // Set standard input (keyboard) as input source
  output: process.stdout  // Set standard output (console) as output target
});

// Function to display the main menu options
function showMenu() {
  console.log('\n=== Patient Health Management System ===');          // Print application header
  console.log('1. Patient Login');                                    // Option 1: Patient Login
  console.log('2. Healthcare Provider Login');                        // Option 2: Healthcare Provider Login                
  console.log('3. Exit');                                             // Option 5: Exit the app
  rl.question('\nChoose an option (1, 2 or 3): ', handleMenu);        // Prompt user for menu choice
}

// Function to handle the menu option entered by the user
function handleMenu(choice) {
  switch (choice.trim()) {                // Use the trimmed input for comparison
    case '1':
      patientLogin();                     // If '1', Prompt patient login 
      break;
    case '2':
      providerLogin();                    // If '2', Prompt provider login
      break;
    case '3':
      console.log('Goodbye!');           // If '3', Print goodbye and close the app
      rl.close();                        // Close readline interface
      break;
    default:
      console.log('Invalid choice. Try again with a valid number.'); // If not 1-3, show error message
      showMenu();                                                    // Show menu again, so user can input valid number 
      break;
  }
}


function patientLogin() {
  console.log('\nPlease enter your username and password: ')
  rl.question('\nUsername: ');                 
    
}

function providerLogin() {  
    console.log('\nPlease enter your username and password: ')                  
    rl.question('\nUsername: ');   
  }
  

// Start the app by showing the main menu
showMenu();
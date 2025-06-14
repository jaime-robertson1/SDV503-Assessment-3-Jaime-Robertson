// Import the readline module for handling command line input/output
const readline = require('readline');

// Import the fs (filesystem) module for reading/writing files
const fs = require('fs');

// Define the file where the patients will be saved 
const FILE = 'patients.json'

// Initialise an empty array to store patients 
let patients = []

// Check if the patients.json file exists
if (fs.existsSync(FILE)) {
  try {
    // If file exists, read its contents (synchronously)
    const data = fs.readFileSync(FILE, 'utf8');
    // Parse JSON string into the patients array
    patients = JSON.parse(data);
  } catch (e) {
    // If there is any error, start with an empty array
    patients = [];
  }
}

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
  console.log('3. Exit');                                             // Option 3: Exit the app
  rl.question('\nChoose an option (1, 2 or 3): ', handleMenu);        // Prompt user for menu choice, handleMenu() function
}                                                                     // to be created below

// Function to save patients array to the patients.json file
function savePatients() {
  fs.writeFileSync(FILE, JSON.stringify(patients, null, 2))
}

// Const of healthcare providers log in details.
// This is not stored in a .json file because the details aren't going to be changing.
const providers = [
  { username: 'drmatthews', password: 'matthews123'},
  { username: 'drprice', password: 'price123'},
  { username: 'drroberts', password: 'roberts123'},
  { username: 'drkrueger', password: 'krueger123'},
  { username: 'drwu', password: 'wu123'},
  { username: 'dryoung', password: 'young123'}
]

// Function to handle the menu option entered by the user
function handleMenu(choice) {
  switch (choice.trim()) {                // Use the trimmed input for comparison
    case '1':
      loginUser('patient');               // If '1', Prompt patient login 
      break;
    case '2':
      loginUser('provider');              // If '2', Prompt provider login
      break;
    case '3':
      console.log('Goodbye!');            // If '3', Print goodbye and close the app
      rl.close();                         // Close readline interface
      break;
    default:
      console.log('Invalid choice. Try again with a valid number.');  // If not 1-3, show error message
      showMenu();                                                     // Show menu again, so user can input valid number 
      break;
  }
}


// Main function that handles the log in
function loginUser (type) {
  rl.question('Username: ', username => {    // input from the user to enter username
    rl.question('Password: ', password => {  // input from the user to enter password 
      if (type === 'patient') {              // if the number selected is 1 for patient, 
        const user = patients.find(p => p.username === username && p.password === password) // Patients.find returns the first element in the array that satisfies the testing function.
        if (user) {                          // In this case, the patient array is checked until it finds a case where the username and password match the ones inputted by the user.
          console.log(`\nWelcome, ${user.name} (patient)!`)         // Lets the user know they have successfully entered the patient menu
          patientMenu(user)                                         // The user is directed to the patientMenu()
        } else {                                                    // If the username and password cannot be found in the patient array, the person is not able to log in
          console.log('Invalid credentials. Please try again. \n')  // They are then prompted to enter their details again in case they made a mistake.
          showMenu()                                                // The main menu is shown so they can try again
        }
       } else if (type === 'provider') {                            // if the user logging in is not a patient, check if provider 
            const user = providers.find(p => p.username === username && p.password === password) // Same as above but it is checking the providers array for a match
            if (user) {
              console.log(`\nWelcome, ${user.username} (provider)!`) // lets the user know they have successfully entered the provider menu
              providerMenu()
          } else {
            console.log('Invalid credentials. Please try again. \n') // If credentionals are wrong they're given a chance to input them again
            showMenu()
          }
        }
     })
  })
}

// Function to show menu for patients after successfully logging in
function patientMenu(patient) {
  console.log('\n1. View My Profile')  // Three choices that the patient can make, 1. View their profile
  console.log('2. Edit My Profile')    // 2. Edits their profile
  console.log('3. Logout')             // 3. Logs out the user 
  rl.question('\nChoose an option: ', choice => { // User inputs choice 
    switch (choice.trim()) {
      case '1':                        // If 1 is selected, print patients profile details. Info is inserted from the relevant patient stored in the patients array.
        console.log(`\nName: ${patient.name}\nDob: ${patient.dob}\nContact: ${patient.contactnumber}\nPhoto: ${patient.photo}\nAllergies: ${patient.allergies}\nConditions: ${patient.conditions}\nMedications: ${patient.medications}\nSmoker: ${patient.smoker}`)
        patientMenu(patient)           // After printing the info, show the patient menu options again
        break
      case '2':
        editPatientProfile(patient, () => patientMenu(patient))      // Show a new menu for editing info which will be created further down, editPatientProfile()
        break
      case '3':
        showMenu()                     // Simulates logging out by going back to the main menu
        break
      default:
        console.log('Invalid choice. Try again with a valid number.') // Displays a error message if the patient types in a number other than 1, 2 or 3
        patientMenu(patient)                                          // Displays the menu again so they can try inputting a valid number 
    }
  })
}

// Function to show menu for providers after successfully logging in
function providerMenu() {
  console.log('\n1. View All Patients')    // Three choices that the provider can make, 1. View all their patients info
  console.log('2. Edit a Patient Profile') // 2. Edits a patients profile
  console.log('3. Logout')                 // 3. Logs out the provider 
  rl.question('\nChoose an option: ', choice => { // User inputs choice 
    switch (choice.trim()) {
      case '1':
        patients.forEach((p, i) => {
          console.log(`\n[${i}] ${p.name}, Dob: ${p.dob}, Contact: ${p.contactnumber}, Photo: ${p.photo}, Allergies: ${p.allergies}, Conditions: ${p.conditions}, Medications: ${p.medications}, Smoker: ${p.smoker}`)
        })
        providerMenu()
        break
      case '2':
        rl.question('Enter patient username to edit: ', username => {
          const patient = patients.find(p => p.username === username)
          if (patient) {
            editProfileProvider(patient, () => providerMenu())
          } else {
            console.log('Patient not found.')
            providerMenu()
          }
        })
        break
      case '3':
        showMenu()
        break
      default:
        console.log('Invalid choice. Try again with a valid number')
        providerMenu()
    }
  })
}

// function to enable editing in the patient menu
function editPatientProfile(patient) {
  console.log("Type in new details, if information is already correct press enter to skip")
  rl.question(`Enter new contact number: [${patient.contactnumber}]: `, contactnumber => { // Only fields that the patient is allowed to edit are included
    rl.question(`Attach new photo: [${patient.photo}]: `, photo => {
      rl.question(`Smoker: Y or N [${patient.smoker}]: `, smoker => {
        console.log("If you want to update any other information, please contact your healthcare provider.")
        if (contactnumber) patient.contactnumber = contactnumber
        if (photo) patient.photo = photo
        if (smoker) patient.smoker = smoker 
        savePatients()
          console.log('Profile updated successfully.')   // informing the user that their changes have been saved successfully
          patientMenu()
      })
    })
  })
}

// function to enable editing in the provider menu
function editProfileProvider(patient) {
  console.log("Type in new details, if information is already correct press enter to skip") // If the info is already correct then enter can be pressed to skip that section
  rl.question(`Enter a new name: [${patient.name}]: `, name => {                            // All fields are editable because the provider has the permissions
    rl.question(`Enter a new dob: [${patient.dob}]: `, dob => {
      rl.question(`Enter new contact number: [${patient.contactnumber}]: `, contactnumber => {
        rl.question(`Attach new photo: [${patient.photo}]: `, photo  => {
          rl.question(`Enter new allergies: [${patient.allergies}]: `, allergies => {
            rl.question(`Enter new conditions: [${patient.conditions}]: `, conditions => {
              rl.question(`Enter new medications: [${patient.medications}]: `, medications => {
                rl.question(`Smoker: Y or N [${patient.smoker}]: `, smoker => {
                console.log("If you want to update any other information, please contact your healthcare provider.")
                    if (name) patient.name = name
                    if (dob) patient.dob = dob 
                    if (contactnumber) patient.contactnumber = contactnumber
                    if (photo) patient.photo = photo
                    if (allergies) patient.allergies = allergies 
                    if (conditions) patient.conditions = conditions 
                    if (medications) patient.medications = medications 
                    if (smoker) patient.smoker = smoker 
                    savePatients()
                      console.log('Profile updated successfully.')
                      providerMenu()
                  })
                })
              })
            })
          })
       })
     })
  })
}

// Start the app by showing the main menu
showMenu();
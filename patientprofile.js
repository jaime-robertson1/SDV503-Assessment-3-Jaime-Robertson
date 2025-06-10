// Import the readline module for handling command line input/output
const readline = require('readline');

// Import the fs (filesystem) module for reading/writing files
const fs = require('fs');

const FILE = 'patients.json'

let patients = []

// Check if the tasks.json file exists
if (fs.existsSync(FILE)) {
  try {
    // If file exists, read its contents (synchronously)
    const data = fs.readFileSync(FILE, 'utf8');
    // Parse JSON string into the todos array
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
  console.log('3. Exit');                                             // Option 5: Exit the app
  rl.question('\nChoose an option (1, 2 or 3): ', handleMenu);        // Prompt user for menu choice
}

function savePatients() {
  fs.writeFileSync(FILE, JSON.stringify(patients, null, 2))
}

const providers = [
  { username: 'drmatthews', password: 'matthews123'},
  { username: 'drprice', password: 'price123'}
]

// Function to handle the menu option entered by the user
function handleMenu(choice) {
  switch (choice.trim()) {                // Use the trimmed input for comparison
    case '1':
      loginUser('patient');                     // If '1', Prompt patient login 
      break;
    case '2':
      loginUser('provider');                    // If '2', Prompt provider login
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

function loginUser (type) {
  rl.question('Username: ', username => {
    rl.question('Password: ', password => {
      if (type === 'patient') {
        const user = patients.find(p => p.username === username && p.password ===password)
        if (user) {
          console.log(`\nWelcome, ${user.name} (patient)!`)
          patientMenu(user)
        } else {
          console.log('Invalid credentials. \n')
          showMenu()
        }
       } else if (type === 'provider') {
            const user = providers.find(p => p.username === username && p.password === password)
            if (user) {
              console.log(`\nWelcome, ${user.username} (provider)!`)
              providerMenu()
          } else {
            console.log('Invalid credentials. \n')
            showMenu()
          }
        }
     })
  })
}

function patientMenu(patient) {
  console.log('\n1. View My Profile')
  console.log('2. Edit My Profile')
  console.log('3. Logout')
  rl.question('\nChoose an option: ', choice => {
    switch (choice.trim()) {
      case '1':
        console.log('\nName: ${patient.name}\nDob: ${patient.dob}\nContact: ${patient.contactnumber}\nPhoto: ${patient.photo}\nAllergies: ${patient.allergies}\nConditions: ${patient.conditions}\nMedications: ${patient.medications}\nSmoker: ${patient.smoker}')
        patientMenu(patient)
        break
      case '2':
        editPatientProfile(patient, () => patientMenu(patient))
        break
      case '3':
        showMenu()
        break
      default:
        console.log('Invalid choice.')
        patientMenu(patient)   
    }
  })
}

function providerMenu() {
  console.log('\n1. View All Patients')
  console.log('2. Edit a Patient Profile')
  console.log('3. Logout')
  rl.question('\nChoose an option: ', choice => {
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
        console.log('Invalid choice.')
        providerMenu()
    }
  })
}

function editPatientProfile(patient, callback) {
  rl.question(`Enter new contact number: [${patient.contactnumber}]: `, contactnumber => {
    rl.question(`Attach new photo: [${patient.photo}]: `, photo => {
      rl.question(`Smoker: Y or N [${patient.smoker}]: `, smoker => {
      console.log("If you want to update any other information, please contact your healthcare provider.")
        if (contactnumber) patient.contactnumber = contactnumber
        if (photo) patient.photo = photo
        if (smoker) patient.smoker = smoker 
        savePatients()
        console.log('Profile updated successfully.')
        callback()
      })
    })
  })
}

function editProfileProvider(patient, callback) {
  rl.question(`Enter new contact number: [${patient.contactnumber}]: `, contactnumber => {
    rl.question(`Attach new photo: [${patient.photo}]: `, photo => {
      rl.question(`Smoker: Y or N [${patient.smoker}]: `, smoker => {
      console.log("If you want to update any other information, please contact your healthcare provider.")
        if (contactnumber) patient.contactnumber = contactnumber
        if (photo) patient.photo = photo
        if (smoker) patient.smoker = smoker 
        savePatients()
        console.log('Profile updated successfully.')
        callback()
      })
    })
  })
}
  

// Start the app by showing the main menu
showMenu();
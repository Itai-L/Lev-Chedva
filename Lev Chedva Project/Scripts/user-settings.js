const db = firebase.firestore();
const auth = firebase.auth();
const hebrewLabels = {
    EmergencyContactName: 'איש קשר לשעת חירום ',
    EmergencyContactPhone: 'טלפון איש קשר לשעת חירום',
    address:'כתובת',
    phone: 'מספר טלפון',
    vehicles: 'רכבים',
};

// Check for logged in user
auth.onAuthStateChanged(user => {
    if(user){
        const email = user.email;
        console.log(email);
        const personalDetailsButton = document.getElementById('updatePersonalDetails');
        const credentialsButton = document.getElementById('updateCredentials');

        let editButton;

        const editFields = () => {
            Object.entries(hebrewLabels).forEach(([key, value]) => {
              let listItem = document.getElementById(key);
              
              if (listItem) {
                if (Array.isArray(volunteerData[key])) {  // Check if the field is an array
                  listItem.innerHTML = `${value}: `;  // Clear the listItem and add the label
          
                  volunteerData[key].forEach((vehicle, index) => {
                    let inputField = document.createElement('input');
                    inputField.type = 'text';
                    inputField.id = `input-${key}-${index}`;  // Create a unique ID for each input field
                    inputField.value = vehicle;  // Prefill the input field with the current value
          
                    let deleteButton = document.createElement('button');
                    deleteButton.textContent = 'מחק';
                    deleteButton.className = 'delete-btn'; 
                    deleteButton.addEventListener('click', () => {
                      inputField.value = '';  // Instead of removing the input field, clear its value
                      inputField.style.display = 'none';  // Hide the input field
                      deleteButton.style.display = 'none';  // Hide the delete button itself
                    });
          
                    listItem.appendChild(inputField);
                    listItem.appendChild(deleteButton);
                  });
          
                  // Create a button to add more fields
                  let addButton = document.createElement('button');
                  addButton.textContent = 'הוסף רכב';
                  addButton.addEventListener('click', () => {
                    let inputField = document.createElement('input');
                    inputField.type = 'text';
                    inputField.id = `input-${key}-${volunteerData[key].length}`;  // The id for the new field will be the next index in the array
                    listItem.appendChild(inputField);
                  });
                  listItem.appendChild(addButton);
                } else {
                  let inputField = document.createElement('input');
                  inputField.type = 'text';
                  inputField.id = `input-${key}`;
                  inputField.value = listItem.textContent.split(": ")[1];  // Assign the existing value
                  listItem.innerHTML = `${value}: `;
                  listItem.appendChild(inputField);
                }
              }
            });
          
            editButton.textContent = "שמור";
            editButton.removeEventListener('click', editFields);
            editButton.addEventListener('click', saveFields);
          };
          

          const saveFields = () => {
            let updatedData = {};
          
            Object.entries(hebrewLabels).forEach(([key, value]) => {
              if (Array.isArray(volunteerData[key])) {  // Check if the field is an array
                updatedData[key] = [];
          
                // Get each input field value and add it to updatedData
                let i = 0;
                while (true) {
                  let inputField = document.getElementById(`input-${key}-${i}`);
                  if (!inputField) break;
                  if (inputField.style.display !== 'none') {  // Only add to updatedData if the input field has not been deleted
                    updatedData[key].push(inputField.value);
                  }
                  i++;
                }
              } else {
                let inputField = document.getElementById(`input-${key}`);
                if (inputField) {
                  updatedData[key] = inputField.value;
                }
              }
            });
            db.collection('Volunteers').doc(email).update(updatedData)
              .then(() => {
                console.log("Document successfully updated!");
                personalDetailsButton.click();  // re-fetch the data
              })
              .catch((error) => {
                console.error("Error updating document: ", error);
              });
          };
          
        let volunteerData;
        personalDetailsButton.addEventListener('click', () => {
            const detailsDiv = document.getElementById('personalDetailsDiv');
            detailsDiv.style.display = 'block';
            detailsDiv.innerHTML = '';
        
            db.collection('Volunteers').doc(email).get()
                .then((doc) => {
                    if (doc.exists) {
                        volunteerData = doc.data();
                        let detailsTable = document.createElement('table');
                        let row = detailsTable.insertRow();
                        let cell = row.insertCell();
                        let ul = document.createElement('ul');
                        Object.entries(hebrewLabels).forEach(([key, value]) => {
                            let li = document.createElement('li');
                            li.id = key;
        
                            // Create a div to wrap the label and input
                            let inputContainer = document.createElement('div');
                            inputContainer.className = 'input-container';
                            inputContainer.innerHTML = `${value}: ${doc.data()[key]}`;
        
                            li.appendChild(inputContainer);
                            ul.appendChild(li);
                        });
        
                        cell.appendChild(ul);
                        detailsDiv.appendChild(detailsTable);
                        editButton = document.createElement('button');
                        editButton.textContent = "ערוך";
                        editButton.addEventListener('click', editFields);
        
                        detailsDiv.appendChild(editButton);
                    } else {
                        console.log("No such document!");
                    }
                })
                .catch((error) => {
                    console.log("Error getting document:", error);
                });
        });
        

        credentialsButton.addEventListener('click', () => {
            const credentialsDiv = document.getElementById('credentialsDiv');
            credentialsDiv.style.display = 'block';
            credentialsDiv.innerHTML = ''; // Clear out the credentialsDiv before each load
        
            // Display the current email
            let emailField = document.createElement('input');
            emailField.type = 'text';
            emailField.id = 'email';
            emailField.value = user.email;
            credentialsDiv.appendChild(emailField);
        
            // Email update button
            let updateEmailButton = document.createElement('button');
            updateEmailButton.textContent = "עדכן אימייל";
            updateEmailButton.addEventListener('click', () => {
                // Fetch the new email
                let newEmail = emailField.value;
                newEmail=newEmail.toLowerCase();
                
                // Update email in Firebase auth
                user.updateEmail(newEmail)
    .then(() => {
              alert("אימייל עודכן בהצלחה");

        // Get the document
        db.collection('Volunteers').doc(email).get()
        .then((doc) => {
            if (doc.exists) {
                // Get the data and modify the email field
                let data = doc.data();
                data.email = newEmail;

                // Set the new document
                db.collection('Volunteers').doc(newEmail).set(data)
                .then(() => {
                    // Delete the old document
                    db.collection('Volunteers').doc(email).delete();
                    console.log("Email updated successfully in Firestore!");
                })
                .catch((error) => {
                    console.error("Error updating email in Firestore: ", error);
                });
            }
        });
    })
    .catch((error) => {
      alert("שגיאה");
        console.error("Error updating email: ", error);
    });

            });
            credentialsDiv.appendChild(updateEmailButton);
        
                   // Password update fields
        let passwordField = document.createElement('input');
        passwordField.type = 'password';
        passwordField.id = 'password';
        passwordField.placeholder = 'סיסמא חדשה';
        credentialsDiv.appendChild(passwordField);

        let confirmPasswordField = document.createElement('input');
        confirmPasswordField.type = 'password';
        confirmPasswordField.id = 'confirm-password';
        confirmPasswordField.placeholder = 'הכנס סיסמא בשנית...';
        credentialsDiv.appendChild(confirmPasswordField);

        // Password update button
        let updatePasswordButton = document.createElement('button');
        updatePasswordButton.textContent = "עדכן סיסמא";
        updatePasswordButton.addEventListener('click', () => {
            // Fetch the new password
            let newPassword = passwordField.value;
            let confirmPassword = confirmPasswordField.value;

            if (newPassword !== confirmPassword) {
                alert("סיסמאות אינן תואמות");
                return;
            }
            
            // Update password in Firebase auth
            user.updatePassword(newPassword)
            .then(() => {
                alert("סיסמא עודכנה בהצלחה");
            })
            .catch((error) => {
                console.error("Error updating password: ", error);
            });
        });
        credentialsDiv.appendChild(updatePasswordButton);

        });
        
    } else {
        console.log('No user is signed in.');
    }
});


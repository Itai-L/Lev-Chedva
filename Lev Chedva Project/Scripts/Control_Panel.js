const db = firebase.firestore();

const editLocationsBtn = document.getElementById('edit-locations');
const writeMessagesBtn = document.getElementById('write-messages');
const showMessagesBtn=document.getElementById('show-messages');
const editKeyWordsBtn=document.getElementById('edit-keywords');
const loadVolunteersBtn=document.getElementById("loadVolunteers")
const locationManagementDiv = document.getElementById('location-management');
const keywordManagementDiv = document.getElementById('keyword-management');

const messageManagementDiv = document.getElementById('message-management');
const VolunteersMagagmentDiv=document.getElementById('VolunteerTable');



let iskeywordManagementVisible = false;

editKeyWordsBtn.addEventListener('click', () => {
    iskeywordManagementVisible = !iskeywordManagementVisible;
    keywordManagementDiv.style.display = iskeywordManagementVisible ? 'block' : 'none';
    locationManagementDiv.style.display = 'none';
    messageManagementDiv.style.display = 'none';
    messageListDiv.style.display = 'none';
    VolunteersMagagmentDiv.style.display = 'none';
    if (iskeywordManagementVisible) {
        fetchKeywords();
    }
});

async function fetchKeywords() {
    const KeywordsRef = db.collection('Tools').doc('search-filters');
    const KeywordsSnapshot = await KeywordsRef.get();
    const Keywords = KeywordsSnapshot.data().filters;
    populateKeywordsDropdown(Keywords);
}

function populateKeywordsDropdown(Keywords) {
    const keywordDropdown = document.getElementById('keyword-dropdown');
    keywordDropdown.innerHTML = '';
    Keywords.forEach(Keyword => {
        const option = document.createElement('option');
        option.value = Keyword;
        option.textContent = Keyword;
        keywordDropdown.appendChild(option);
    });
}


document.getElementById('edit-keyword').addEventListener('click', async () => {
    const selectedkeyword = document.getElementById('keyword-dropdown').value;
    const newKeywordName = prompt('הכנס מילת מפתח חדשה', selectedkeyword);

    if (newKeywordName && newKeywordName !== selectedkeyword) {
        const toolsRef = db.collection('Tools').doc('search-filters');
        await toolsRef.update({
            filters: firebase.firestore.FieldValue.arrayRemove(selectedkeyword)
        });
        await toolsRef.update({
            filters: firebase.firestore.FieldValue.arrayUnion(newKeywordName)
        });

        const replaceInInventory = confirm("האם תרצה לשנות את מילת המפתח בכל המוצרים בהם היא מופיעה?");
        if (replaceInInventory) {
            const inventoryRef = db.collection('inventory');
            const snapshot = await inventoryRef.get();
            
            snapshot.forEach(async doc => {
                let keywords = doc.data().keywords.split(',').map(kw => kw.trim());
                const keywordIndex = keywords.indexOf(selectedkeyword);

                if (keywordIndex > -1) {
                    keywords[keywordIndex] = newKeywordName;  // Replace selected keyword with the new one
                    const itemRef = inventoryRef.doc(doc.id);
                    await itemRef.update({
                        'keywords': keywords.join(', ')
                    });
                }
            });
        }

        fetchKeywords();
    }
});




document.getElementById('delete-keyword').addEventListener('click', async () => {
    const selectedkeyword = document.getElementById('keyword-dropdown').value;
    if (confirm(`האם אתה בטוח שאתה רוצה למחוק? ${selectedkeyword}`)) {
        const toolsRef = db.collection('Tools').doc('search-filters');
        await toolsRef.update({
            filters: firebase.firestore.FieldValue.arrayRemove(selectedkeyword)
        });

        const replaceInInventory = confirm("האם תרצה למחוק את מילת המפתח מכלל המוצרים?");
        if (replaceInInventory) {
            const inventoryRef = db.collection('inventory');
            const snapshot = await inventoryRef.get();
            
            snapshot.forEach(async doc => {
                let keywords = doc.data().keywords.split(',').map(kw => kw.trim());
                const keywordIndex = keywords.indexOf(selectedkeyword);

                if (keywordIndex > -1) {
                    keywords.splice(keywordIndex, 1);  // Delete selected keyword
                    const itemRef = inventoryRef.doc(doc.id);
                    await itemRef.update({
                        'keywords': keywords.join(', ')
                    });
                }
            });
        }

        fetchKeywords();
    }
});



document.getElementById('add-keyword').addEventListener('click', async () => {
    const newkeyword = prompt('הכנס מחסן חדש');
    if (newkeyword) {
    const toolsRef = db.collection('Tools').doc('search-filters');
    await toolsRef.update({
    filters: firebase.firestore.FieldValue.arrayUnion(newkeyword)
    });
    fetchKeywords();
    }
    });




let isVolunteersMagagmentDivVisible=false;

loadVolunteersBtn.addEventListener('click', ()=>
{
    isVolunteersMagagmentDivVisible = !isVolunteersMagagmentDivVisible;
    VolunteersMagagmentDiv.style.display = isVolunteersMagagmentDivVisible ? 'block' : 'none';
    locationManagementDiv.style.display = 'none';
    messageManagementDiv.style.display = 'none';
    messageListDiv.style.display = 'none';
    keywordManagementDiv.style.display = 'none';
    loadWaitingVolunteers();



});
let isLocationManagementVisible = false;

editLocationsBtn.addEventListener('click', () => {
    isLocationManagementVisible = !isLocationManagementVisible;
    locationManagementDiv.style.display = isLocationManagementVisible ? 'block' : 'none';
    keywordManagementDiv.style.display = 'none';
    messageManagementDiv.style.display = 'none';
    messageListDiv.style.display = 'none';
    VolunteersMagagmentDiv.style.display = 'none';
    if (isLocationManagementVisible) {
        fetchLocations();
    }
});

let isMessageManagementVisible = false;

writeMessagesBtn.addEventListener('click', () => {
    isMessageManagementVisible = !isMessageManagementVisible;
    locationManagementDiv.style.display = 'none';
    messageManagementDiv.style.display = isMessageManagementVisible ? 'block' : 'none';
    messageListDiv.style.display = 'none';
    VolunteersMagagmentDiv.style.display = 'none';
    keywordManagementDiv.style.display = 'none';
});

let isMessageListVisible = false;

showMessagesBtn.addEventListener('click', () => {
   
    isMessageListVisible = !isMessageListVisible;
    messageListDiv.style.display = isMessageListVisible ? 'block' : 'none';
    locationManagementDiv.style.display = 'none';
    messageManagementDiv.style.display = 'none';
    VolunteersMagagmentDiv.style.display = 'none';
    keywordManagementDiv.style.display = 'none';
   
if (isMessageListVisible) {
fetchMessages();
}
});

document.getElementById('add-location').addEventListener('click', async () => {
const newLocation = prompt('הכנס מחסן חדש');
if (newLocation) {
const toolsRef = db.collection('Tools').doc('Locations');
await toolsRef.update({
Location: firebase.firestore.FieldValue.arrayUnion(newLocation)
});
fetchLocations();
}
});

document.getElementById('edit-location').addEventListener('click', async () => {
    const selectedLocation = document.getElementById('locations-dropdown').value;
    const newLocationName = prompt('הכנס שם מחסן חדש', selectedLocation);

    if (newLocationName && newLocationName !== selectedLocation) {
        const toolsRef = db.collection('Tools').doc('Locations');
        await toolsRef.update({
            Location: firebase.firestore.FieldValue.arrayRemove(selectedLocation)
        });
        await toolsRef.update({
            Location: firebase.firestore.FieldValue.arrayUnion(newLocationName)
        });

        const replaceInInventory = confirm("האם תרצה לשנות מיקום בכל המוצרים?");
        if (replaceInInventory) {
            const inventoryRef = db.collection('inventory');
            const snapshot = await inventoryRef.where('location', '==', selectedLocation).get();
            
            snapshot.forEach(async doc => {
                const itemRef = inventoryRef.doc(doc.id);
                await itemRef.update({
                    'location': newLocationName
                });
            });
        }

        fetchLocations();
    }
});


document.getElementById('delete-location').addEventListener('click', async () => {
    const selectedLocation = document.getElementById('locations-dropdown').value;

    if (confirm(`האם אתה בטוח שאתה רוצה למחוק? ${selectedLocation}`)) {
        const toolsRef = db.collection('Tools').doc('Locations');
        await toolsRef.update({
            Location: firebase.firestore.FieldValue.arrayRemove(selectedLocation)
        });

        const deleteInInventory = confirm("האם תרצה למחוק את המיקום מכלל המוצרים?");
        if (deleteInInventory) {
            const inventoryRef = db.collection('ןnventory');
            const snapshot = await inventoryRef.where('location', '==', selectedLocation).get();
            
            snapshot.forEach(async doc => {
                const itemRef = inventoryRef.doc(doc.id);
                await itemRef.update({
                    'location': firebase.firestore.FieldValue.delete()
                });
            });
        }

        fetchLocations();
    }
});



document.getElementById('save-message').addEventListener('click', async () => {
    const messageText = document.getElementById('message-text').value;
    const header = document.getElementById('header').value;

    // Retrieve the checkbox values
    const checkboxes = ['checkbox1', 'checkbox2', 'checkbox3', 'checkbox4'];
    const messageAuthorizations = checkboxes.map(id => {
        const checkbox = document.getElementById(id);
        return checkbox.checked ? checkbox.value : null;
    }).filter(value => value !== null);

    if (messageText.trim() && header.trim()) {
        const messageData = {
            header:header.trim(),
            message: messageText.trim(),
            messageAuthorizations,  // Save checkbox values
            timestamp: firebase.firestore.Timestamp.now()
        };

        // Fetch the "Message Counter" from "Events Counter" document in "Tools" collection
        const counterDocRef = db.collection('Tools').doc('Events Counter');
        const counterDoc = await counterDocRef.get();
        let messageCounter = counterDoc.data().MessageCounter;
        
        // Save the message with the incremented counter value as the doc id
        const messageId = String(messageCounter);
        await db.collection('messages').doc(messageId).set(messageData);
        
        // Update the "Message Counter" field by incrementing it
        await counterDocRef.update({ MessageCounter: firebase.firestore.FieldValue.increment(1) });

        alert('הודעה נשמרה בהצלחה');
        document.getElementById('message-text').value = '';
        document.getElementById('header').value = '';
    } else {
        alert('הודעה לא תקנית');
    }
});




const showMessageBtn = document.getElementById('show-messages');
const messageListDiv = document.getElementById('message-list');
const messagesContainer = document.getElementById('messages-container');


async function fetchMessages() {
messagesContainer.innerHTML = '';
const messagesRef = db.collection('messages');
const messagesSnapshot = await messagesRef.orderBy('timestamp', 'desc').get();
messagesSnapshot.forEach(messageDoc => {
    const messageData = messageDoc.data();
    const messageId = messageDoc.id;

    createMessageElement(messageId, messageData);
});
}
function createMessageElement(messageId, messageData) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.setAttribute('data-id', messageId);
    messageDiv.id = `message-${messageId}`;

    const headerDiv = document.createElement('div');
    headerDiv.classList.add('message-header');

    const headerText = document.createElement('h3');
    headerText.textContent = messageData.header;
    headerDiv.appendChild(headerText);

    const dateText = document.createElement('p');
    const date = messageData.timestamp.toDate();
    dateText.textContent = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    headerDiv.appendChild(dateText);

    messageDiv.appendChild(headerDiv);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.style.display = 'none';

    const messageText = document.createElement('p');
    messageText.textContent = messageData.message;
    contentDiv.appendChild(messageText);

    const editHeaderBtn = document.createElement('button');
    editHeaderBtn.textContent = 'ערוך כותרת';
    editHeaderBtn.addEventListener('click', () => editHeader(messageId));
    contentDiv.appendChild(editHeaderBtn);

    const editTextBtn = document.createElement('button');
    editTextBtn.textContent = 'ערוך גוף ההודעה';
    editTextBtn.addEventListener('click', () => editMessage(messageId));
    contentDiv.appendChild(editTextBtn);
    messageDiv.appendChild(contentDiv);

    headerDiv.addEventListener('click', () => {
        if (contentDiv.style.display === 'none') {
            contentDiv.style.display = 'block';
        } else {
            contentDiv.style.display = 'none';
        }
    });

    messagesContainer.appendChild(messageDiv);
    const deleteBtn = document.createElement('button');
deleteBtn.textContent = 'מחק הודעה';
deleteBtn.addEventListener('click', () => deleteMessage(messageId));
contentDiv.appendChild(deleteBtn);
}


async function fetchLocations() {
    const locationsRef = db.collection('Tools').doc('Locations');
    const locationsSnapshot = await locationsRef.get();
    const locations = locationsSnapshot.data().Location;
    populateLocationsDropdown(locations);
}

function populateLocationsDropdown(locations) {
    const locationsDropdown = document.getElementById('locations-dropdown');
    locationsDropdown.innerHTML = '';
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationsDropdown.appendChild(option);
    });
}


function editHeader(messageId) {
    const messageDiv = document.getElementById(`message-${messageId}`);
    const headerDiv = messageDiv.querySelector('.message-header');
    const headerText = headerDiv.querySelector('h3');

    // Create new elements
    const headerInput = document.createElement('input');
    headerInput.value = headerText.textContent;
    headerInput.classList.add('edit-input');
    headerInput.type = 'text';

    const saveButton = document.createElement('button');
    saveButton.textContent = 'שמור';
    saveButton.classList.add('edit-button');

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'ביטול';
    cancelButton.classList.add('edit-button');

    // Create a wrapper div and append new elements
    const editAreaDiv = document.createElement('div');
    editAreaDiv.classList.add('edit-area');
    editAreaDiv.appendChild(headerInput);
    editAreaDiv.appendChild(saveButton);
    editAreaDiv.appendChild(cancelButton);

    // Clear the div and append new elements
    headerDiv.innerHTML = '';
    headerDiv.appendChild(editAreaDiv);

    // Event listeners
    saveButton.addEventListener('click', async () => {
        const newHeader = headerInput.value;
        const messageRef = db.collection('messages').doc(messageId);
        await messageRef.update({ header: newHeader });

        headerText.textContent = headerInput.value;
        headerDiv.innerHTML = '';
        headerDiv.appendChild(headerText);
    });

    cancelButton.addEventListener('click', () => {
        headerDiv.innerHTML = '';
        headerDiv.appendChild(headerText);
    });
}

function editMessage(messageId) {
    const messageDiv = document.getElementById(`message-${messageId}`);
    const contentDiv = messageDiv.querySelector('.message-content');
    const messageText = contentDiv.querySelector('p');

    // Create new elements
    const messageInput = document.createElement('textarea');
    messageInput.value = messageText.textContent;
    messageInput.classList.add('edit-input');
    messageInput.rows = '4';
    messageInput.cols = '50';

    const saveButton = document.createElement('button');
    saveButton.textContent = 'שמור';
    saveButton.classList.add('edit-button');

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'ביטול';
    cancelButton.classList.add('edit-button');

    // Create a wrapper div and append new elements
    const editAreaDiv = document.createElement('div');
    editAreaDiv.classList.add('edit-area');
    editAreaDiv.appendChild(messageInput);
    editAreaDiv.appendChild(saveButton);
    editAreaDiv.appendChild(cancelButton);

    // Insert new elements before the original message text
    contentDiv.insertBefore(editAreaDiv, messageText.nextSibling);

    // Hide the original message text while editing
    messageText.style.display = 'none';

    // Event listeners
    saveButton.addEventListener('click', async () => {
        const newMessage = messageInput.value;
        const messageRef = db.collection('messages').doc(messageId);
        await messageRef.update({ message: newMessage });

        messageText.textContent = messageInput.value;
        messageText.style.display = 'block';
        contentDiv.removeChild(editAreaDiv);
    });

    cancelButton.addEventListener('click', () => {
        messageText.style.display = 'block';
        contentDiv.removeChild(editAreaDiv);
    });
}

async function deleteMessage(messageId) {
    if (confirm('האם אתה בטוח שברצונך למחוק את ההודעה?')) {
        await db.collection('messages').doc(messageId).delete();
        const messageDiv = document.getElementById(`message-${messageId}`);
        messageDiv.remove();
    }
}

let volunteersTableValid=false;


async function loadWaitingVolunteers()
{


  
    const VolunteerTable = document.getElementById('VolunteerTable');
  
    let existingTable = document.getElementById('volunteersTable');
    if (existingTable) {
      // If the table already exists, remove it
      VolunteerTable.removeChild(existingTable);
    }
    let table = document.createElement('table');
    table.id = "volunteersTable";
    let thead = table.createTHead();
    let tbody = table.createTBody();

    let headers = ['שם'];
    let headRow = thead.insertRow();
    for (let head of headers) {
        let th = document.createElement("th");
        th.textContent = head;
        headRow.appendChild(th);
    }

    VolunteerTable.appendChild(table);

    const hebrewLabels = {
        EmergencyContactName: 'איש קשר לשעת חירום',
        EmergencyContactPhone: 'טלפון איש קשר לשעת חירום',
        ID: 'ת.ז.',
        address: 'כתובת',
        email: 'אימייל',
        firstName: 'שם פרטי',
        lastName: 'שם משפחה',
        phone: 'מספר טלפון',
        vehicals: 'רכבים',
        volunteerTypes: 'סוגי התנדבות'
    };
    

    db.collection("Volunteers Waiting").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let row = tbody.insertRow();
            let nameCell = row.insertCell(0);
            let actionsCell = row.insertCell(1);
            
            nameCell.textContent = doc.data().firstName + " " + doc.data().lastName;

            actionsCell.style.display = 'none'; // Hide the Actions cell by default

            let detailsList = document.createElement('ul');
            Object.entries(hebrewLabels).forEach(([key, value]) => {
                let listItem = document.createElement('li');
                listItem.textContent = `${value}: ${doc.data()[key]}`;
                detailsList.appendChild(listItem);
            });


            let authBtn = document.createElement('button');
            authBtn.textContent = 'הוסף הרשאות';
            
            let authorizeBtn = document.createElement('button');
            authorizeBtn.textContent = 'אשר מתנדב';

            let doNotAuthorizeBtn = document.createElement('button');
            doNotAuthorizeBtn.textContent = 'מחק מתנדב';


            row.addEventListener('click', function() {
                let detailsRow = row.nextElementSibling;
                if (detailsRow && detailsRow.classList.contains('details-row')) {
                    row.parentElement.removeChild(detailsRow);
                } else {
                    detailsRow = row.insertAdjacentElement('afterend', document.createElement('tr'));
                    detailsRow.classList.add('details-row');
                    let cell = detailsRow.insertCell(0);
                    cell.colSpan = 2;
                    let contentContainer = document.createElement('div');
                    contentContainer.style.textAlign = 'right';
                    contentContainer.appendChild(detailsList);
                    contentContainer.appendChild(authBtn);
                    contentContainer.appendChild(authorizeBtn);
                    contentContainer.appendChild(doNotAuthorizeBtn);
                    cell.appendChild(contentContainer);
                }
                    authBtn.addEventListener('click', function() {
                        let authRow = document.createElement('tr');
                        let authCell = authRow.insertCell(0);
                        authCell.colSpan = 2;
                        const authForm = document.createElement('form');
                        authForm.classList.add('categories-form');

                        const categories = [
                            {
                              name: 'ניהול וכללי',
                              options: [
                                { name: 'מנהל', value: '000' },
                                { name: 'כללי', value: '01' },
                                { name: 'פאנל טלפניות', value: '30' },
                              ]
                            },
                            {
                              name: 'אירועים',
                              options: [
                                { name: 'אירוע חדש', value: '10' },
                                { name: 'אירועים פתוחים כללי', value: '11' },
                                { name: 'אירועים פתוחים מתנדב', value: '12' },
                                { name: 'אירועים של המתנדב', value: '13' },
                              ]
                            },
                            {
                              name: 'מלאי',
                              options: [
                                { name: 'הוספת מוצר', value: '20' },
                                { name: 'החזרת מוצר', value: '21' },
                                { name: 'השאלת מוצר', value: '22' },
                                { name: 'צפייה במלאי', value: '23' },
                                { name: 'צור הזמנה עתידית', value: '26' } ,
                                { name: 'מוצרים מושאלים', value: '24' },
                                { name: 'הזמנות עתידיות', value: '27' },
                
                
                               
                              ]
                            },
                            {
                              name: 'ארכיבים',
                              options: [
                                { name: 'ארכיב השאלות', value: '25' },
                                { name: 'ארכיב הזמנות', value: '33' },
                                { name: 'ארכיב בקשות השאלה', value: '32' },
                                { name: 'ארכיב תרומה', value: '31' },
                                { name: 'אירועים סגורים', value: '14' },
                              ]
                            },
                            {
                              name: 'בקשות',
                              options: [
                                { name: 'צפה בבקשות השאלה', value: '28' },
                                { name: 'צפה בבקשות תרומה', value: '29' },
                                
                              ]
                            },
                            {
                              name: 'הודעות',
                              options: [
                                { name: 'הודעות כללי', value: '40' },
                                { name: 'הודעות טלפניות', value: '41' },
                                { name: 'הודעות שינוע', value: '42' },
                                { name: 'הודעות מנהלים', value: '43' },
                                { name: 'הודעות מסדרי מחסן', value: '44' },
                              ]
                            }
                          ];
            
            
                        categories.forEach(category => {
                            const categoryDiv = document.createElement('div');
                            categoryDiv.classList.add('category');

                            const categoryLabel = document.createElement('label');
                            categoryLabel.classList.add('category-title');

                            categoryLabel.textContent = category.name;
                            categoryDiv.appendChild(categoryLabel);
                          
                            category.options.forEach(option => {
                              const checkboxContainer = document.createElement('div');
                              checkboxContainer.classList.add('checkbox-container');

                              const checkbox = document.createElement('input');
                              checkbox.type = 'checkbox';
                              checkbox.id = option.value;
                              checkbox.name = option.name;
                              checkbox.value = option.value;
                              checkbox.classList.add('checkbox');

                          
                              const label = document.createElement('label');
                              label.htmlFor = option.value;
                              label.appendChild(document.createTextNode(option.name));
                              label.classList.add('checkbox-label');

                          
                              checkboxContainer.appendChild(checkbox);
                              checkboxContainer.appendChild(label);
                          
                              categoryDiv.appendChild(checkboxContainer);
                            });
                            authForm.appendChild(categoryDiv);
                        });
            
                        let finishBtn = document.createElement('button');
                        finishBtn.textContent = 'סיום';
                        finishBtn.classList.add('finish-button'); // Add this line to assign a class to the button
                        authForm.appendChild(finishBtn);
          
                        authForm.addEventListener('submit', function(e) {
                            e.preventDefault();
                            const authCheckboxes = Array.from(authForm.querySelectorAll('input[type=checkbox]'));  // Query all checkboxes inside the form
                            const selectedAuths = [];
                        
                            authCheckboxes.forEach(authOption => {
                                if (authOption.checked) {
                                    selectedAuths.push(authOption.value);
                                }
                            });

                            db.collection('Volunteers Waiting').doc(doc.id).update({
                                Authorizations: selectedAuths
                            });
                            authForm.style.display = 'none';
                        });
                        
                        authCell.appendChild(authForm);
            detailsRow.insertAdjacentElement('afterend', authRow);
                }); 




                authorizeBtn.addEventListener('click', function() {
                    incrementVolunteers();
                    db.collection("Volunteers Waiting").doc(doc.id).get()
                    .then(doc => {
                        if (doc.exists) {
                            // Then move the updated document to the "Volunteers" collection
                            db.collection("Volunteers").doc(doc.id).set(doc.data())
                            .then(() => {
                                // Then delete from the "Volunteers Waiting" collection
                                db.collection("Volunteers Waiting").doc(doc.id).delete()
                                .then(() => {
                                    row.remove(); // To remove the entire row after form submission
                                    loadWaitingVolunteers();
                                });
                            });
                            
                        } else {
                            console.log("No such document!");
                        }
                    }).catch(error => {
                        console.log("Error getting document:", error);
                    });
                });


                doNotAuthorizeBtn.addEventListener('click', function() {
                    // Delete the doc from the current collection
                    if (confirm('האם תרצה למנוע גישה למשתמש זה?')) {
                      const email = doc.id;
                      db.collection("Volunteers Waiting").doc(email).delete()
                        .then(() => {
                          // After deleting the document, call the cloud function to delete the user
                          firebase.functions().httpsCallable('deleteUser')({email: email})
                            .then(() => {
                              console.log("User deletion request sent successfully");
                              row.remove(); // To remove the entire row after form submission
                              loadWaitingVolunteers();
                            })
                            .catch((error) => {
                              console.error("Error sending user deletion request:", error);
                            });
                        })
                        .catch((error) => {
                          console.error("Error removing document: ", error);
                        });
                    }
                  });
                  

           
            });
        });
    });
}




function incrementVolunteers() {
 
    let date = new Date();
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let currentMonth = monthNames[date.getMonth()];
    let currentYear = date.getFullYear();
    let docId = currentMonth + ' ' + currentYear;
  
    // Update borrows field
    let statisticsRef =firebase.firestore().collection('Monthly Statistics').doc(docId);
    statisticsRef.update({
        newVolunteers: firebase.firestore.FieldValue.increment(1)
    }).then(() => {
        console.log("Document successfully updated!");
    }).catch((error) => {
        console.error("Error updating document: ", error);
    });


    
  
}
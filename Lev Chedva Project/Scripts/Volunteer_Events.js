firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      const userEmail = user.email;
      console.log(userEmail);
  
      // Get the "authorizations" field for the current user's email from the "Volunteers" collection
      firebase.firestore().collection("Volunteers").doc(userEmail).get().then((doc) => {
        if (doc.exists) {
          const TakenEvents = doc.data().TakenEvents;
          console.log(TakenEvents);
          // Show the buttons based on the authorizations field
          TakenEvents.forEach((event) => {
            firebase.firestore().collection("Open Events").doc(event.toString()).get().then((doc) => {
              const eventData=doc.data();
              const row = document.createElement('tr');
              const nameCell = document.createElement('td');
              nameCell.textContent =  eventData.ProductName + " מכתובת: "+eventData.Source_Address +" לכתובת:" + eventData.Destination_Address;
  if(eventData.jeepUnit==true)
  nameCell.textContent =eventData.ProductName + " מכתובת: "+eventData.Source_Address +" לכתובת:" + eventData.Destination_Address+ "  -שינוע ג'יפ";
  if(eventData.motorcycleUnit==true)
  nameCell.textContent =eventData.ProductName + " מכתובת: "+eventData.Source_Address +" לכתובת:" + eventData.Destination_Addresss+ "  -שינוע דו גלגלי"
              row.appendChild(nameCell);
              eventTable.appendChild(row);
              // Add a click event listener to each row to show more details
              row.addEventListener('click', () => {
                // Check if the details row already exists
                const detailsRow = row.nextElementSibling;
                if (detailsRow && detailsRow.classList.contains('Data-details-row')) {
                  // If the row already exists, remove it to hide the details
                  row.parentElement.removeChild(detailsRow);
                } else {
                  // Create a new row to display the volunteer details
                  const detailsRow = document.createElement('tr');
                  detailsRow.classList.add('Data-details-row');
                  const detailsCell = document.createElement('td');
                  detailsCell.colSpan = 8;
                  const detailsList = document.createElement('ul');
                  const ProductNameItem = document.createElement('li');
                  ProductNameItem.textContent = "שם המוצר: " + eventData.ProductName;
                  const ContactNameItem = document.createElement('li');
                  ContactNameItem.textContent = "איש קשר באיסוף: " + eventData.contactName;
                  const phoneNumber = eventData.contactPhone;
                  const formattedPhoneNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                  const ContactPhoneItem = document.createElement('li');
                  const ContactPhoneLabel = document.createElement('span');
                  ContactPhoneLabel.textContent = 'טלפון באיסוף: ';
                  ContactPhoneItem.appendChild(ContactPhoneLabel);
                  const phoneLink = document.createElement('a');
                  phoneLink.href = 'tel:' + phoneNumber; // Specify the phone number as the href
                  phoneLink.textContent = formattedPhoneNumber;
                  ContactPhoneItem.appendChild(phoneLink);
                  
          

                  const AdressItem = document.createElement('li');
const sourceAddress = eventData.Source_Address;

// Create an anchor element for the Waze navigation
const wazeLink = document.createElement('a');
wazeLink.href = "https://www.waze.com/ul?ll=" + encodeURI(sourceAddress); // Encode the address for the URL
wazeLink.target = "_blank"; // Open link in a new tab

// Create an image element for the Waze icon
const wazeIcon = document.createElement('img');
wazeIcon.src = "../Pictures/waze.png"; // Replace with the actual path to the Waze icon image
wazeIcon.alt = "Waze";
wazeIcon.width = 40; // Adjust the width as needed

// Append the Waze icon to the anchor element
wazeLink.appendChild(wazeIcon);

// Create an anchor element for the Google Maps navigation
const googleMapsLink = document.createElement('a');
googleMapsLink.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURI(sourceAddress); // Encode the address for the URL
googleMapsLink.target = "_blank"; // Open link in a new tab

// Create an image element for the Google Maps icon
const googleMapsIcon = document.createElement('img');
googleMapsIcon.src = "../Pictures/map.png"; // Replace with the actual path to the Google Maps icon image
googleMapsIcon.alt = "Google Maps";
googleMapsIcon.width = 40; // Adjust the width as needed

// Append the Google Maps icon to the anchor element
googleMapsLink.appendChild(googleMapsIcon);

// Append the source address and both navigation links to the item
AdressItem.textContent = "כתובת איסוף: " + sourceAddress;
AdressItem.appendChild(wazeLink.cloneNode(true)); // Clone the elements to avoid overwriting
AdressItem.appendChild(googleMapsLink.cloneNode(true)); // Clone the elements to avoid overwriting

const AdressItem2 = document.createElement('li');
const destinationAddress = eventData.Destination_Address;

// Create an anchor element for the Waze navigation (destination)
const wazeLink2 = document.createElement('a');
wazeLink2.href = "https://www.waze.com/ul?ll=" + encodeURI(destinationAddress); // Encode the address for the URL
wazeLink2.target = "_blank"; // Open link in a new tab

// Create an image element for the Waze icon (destination)
const wazeIcon2 = document.createElement('img');
wazeIcon2.src = "../Pictures/waze.png"; // Replace with the actual path to the Waze icon image
wazeIcon2.alt = "Waze";
wazeIcon2.width = 40; // Adjust the width as needed

// Append the Waze icon to the anchor element (destination)
wazeLink2.appendChild(wazeIcon2);

// Create an anchor element for the Google Maps navigation (destination)
const googleMapsLink2 = document.createElement('a');
googleMapsLink2.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURI(destinationAddress); // Encode the address for the URL
googleMapsLink2.target = "_blank"; // Open link in a new tab

// Create an image element for the Google Maps icon (destination)
const googleMapsIcon2 = document.createElement('img');
googleMapsIcon2.src = "../Pictures/map.png"; // Replace with the actual path to the Google Maps icon image
googleMapsIcon2.alt = "Google Maps";
googleMapsIcon2.width = 40; // Adjust the width as needed

// Append the Google Maps icon to the anchor element (destination)
googleMapsLink2.appendChild(googleMapsIcon2);

// Append the destination address and both navigation links to the item
AdressItem2.textContent = "כתובת יעד: " + destinationAddress;
AdressItem2.appendChild(wazeLink2.cloneNode(true)); // Clone the elements to avoid overwriting
AdressItem2.appendChild(googleMapsLink2.cloneNode(true)); // Clone the elements to avoid overwriting

                 
                  const ContactNameItem2 = document.createElement('li');
                  ContactNameItem2.textContent = "איש קשר ביעד: " + eventData.contactNameDestination;
                  
            
                   const phoneNumber2 = eventData.contactPhoneDestination;
                  const formattedPhoneNumber2 = phoneNumber2 ? phoneNumber2.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3') : '';
            
                  const ContactPhoneItem2 = document.createElement('li');
                  const ContactPhoneLabel2 = document.createElement('span');
                  ContactPhoneLabel2.textContent = 'טלפון ביעד: ';
                  ContactPhoneItem2.appendChild(ContactPhoneLabel2);
            
                  const phoneLink2 = document.createElement('a');
                  phoneLink2.href = phoneNumber2 ? 'tel:' + phoneNumber2 : '#'; // Specify the phone number as the href if available, otherwise use '#' as a placeholder
                  phoneLink2.textContent = formattedPhoneNumber2 ? formattedPhoneNumber2 : 'N/A'; // Display 'N/A' if phone number is not available
                  phoneLink2.addEventListener('click', (event) => {
                    event.stopPropagation();
                  });
                  ContactPhoneItem2.appendChild(phoneLink2);
            
                  
                  // Add an event listener to prevent the click event from propagating to the parent elements
                  phoneLink2.addEventListener('click', (event) => {
                    event.stopPropagation();
                  });
                  
                  ContactPhoneItem2.appendChild(phoneLink2);
                  
                  
            
            
                  const RemarksItem = document.createElement('li');
                  RemarksItem.textContent = "הערות: " + eventData.remarks;
                  const timestamp = eventData.timestamp.seconds * 1000;
                  const date = new Date(eventData.timestamp.seconds * 1000);
                  const now = new Date();
                  const PostTimeItem = document.createElement('li');
                  PostTimeItem.textContent = "תאריך פרסום: " + date.toLocaleString('he-IL');
                  const ElapsedTimeItem = document.createElement('li');
                  let timeElapsed = Math.round((now - timestamp) / (1000 * 60));
                  if (timeElapsed > 60) {
                    timeElapsed = timeElapsed / 60;
                    timeElapsed = Math.floor(timeElapsed);
                    ElapsedTimeItem.textContent = "זמן שחלף: " + timeElapsed + " שעות";
                  } else
                    ElapsedTimeItem.textContent = "זמן שחלף: " + timeElapsed + " דקות";
                  const StatusItem = document.createElement('li');
                  StatusItem.textContent = "סטטוס: " + eventData.status;
                  const TypeItem = document.createElement('li');
                  TypeItem.textContent = "סוג: " + eventData.type;
                  const SizeItem = document.createElement('li');
                  SizeItem.textContent = "גודל: " + eventData.size;
                  let urgencyTranslation = '';
                  switch (eventData.urgency) {
                    case 'Urgent':
                      urgencyTranslation ='דחוף';
                      break;
                    default:
                      urgencyTranslation = 'מי שעל הציר';
                      break;
                  }
                  const UrgencyItem = document.createElement('li');
                  UrgencyItem.textContent = "דחיפות: " + urgencyTranslation;
                  const WeightItem = document.createElement('li');
                  WeightItem.textContent = "משקל: " + eventData.weight
            
            
                  let JeepTranslation = '';
                  switch (eventData.jeepUnit) {
                    case false:
                      JeepTranslation ='לא';
                      break;
                    case true:
                      JeepTranslation = 'כן';
                      break;
                  }
            
                  const JeepItem = document.createElement('li');
                  JeepItem.textContent = "יחידת ג'יפים: " + JeepTranslation;
            
            
                    let MotorcycleTranslation = '';
                    switch (eventData.motorcycleUnit) {
                      case false:
                        MotorcycleTranslation ='לא';
                        break;
                      case true:
                        MotorcycleTranslation = 'כן';
                        break;
                    }
                  const MotorcycleItem = document.createElement('li');
                  MotorcycleItem.textContent = "יחידת האופנועים: " + MotorcycleTranslation;
            
                  const TakenByItem = document.createElement('li');
                  if(eventData.takenBy)
                  {
                  firebase.firestore().collection("Volunteers").doc(eventData.takenBy).get()
                  .then((doc) => {
                    if (doc.exists) {
                      const volunteerData = doc.data();
                      const firstName = volunteerData.firstName;
                      const lastName = volunteerData.lastName;
                      const phoneNumber = volunteerData.phone;
                      TakenByItem.textContent = "נלקח על ידי: " + firstName+lastName+" טלפון: "+phoneNumber; 
                    }
                  });
                 
                }
                  detailsList.appendChild(ProductNameItem);
                  detailsList.appendChild(AdressItem);
                  detailsList.appendChild(ContactNameItem);
                  detailsList.appendChild(ContactPhoneItem);
                  detailsList.appendChild(ContactNameItem2);
                  detailsList.appendChild(ContactPhoneItem2);
                  detailsList.appendChild(AdressItem2);
                  detailsList.appendChild(RemarksItem);
                  detailsList.appendChild(PostTimeItem);
                  detailsList.appendChild(ElapsedTimeItem);
                  detailsList.appendChild(StatusItem);
                  detailsList.appendChild(TypeItem);
                  detailsList.appendChild(SizeItem);
                  detailsList.appendChild(UrgencyItem);
                  detailsList.appendChild(WeightItem);
                  detailsList.appendChild(JeepItem);
                  detailsList.appendChild(MotorcycleItem);
                  detailsCell.appendChild(detailsList);
                  detailsRow.appendChild(detailsCell);
                  row.after(detailsRow);
                  
                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.style.justifyContent = 'center';
                buttonContainer.style.alignItems = 'center';

                const PickupBtn = document.createElement('button');
                PickupBtn.textContent = 'נאסף';
                PickupBtn.style.marginLeft = '10px';

                const Delivered = document.createElement('button');
                Delivered.textContent = 'נמסר';
                Delivered.style.marginLeft = '10px';

                const CancelEvent = document.createElement('button');
                CancelEvent.textContent = 'ביטול אירוע';
                Delivered.style.marginLeft = '10px';
               
                buttonContainer.appendChild(PickupBtn);
                buttonContainer.appendChild(Delivered);
                buttonContainer.appendChild(CancelEvent);  
                detailsList.appendChild(buttonContainer);
            
                PickupBtn.addEventListener('click', () => {
                  if (eventData && eventData.eventCounter) {
                    const docRef = firebase.firestore().collection("Open Events").doc(eventData.eventCounter.toString());
                    const StatusString = "בשינוע";
                    const pickupTime = firebase.firestore.Timestamp.now();
                
                    docRef.update({
                      status: StatusString,
                      pickupTime: pickupTime // add pickupTime field with current time
                    }).then(() => {
                      // After successful update, get the updated document
                      docRef.get().then((updatedDoc) => {
                        if (updatedDoc.exists) {
                          const updatedData = updatedDoc.data();
                          // Update the status item and pickup time in the table row
                          StatusItem.textContent = "סטטוס: " + updatedData.status;
                          PickupTimeItem.textContent = "זמן איסוף: " + updatedData.pickupTime.toDate().toLocaleString('he-IL');
                        } else {
                          console.error("No document exists with the given ID");
                        }
                      }).catch((error) => {
                        console.error("שגיאה בקבלת המסמך המעודכן: ", error);
                      });
                    }).catch((error) => {
                      console.error("שגיאה בעדכון המסמך: ", error);
                    });
                  } else {
                    console.error("Error: eventData or eventData.eventCounter is undefined");
                  }
                  alert("תודה רבה! שינוע נעים!");
                 
                });
                
                
                Delivered.addEventListener('click', () => {
                  if (eventData.status !== "בשינוע") {
                    alert("יש לאסוף את תחילה את המוצר");
                    return;
                  }
                
                  if (eventData && eventData.eventCounter) {
                    const docRef = firebase.firestore().collection("Open Events").doc(eventData.eventCounter.toString());
                    const StatusString = "נמסר";
                    const deliveredTime = firebase.firestore.Timestamp.now();
                    
                    docRef.update({
                      status: StatusString,
                      deliveredTime: deliveredTime // add deliveredTime field with current time
                    }).then(() => {
                      row.remove();
                      detailsRow.remove();
                      
                      

                      // Update Volunteer document
                      const volunteerDocRef = firebase.firestore().collection("Volunteers").doc(userEmail);
                
                      volunteerDocRef.update({
                        "totalEvents": firebase.firestore.FieldValue.increment(1), // increment total events by 1
                        "monthlyEvents": firebase.firestore.FieldValue.increment(1), // increment monthly events by 1
                        latestEvent: deliveredTime // update latestEvent field with deliveredTime
                      }).catch((error) => {
                        console.error("שגיאה בעדכון מסמך המתנדב: ", error);
                      });
                    
                
                 
                    }).catch((error) => {
                      console.error("שגיאה בעדכון המסמך: ", error);
                    });
                  } else {
                    console.error("Error: eventData or eventData.eventCounter is undefined");
                  }
                
                  const updatedTakenEvents = TakenEvents.filter((e) => e !== event);
                  firebase.firestore().collection("Volunteers").doc(userEmail).update({ 
                    TakenEvents: updatedTakenEvents 
                  }).then(() => {
                    console.log("TakenEvents array updated successfully!");
                  }).catch((error) => {
                    console.log("Error updating TakenEvents array:", error);
                  });
                
                  alert("מוצר נמסר בהצלחה! תודה רבה!");
                });
                
                CancelEvent.addEventListener('click', () => {
                    if (eventData && eventData.eventCounter) {
                        {
                        const docRef = firebase.firestore().collection("Open Events").doc(eventData.eventCounter.toString());
                        StatusString="פתוח";
                        docRef.update({
                          status: StatusString
                        }).catch((error) => {
                          console.error("שגיאה בעדכון המסמך: ", error);
                        });
                        const updatedTakenEvents = TakenEvents.filter((e) => e !== event);
                        firebase.firestore().collection("Volunteers").doc(userEmail).update({ 
                        TakenEvents: updatedTakenEvents 
                        }).then(() => {
                            console.log("TakenEvents array updated successfully!");
                            row.remove();
                            detailsRow.remove();
                          }).catch((error) => {
                            console.log("Error updating TakenEvents array:", error);
                          });
                      }
                    }
                })
            }})

              // Do something with the event data, e.g. display it on the page
            }).catch((error) => {
              console.log("שגיאה בקבלת נתוני האירוע", error);
            });
          });
        } else {
          console.log("לא קיים מסמך כזה");
        }
      }).catch((error) => {
        console.log("שגיאה בקבלת המסמך:", error);
      });
    } else {
      // No user is signed in.
      console.log("משתמש לא מחובר");
    }
  });

function handleMobileButtonClick() {
  window.location.href = 'Volunteer_Transport_Panel.html';
}

window.addEventListener('DOMContentLoaded', () => {
  const mobileButton = document.getElementById('mobileButton');
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    mobileButton.style.display = 'block';
  } else {
    mobileButton.style.display = 'none';
  }
});

  
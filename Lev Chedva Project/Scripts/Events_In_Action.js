let eventArray = [];
const eventTable = document.getElementById('eventTable');
const db = firebase.firestore();
const eventRef = db.collection("Open Events");
const filterBar = document.getElementById("authorization-filter");


// great now lets add the implantation i want only the -ProductNameItem-AdressItem-AdressItem2-ContactNameItem-ContactPhoneItem--RemarksItem


async function readData() {
  try {
    const snapshot = await eventRef.get();
    snapshot.forEach((doc) => {
      if (doc.exists) {
        eventArray.push(doc.data());
      } else {
        console.log("אין מסמך כזה!");
      }
    });
    eventArray.sort((a, b) => a.eventCounter - b.eventCounter); // Sort the eventArray based on eventCounter
    preDisplayData("הכל");
  } catch (error) {
    console.log("שגיאה בקבלת המסמכים:", error);
  }

  eventArray.reverse();
  preDisplayData("הכל");
}

filterBar.addEventListener("change", function() {
  const selectedValue = filterBar.value;
  preDisplayData(selectedValue);
});

function preDisplayData(filter) {
  eventTable.innerHTML = "";
  eventArray.forEach((eventData) => {
   
    if (filter == "הכל") {
      DisplayData(eventData);
    } else {
      var StatusString = eventData.status;
      if (StatusString.toLowerCase().includes(filter.toLowerCase())||eventData.urgency=="Urgent")
        DisplayData(eventData);
    }
  });
}

function DisplayData(eventData) {
  const row = document.createElement('tr');
  const nameCell = document.createElement('td');



  nameCell.textContent =eventData.eventCounter+" | "+  "שם מוצר: " + eventData.ProductName + ", כתובת מקור: " + eventData.Source_Address + " , כתובת יעד: " + eventData.Destination_Address;
  if(eventData.jeepUnit==true)
  nameCell.textContent =eventData.eventCounter+" | "+  "שם מוצר: " + eventData.ProductName + ", כתובת מקור: " + eventData.Source_Address + " , כתובת יעד: " + eventData.Destination_Address+ "  -שינוע ג'יפ";
  

  if(eventData.motorcycleUnit==true)
  nameCell.textContent =eventData.eventCounter+" | "+  "שם מוצר: " + eventData.ProductName + ", כתובת מקור: " + eventData.Source_Address + " , כתובת יעד: " + eventData.Destination_Address+ "  -שינוע דו גלגלי"
  row.appendChild(nameCell);
  eventTable.appendChild(row);
  switch (eventData.status) {
    case "פתוח":
      if (eventData.urgency === "דחוף") {
        row.style.backgroundColor = "#FFCDD2"; // Soft red
      }
      break;
    case "נלקח":
      row.style.backgroundColor = "#FFF9C4"; // Soft yellow
      break;
    case "בשינוע":
      row.style.backgroundColor = "#C8E6C9"; // Soft green
      break;
      case "נמסר":
        row.style.backgroundColor = "#f0ceff"; // Soft purple
    default:
      break;
  }
  row.addEventListener('click', () => {
    const detailsRow = row.nextElementSibling;
    if (detailsRow && detailsRow.classList.contains('Data-details-row')) {
      row.parentElement.removeChild(detailsRow);
    } else {
      const detailsRow = document.createElement('tr');
      detailsRow.classList.add('Data-details-row');
      const detailsCell = document.createElement('td');
      detailsCell.colSpan = 8;
      const detailsList = document.createElement('ul');
      const ProductNameItem = document.createElement('li');
      ProductNameItem.textContent = "שם המוצר: " + eventData.ProductName;
      const AdressItem = document.createElement('li');
      AdressItem.textContent = "כתובת איסוף: " + eventData.Source_Address;
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
      

      const AdressItem2 = document.createElement('li');
      AdressItem2.textContent = "כתובת יעד: " + eventData.Destination_Address;
     
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
      db.collection("Volunteers").doc(eventData.takenBy).get()
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
    const TakenAtItem = document.createElement('li');
    TakenAtItem.textContent = eventData.takenAt ? "נלקח ב: " + formatDate(eventData.takenAt) : "נלקח ב: N/A";
    const PickedUpleItem = document.createElement('li');
    PickedUpleItem.textContent = eventData.pickupTime ? "נאסף ב: " + formatDate(eventData.pickupTime) : "נאסף ב: N/A";
    const DeliveredItem = document.createElement('li');
    DeliveredItem.textContent = eventData.deliveredTime ? "נמסר ב: " + formatDate(eventData.deliveredTime) : "נמסר ב: N/A";
    
    function formatDate(timestamp) {
      if (timestamp && timestamp.seconds) {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleString('he-IL', { dateStyle:'short', timeStyle: 'short' });
      } else {
        return 'N/A';
      }
    }
    

      detailsList.appendChild(ProductNameItem);
      detailsList.appendChild(AdressItem);
      detailsList.appendChild(AdressItem2);
      detailsList.appendChild(ContactNameItem);
      detailsList.appendChild(ContactPhoneItem);
      detailsList.appendChild(ContactNameItem2);
      detailsList.appendChild(ContactPhoneItem2);
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
      detailsList.appendChild(TakenByItem);
      detailsList.appendChild(TakenAtItem);
      detailsList.appendChild(PickedUpleItem);
      detailsList.appendChild(DeliveredItem);
      detailsCell.appendChild(detailsList);
      detailsRow.appendChild(detailsCell);
      row.after(detailsRow);

      const buttonContainer = document.createElement('div');
      buttonContainer.style.display = 'flex';
      buttonContainer.style.justifyContent = 'center';
      buttonContainer.style.alignItems = 'center';

      const EditEvent = document.createElement('button');
      EditEvent.textContent = 'עריכת אירוע';
      EditEvent.style.margin = '0 10px'; // Add margin around the button
      buttonContainer.appendChild(EditEvent);
      
      const CloseEvent = document.createElement('button');
      CloseEvent.textContent = 'סגירת אירוע';
      CloseEvent.style.margin = '0 10px'; // Add margin around the button
      
      const CancelEvent = document.createElement('button');
      CancelEvent.textContent = 'ביטול אירוע';
      CancelEvent.style.margin = '0 10px'; // Add margin around the button
      
      buttonContainer.appendChild(CloseEvent);
      buttonContainer.appendChild(CancelEvent);
      
      detailsList.appendChild(buttonContainer);

      EditEvent.addEventListener('click', () => {
        // Replace the text content with editable input fields
    
        // ProductNameItem
        const ProductNameLabel = document.createElement('span');
        ProductNameLabel.textContent = 'שם המוצר: ';
        const ProductNameInput = document.createElement('input');
        ProductNameInput.type = 'text';
        ProductNameInput.value = eventData.ProductName;
        ProductNameItem.textContent = '';
        ProductNameItem.appendChild(ProductNameLabel);
        ProductNameItem.appendChild(ProductNameInput);
    
        // AdressItem
        const AdressLabel = document.createElement('span');
        AdressLabel.textContent = 'כתובת מקור: ';
        const AdressInput = document.createElement('input');
        AdressInput.type = 'text';
        AdressInput.value = eventData.Source_Address;
        AdressItem.textContent = '';
        AdressItem.appendChild(AdressLabel);
        AdressItem.appendChild(AdressInput);
    
        // AdressItem2
        const AdressLabel2 = document.createElement('span');
        AdressLabel2.textContent = 'כתובת יעד: ';
        const AdressInput2 = document.createElement('input');
        AdressInput2.type = 'text';
        AdressInput2.value = eventData.Destination_Address;
        AdressItem2.textContent = '';
        AdressItem2.appendChild(AdressLabel2);
        AdressItem2.appendChild(AdressInput2);
    
        // ContactNameItem
        const ContactNameLabel = document.createElement('span');
        ContactNameLabel.textContent = 'שם איש קשר: ';
        const ContactNameInput = document.createElement('input');
        ContactNameInput.type = 'text';
        ContactNameInput.value = eventData.contactName;
        ContactNameItem.textContent = '';
        ContactNameItem.appendChild(ContactNameLabel);
        ContactNameItem.appendChild(ContactNameInput);
    
        // ContactPhoneItem
        const ContactPhoneLabel = document.createElement('span');
        ContactPhoneLabel.textContent = 'טלפון באיסוף: ';
        const ContactPhoneInput = document.createElement('input');
        ContactPhoneInput.type = 'text';
        ContactPhoneInput.value = eventData.contactPhone;
        ContactPhoneItem.textContent = '';
        ContactPhoneItem.appendChild(ContactPhoneLabel);
        ContactPhoneItem.appendChild(ContactPhoneInput);
    
        // RemarksItem
        const RemarksLabel = document.createElement('span');
        RemarksLabel.textContent = 'הערות: ';
        const RemarksInput = document.createElement('input');
        RemarksInput.type = 'text';
        RemarksInput.value = eventData.remarks;
        RemarksItem.textContent = '';
        RemarksItem.appendChild(RemarksLabel);
        RemarksItem.appendChild(RemarksInput);
    
        // ContactNameItem2
        const ContactNameLabel2 = document.createElement('span');
        ContactNameLabel2.textContent = 'שם איש קשר ביעד: ';
        const ContactNameInput2 = document.createElement('input');
        ContactNameInput2.type = 'text';
        ContactNameInput2.value = eventData.contactNameDestination;
        ContactNameItem2.textContent = '';
        ContactNameItem2.appendChild(ContactNameLabel2);
        ContactNameItem2.appendChild(ContactNameInput2);
    
        // ContactPhoneItem2
        const ContactPhoneLabel2 = document.createElement('span');
        ContactPhoneLabel2.textContent = 'טלפון ביעד: ';
        const ContactPhoneInput2 = document.createElement('input');
        ContactPhoneInput2.type = 'text';
        ContactPhoneInput2.value = eventData.contactPhoneDestination;
        ContactPhoneItem2.textContent = '';
        ContactPhoneItem2.appendChild(ContactPhoneLabel2);
        ContactPhoneItem2.appendChild(ContactPhoneInput2);
    
         // SizeItem
    const SizeLabel = document.createElement('span');
    SizeLabel.textContent = 'גודל: ';
    const SizeSelect = document.createElement('select');
    const sizeOptions = ['ענק', 'גדול', 'בינוני','קטן']; // Example size options
    sizeOptions.forEach((option) => {
      const sizeOption = document.createElement('option');
      sizeOption.value = option;
      sizeOption.textContent = option;
      if (option === eventData.size) {
        sizeOption.selected = true; // Select the current value
      }
      SizeSelect.appendChild(sizeOption);
    });
    SizeItem.textContent = '';
    SizeItem.appendChild(SizeLabel);
    SizeItem.appendChild(SizeSelect);

    // WeightItem
    const WeightLabel = document.createElement('span');
    WeightLabel.textContent = 'משקל: ';
    const WeightSelect = document.createElement('select');
    const weightOptions = ['כבד מאוד', 'כבד', 'בינוני','קל']; // Example weight options
    weightOptions.forEach((option) => {
      const weightOption = document.createElement('option');
      weightOption.value = option;
      weightOption.textContent = option;
      if (option === eventData.weight) {
        weightOption.selected = true; // Select the current value
      }
      WeightSelect.appendChild(weightOption);
    });
    WeightItem.textContent = '';
    WeightItem.appendChild(WeightLabel);
    WeightItem.appendChild(WeightSelect);

    // JeepItem
    const JeepLabel = document.createElement('span');
    JeepLabel.textContent = "יחידת ג'יפים: ";
    const JeepCheckbox = document.createElement('input');
    JeepCheckbox.type = 'checkbox';
    JeepCheckbox.checked = eventData.jeepUnit;
    const JeepCheckboxLabel = document.createElement('label');
    JeepCheckboxLabel.appendChild(JeepCheckbox);
    JeepCheckboxLabel.appendChild(document.createTextNode('כן'));
    JeepItem.textContent = '';
    JeepItem.appendChild(JeepLabel);
    JeepItem.appendChild(JeepCheckboxLabel);

    // MotorcycleItem
    const MotorcycleLabel = document.createElement('span');
    MotorcycleLabel.textContent = 'יחידת האופנועים: ';
    const MotorcycleCheckbox = document.createElement('input');
    MotorcycleCheckbox.type = 'checkbox';
    MotorcycleCheckbox.checked = eventData.motorcycleUnit;
    const MotorcycleCheckboxLabel = document.createElement('label');
    MotorcycleCheckboxLabel.appendChild(MotorcycleCheckbox);
    MotorcycleCheckboxLabel.appendChild(document.createTextNode('כן'));
    MotorcycleItem.textContent = '';
    MotorcycleItem.appendChild(MotorcycleLabel);
    MotorcycleItem.appendChild(MotorcycleCheckboxLabel);

    // Event listener for submitting changes
    const submitChanges = () => {
      // Update the eventData with the new values
      eventData.ProductName = ProductNameInput.value;
      eventData.Source_Address = AdressInput.value;
      eventData.Destination_Address = AdressInput2.value;
      eventData.contactName = ContactNameInput.value;
      eventData.contactPhone = ContactPhoneInput.value;
      eventData.remarks = RemarksInput.value;
      eventData.size = SizeSelect.value;
      eventData.weight = WeightSelect.value;
      eventData.jeepUnit = JeepCheckbox.checked;
      eventData.motorcycleUnit = MotorcycleCheckbox.checked;

      // Update the Firestore document
      const eventDocRef = eventRef.doc(eventData.eventCounter.toString());
      eventDocRef.update(eventData)
        .then(() => {
          // Display the updated information
          ProductNameItem.textContent = "שם המוצר: " + eventData.ProductName;
          // ...update other items' text content...

          // Remove the input fields and submit button
          ProductNameLabel.remove();
          ProductNameInput.remove();
          // ...remove other input fields...

          submitButton.remove();
        })
        .catch((error) => {
          console.error("Error updating Firestore document: ", error);
        });
    };

    // Create a submit button for changes
    const submitButton = document.createElement('button');
    submitButton.textContent = 'שמירת שינויים';
    submitButton.style.marginTop = '10px'; // Add margin top for spacing
    buttonContainer.appendChild(submitButton);

    // Event listener for submit button
    submitButton.addEventListener('click', submitChanges);
  });


  CloseEvent.addEventListener('click', () => {
    if (eventData && eventData.eventCounter) {
      if (confirm("האם אתה בטוח שברצונך לסגור את האירוע הזה?")) {
        const currentDate = new Date().toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "."); // Get the current date and format it to Hebrew format
        const docRef = firebase.firestore().collection("Open Events").doc(eventData.eventCounter.toString());
        const statusString = "סגור";
        const closedEventData = { ...eventData, CloseDate: currentDate, status: statusString };
        docRef.update({ status: statusString })
          .then(() => {
            row.remove();
            detailsRow.remove();
            firebase.firestore().collection("Closed Events").doc(eventData.eventCounter.toString()).set({ eventData: closedEventData });
            firebase.firestore().collection("Open Events").doc(eventData.eventCounter.toString()).delete({ eventData });
            incrementTransports();
          })
          .catch((error) => {
            console.error("שגיאה בעדכון המסמך: ", error);
          });
          const toolsDocRef = firebase.firestore().collection("Tools").doc("Statistics");
                
                      toolsDocRef.update({
                        "TotalEvents": firebase.firestore.FieldValue.increment(1)
                      }).catch((error) => {
                        console.error("שגיאה בעדכון מסמך הכלים: ", error);
                      });

      } else {
        console.error("שגיאה: המסמך או המזהה של המסמך אינם מוגדרים");
      }
    }
  });
  
  
  

      CancelEvent.addEventListener('click', () => {
        if (eventData && eventData.eventCounter) {
          if (confirm("האם אתה בטוח שברצונך לבטל את האירוע הזה?")) {
            const openDocRef = firebase.firestore().collection("Open Events").doc(eventData.eventCounter.toString());
            const closedDocRef = firebase.firestore().collection("Closed Events").doc(eventData.eventCounter.toString());
            const StatusString = "בוטל";
            const CanceledString = eventData.eventCounter.toString() + " -בוטל";
            eventData.status=StatusString;
            eventData.eventCounter=CanceledString;
              
            closedDocRef.set({ eventData })
              .then(() => {
                return openDocRef.delete();
              })
              .then(() => {
                row.remove();
                detailsRow.remove();
                console.log("Event canceled and removed from Open Events");
              })
              .catch((error) => {
                console.error("שגיאה בביטול האירוע ועדכון המסמך: ", error);
              });
          } else {
            console.error("שגיאה: המסמך או המזהה של המסמך אינם מוגדרים");
          }
        }
      });
      
      
    }
  });
}

// Assuming you have a search input field with the id "searchInput"
const searchInput = document.getElementById('searchInput');

// Add an event listener to the search input field
searchInput.addEventListener('input', function () {
  const searchTerm = searchInput.value.trim(); // Retrieve the search term and remove leading/trailing whitespace

  // Call the searchAcrossCollection function with the search term
  searchAcrossCollection(searchTerm);
});

async function searchAcrossCollection(searchTerm) {
  reservationTableBody.innerHTML = "";
  const snapshot = await db
    .collection("Closed Events")
    .orderBy(firebase.firestore.FieldPath.documentId(), "asc")
    .get();

  const docs = snapshot.docs.reverse(); // Reverse the order of the documents

  docs.forEach((doc) => {
    const data = doc.data();
    for (let key in data) {
      if (data[key].toString().toLowerCase().includes(searchTerm.toLowerCase())) {
        DisplayData(doc);
        break;
      }
    }
  });
}



function incrementTransports() {

  let date = new Date();
  let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let currentMonth = monthNames[date.getMonth()];
  let currentYear = date.getFullYear();
  let docId = currentMonth + ' ' + currentYear;

  // Update borrows field
  let statisticsRef =firebase.firestore().collection('Monthly Statistics').doc(docId);
  statisticsRef.update({
    transports: firebase.firestore.FieldValue.increment(1)
  }).then(() => {
      console.log("Document successfully updated!");
  }).catch((error) => {
      console.error("Error updating document: ", error);
  });

}

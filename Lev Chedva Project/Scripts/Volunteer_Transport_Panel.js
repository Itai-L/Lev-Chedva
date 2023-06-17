let eventArray = [];
const eventTable = document.getElementById('eventTable');
const db = firebase.firestore();
const eventRef = db.collection("Open Events");
const winnersTable = document.getElementById('winnersTable');
const winnersDiv = document.getElementById('winnersDiv');
const volunteersRef = db.collection("Volunteers");


async function readData() {
  try {
    const snapshot = await eventRef.get();
    eventArray = []; // Clear the eventArray before populating it again
    snapshot.forEach((doc) => {
      if (doc.exists && doc.data().status === "פתוח") {
        eventArray.push(doc.data());
      }
    });
  } catch (error) {
    console.log("Error getting documents:", error);
  }

  eventArray.reverse();
  eventTable.innerHTML = "";
  eventArray.forEach((eventData) => {
    DisplayData(eventData);
  })
}

function DisplayData(eventData) {
  const row = document.createElement('tr');
  const nameCell = document.createElement('td');
  
  nameCell.textContent =  eventData.ProductName + " מכתובת: "+eventData.Source_Address +" לכתובת:" + eventData.Destination_Address;
  
  if(eventData.jeepUnit==true)
  nameCell.textContent =eventData.ProductName + " מכתובת: "+eventData.Source_Address +" לכתובת:" + eventData.Destination_Address+ "  -שינוע ג'יפ";
  

  if(eventData.motorcycleUnit==true)
  nameCell.textContent =eventData.ProductName + " מכתובת: "+eventData.Source_Address +" לכתובת:" + eventData.Destination_Address+ "  -שינוע דו גלגלי"
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
      const TakeEvent = document.createElement('button');

      TakeEvent.textContent = 'לקחתי!';
      buttonContainer.appendChild(TakeEvent);
      detailsList.appendChild(buttonContainer);

      TakeEvent.addEventListener('click', () => {
        var user = firebase.auth().currentUser;
        if (user) {
          var email = user.email;
          const currentTime = firebase.firestore.Timestamp.now();
      
          firebase.firestore().collection("Volunteers").doc(email).update({
            TakenEvents: firebase.firestore.FieldValue.arrayUnion(eventData.eventCounter)
          }).then(() => {
            const docRef = firebase.firestore().collection("Open Events").doc(eventData.eventCounter.toString());
            const StatusString = "נלקח";
            
            docRef.update({
              status: StatusString,
              takenBy: email, // add takenBy field to the event document
              takenAt: currentTime // add takenAt field with current time
            }).then(() => {
              row.remove();
              detailsRow.remove();
              updateWinnersTable(); // Update the winners table
            }).catch((error) => {
              console.error("שגיאה בעדכון המסמך: ", error);
            });
          }).catch((error) => {
            console.error("שגיאה בעדכון המסמך: ", error);
          });
        } else {
          console.log('לא נמצא משתמש מחובר.');
        }
        alert("שינוע נלקח בהצלחה, תודה!");
      });
      
}
  });

}

let count=0;
async function updateWinnersTable() {
  try {
    const snapshot = await eventRef.get();
    winnersTable.innerHTML = ""; // Clear the winnersTable before populating it again
    snapshot.forEach((doc) => {
      if (doc.exists && (doc.data().status === "נלקח" || doc.data().status === "בשינוע")) {
        const eventData = doc.data();
        count++;
        if(count>0)
        winnersDiv.style.display = 'block';
        displayWinner(eventData);
      }
    });
  } catch (error) {
    console.log("Error getting documents:", error);
  }
}

async function displayWinner(eventData) {
  const volunteerSnapshot = await volunteersRef.doc(eventData.takenBy).get();
  if (volunteerSnapshot.exists) {
    const volunteerData = volunteerSnapshot.data();
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    nameCell.textContent = "תודה ל "+volunteerData.firstName + " " + volunteerData.lastName+ " על שינוע של" +eventData.ProductName+" מ: "+eventData.Source_Address+" ל: "+eventData.Destination_Address;
    // const sourceCell = document.createElement('td');
    // sourceCell.textContent = eventData.Source_Address;
    // const destCell = document.createElement('td');
    // destCell.textContent = eventData.Destination_Address;
    row.appendChild(nameCell);
    // row.appendChild(sourceCell);
    // row.appendChild(destCell);
    winnersTable.appendChild(row);
  } else {
    console.log("No volunteer found for email:", eventData.takenBy);
  }
}

// And also call updateWinnersTable when the page loads, to display the current winners:


  readData();
  updateWinnersTable();

  function handleMobileButtonClick() {
    window.location.href = 'Volunteer_Events.html';
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


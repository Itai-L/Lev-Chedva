const auth = firebase.auth();
const db = firebase.firestore();
var statsBox = document.querySelector('.stats-box');
var monthlyBorrowsElement = document.getElementById('monthlyBorrows');
var totalEventsElement = document.getElementById('totalEvents');
var lastEventElement = document.getElementById('lastEvent');

auth.onAuthStateChanged(user => {
  if (user) {
    // User is signed in.
    let email = user.email;

    // Check if the user is in the "Volunteers Waiting" collection
    db.collection('Volunteers Waiting').doc(email).get()
      .then(doc => {
        if (doc.exists) {
          let data = doc.data();
          document.getElementById('username').textContent = `${data.firstName} ${data.lastName}`;
          // User is in the "Volunteers Waiting" collection
          let confirmationMessage = document.createElement('div');
          confirmationMessage.className = 'message';
          confirmationMessage.style.width = 'auto';
          confirmationMessage.style.height = 'fit-content'
          confirmationMessage.innerHTML = `
            <h2>בקשתך להתנדבות בטיפול</h2>
            <p>תודה על הרשמתך. הבקשה שלך צריכה להתווסף על ידי מנהל המערכת.</p>
          `;
          messageContainer.appendChild(confirmationMessage);
          document.getElementById('dashboard').textContent = 'בקשתך להתנדבות בטיפול';
        } else {
          // User is not in the "Volunteers Waiting" collection
          db.collection('Volunteers').doc(email).get()
            .then(doc => {
              if (doc.exists) {
                let data = doc.data();
                if (doc.exists && doc.data().latestEvent && doc.data().monthlyEvents && doc.data().totalEvents) {
                  statsBox.style.display="block";
                monthlyBorrowsElement.textContent = data.monthlyEvents;
                totalEventsElement.textContent = data.totalEvents;
                var lastEventTimestamp = data.latestEvent.toDate();
                var lastEventDate = new Date(lastEventTimestamp);
                var options = { year: 'numeric', month: 'long', day: 'numeric', locale: 'he-IL' };
                lastEventElement.textContent = lastEventDate.toLocaleDateString('he-IL', options);
                }
                // checkVolunteerStats();
                document.getElementById('username').textContent = `${data.firstName} ${data.lastName}`;
                let autorizations = data.Authorizations;
                autorizations.sort();
                console.log(autorizations);
                createButtons(autorizations);
                loadMessages(autorizations);
                checkVolunteerStats(email);
              }
            });
        }
      });
  } else {
    // No user is signed in.
    console.log('No user is signed in');
  }
});


function checkVolunteerStats(email) {
  const db = firebase.firestore();
  db.collection("Volunteers").doc(email).get().then((doc) => {
      // check if the document exists and the fields are not empty
      if (doc.exists && doc.data().latestEvent && doc.data().monthlyEvents && doc.data().totalEvents) {
          // convert firestore timestamp to Date object
          let latestEventDate = new Date(doc.data().latestEvent.seconds * 1000);
          // Convert to Israeli date format dd/mm/yyyy
          let dateString = latestEventDate.getDate() + '/' + (latestEventDate.getMonth() + 1) + '/' + latestEventDate.getFullYear();
      } else {
          // One of the fields is empty, do nothing
          console.log("One or more fields are empty");

          console.log(doc.data().monthlyEvents,doc.data().totalEvents);
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}





function createButtons(autorizations) {
  let navbar = document.getElementById('navbar');

  const authMap = {
    "10": { text: "פתיחת שינוע חדש", href: "New_Event.html" },
    "11": { text: "אירועים בטיפול", href: "Events_In_Action.html" },
    "12": { text: "אירועים פתוחים", href: "Volunteer_Transport_Panel.html" },
    "13": { text: "האירועים שלי", href: "Volunteer_Events.html" },
    "14": { text: "אירועים סגורים", href: "Closed_Events.html" },
    "20": { text: "הוסף מוצר למלאי", href: "New_Product_ Insert.HTML" },
    "21": { text: "החזרת מוצר", href: "Return_Item.html" },
    "22": { text: "השאלת מוצר", href: "Borrow_Event.html" },
    "23": { text: "צפה במלאי", href: "Inventory.html" },
    "24": { text: "מוצרים מושאלים", href: "Borrowed_Items.html" },
    "25": { text: "ארכיב השאלות", href:"Borrowed_Archive.html" },
    "26": { text: "צור הזמנה עתידית", href: "reservation.html" },
    "27": { text: "הזמנות עתידיות",href: "reservation_list.html" },
    "28": { text: "צפה בבקשות השאלה",href: "Borrow_List.html" },
    "29": { text: "צפה בבקשות תרומה", href: "Donation_List.html" },
    "30": { text: "פאנל טלפניות", href: "Telephone_Panel.html" },
    "31": { text: "ארכיב בקשות תרומה", href: "Donation_App_Archive.html" },
    "32": { text: "ארכיב בקשות השאלה", href: "Borrow_App_Archive.html" },
    "33": { text: "ארכיב הזמנות", href: "reservation_archive.html" },
  };

  const mobileButtons = ["12", "13"];

  if (window.matchMedia('(max-width: 767px)').matches) {
    // Mobile devices: Display only mobile buttons
    mobileButtons.forEach(auth => {
      if (authMap[auth] && autorizations.includes(auth)) {
        let btn = document.createElement('button');
        btn.textContent = authMap[auth].text;
        btn.onclick = function() {
          window.location.href = authMap[auth].href;
        };
        btn.classList.add('mobile-button');
        navbar.appendChild(btn);
      }
    });
  } else {
    // Desktop devices: Display all buttons
    Object.keys(authMap).forEach(auth => {
      if (authMap[auth] && autorizations.includes(auth)) {
        let btn = document.createElement('button');
        btn.textContent = authMap[auth].text;
        btn.onclick = function() {
          window.location.href = authMap[auth].href;
        };
        navbar.appendChild(btn);
      }
    });
  }
}











function loadMessages(authorizations) {
  const messageContainer = document.getElementById('messageContainer');

  // Clear out any existing messages
  messageContainer.innerHTML = "";
  messageContainer.scrollTop = 0; // Reset the scroll position to the top

  db.collection('messages')
    .orderBy('timestamp', 'desc')
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        let data = doc.data();
        if (authorizations.some(r => data.messageAuthorizations.includes(r))) {
          let message = document.createElement('div');
          message.className = 'message';
          message.innerHTML = `
            <h2>${data.header}</h2>
            <p class="message-date">${new Date(data.timestamp.toDate()).toLocaleDateString()}</p>
            
            <div class="message-full">${data.message}</div>
          `;
          message.addEventListener('click', function() {
            if (this.classList.contains('expanded')) {
              this.classList.remove('expanded');
            } else {
              this.classList.add('expanded');
            }
          });
          messageContainer.appendChild(message);
        }
      });
    })
    .catch(error => {
      console.error('Error loading messages:', error);
    });
}


document.getElementById("updateSettings").addEventListener("click", function() {
  // Redirect to the settings page
  window.location.href = "Update_User_Settings.html";
});

document.getElementById("logout").addEventListener("click", function() {
  firebase.auth().signOut().then(function() {
      // Sign-out successful, redirect to login page.
      window.location.href = "../Pages/MainPage/index.html";
    }).catch(function(error) {
      // An error happened during sign out.
      console.error("Sign out error: ", error);
  });
});

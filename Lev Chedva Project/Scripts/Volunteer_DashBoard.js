const auth = firebase.auth();
const db = firebase.firestore();

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
                document.getElementById('username').textContent = `${data.firstName} ${data.lastName}`;
                let autorizations = data.Authorizations;
                autorizations.sort();
                console.log(autorizations);
                createButtons(autorizations);
                loadMessages(autorizations);
              }
            });
        }
      });
  } else {
    // No user is signed in.
    console.log('No user is signed in');
  }
});


function createButtons(autorizations) {
  let navbar = document.getElementById('navbar');

  const authMap = {
    "10": { text: "פתיחת שינוע חדש", href: "New_Event.html" },
    "11": { text: "אירועים בטיפול", href: "Events_In_Action.html" },
    "12": { text: "אירועים פתוחים", href: "Volunteer_Transport_Panel.html" },
    "13": { text: "האירועים שלי", href: "Volunteer_Events.html" },
    "14": { text: "אירועים סגורים", href: "Closed_Events.html" },
    // "15": { text: "סטיסטיקה שלי", href: "href_for_12.html" },
    "20": { text: "הוסף מוצר למלאי", href: "New_Product_ Insert.HTML" },
    "21": { text: "החזרת מוצר", href: "Return_Item.html" },
    "22": { text: "השאלת מוצר", href: "Borrow_Event.html" },
    "23": { text: "צפה במלאי", href: "Inventory.html" },
    "24": { text: "מוצרים מושאלים", href: "Borrowed_Items.html" },
    //"25": { text: "ארכיב השאלות", href: "Closed_Events.html" },
    "26": { text: "צור הזמנה עתידית", href: "reservation.html" },
    //"27": { text: "הזמנות עתידיות",href: "Closed_Events.html" },
    //"28": { text: "צפה בבקשות השאלה",href: "Closed_Events.html" },
    //"29": { text: "צפה בבקשות תרומה":, href: "Closed_Events.html" },
    "30": { text: "פאנל טלפניות", href: "Telephone_Panel.html" },

    // Add more mappings here...
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

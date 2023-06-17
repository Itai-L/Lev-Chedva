function validateUserAndRedirect() {
    // Get the currently logged-in user
    const user = firebase.auth().currentUser;
  
    if (user) {
      const email = user.email;
  
      // Get the document from the "Volunteers" collection based on the provided email
      firebase
        .firestore()
        .collection("Volunteers")
        .doc(email)
        .get()
        .then((doc) => {
          if (doc.exists) {
            // If the document exists, get the "Authorizations" field
            const authorizations = doc.data().Authorizations;
  
            if (authorizations.includes("000")) {
              // If the "Authorizations" array contains "000", redirect to page A
              window.location.href = "../Pages/Manager_Panel.html";
            } else  if (authorizations.includes("13")){
              // If the "Authorizations" array does not contain "000", redirect to page B
              window.location.href = "../Pages/Volunteer_Dashboard.html";
            }else{
              window.location.href = "../Pages/MainPage/index.html";
            }
          } else {
            // If the document doesn't exist, log an error and redirect to an error page
            console.error("No such document!");
            window.location.href = "../Pages/MainPage/index.html";
          }
        })
        .catch((error) => {
          // Handle errors
          console.error("Error getting document:", error);
          window.location.href = "error.html";
        });
    } else {
      // If no user is logged in, redirect to the login page
      window.location.href = "login_HE.html";
    }
  }
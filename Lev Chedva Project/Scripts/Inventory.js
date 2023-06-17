let ProductsArray = [];
const ProductsTable = document.getElementById('product-list');
const db = firebase.firestore();
const ProductsRef = db.collection("inventory");

const filterBar = document.getElementById("filter-bar");
document.getElementById('add-filter-btn').addEventListener('click', addFilter);
document.getElementById('search-btn').addEventListener('click', searchBarProducts);
document.getElementById('filter-btn').addEventListener('click', searchFilterProducts);

let currentAuthorizations = []; // global variable

firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    // User is signed in, retrieve authorizations
    try {
      const doc = await db.collection("Volunteers").doc(user.email).get();
      if (doc.exists) {
        currentAuthorizations = doc.data().Authorizations;
        console.log("Authorizations:", currentAuthorizations);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  } else {
    // User is signed out
    console.log("No user is signed in.");
  }
});



console.log(currentAuthorizations);



function addFilter() {
  const filterName = prompt('Enter the name of the new filter:');
  if (filterName) {
    db.collection('Tools').doc('search-filters')
      .update({ filters: firebase.firestore.FieldValue.arrayUnion(filterName) });
  }
}

db.collection('Tools').doc('search-filters')
  .onSnapshot((doc) => {
    const filters = doc.data().filters;
    const filterSelect = document.getElementById('filter-select');
    filterSelect.innerHTML = '';
    filters.forEach((filter) => {
      const option = document.createElement('option');
      option.value = filter;
      option.textContent = filter;
      filterSelect.appendChild(option);
    });
  });

  async function searchBarProducts() {
    const searchInput = document.getElementById('search-input').value;
    searchAcrossCollection(searchInput); // CHANGE HERE
  }


async function searchFilterProducts() {
  const selectedFilter = document.getElementById('filter-select').value;
 preDisplayProducts(selectedFilter);
}


async function searchAcrossCollection(searchTerm) { // CHANGE HERE
  ProductsArray = []; // Clear the array before search
  try {
    const snapshot = await ProductsRef.get();
    snapshot.forEach((doc) => {
      if (doc.exists) {
        const data = doc.data();
        // Check if the search term exists in any field of the document
        for (let key in data) {
          if (data[key].toString().toLowerCase().includes(searchTerm.toLowerCase())) {
            ProductsArray.push(data);
            break;
          }
        }
      } else {
        console.log("No such document!");
      }
    });
  } catch (error) {
    console.log("Error getting documents:", error);
  }
  preDisplayProducts("all");
}



async function readProducts() {
  try {
    const snapshot = await ProductsRef.get();
    snapshot.forEach((doc) => {
      if (doc.exists) {
        ProductsArray.push(doc.data());
      } else {
        console.log("No such document!");
      }
    });
  } catch (error) {
    console.log("Error getting documents:", error);
  }


  preDisplayProducts("all");
}


// filterBar.addEventListener("change", function() {
//   const selectedValue = filterBar.value;
//   preDisplayProducts(selectedValue);
// });

function preDisplayProducts(filter) {
  

if(filter=="הכל")
filter="all";
  ProductsTable.innerHTML = "";
  
  ProductsArray.forEach((ProductData) => {
    if (filter === "all") {
        displayProducts(ProductData);
    } else {
      let DescriptionString = ProductData.product_description;
      let KeywordString = ProductData.keywords;
      let LocationString=ProductData.location;

      if (DescriptionString.toLowerCase().includes(filter.toLowerCase())||KeywordString.toLowerCase().includes(filter.toLowerCase()))

      displayProducts(ProductData);
    }
  });
}

function displayProducts(ProductData) {

  const row = document.createElement('tr');
  
  const nameCell = document.createElement('td');
  nameCell.textContent = ProductData.categorial_number;
  nameCell.style.textAlign = "right";

  const CountCell = document.createElement('td');
  CountCell.textContent = ProductData.product_quantity;
  CountCell.style.textAlign = "right";


  const KeywordCell = document.createElement('td');
  KeywordCell.textContent = ProductData.keywords;
  KeywordCell.style.textAlign = "right";
  
  row.appendChild(nameCell);
  row.appendChild(CountCell);
  row.appendChild(KeywordCell);
  ProductsTable.appendChild(row);

  row.addEventListener('click', () => {
    const detailsRow = row.nextElementSibling;
    if (detailsRow && detailsRow.classList.contains('product-details-row')) {
      row.parentElement.removeChild(detailsRow);
    } else {
      const detailsRow = document.createElement('tr');
      detailsRow.classList.add('product-details-row');
      const detailsCell = document.createElement('td');
      detailsCell.colSpan = 8;
      const detailsList = document.createElement('ul');
      const ProductNameItem = document.createElement('li');
      ProductNameItem.textContent = "שם: " + ProductData.categorial_number;
      const DescriptionItem = document.createElement('li');
      DescriptionItem.textContent = "תיאור: " + ProductData.product_description;
      const KeywordItem = document.createElement('li');
      KeywordItem.textContent = "מילות מפתח: " + ProductData.keywords;
      const QuantityItem = document.createElement('li');
      QuantityItem.textContent = "כמות: " + ProductData.product_quantity;
      const RemarksItem = document.createElement('li');
      const ReservedQuantityItem = document.createElement('li');
      ReservedQuantityItem.textContent = "כמות שמורה: "  + ProductData.reserved_quantity;

      RemarksItem.textContent = "הערות: " + ProductData.remarks;
      const StatusItem = document.createElement('li');
      StatusItem.textContent = "סטאטוס: " + translateStatus(ProductData.status);
      const AccessoriesItem = document.createElement('li');
      AccessoriesItem.textContent = "מוצרים נלווים: "+ProductData.companion_accessories;
      const LocationItem = document.createElement('li');
      LocationItem.textContent = "מיקום:  "+ProductData.location;
  
    
      detailsList.appendChild(ProductNameItem);
      detailsList.appendChild(DescriptionItem);
      detailsList.appendChild(QuantityItem);
      detailsList.appendChild(ReservedQuantityItem);
      detailsList.appendChild(KeywordItem);
      detailsList.appendChild(RemarksItem);
      detailsList.appendChild(AccessoriesItem);
      detailsList.appendChild(StatusItem);
      detailsList.appendChild(LocationItem);
      detailsCell.appendChild(detailsList);
      detailsRow.appendChild(detailsCell);
      

      row.after(detailsRow);
    
      const editProductBtn = document.createElement('button');
      editProductBtn.textContent = 'ערוך מוצר';
      if(currentAuthorizations.includes("000"))
      detailsList.appendChild(editProductBtn);
      

      async function updateProductField(catNum, field, newValue) {
        try {
          const docRef = db.collection("inventory").doc(catNum);
      
          // Translate the status back to English if the field is 'status'
          if (field === "status") {
            newValue = translateStatusToEnglish(newValue);
          }
      
          // If the field is 'companion_accessories', convert the string to an array // CHANGE HERE
          if (field === "companion_accessories") {
            newValue = newValue.split(',').map(item => item.trim());
          }
      
          if (field === "categorial_number") {
            // Update the document name
            await docRef.update({ [field]: newValue });
          } else {
            // Update the field value
            await docRef.update({ [field]: newValue });
          }
        } catch (error) {
          console.error("Error updating document:", error);
          throw error;
        }
      }
      


      let ValidSaveBtn=false;
      editProductBtn.addEventListener('click', () => {
       
        const makeEditable = (item, field) => {
          if (field === 'location') {
            createLocationDropdown(item);
          }

          const [label, value] = item.textContent.split(": ");
          const editableValue = document.createElement("span");
          editableValue.contentEditable = true;
          editableValue.textContent = value ? value.trim() : "";
          item.innerHTML = `${label}: `;
          item.appendChild(editableValue);
          editableValue.addEventListener("blur", async () => {

            const newValue = editableValue.textContent.trim();
            try {
              await updateProductField(ProductData.categorial_number, field, newValue);
              if (field === "categorial_number" && newValue !== ProductData.categorial_number) {
                await updateProductDocName(ProductData.categorial_number, newValue);
                ProductData.categorial_number = newValue;
              } else {
                ProductData[field] = newValue;
              }

              item.innerHTML = `${label}: ${newValue}`;
            } catch (error) {
              console.error("Error updating document:", error);
            }
          });
        };
      

  
        
      
        const updateProductDocName = async (oldCatNum, newCatNum) => {
          try {
            const oldDocRef = db.collection("inventory").doc(oldCatNum);
            const newDocRef = db.collection("inventory").doc(newCatNum);
      
            const doc = await oldDocRef.get();
            if (doc.exists) {
              // Create a new document with the new categorial number
              await newDocRef.set(doc.data());
              // Delete the old document
              await oldDocRef.delete();
            } else {
              console.error("Document not found:", oldCatNum);
            }
          } catch (error) {
            console.error("Error updating document name:", error);

            throw error;
          }
        };
      
        makeEditable(ProductNameItem, "categorial_number");
        makeEditable(DescriptionItem, "product_description");
        makeEditable(KeywordItem, "keywords");
        makeEditable(RemarksItem, "remarks");
        makeEditable(AccessoriesItem, "companion_accessories");
        makeEditable(QuantityItem, "product_quantity");
        createLocationDropdown(LocationItem, updateProductField, ProductData);
        createStatusDropdown(StatusItem, updateProductField, ProductData);


        const saveChangesBtn = document.createElement('button');
        saveChangesBtn.textContent = 'שמור שינויים';
        // add calls for other category fields as needed
       

        if(ValidSaveBtn==false)
        {
        detailsList.appendChild(saveChangesBtn);
        ValidSaveBtn=true;
        }
      
        saveChangesBtn.addEventListener('click', () => {
          ProductNameItem.textContent = "שם: " + ProductData.categorial_number;
          DescriptionItem.textContent = " תיאור: " + ProductData.product_description;
          QuantityItem.textContent="כמות: " +ProductData.product_quantity;
          KeywordItem.textContent="מילות מפתח "+ProductData.keywords;
          RemarksItem.textContent="הערות: "+ProductData.remarks;
          AccessoriesItem.textContent=" מוצרים נלווים: "+ProductData.companion_accessories;
          StatusItem.textContent="סטאטוס: "+translateStatus(ProductData.status);
          LocationItem.textContent = "מיקום: " + ProductData.location;
          
          // update other category fields as needed
      
          nameCell.textContent = ProductData.categorial_number;
          CountCell.textContent = ProductData.product_quantity;
          KeywordCell.textContent = ProductData.keywords;
          // update other table cells as needed
          detailsList.removeChild(saveChangesBtn);
         
          ValidSaveBtn=false;

        }); 
        
      });
      
      

    const deleteProductBtn = document.createElement('button');
deleteProductBtn.textContent = 'מחק מוצר';
if(currentAuthorizations.includes("000"))
detailsList.appendChild(deleteProductBtn);

// Step 2: Add an event listener to the "delete" button
deleteProductBtn.addEventListener('click', async () => {
  // Step 3: Prompt the user to confirm the deletion
  if (confirm("האם אתה בטוח שתרצה למחוק מוצר זה?")) {
    // Step 4: Prompt the user to enter the categorical number
    const enteredCatNum = prompt("הכנס את שם המוצר לאישור:");
    if (enteredCatNum === ProductData.categorial_number) {
       await deleteProductFromFirestore(ProductData.categorial_number);
       alert("מוצר נמחק בהצלחה");
      location.reload(); 
    } else {
      alert("מוצר לא קיים- מחיקה בוטלה");
    }
  }
});


    }
  });





  
}

async function deleteProductFromFirestore(CatNum) {
  try {
    await ProductsRef.doc(CatNum).delete();
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}


const translateStatus = (status) => {
  switch (status) {
    case "free":
      return "במלאי";
    case "borrowed":
      return "מושאל";
    case "reserved":
      return "שמור";
    case "none":
      return "חסר במלאי";
    
      default:
      return status;




  }
};

const translateStatusToEnglish = (status) => {
  switch (status) {
    case "במלאי":
      return "free";
    case "מושאל":
      return "borrowed";
    case "שמור":
      return "reserved";
    case "חסר במלאי":
      return "none";
    default:
      return status;
  }
};

// readProducts();    
   
async function createLocationDropdown(item, updateProductField, ProductData) {
  const [label, value] = item.textContent.split(": ");
  const locationSelect = document.createElement("select");

  // Load locations
  const locationSnapshot = await db.collection('Tools').doc('Locations').get();
  const locations = locationSnapshot.data().Location; // Change this line

  locations.forEach(location => {
    const option = document.createElement('option');
    option.value = location;
    option.text = location;
    if (location === value.trim()) {
      option.selected = true;
    }
    locationSelect.add(option);
  });

  item.innerHTML = `${label}: `;
  item.appendChild(locationSelect);
  locationSelect.addEventListener("change", async () => {
    const newValue = locationSelect.value;
    await updateProductField(ProductData.categorial_number, "location", newValue);
    ProductData.location = newValue;
  });
}

async function createStatusDropdown(item, updateProductField, ProductData) {
  const [label, value] = item.textContent.split(": ");
  const statusSelect = document.createElement("select");

  const statuses = ['במלאי', 'מושאל', 'שמור'];

  statuses.forEach(status => {
    const option = document.createElement('option');
    option.value = status;
    option.text = status;
    if (status === value.trim()) {
      option.selected = true;
    }
    statusSelect.add(option);
  });

  item.innerHTML = `${label}: `;
  item.appendChild(statusSelect);
  statusSelect.addEventListener("change", async () => {
    const newValue = statusSelect.value;
    await updateProductField(ProductData.categorial_number, "status", translateStatusToEnglish(newValue));
    ProductData.status = newValue;
  });
}



const db = firebase.firestore();
const itemTableBody = document.getElementById('itemTableBody');
let farFuture = new Date();
farFuture.setFullYear(farFuture.getFullYear()); 
dateInput.valueAsDate = farFuture;
function clearTable() {
    itemTableBody.innerHTML = '';
}

async function fetchAndDisplayBorrowedItems() {
    clearTable();
    const currentDate = new Date();
    const inputDate = new Date(dateInput.value);
    const borrowedItemsRef = db.collection('Borrowed Items');
    const snapshot = await borrowedItemsRef.get();

    const tableBody = document.getElementById('itemTableBody');

    for (let doc of snapshot.docs) {
        const data = doc.data();
        const borrowedItems = data.borrowTickets;
        let shouldShowDoc = false; 

        for (let item of borrowedItems) {
            const itemRef = db.collection('Borrow Tickets').doc(item.toString());
            const itemData = (await itemRef.get()).data();

            const borrowingUntilDate = new Date(itemData.borrowingUntil);

            if (borrowingUntilDate <= inputDate && borrowingUntilDate >= currentDate) {
                shouldShowDoc = true;
                break;
            }
        }

        if (shouldShowDoc) {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.textContent = doc.data().Name;
            row.appendChild(idCell);

            const buttonCell = document.createElement('td');
            const contactButton = document.createElement('button');
            contactButton.textContent = 'יצרתי קשר';

            buttonCell.appendChild(contactButton);
            row.appendChild(buttonCell);

            const contactCell = document.createElement('td');
            if (data.lastTalk) {
                contactCell.textContent =  "נוצר קשר בתאריך:"+data.lastTalk;
            }
            row.appendChild(contactCell);

            contactButton.addEventListener('click', async () => {
                const currentDate = new Date().toLocaleDateString();
                contactCell.textContent = currentDate;
                await borrowedItemsRef.doc(doc.id).update({
                    lastTalk: currentDate
                });
            });

            tableBody.appendChild(row);

            const detailsRow = document.createElement('tr');
            const detailsCell = document.createElement('td');
            detailsCell.colSpan = 3;
        
            const detailsTable = document.createElement('table');
            detailsCell.appendChild(detailsTable);
            detailsRow.appendChild(detailsCell);
            tableBody.appendChild(detailsRow);

            detailsRow.style.display = 'none';

            row.addEventListener('click', () => {
                if (detailsRow.style.display === 'none') {
                    detailsRow.style.display = '';
                } else {
                    detailsRow.style.display = 'none';
                }
            });

            for (let item of borrowedItems) {
                const itemRef = db.collection('Borrow Tickets').doc(item.toString());
                const itemData = (await itemRef.get()).data();
                displayTicketRow(detailsTable, itemData, item.toString());
            }

            // Remarks cell
            const remarksCell = document.createElement('td');
            const remarksInput = document.createElement('textarea');
            remarksInput.type = 'text';
            remarksInput.value = doc.data().remarks || '';
            remarksInput.style.width = '200px';
            remarksInput.style.height = '50px';
            remarksInput.style.textAlign = 'right'; // Align text to the right
            remarksInput.style.overflow = 'auto';
            const saveButton = document.createElement('button');
            saveButton.textContent = 'שמור';

            remarksCell.appendChild(remarksInput);
            remarksCell.appendChild(saveButton);
            row.appendChild(remarksCell);

            saveButton.addEventListener('click', async () => {
                await borrowedItemsRef.doc(doc.id).update({
                    remarks: remarksInput.value
                });
            });
        }
    }
}




async function displayTicketRow(detailsTable, ticketData, itemId) {
    const row = document.createElement('tr');
  
    // Create and append cells
    const productNameCell = document.createElement('td');
    const categorialNumber = ticketData.categorialNumber;
  
    // Fetch product name from inventory collection
    const inventoryRef = db.collection('inventory').doc(categorialNumber);
    const inventorySnapshot = await inventoryRef.get();
    if (inventorySnapshot.exists) {
        const productData = inventorySnapshot.data();
        productNameCell.textContent = productData.product_name;
    } else {
        productNameCell.textContent = 'Product Not Found';
    }
  
    row.appendChild(productNameCell);
  
    const untilDateCell = document.createElement('td');
    untilDateCell.textContent = ticketData.borrowingUntil;
    row.appendChild(untilDateCell);
  
    // Append row to the details table
    detailsTable.appendChild(row);
  
    // Create a details row and cell for the ticket
    const ticketDetailsRow = document.createElement('tr');
    const ticketDetailsCell = document.createElement('td');
    ticketDetailsCell.colSpan = 2;
  
    // Create a list for the details
    const detailsList = document.createElement('ul');
    const hebrewLabels = {
        borrowingUntil: 'עד תאריך',
        contactName: 'שם איש קשר',
        quantity: 'כמות',
        contactPhone: 'טלפון איש קשר',
        contactPhone2: 'טלפון איש קשר נוסף',
        contactId: 'ת.ז. איש קשר',
        address: 'כתובת',
        borrowingFrom: 'הושאל בתאריך',
        categorialNumber: 'מספר סידורי',
        patientName: 'שם המטופל',
        loaning_volunteer: 'שם המתנדב'
        // Add more labels as necessary
    };
    const reverseLabels = {}; // Reverse mapping object for translating back to original keys
    Object.entries(hebrewLabels).forEach(([key, value]) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${value}: ${ticketData[key]}`;
        detailsList.appendChild(listItem);
        reverseLabels[value] = key;
    });
    ticketDetailsCell.appendChild(detailsList);
    ticketDetailsRow.appendChild(ticketDetailsCell);
  
    // Create the update button
    const updateButton = document.createElement('button');
    updateButton.textContent = 'ערוך';
    ticketDetailsCell.appendChild(updateButton);
  
    detailsTable.appendChild(ticketDetailsRow);
  
    // Hide ticket details by default
    ticketDetailsRow.style.display = 'none';
  
    // Show/hide ticket details on click
    row.addEventListener('click', () => {
        if (ticketDetailsRow.style.display === 'none') {
            ticketDetailsRow.style.display = '';
        } else {
            ticketDetailsRow.style.display = 'none';
        }
    });
  
    // Add functionality to the update button
    updateButton.addEventListener('click', async () => {
        
        if (updateButton.textContent === 'Update') {
            // Replace list items with input fields
            detailsList.childNodes.forEach(listItem => {
                const inputField = document.createElement('input');
                const label = listItem.textContent.split(': ')[0];
                const key = reverseLabels[label]; // Translate back to the original key
                inputField.value = ticketData[key];
                listItem.textContent = `${label}: `;
                listItem.appendChild(inputField);
            });
            updateButton.textContent = 'Save';
        } else if (updateButton.textContent === 'Save') {
            // Replace input fields with new values and update data
            let updatedData = {};
            detailsList.childNodes.forEach(listItem => {
                const label = listItem.textContent.split(': ')[0];
                const key = reverseLabels[label]; // Translate back to the original key
                const value = listItem.children[0].value;
                updatedData[key] = value;
                listItem.textContent = `${label}: ${value}`;
            });
            updateButton.textContent = 'Update';
  
            // Update data in Firestore
            const itemRef = db.collection('Borrow Tickets').doc(itemId);
            try {
                await itemRef.update(updatedData);
                alert('Document successfully updated!');
            } catch (err) {
                console.error('Error updating document: ', err);
            }
        }
    });
  
}


    

fetchAndDisplayBorrowedItems();
dateInput.addEventListener('change', fetchAndDisplayBorrowedItems);



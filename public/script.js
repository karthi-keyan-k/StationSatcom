



function toggleSettings() {
    const settingsPanel = document.getElementById('settings-panel');
    const toggleButton = document.querySelector('.settings-icon');

    if (settingsPanel.style.display === 'block') {
        settingsPanel.style.display = 'none';
        document.removeEventListener('click', outsideClickHandler);
    } else {
        settingsPanel.style.display = 'block';
        document.addEventListener('click', outsideClickHandler);
    }

    function outsideClickHandler(event) {
        // Check if the click is outside the panel and the button
        if (!settingsPanel.contains(event.target) && event.target !== toggleButton) {
            settingsPanel.style.display = 'none';
            document.removeEventListener('click', outsideClickHandler);
        }
    }
}










document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("unified-form");
    const detailsTable = document.getElementById("details-table");
    const updatedListTable = document.getElementById("updated-list-table");
    const searchInput = document.getElementById("search-query");
    const filterOptions = document.getElementById("filter-options");
    const applyFilterBtn = document.getElementById("apply-filter");

    let updatedDetailsList = [];

    // Function to fetch data from the server
    const BASE_URL = "https://stationsatcom.onrender.com";

    // Function to fetch data from the server
    async function fetchData() {
        try {
            const response = await fetch(`${BASE_URL}/api/details`);
            const data = await response.json();
            renderTable(data, detailsTable);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    

    // Function to render table rows
    function renderTable(data, tableElement, isUpdateTable = false) {
        tableElement.innerHTML = "";
        data.forEach((item,index) => {
            const row = document.createElement("tr");
            
            row.innerHTML = `
                <td>${index+1}</td>
                <td>${item.employerName}</td>
                <td>${item.shipName}</td>
                <td>${item.imoNumber}</td>
                <td>${item.serviceDate}</td>
                <td>${item.serviceName}</td>
                <td>${item.package}</td>
                <td>${item.companyName}</td>
                <td>${item.contact}</td>
                <td>${item.email}</td>
                <td>
                <button onclick="updateRow('${item._id}')">Update</button>
                <button onclick="deleteRow('${item._id}')">Delete</button>
                <button 
                    id="history-button-${item._id}" 
                    onclick="viewHistory('${item._id}')"
                    style="display: ${item.history && item.history.length > 0 ? 'inline-block' : 'none'};">
                    History
                </button>


                </td>
            `;
            tableElement.appendChild(row);
        });
    }
    function rendersTable(data, tableElement, isUpdateTable = false) {
        tableElement.innerHTML = "";
        data.forEach((item) => {
            const row = document.createElement("tr");
            
            row.innerHTML = `
                <td>${item.originalIndex}</td>
                <td>${item.employerName}</td>
                <td>${item.shipName}</td>
                <td>${item.imoNumber}</td>
                <td>${item.serviceDate}</td>
                <td>${item.serviceName}</td>
                <td>${item.package}</td>
                <td>${item.companyName}</td>
                <td>${item.contact}</td>
                <td>${item.email}</td>
                <td>
                <button onclick="updateRow('${item._id}')">Update</button>
                <button onclick="deleteRow('${item._id}')">Delete</button>
                <button 
                    id="history-button-${item._id}" 
                    onclick="viewHistory('${item._id}')"
                    style="display: ${item.history && item.history.length > 0 ? 'inline-block' : 'none'};">
                    History
                </button>
                </td>
            `;
            tableElement.appendChild(row);
        });
    }

    // Add form submission handler
    
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
         
        const newEntry = {
            
            employerName: document.getElementById("employer-name").value,
            shipName: document.getElementById("ship-name").value,
            imoNumber: document.getElementById("imo-number").value,
            serviceDate: document.getElementById("service-date").value,
            serviceName: document.getElementById("service-name").value,
            package: document.getElementById("service-quantity").value,
            companyName: document.getElementById("company-name").value,
            contact: document.getElementById("contact").value,
            email: document.getElementById("email").value,
        };



        

        try {
            const response = await fetch(`${BASE_URL}/api/details`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEntry),
            });

            if (response.ok) {
                fetchData(); // Refresh table data
                form.reset();
                alert("Details added successfully!");
            } else {
                console.error("Error adding details:", response.statusText);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    });

    // Delete Row
    window.deleteRow = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/api/details/${id}`, { method: "DELETE" });

            if (response.ok) {
                fetchData(); // Refresh table data
                alert("Details deleted successfully!");
            } else {
                console.error("Error deleting details:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting row:", error);
        }
    };

    // Update Row
    window.updateRow = async (id) => {
        const newServiceName = prompt("Enter new service name:");
        const newPackage = prompt("Enter new package (GB):");
        const modifiedBy = prompt("Enter your name:");
    
        if (newServiceName && newPackage && modifiedBy) {
            try {
                const response = await fetch(`${BASE_URL}/api/details/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        serviceName: newServiceName,
                        package: newPackage,
                        modifiedBy: modifiedBy,
                    }),
                });
    
                if (response.ok) {
                    fetchData(); // Refresh table data
                    await checkHistoryVisibility(id); // Toggle history button visibility
                    alert("Details updated successfully!");
                } else {
                    console.error("Error updating details:", response.statusText);
                }
            } catch (error) {
                console.error("Error updating row:", error);
            }
        }
    };
    
    
    
    async function checkHistoryVisibility(id) {
        try {
            const response = await fetch(`${BASE_URL}/api/details/${id}`);
            if (response.ok) {
                const detail = await response.json();
                const historyButton = document.getElementById(`history-button-${id}`);
                if (detail.hasHistory) {
                    historyButton.style.display = "inline-block"; // Show button
                } else {
                    historyButton.style.display = "none"; // Hide button
                }
            } else {
                console.error("Error checking history visibility:", response.statusText);
            }
        } catch (error) {
            console.error("Error checking history visibility:", error);
        }
    }
    
    
    
  
    
    window.viewHistory = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/api/details/${id}/history`);
            const responseText = await response.text(); // Capture raw response
            console.log("Raw Response:", responseText); // Debug log
    
            if (response.ok) {
                const history = JSON.parse(responseText);
                displayHistory(history);
            } else {
                console.error("Error fetching history:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching history:", error);
        }
    };
    
    
    
    
    
    

function displayHistory(history) {
    const historyContent = history.map(change => `
        <li>
            <strong>Modified By:</strong> ${change.modifiedBy} <br>
            <strong>Modified At:</strong> ${new Date(change.modifiedAt).toLocaleString()} <br>
            <strong>Changes:</strong> ${JSON.stringify(change.changes)}
        </li>
    `).join('');

    document.getElementById('history-content').innerHTML = historyContent;
    document.getElementById('history-modal').style.display = 'block';
}

    
       
    
    
    

    // Apply Filter
    applyFilterBtn.addEventListener("click", async () => {
        const query = searchInput.value.toLowerCase();
        const filterBy = filterOptions.value;
    
        try {
            const response = await fetch(`${BASE_URL}/api/details`);
            const detailsList = await response.json();
    
            // Add index to each item
            const detailsListWithIndex = detailsList.map((item, index) => ({ ...item, originalIndex: index + 1 }));
    
            const filteredData = detailsListWithIndex.filter((item) => {
                switch (filterBy) {
                    case "ship":
                        return item.shipName.toLowerCase().includes(query);
                    case "service":
                        return item.serviceName.toLowerCase().includes(query);
                    case "imo":
                        return item.imoNumber.toLowerCase().includes(query);
                    default:
                        return (
                            item.shipName.toLowerCase().includes(query) ||
                            item.serviceName.toLowerCase().includes(query) ||
                            item.imoNumber.toLowerCase().includes(query)
                        );
                }
            });
    
            //renderTable(filteredData, detailsTable);
            rendersTable(filteredData, updatedListTable, true); // Render in updated list table
        } catch (error) {
            console.error("Error filtering data:", error);
        }
    });
    
    
    
    // Initial Fetch and Render
    fetchData();
});


function handleLogin() {
    const usernameInput = document.getElementById('login-username').value;
    const passwordInput = document.getElementById('login-password').value;
    const errorMessage = document.getElementById('login-error');
    const loginPage = document.querySelector('.login-page');
    const mainPage = document.querySelector('.main-page');
    

    // Static credentials
    const username = "Stationsatcom";
    const password = "Stationsatcom2424+";

    if (username === usernameInput && password === passwordInput) {
        loginPage.style.display = 'none';
        mainPage.style.display = 'block';
        errorMessage.textContent = '';
    } else {
        errorMessage.textContent = 'Invalid username or password. Please try again.';
    }
}




document.addEventListener("DOMContentLoaded", () => {
    const dropdownContent = document.getElementById('service-dropdown');
    const dropdownContentSettings = document.getElementById('service-dropdown-settings');
    
    const serviceNameInput = document.getElementById('service-name');
    const BASE_URL = "https://stationsatcom.onrender.com";

    async function fetchServiceNames() {
        try {
            const response = await fetch(`${BASE_URL}/api/services`);
            if (!response.ok) throw new Error('Failed to fetch service names');
            const services = await response.json();
            console.log(services);

            dropdownContent.innerHTML = '';
            services.forEach(service => {
                const label = document.createElement('label');
                label.innerHTML = `<input type="checkbox" value="${service.name}"> ${service.name}`;
                dropdownContent.appendChild(label);
            });
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    }

    window.toggleDropdown = function() {
        dropdownContent.classList.toggle('dropdown-active');
        dropdownContent.style.display = dropdownContent.classList.contains('dropdown-active')? 'block' : 'none';
        //the dropdown content should come one after theanother 
        

        console.log('Dropdown toggled!');
    }

    function getSelectedServices() {
        const checkboxes = dropdownContent.querySelectorAll('input[type="checkbox"]');
        const selectedServices = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        serviceNameInput.value = selectedServices.join(', ');
        return selectedServices;
    }

    dropdownContent.addEventListener('change', getSelectedServices);

    window.addServiceName = async () => {
        const newService = document.getElementById('new-service-name').value.trim();
        if (!newService) {
            alert('Please enter a service name.');
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/api/services`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newService })
            });
            if (response.ok) {
                const label = document.createElement('label');
                label.innerHTML = `<input type="checkbox" value="${newService}"> ${newService}`;
                dropdownContent.appendChild(label);
                alert('Service added successfully!');
                document.getElementById('new-service-name').value = '';
            } else {
                const errorData = await response.json();
                alert(errorData.error);
            }
        } catch (error) {
            console.error('Error adding service:', error);
        }
    };

    window.deleteServiceName = async (serviceName) => {
        if (!serviceName) {
            alert('Please select a service name to delete.');
            return;
        }
    
        try {
            console.log(`Attempting to delete service: ${serviceName}`);
            const response = await fetch(`${BASE_URL}/api/services/${encodeURIComponent(serviceName)}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                alert('Service name deleted successfully!');
                // Refresh the dropdown
                await fetchServiceNames();
            } else {
                const errorText = await response.text();
                console.error('Error deleting service name:', errorText);
                alert(`Error deleting service name: ${errorText}`);
            }
        } catch (error) {
            console.error('Error deleting service name:', error);
            alert('Failed to delete service name. Check your connection or server.');
        }
    };
    
    
    

    fetchServiceNames();
});


document.addEventListener("DOMContentLoaded", () => {
    const shipNameDropdown = document.getElementById("ship-name");
    const newShipNameInput = document.getElementById("new-ship-name");
    const BASE_URL = "https://stationsatcom.onrender.com";

    // Function to fetch ship names from the server
    async function fetchShipNames() {
        try {
            const response = await fetch(`${BASE_URL}/api/ships`);
            if (!response.ok) {
                throw new Error("Failed to fetch ship names");
            }

            const ships = await response.json();
            ships.forEach((ship) => {
                const optionElement = document.createElement("option");
                optionElement.value = ship.name;
                optionElement.textContent = ship.name;
                shipNameDropdown.appendChild(optionElement);
            });
        } catch (error) {
            console.error("Error fetching ship names:", error);
        }
    }

    // Function to add a new ship name to the database and dropdown
    window.addShipName = async () => {
        const newShipName = newShipNameInput.value.trim();

        if (newShipName === "") {
            alert("Please enter a ship name.");
            return;
        }

        // Send the new ship name to the backend
        try {
            const response = await fetch(`${BASE_URL}/api/ships`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newShipName }),
            });

            if (response.ok) {
                // Add the new option to the dropdown
                const optionElement = document.createElement("option");
                optionElement.value = newShipName;
                optionElement.textContent = newShipName;
                shipNameDropdown.appendChild(optionElement);

                alert("Ship name added successfully!");
                newShipNameInput.value = ""; // Clear the input field
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error("Error adding ship name:", error);
            alert("Failed to add ship name. Check your connection or server.");
        }
    };

    // Function to delete a ship name from the database and dropdown
   // Function to delete a ship name from the database and dropdown
window.deleteShipName = async (shipName) => {
    if (!shipName) {
        alert("Please select a ship name to delete.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/ships/${encodeURIComponent(shipName)}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Ship name deleted successfully!");
            // Refresh the dropdown
            //await fetchShipNames();
        } else {
            const errorData = await response.json();
            console.error("Error deleting ship name:", errorData);
            alert(`Error deleting ship name: ${errorData.error || "Unknown error"}`);
        }
    } catch (error) {
        console.error("Error deleting ship name:", error);
        alert("Failed to delete ship name. Check your connection or server.");
    }
};


    // Fetch initial ship names
    fetchShipNames();
});



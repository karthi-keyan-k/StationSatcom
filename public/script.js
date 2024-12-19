document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("unified-form");
    const detailsTable = document.getElementById("details-table");
    const updatedListTable = document.getElementById("updated-list-table");
    const searchInput = document.getElementById("search-query");
    const filterOptions = document.getElementById("filter-options");
    const applyFilterBtn = document.getElementById("apply-filter");

    let updatedDetailsList = [];

    // Function to fetch data from the server
    const BASE_URL = "https://stationsatcom.onrender.com";  // Live backend URL

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
                <button onclick="updateRow('${item._id}')">Update</button>
                <button onclick="deleteRow('${item._id}')">Delete</button>
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
                <button onclick="updateRow('${item._id}')">Update</button>
                <button onclick="deleteRow('${item._id}')">Delete</button>
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
        const newDate = prompt("Enter new date (YYYY-MM-DD):");
        const newServiceName = prompt("Enter new service name:");
        const newPackage = prompt("Enter new package (GB):");

        if (newDate && newServiceName && newPackage) {
            try {
                const response = await fetch(`${BASE_URL}/api/details/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        serviceDate: newDate,
                        serviceName: newServiceName,
                        package: newPackage,
                    }),
                });

                if (response.ok) {
                    fetchData(); // Refresh table data
                    alert("Details updated successfully!");
                } else {
                    console.error("Error updating details:", response.statusText);
                }
            } catch (error) {
                console.error("Error updating row:", error);
            }
        }
    };

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
// applyFilterBtn.addEventListener("click", async () => {
//     const query = searchInput.value.toLowerCase();
//     const filterBy = filterOptions.value;

//     try {
//         const response = await fetch(`http://localhost:5000/api/details`);
//         const detailsList = await response.json();

//         const filteredData = detailsList.filter((item) => {
//             switch (filterBy) {
//                 case "ship":
//                     return item.shipName.toLowerCase().includes(query);
//                 case "service":
//                     return item.serviceName.toLowerCase().includes(query);
//                 case "imo":
//                     return item.imoNumber.toLowerCase().includes(query);
//                 default:
//                     return (
//                         item.shipName.toLowerCase().includes(query) ||
//                         item.serviceName.toLowerCase().includes(query) ||
//                         item.imoNumber.toLowerCase().includes(query)
//                     );
//             }
//         });

//         // renderTable(filteredData, detailsTable);
//         renderTable(filteredData, updatedListTable, true); // Render in updated list table
//     } catch (error) {
//         console.error("Error filtering data:", error);
//     }
// });

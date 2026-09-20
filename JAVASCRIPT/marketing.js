// =========================
// MARKETING PAGE
// =========================

let savedRecordsMonitor;

// Initialize Marketing page components
function initializeMarketingPage() {

    const btn = document.querySelector(".btn-primary");

    if (btn) {
        btn.addEventListener("click", function () {
            alert("Generate Quotation clicked!");
        });
    }

    initializeClientLookup();
    initializeProjectRequestLookup();
    initializeQuotationOverviewLookup();
    initializePurchaseOrderUpload();

}

function initializePurchaseOrderUpload() {

    const form = document.getElementById("PurchaseOrderForm");
    const fileInput = document.getElementById("PurchaseOrder_File");
    const dropzone = document.getElementById("PurchaseOrder_Dropzone");
    const fileList = document.getElementById("PurchaseOrder_FileList");

    if (!form || !fileInput || !dropzone || !fileList || form.dataset.initialized) {
        return;
    }

    form.dataset.initialized = "true";
    let selectedFiles = [];

    function syncFileInput() {
        const dataTransfer = new DataTransfer();

        selectedFiles.forEach(file => dataTransfer.items.add(file));
        fileInput.files = dataTransfer.files;
    }

    function showSelectedFiles() {
        fileList.innerHTML = "";

        selectedFiles.forEach((file, index) => {
            const item = document.createElement("li");
            const fileName = document.createElement("span");
            const removeButton = document.createElement("button");

            fileName.textContent = `${file.name} (${Math.ceil(file.size / 1024)} KB)`;
            removeButton.type = "button";
            removeButton.className = "purchase-order-remove-file";
            removeButton.textContent = "Remove";
            removeButton.setAttribute("aria-label", `Remove ${file.name}`);
            removeButton.addEventListener("click", () => {
                selectedFiles.splice(index, 1);
                syncFileInput();
                showSelectedFiles();
            });

            item.append(fileName, removeButton);
            fileList.appendChild(item);
        });
    }

    fileInput.addEventListener("change", () => {
        selectedFiles = [
            ...selectedFiles,
            ...Array.from(fileInput.files).filter(file =>
                !selectedFiles.some(selectedFile =>
                    selectedFile.name === file.name &&
                    selectedFile.size === file.size &&
                    selectedFile.lastModified === file.lastModified
                )
            )
        ];
        syncFileInput();
        showSelectedFiles();
    });

    ["dragenter", "dragover"].forEach(eventName => {
        dropzone.addEventListener(eventName, event => {
            event.preventDefault();
            dropzone.classList.add("is-dragging");
        });
    });

    ["dragleave", "drop"].forEach(eventName => {
        dropzone.addEventListener(eventName, event => {
            event.preventDefault();
            dropzone.classList.remove("is-dragging");
        });
    });

    dropzone.addEventListener("drop", event => {
        const files = event.dataTransfer.files;

        if (!files.length) {
            return;
        }

        selectedFiles = [
            ...selectedFiles,
            ...Array.from(files).filter(file =>
                !selectedFiles.some(selectedFile =>
                    selectedFile.name === file.name &&
                    selectedFile.size === file.size &&
                    selectedFile.lastModified === file.lastModified
                )
            )
        ];
        syncFileInput();
        showSelectedFiles();
    });

}

function initializeClientLookup() {

    const openButton = document.getElementById("openClientPicker");
    const closeButton = document.getElementById("closeClientPicker");
    const modal = document.getElementById("clientPickerModal");
    const tableBody = document.getElementById("clientPickerTableBody");
    const searchInput = document.getElementById("clientPickerSearch");

    if (!openButton || !closeButton || !modal || !tableBody) {
        return;
    }

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            filterTableRows(tableBody, searchInput.value);
        });
    }

    setClientDependentFieldsEnabled(false);
    setConformeFieldsEnabled(false);

    openButton.addEventListener("click", async function () {
        modal.hidden = false;
        if (searchInput) {
            searchInput.value = "";
        }
        tableBody.innerHTML = `<tr><td colspan="5">Loading clients...</td></tr>`;

        try {
            const clients = await getClients();

            if (!Array.isArray(clients) || clients.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="5">No saved client records found.</td></tr>`;
                return;
            }

            tableBody.innerHTML = "";

            clients.forEach(client => {
                const row = document.createElement("tr");
                const values = [
                    getClientValue(client, "client_Name", "Client_Name"),
                    getClientValue(client, "client_Telephone", "Client_Telephone"),
                    getClientValue(client, "client_Address", "Client_Address"),
                    getClientValue(client, "client_TinNumber", "TIN", "Tin"),
                    getClientValue(client, "client_PaymentTerms", "Payment_Terms")
                ];

                values.forEach(value => {
                    const cell = document.createElement("td");
                    cell.textContent = value;
                    row.appendChild(cell);
                });

                row.addEventListener("click", function () {
                    selectClient(client);
                    modal.hidden = true;
                });

                tableBody.appendChild(row);
            });

            if (searchInput) {
                filterTableRows(tableBody, searchInput.value);
            }
        } catch (error) {
            console.error("Failed to load clients:", error);
            tableBody.innerHTML = `<tr><td colspan="5">Failed to load client records.</td></tr>`;
        }
    });

    closeButton.addEventListener("click", function () {
        modal.hidden = true;
    });

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.hidden = true;
        }
    });
}

function initializeProjectRequestLookup() {
    const openButton = document.getElementById("openProjectRequestPicker");
    const closeButton = document.getElementById("closeProjectRequestPicker");
    const modal = document.getElementById("projectRequestPickerModal");
    const tableBody = document.getElementById("projectRequestPickerTableBody");
    const searchInput = document.getElementById("projectRequestPickerSearch");

    if (!openButton || !closeButton || !modal || !tableBody) {
        return;
    }

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            filterTableRows(tableBody, searchInput.value);
        });
    }

    const projectRequests = [
        {
            project_ID: "PR-1001",
            client_ID: "CL-201",
            attention: "Maria Santos",
            business_Style: "Retail Store",
            client_Subject: "Glass Signage",
            fileID: "FILE-45",
            representative: "Daniel Cruz",
            contact_Person: "Alice Reyes",
            account_Executive: "Nina Gomez",
            date: "2026-09-20",
            time: "09:30 AM"
        },
        {
            project_ID: "PR-1002",
            client_ID: "CL-202",
            attention: "James Lim",
            business_Style: "Office Fit-out",
            client_Subject: "Wall Graphics",
            fileID: "FILE-46",
            representative: "Liza Tan",
            contact_Person: "Benny Lee",
            account_Executive: "Mel Santos",
            date: "2026-09-21",
            time: "02:15 PM"
        }
    ];

    openButton.addEventListener("click", function () {
        modal.hidden = false;
        if (searchInput) {
            searchInput.value = "";
        }
        tableBody.innerHTML = "";

        projectRequests.forEach(project => {
            const row = document.createElement("tr");
            const columns = [
                project.project_ID,
                project.client_ID,
                project.attention,
                project.business_Style,
                project.client_Subject,
                project.fileID,
                project.representative,
                project.contact_Person,
                project.account_Executive,
                project.date,
                project.time
            ];

            columns.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value || "";
                row.appendChild(cell);
            });

            row.addEventListener("click", function () {
                const lookupInput = document.getElementById("projectRequestLookupInput");
                if (lookupInput) {
                    lookupInput.value = project.project_ID;
                }
                modal.hidden = true;
            });

            tableBody.appendChild(row);
        });
    });

    closeButton.addEventListener("click", function () {
        modal.hidden = true;
    });

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.hidden = true;
        }
    });
}

function initializeQuotationOverviewLookup() {
    const openButton = document.getElementById("openQuotationOverviewPicker");
    const closeButton = document.getElementById("closeQuotationOverviewPicker");
    const modal = document.getElementById("quotationOverviewPickerModal");
    const tableBody = document.getElementById("quotationOverviewPickerTableBody");
    const searchInput = document.getElementById("quotationOverviewPickerSearch");

    if (!openButton || !closeButton || !modal || !tableBody) {
        return;
    }

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            filterTableRows(tableBody, searchInput.value);
        });
    }

    const quotationRows = [
        {
            quotation_ID: "QT-9001",
            client_ID: "CL-201",
            project_ID: "PR-1001",
            title: "Glass Signage",
            store: "Main Branch",
            description: "Front Window Branding",
            width: "240",
            height: "180",
            quantity: "2",
            unit_Price: "2450",
            total_Amount: "4900",
            sub_Total: "4900",
            less_Discount: "200",
            ingress_and_Engress: "150",
            overall_Total: "4850",
            status: "Approved",
            comment: "Priority install",
            terms_Condition: "Net 15",
            start_Date: "2026-09-20",
            time: "09:30 AM",
            end_Date: "2026-09-27"
        },
        {
            quotation_ID: "QT-9002",
            client_ID: "CL-202",
            project_ID: "PR-1002",
            title: "Wall Graphics",
            store: "Regional Office",
            description: "Lobby Wall Wrap",
            width: "320",
            height: "240",
            quantity: "1",
            unit_Price: "5400",
            total_Amount: "5400",
            sub_Total: "5400",
            less_Discount: "500",
            ingress_and_Engress: "300",
            overall_Total: "5200",
            status: "Pending",
            comment: "Waiting approval",
            terms_Condition: "Net 30",
            start_Date: "2026-09-21",
            time: "02:15 PM",
            end_Date: "2026-09-29"
        }
    ];

    openButton.addEventListener("click", function () {
        modal.hidden = false;
        if (searchInput) {
            searchInput.value = "";
        }
        tableBody.innerHTML = "";

        quotationRows.forEach(quotation => {
            const row = document.createElement("tr");
            const columns = [
                quotation.quotation_ID,
                quotation.client_ID,
                quotation.project_ID,
                quotation.title,
                quotation.store,
                quotation.description,
                quotation.width,
                quotation.height,
                quotation.quantity,
                quotation.unit_Price,
                quotation.total_Amount,
                quotation.sub_Total,
                quotation.less_Discount,
                quotation.ingress_and_Engress,
                quotation.overall_Total,
                quotation.status,
                quotation.comment,
                quotation.terms_Condition,
                quotation.start_Date,
                quotation.time,
                quotation.end_Date
            ];

            columns.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value || "";
                row.appendChild(cell);
            });

            row.addEventListener("click", function () {
                const lookupInput = document.getElementById("quotationOverviewLookupInput");
                if (lookupInput) {
                    lookupInput.value = quotation.quotation_ID;
                }
                modal.hidden = true;
            });

            tableBody.appendChild(row);
        });
    });

    closeButton.addEventListener("click", function () {
        modal.hidden = true;
    });

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.hidden = true;
        }
    });
}

function filterTableRows(tableBody, query) {
    if (!tableBody) {
        return;
    }

    const term = (query || "").trim().toLowerCase();
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach(row => {
        const text = (row.textContent || "").toLowerCase();
        row.style.display = !term || text.includes(term) ? "" : "none";
    });
}

function getClientValue(client, ...propertyNames) {
    for (const propertyName of propertyNames) {
        if (client[propertyName] !== null && client[propertyName] !== undefined) {
            return client[propertyName];
        }
    }

    return "";
}

function selectClient(client) {
    const fieldValues = {
        clientLookupInput: getClientValue(client, "client_Name", "Client_Name"),
        Client_CompanyName: getClientValue(client, "client_Name", "Client_Name"),
        Client_Telephone: getClientValue(client, "client_Telephone", "Client_Telephone"),
        Client_PaymentTerms: getClientValue(client, "client_PaymentTerms", "Payment_Terms"),
        Client_TinNumber: getClientValue(client, "client_TinNumber", "TIN", "Tin"),
        Client_CompanyAddress: getClientValue(client, "client_Address", "Client_Address"),
        Conforme_CompanyName: getClientValue(client, "client_Name", "Client_Name"),
        Conforme_Telephone: getClientValue(client, "client_Telephone", "Client_Telephone"),
        Conforme_PaymentTerms: getClientValue(client, "client_PaymentTerms", "Payment_Terms"),
        Conforme_TinNumber: getClientValue(client, "client_TinNumber", "TIN", "Tin"),
        Conforme_CompanyAddress: getClientValue(client, "client_Address", "Client_Address")
    };

    Object.entries(fieldValues).forEach(([fieldId, value]) => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = value;
        }
    });

    setClientDependentFieldsEnabled(true);
    setConformeFieldsEnabled(true);
}

function setClientDependentFieldsEnabled(enabled) {
    document.querySelectorAll("[data-client-dependent]")
        .forEach(field => {
            field.disabled = !enabled;
        });
}

function setConformeFieldsEnabled(enabled) {
    document.querySelectorAll("#ConformeSection input, #ConformeSection select, #ConformeSection textarea")
        .forEach(field => {
            if (field.id !== "clientLookupInput") {
                field.disabled = !enabled;
            }
        });
}


// Switch between Marketing tabs
function switchTab(event, sectionId) {

    event.preventDefault();

    const links = document.querySelectorAll(".tab-nav a");

    links.forEach(link => {
        link.classList.remove("active");
    });

    event.currentTarget.classList.add("active");

    clearInterval(savedRecordsMonitor);

    const contents = document.querySelectorAll(".tab-content");

    contents.forEach(content => {
        content.classList.remove("active-content");
        content.classList.add("hidden");
    });

    const target = document.getElementById(sectionId);

    if (target) {

        target.classList.remove("hidden");
        target.classList.add("active-content");

        // Load client records when Saved Records is opened
        if (sectionId === "savedRecordsSection") {
            loadClientsIntoTable();
            savedRecordsMonitor = setInterval(loadClientsIntoTable, 5000);
        }
    }
}

async function loadClientsIntoTable() {

    const tableBody = document.getElementById("clientsTableBody");

    if (!tableBody) {
        console.error("clientsTableBody not found.");
        return;
    }

    tableBody.innerHTML = `
        <tr>
            <td colspan="7">Loading saved records...</td>
        </tr>
    `;

    try {

        console.log("Loading clients...");

        const clients = await getClients();

        console.log("API CLIENT DATA:", clients);
        console.log("IS ARRAY:", Array.isArray(clients));

        tableBody.innerHTML = "";

        if (!Array.isArray(clients)) {
            console.error("API did not return an array:", clients);
            return;
        }

        if (clients.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7">No saved client records found.</td>
                </tr>
            `;
            return;
        }

        clients.forEach(client => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${client.client_ID ?? ""}</td>
                <td>${client.client_Name ?? ""}</td>
                <td>${client.client_Telephone ?? ""}</td>
                <td>${client.client_Address ?? ""}</td>
                <td>${client.client_TinNumber ?? ""}</td>
                <td>${client.client_PaymentTerms ?? ""}</td>
                <td>
                    <button onclick="editClient(${client.client_ID})">
                        Edit
                    </button>

                    <button onclick="deleteClient(${client.client_ID})">
                        Delete
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        console.log("Clients successfully displayed.");

    } catch (error) {

        console.error("Failed to load clients:", error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    Saved records are unavailable because the API is offline.
                </td>
            </tr>
        `;
    }
}

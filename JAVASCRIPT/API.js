const API_BASE_URL = "http://localhost:5073/api";

async function getClients() {

    const response = await fetch(`${API_BASE_URL}/Clients/GetLocalClients`, {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error("Failed to retrieve clients.");
    }

    return await response.json();
} 

async function CreateClients() {
    const client_Name = document.getElementById('Client_CompanyName');
    const Client_Name = client_Name.value;

    const client_Telephone = document.getElementById('Client_Telephone');
    const Client_Telephone = client_Telephone.value;

    const client_Address = document.getElementById('Client_CompanyAddress');
    const Client_Address = client_Address.value;

    const client_PaymentTerms = document.getElementById('Client_PaymentTerms');
    const Client_PaymentTerms = client_PaymentTerms.value;

    const client_TinNumber = document.getElementById('Client_TinNumber');
    const Client_TinNumber = client_TinNumber.value;
    
    const payload = { Client_Name: Client_Name, Client_Telephone: Client_Telephone, Client_Address: Client_Address, Payment_Terms: Client_PaymentTerms, TIN: Client_TinNumber }
    console.log(payload);
   try {
    const response = await fetch((`${API_BASE_URL}/Clients/GetLocalClients`), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    console.log(payload);
    // CHANGE THIS: Read the error body before throwing
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - Details: ${errorText}`);
    }

    const textData = await response.text();
    console.log('Success:', textData);
} catch (error) {
    console.error('Error details:', error.message);
}

  
}

async function GetDeliveryReceipts() {

    const response = await fetch(`${API_BASE_URL}/Marketing/GetLocalDeliveryReceipts`);

    if (!response.ok) {
        throw new Error("Failed to retrieve Delivery Receipts.");
    }

    return await response.json();
} 



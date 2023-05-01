async function fetchAccounts() {
    try{
        const response = await fetch('/user/getaccounts/');
        const data = await response.json();
        const accountsTableBody = document.getElementById("accounts-table-body");
        accountsTableBody.innerHTML = "";

        data.forEach((account) => {
            const row = document.createElement("tr");
            const idCell = document.createElement("td");
            idCell.textContent = account._id;
            const usernameCell = document.createElement("td");
            usernameCell.textContent = account.username;
            const hashCell = document.createElement("td");
            hashCell.textContent = account.password;

            row.appendChild(idCell);
            row.appendChild(usernameCell);
            row.appendChild(hashCell);
            accountsTableBody.appendChild(row);
        });
    } catch(err){
        console.error('Error fetching accounts:', err);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    fetchAccounts();
});
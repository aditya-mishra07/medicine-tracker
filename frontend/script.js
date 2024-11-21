function fetchAllMedicine() {
  const tbody = document.getElementById("tbody");
  fetch("http://localhost:8000/medicines")
    .then((response) => response.json())
    .then((data) => {
      if (data && data.medicines) {
        data.medicines.forEach((medicine) => {
          if (medicine.name && medicine.price) {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${medicine.name}</td>
            <td>${medicine.price}</td>
          `;
            tbody.appendChild(row);
          }
        });
      }
    });
}

fetchAllMedicine();

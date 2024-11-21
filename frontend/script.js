function fetchAllMedicine() {
  const tbody = document.getElementById("tbody");
  const errorMessage = document.getElementById("error-message");
  const table = document.getElementById("medicine-list");
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
            <td><button class="delete-btn" onclick="deleteMedicine(this)">Delete</button></td>
          `;
            tbody.appendChild(row);
          }
        });
      } else {
        errorMessage.style.display = "block";
        table.style.display = "none";
      }
    })
    .catch((error) => {
      errorMessage.style.display = "block";
      table.style.display = "none";
      console.log(error);
    });
}

function addMedicine() {
  const form = document.getElementById("medicine-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    if (name && price) {
      try {
        await fetch("http://localhost:8000/create", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ name: name, price: price }),
        });
      } catch (error) {
        console.error("error: " + error);
      }
    }
    //todo else display message
  });
}

async function deleteMedicine(med) {
  const row = med.parentNode.parentNode;
  const name = row.querySelector("td").textContent;

  try {
    await fetch("http://localhost:8000/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ name: name }),
    });
  } catch (error) {
    console.log(error);
  }
}

fetchAllMedicine();
addMedicine();

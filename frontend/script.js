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
            price = parseFloat(medicine.price).toFixed(2);
            row.innerHTML = `
            <td>${medicine.name}</td>
            <td>${price}</td>
            <td><button class="delete-btn" onclick="deleteMedicine(this)">Delete</button>
            <button class="update-btn" onclick="updateMedicine(this)">Update</button>
            </td>
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

function updateMedicine(med) {
  const row = med.parentNode.parentNode;

  const tr = document.createElement("tr");

  const cells = row.querySelectorAll("td");
  const name = cells[0].textContent.trim();
  const price = cells[1].textContent.trim();
  const btns = cells[2].innerHTML;
  const td1 = document.createElement("td");
  td1.textContent = name;

  const td2 = document.createElement("td");
  td2.innerHTML = `<input type="number" placeholder="price" step="0.01" value="${price}" />`;

  const td3 = document.createElement("td");
  td3.innerHTML = btns;

  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);

  document.getElementById("tbody").replaceChild(tr, row);

  const input = td2.querySelector("input");
  input.addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
      let newPrice = input.value.trim();
      if (newPrice === "" || isNaN(newPrice)) {
        newPrice = price;
      }

      const response = await fetch("http://localhost:8000/update", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ name: name, price: newPrice }),
      });
      td2.textContent = parseFloat(newPrice).toFixed(2);
    }
  });
}

function searchTable() {
  const search = document.getElementById("search-bar").value.toUpperCase();
  const table = document.getElementById("medicine-list");
  const tr = table.querySelectorAll("tr");
  let hasResults = false;
  for (let i = 1; i < tr.length; i++) {
    console.log(tr[i]);
    const td = tr[i].querySelector("td");

    if (td) {
      const name = td.textContent;
      if (name.toUpperCase().includes(search)) {
        tr[i].style.display = "";
        hasResults = true;
      } else {
        tr[i].style.display = "none";
      }
    }
  }

  const message = document.getElementById("error-message");

  if (!hasResults) {
    table.style.display = "none";
    message.style.display = "block";
  } else {
    table.style.display = "";
    message.style.display = "none";
  }
}

fetchAllMedicine();
addMedicine();

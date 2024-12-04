const billDateInput = document.getElementById("invoice-date");
const dueDateInput = document.getElementById("due-date");
const tBody = document.getElementById("item-list");
const taxInput = document.getElementById("tax");
const discountInput = document.getElementById("discount");
const resetButton = document.querySelector("button[type='reset']");

document.addEventListener("DOMContentLoaded", () => {
  // Get today's date in IST
  const today = new Date();
  const offset = 5.5 * 60 * 60 * 1000;
  istDate = new Date(today.getTime() + offset).toISOString().split("T")[0];

  if (billDateInput) {
    billDateInput.value = istDate;
    billDateInput.setAttribute("readonly", true);
  }
  dueDateInput.setAttribute("min", istDate);
});

const addNewRow = () => {
  const row = document.createElement("tr");
  row.className = "single-row";
  row.innerHTML = `<td>
                  <input
                    type="text"
                    placeholder="Product name"
                    name="product name"
                    id="product-name"
                    class="input-control"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="0"
                    name="unit"
                    id="unit"
                    class="input-control"
                    onkeyup="getInput()"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="0"
                    name="price"
                    id="price"
                    class="input-control"
                    onkeyup="getInput()"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="0"
                    name="amount"
                    id="amount"
                    class="input-control amount"
                    disabled
                  />
                </td>
                <td>
                  <button
                    type="button"
                    id="delete-item"
                    class="btn"
                    onclick="removeRow(this)"
                  >
                    Delete
                  </button>
                </td>`;

  tBody.appendChild(row);
};

document.getElementById("add-row").addEventListener("click", (e) => {
  e.preventDefault();
  addNewRow();
});

const getInput = () => {
  let rows = document.querySelectorAll("tr.single-row");
  rows.forEach((currentRow) => {
    let unit = currentRow.querySelector("#unit").value;
    let price = currentRow.querySelector("#price").value;

    amount = unit * price;
    currentRow.querySelector("#amount").value = amount;
    overallSum();
  });
};

overallSum = () => {
  let amountInputs = document.getElementsByName("amount");
  let subtotal = 0;
  for (let i = 0; i < amountInputs.length; i++) {
    if (amountInputs[i].value) {
      subtotal += +amountInputs[i].value;
    }
    document.getElementById("subtotal").value = subtotal;
    calculateTotal();
  }
};

function calculateTotal() {
  const subtotal = parseFloat(document.getElementById("subtotal").value) || 0;
  const taxPercentage = parseFloat(taxInput.value) || 0;
  const discountPercentage = parseFloat(discountInput.value) || 0;

  // Calculate tax and discount amounts
  const taxAmount = (subtotal * taxPercentage) / 100;
  const discountAmount = (subtotal * discountPercentage) / 100;

  // Calculate the total
  const total = subtotal + taxAmount - discountAmount;

  document.getElementById("total").innerHTML = total.toFixed(2);
}

taxInput.addEventListener("input", calculateTotal);
discountInput.addEventListener("input", calculateTotal);

function removeRow(button) {
  const row = button.closest("tr");
  row.remove();
  overallSum();
}

resetButton.addEventListener("click", () => {
  // Reset all text inputs, number inputs, and textareas
  document.querySelectorAll(".input-control").forEach((input) => {
    if (input.type === "text" || input.type === "textarea") {
      input.value = "";
    } else if (input.type === "number") {
      input.value = "0";
    }
  });

  // Reset date fields
  if (billDateInput) billDateInput.value = istDate;
  if (dueDateInput) {
    dueDateInput.value = "";
    dueDateInput.setAttribute("min", istDate);
  }

  // Reset subtotal and total
  document.getElementById("subtotal").value = "0";
  document.getElementById("total").textContent = "0.00";

  // Remove dynamically added rows
  const rows = tBody.querySelectorAll("tr.single-row");
  rows.forEach((row, index) => {
    if (index > 0) row.remove();
  });

  // Reset the first row's fields
  const firstRow = tBody.querySelector("tr.single-row");
  if (firstRow) {
    firstRow.querySelectorAll(".input-control").forEach((input) => {
      input.value = "";
      if (input.classList.contains("amount")) {
        input.disabled = true;
      }
    });
  }
});

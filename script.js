document.addEventListener("DOMContentLoaded", function () {
  const balanceEl = document.getElementById("balance");
  const incomeEl = document.getElementById("total-income");
  const expenseEl = document.getElementById("total-expense");
  const listEl = document.getElementById("list");
  const descriptionEl = document.getElementById("description");
  const amountEl = document.getElementById("amount");
  const addBtn = document.getElementById("add");
  let entries = JSON.parse(localStorage.getItem("entries")) || [];

  const updateUI = (filter = "all") => {
    listEl.innerHTML = "";
    let totalIncome = 0;
    let totalExpense = 0;
  

    entries.forEach((entry, index) => {
      if (filter === "all" || filter === entry.type) {
        const entryEl = document.createElement("li");
        entryEl.className =
          "flex justify-between items-center bg-white mb-2 p-2 rounded";

        entryEl.innerHTML = `
          <span>${entry.description} - $${entry.amount}</span>
          <div>
            <button class="edit-btn text-yellow-500 mr-2">Edit</button>
            <button class="delete-btn text-red-500">Delete</button>
          </div>
        `;

        listEl.appendChild(entryEl);

        entryEl
          .querySelector(".edit-btn")
          .addEventListener("click", () => editEntry(index));
        entryEl
          .querySelector(".delete-btn")
          .addEventListener("click", () => deleteEntry(index));

        if (entry.type === "income") {
          totalIncome += entry.amount;
        } else {
          totalExpense += entry.amount;
        }
      }
    });

    balanceEl.textContent = `$${totalIncome - totalExpense}`;
    incomeEl.textContent = `$${totalIncome}`;
    expenseEl.textContent = `$${totalExpense}`;
  };

  const addEntry = () => {
    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value.trim());
    const type = document.querySelector('input[name="type"]:checked').value;

    if (!description || isNaN(amount)) {
      alert("Please enter valid description and amount");
      return;
    }

    entries.push({ description, amount, type });
    localStorage.setItem("entries", JSON.stringify(entries));
    updateUI();
    clearInputs();
  };

  const clearInputs = () => {
    descriptionEl.value = "";
    amountEl.value = "";
  };

  const deleteEntry = (index) => {
    entries.splice(index, 1);
    localStorage.setItem("entries", JSON.stringify(entries));
    updateUI();
  };

  const editEntry = (index) => {
    const entry = entries[index];
    descriptionEl.value = entry.description;
    amountEl.value = entry.amount;
    document.querySelector(
      `input[name="type"][value="${entry.type}"]`
    ).checked = true;
    deleteEntry(index);
  };

  addBtn.addEventListener("click", addEntry);

  document.querySelectorAll('input[name="filter"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      updateUI(e.target.value);
    });
  });

  resetButton.addEventListener("click", () => {
    localStorage.removeItem("entries");
    entries = [];
    updateUI();
  });

  updateUI();
});


// ================================
// DOM Elements
// ================================

const expenseForm = document.getElementById("expenseForm");

const expenseName = document.getElementById("expenseName");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const date = document.getElementById("date");

const expenseList = document.getElementById("expenseList");
const emptyState = document.getElementById("emptyState");

const totalExpense = document.getElementById("totalExpense");
const transactionCount = document.getElementById("transactionCount");
const highestExpense = document.getElementById("highestExpense");

const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");
const sortExpenses = document.getElementById("sortExpenses");


// Edit Modal

const editModal = document.getElementById("editModal");

const editForm = document.getElementById("editForm");

const editName = document.getElementById("editName");
const editAmount = document.getElementById("editAmount");
const editCategory = document.getElementById("editCategory");
const editDate = document.getElementById("editDate");

const closeModal = document.getElementById("closeModal");
const cancelEdit = document.getElementById("cancelEdit");


// ================================
// Data
// ================================

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let editingId = null;


// ================================
// Set Today's Date
// ================================

date.value = new Date().toISOString().split("T")[0];


// ================================
// Save to LocalStorage
// ================================

function saveExpenses() {

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

}


// ================================
// Add Expense
// ================================

expenseForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const name = expenseName.value.trim();

    const expenseAmount = Number(
        amount.value
    );

    const expenseCategory = category.value;

    const expenseDate = date.value;


    if (
        name === "" ||
        expenseAmount <= 0 ||
        expenseCategory === "" ||
        expenseDate === ""
    ) {

        alert("Please enter valid expense details.");

        return;

    }


    const newExpense = {

        id: Date.now(),

        name: name,

        amount: expenseAmount,

        category: expenseCategory,

        date: expenseDate

    };


    expenses.push(newExpense);


    saveExpenses();

    expenseForm.reset();


    date.value =
        new Date().toISOString().split("T")[0];


    renderExpenses();

});


// ================================
// Render Expenses
// ================================

function renderExpenses() {

    let filteredExpenses = [...expenses];


    // Search

    const searchText =
        searchInput.value.trim().toLowerCase();


    if (searchText !== "") {

        filteredExpenses =
            filteredExpenses.filter(function (expense) {

                return expense.name
                    .toLowerCase()
                    .includes(searchText);

            });

    }


    // Category Filter

    const selectedCategory =
        filterCategory.value;


    if (selectedCategory !== "All") {

        filteredExpenses =
            filteredExpenses.filter(function (expense) {

                return expense.category === selectedCategory;

            });

    }


    // Sorting

    const sortValue =
        sortExpenses.value;


    if (sortValue === "newest") {

        filteredExpenses.sort(function (a, b) {

            return new Date(b.date) -
                   new Date(a.date);

        });

    }


    if (sortValue === "oldest") {

        filteredExpenses.sort(function (a, b) {

            return new Date(a.date) -
                   new Date(b.date);

        });

    }


    if (sortValue === "highest") {

        filteredExpenses.sort(function (a, b) {

            return b.amount - a.amount;

        });

    }


    if (sortValue === "lowest") {

        filteredExpenses.sort(function (a, b) {

            return a.amount - b.amount;

        });

    }


    // Clear list

    expenseList.innerHTML = "";


    // Empty state

    if (filteredExpenses.length === 0) {

        emptyState.style.display = "block";

    }
    else {

        emptyState.style.display = "none";

    }


    // Create expenses

    filteredExpenses.forEach(function (expense) {

        const expenseItem =
            document.createElement("div");

        expenseItem.className = "expense-item";


        const expenseInfo =
            document.createElement("div");

        expenseInfo.className = "expense-info";


        const nameElement =
            document.createElement("div");

        nameElement.className = "expense-name";

        nameElement.textContent = expense.name;


        const meta =
            document.createElement("div");

        meta.className = "expense-meta";


        const categoryElement =
            document.createElement("span");

        categoryElement.className = "category";

        categoryElement.textContent =
            expense.category;


        const dateElement =
            document.createElement("span");

        dateElement.textContent =
            formatDate(expense.date);


        meta.appendChild(categoryElement);

        meta.appendChild(dateElement);


        expenseInfo.appendChild(nameElement);

        expenseInfo.appendChild(meta);


        // Right section

        const expenseRight =
            document.createElement("div");

        expenseRight.className = "expense-right";


        const amountElement =
            document.createElement("div");

        amountElement.className = "expense-amount";

        amountElement.textContent =
            "$" + expense.amount.toFixed(2);


        const actions =
            document.createElement("div");

        actions.className = "expense-actions";


        const editButton =
            document.createElement("button");

        editButton.className = "edit-btn";

        editButton.textContent = "Edit";

        editButton.addEventListener(
            "click",
            function () {

                openEditModal(expense.id);

            }
        );


        const deleteButton =
            document.createElement("button");

        deleteButton.className = "delete-btn";

        deleteButton.textContent = "Delete";

        deleteButton.addEventListener(
            "click",
            function () {

                deleteExpense(expense.id);

            }
        );


        actions.appendChild(editButton);

        actions.appendChild(deleteButton);


        expenseRight.appendChild(amountElement);

        expenseRight.appendChild(actions);


        expenseItem.appendChild(expenseInfo);

        expenseItem.appendChild(expenseRight);


        expenseList.appendChild(expenseItem);

    });


    updateSummary();

}


// ================================
// Update Summary
// ================================

function updateSummary() {

    const total = expenses.reduce(
        function (sum, expense) {

            return sum + expense.amount;

        },
        0
    );


    const highest = expenses.length > 0

        ? Math.max(
            ...expenses.map(function (expense) {

                return expense.amount;

            })
        )

        : 0;


    totalExpense.textContent =
        "$" + total.toFixed(2);


    transactionCount.textContent =
        expenses.length;


    highestExpense.textContent =
        "$" + highest.toFixed(2);

}


// ================================
// Delete Expense
// ================================

function deleteExpense(id) {

    const confirmed =
        confirm("Are you sure you want to delete this expense?");


    if (!confirmed) {

        return;

    }


    expenses = expenses.filter(
        function (expense) {

            return expense.id !== id;

        }
    );


    saveExpenses();

    renderExpenses();

}


// ================================
// Open Edit Modal
// ================================

function openEditModal(id) {

    const expense =
        expenses.find(function (item) {

            return item.id === id;

        });


    if (!expense) {

        return;

    }


    editingId = id;


    editName.value =
        expense.name;

    editAmount.value =
        expense.amount;

    editCategory.value =
        expense.category;

    editDate.value =
        expense.date;


    editModal.classList.add("active");

}


// ================================
// Save Edited Expense
// ================================

editForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const name =
        editName.value.trim();


    const newAmount =
        Number(editAmount.value);


    if (
        name === "" ||
        newAmount <= 0 ||
        editDate.value === ""
    ) {

        alert("Please enter valid information.");

        return;

    }


    expenses =
        expenses.map(function (expense) {

            if (expense.id === editingId) {

                return {

                    ...expense,

                    name: name,

                    amount: newAmount,

                    category: editCategory.value,

                    date: editDate.value

                };

            }


            return expense;

        });


    saveExpenses();

    closeEditModal();

    renderExpenses();

});


// ================================
// Close Edit Modal
// ================================

function closeEditModal() {

    editModal.classList.remove("active");

    editingId = null;

    editForm.reset();

}


closeModal.addEventListener(
    "click",
    closeEditModal
);


cancelEdit.addEventListener(
    "click",
    closeEditModal
);


// Close modal when clicking outside

editModal.addEventListener(
    "click",
    function (event) {

        if (event.target === editModal) {

            closeEditModal();

        }

    }
);


// ================================
// Search / Filter / Sort
// ================================

searchInput.addEventListener(
    "input",
    renderExpenses
);


filterCategory.addEventListener(
    "change",
    renderExpenses
);


sortExpenses.addEventListener(
    "change",
    renderExpenses
);


// ================================
// Format Date
// ================================

function formatDate(dateString) {

    const dateObject =
        new Date(dateString + "T00:00:00");


    return dateObject.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


// ================================
// Initial Render
// ================================

renderExpenses();

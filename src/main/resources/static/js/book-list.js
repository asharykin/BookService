var currentPage = 0;
var pageSize = 10;
var titleFilter = "";
var brandFilter = "";
var yearFilter = "";
var currentBookId; // Variable to hold the ID of the currently selected book for edit/delete

document.addEventListener("DOMContentLoaded", function() {
    loadBooks();

    // Show modal for adding book
    document.getElementById('openCreateModal').addEventListener('click', function() {
        $('#createModal').modal('show');
    });

    // Handle book creation
    document.getElementById("createBookForm").addEventListener("submit", function(event) {
        event.preventDefault();
        createBook();
    });

    // Handle book editing
    document.getElementById("editBookForm").addEventListener("submit", function(event) {
        event.preventDefault();
        updateBook();
    });

    // Handle delete confirmation
    document.getElementById("confirmDelete").addEventListener("click", function() {
        deleteBook(currentBookId);
    });
});

// Load books from the server
async function loadBooks() {
    var url = `/api/books?page=${currentPage}&size=${pageSize}&title=${titleFilter}&brand=${brandFilter}&year=${yearFilter}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        populateTable(data.content);
        populatePagination(data.totalPages, data.number);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Populate the table with book data
function populateTable(books) {
    var tableBody = document.getElementById("bookTableBody");
    tableBody.innerHTML = "";

    for (var book of books) {
        var row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.vendorCode}</td>
            <td>${book.title}</td>
            <td>${book.year}</td>
            <td>${book.brand}</td>
            <td>${book.stock}</td>
            <td>${book.price}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="showEditModal(${book.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="confirmDeleteBook(${book.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    }
}

// Create a new book
async function createBook() {
    var newBook = {
        vendorCode: document.getElementById("createVendorCode").value,
        title: document.getElementById("createTitle").value,
        year: parseInt(document.getElementById("createYear").value),
        brand: document.getElementById("createBrand").value,
        stock: parseInt(document.getElementById("createStock").value),
        price: parseFloat(document.getElementById("createPrice").value)
    };

    try {
        const response = await fetch("/api/books", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBook)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        $('#createModal').modal('hide'); // Hide the modal
        loadBooks(); // Refresh the book list
    } catch (error) {
        alert("Error creating book: " + error.message);
    }
}

// Show the edit modal
function showEditModal(bookId) {
    currentBookId = bookId; // Store the ID to use in update
    // Load the book data and populate the edit form
    // Assume an API endpoint returns the book data for this ID
    fetch(`/api/books/${bookId}`)
        .then(response => response.json())
        .then(book => {
            document.getElementById("editVendorCode").value = book.vendorCode;
            document.getElementById("editTitle").value = book.title;
            document.getElementById("editYear").value = book.year;
            document.getElementById("editBrand").value = book.brand;
            document.getElementById("editStock").value = book.stock;
            document.getElementById("editPrice").value = book.price;
            $('#editModal').modal('show'); // Show the edit modal
        });
}

// Update the book information
async function updateBook() {
    var updatedBook = {
        id: currentBookId,
        vendorCode: document.getElementById("editVendorCode").value,
        title: document.getElementById("editTitle").value,
        year: parseInt(document.getElementById("editYear").value),
        brand: document.getElementById("editBrand").value,
        stock: parseInt(document.getElementById("editStock").value),
        price: parseFloat(document.getElementById("editPrice").value)
    };

    try {
        const response = await fetch(`/api/books/${currentBookId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedBook)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        $('#editModal').modal('hide'); // Hide the modal
        loadBooks(); // Refresh the book list
    } catch (error) {
        alert("Error updating book: " + error.message);
    }
}

// Confirm delete action
function confirmDeleteBook(bookId) {
    currentBookId = bookId; // Store the ID for deletion confirmation
    $('#deleteModal').modal('show'); // Show the delete confirmation modal
}

// Delete a book
async function deleteBook(id) {
    try {
        const response = await fetch(`/api/books/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        $('#deleteModal').modal('hide'); // Hide the modal
        loadBooks(); // Refresh the book list
    } catch (error) {
        alert("Error deleting book: " + error.message);
    }
}

// Add additional functions here if you need filtering or pagination...

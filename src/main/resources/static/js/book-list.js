var currentPage = 0;
var pageSize = 10;
var titleFilter = "";
var brandFilter = "";
var yearFilter = "";

document.addEventListener("DOMContentLoaded", function() {
    loadBooks();

    document.getElementById("bookForm").addEventListener("submit", function(event) {
        event.preventDefault();
        saveBook();
    });

    if (userRoles.includes("ROLE_ADMIN")) {
        document.getElementById("addBookButton").style.display = "block";
    } else {
        document.getElementById("addBookButton").style.display = "none";
    }
});

function applyFilters() {
    titleFilter = document.getElementById("titleFilter").value;
    brandFilter = document.getElementById("brandFilter").value;
    yearFilter = document.getElementById("yearFilter").value;
    currentPage = 0;
    loadBooks();
}

function clearFilters() {
    document.getElementById("titleFilter").value = "";
    document.getElementById("brandFilter").value = "";
    document.getElementById("yearFilter").value = "";
    titleFilter = "";
    brandFilter = "";
    yearFilter = "";
    currentPage = 0;
    loadBooks();
}

function changePageSize() {
    pageSize = parseInt(document.getElementById("pageSizeSelect").value, 10);
    currentPage = 0;
    loadBooks();
}

async function loadBooks() {
    var url = "/api/books?page=" + currentPage + "&size=" + pageSize;
    if (titleFilter) {
        url += "&title=" + titleFilter;
    }
    if (brandFilter) {
        url += "&brand=" + brandFilter;
    }
    if (yearFilter) {
        url += "&year=" + yearFilter;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        populateTable(data.content);
        populatePagination(data.totalPages, data.number);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function populateTable(books) {
    var tableBody = document.getElementById("bookTableBody");
    tableBody.innerHTML = "";

    for (let i = 0; i < books.length; i++) {
        let book = books[i];
        let row = document.createElement("tr");

        let idCell = document.createElement("td");
        idCell.textContent = book.id;
        row.appendChild(idCell);

        let vendorCodeCell = document.createElement("td");
        vendorCodeCell.textContent = book.vendorCode;
        row.appendChild(vendorCodeCell);

        let titleCell = document.createElement("td");
        titleCell.textContent = book.title;
        row.appendChild(titleCell);

        let yearCell = document.createElement("td");
        yearCell.textContent = book.year;
        row.appendChild(yearCell);

        let brandCell = document.createElement("td");
        brandCell.textContent = book.brand;
        row.appendChild(brandCell);

        let stockCell = document.createElement("td");
        stockCell.textContent = book.stock;
        row.appendChild(stockCell);

        let priceCell = document.createElement("td");
        priceCell.textContent = book.price;
        row.appendChild(priceCell);

        if (userRoles.includes("ROLE_ADMIN")) {
            let actionsCell = document.createElement("td");

            let editButton = createButton("Edit", "btn-primary", (function(currentBook) {
                return function() {
                    openEditModal(currentBook);
                };
            })(book));

            let deleteButton = createButton("Delete", "btn-danger", (function(currentBook) {
                return function() {
                    deleteBook(currentBook.id);
                };
            })(book));

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);
        }

        tableBody.appendChild(row);
    }
}


function createButton(text, className, clickHandler) {
    var button = document.createElement("button");
    button.textContent = text;
    button.className = "btn " + className + " btn-sm ml-1";
    button.addEventListener("click", clickHandler);
    return button;
}

function populatePagination(totalPages, currentPage) {
    var pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    var prevItem = document.createElement("li");
    prevItem.className = "page-item";
    var prevLink = document.createElement("a");
    prevLink.className = "page-link";
    prevLink.textContent = "Previous";
    prevLink.href = "#";

    if (currentPage === 0) {
        prevItem.classList.add("disabled");
    } else {
        prevLink.addEventListener("click", function(e) {
            e.preventDefault();
            goToPage(currentPage - 1);
        });
    }

    prevItem.appendChild(prevLink);
    pagination.appendChild(prevItem);

    for (var i = 0; i < totalPages; i++) {
        var pageItem = document.createElement("li");
        pageItem.className = "page-item";
        var pageLink = document.createElement("a");
        pageLink.className = "page-link";
        pageLink.textContent = (i + 1);
        pageLink.href = "#";

        if (i === currentPage) {
            pageItem.classList.add("active");
        } else {
            (function(pageNum) {
                pageLink.addEventListener("click", function(e) {
                    e.preventDefault();
                    goToPage(pageNum);
                });
            })(i);
        }

        pageItem.appendChild(pageLink);
        pagination.appendChild(pageItem);
    }

    var nextItem = document.createElement("li");
    nextItem.className = "page-item";
    var nextLink = document.createElement("a");
    nextLink.className = "page-link";
    nextLink.textContent = "Next";
    nextLink.href = "#";

    if (currentPage === totalPages - 1) {
        nextItem.classList.add("disabled");
    } else {
        nextLink.addEventListener("click", function(e) {
            e.preventDefault();
            goToPage(currentPage + 1);
        });
    }

    nextItem.appendChild(nextLink);
    pagination.appendChild(nextItem);
}

function goToPage(page) {
    currentPage = page;
    loadBooks();
}

async function saveBook() {
    var id = document.getElementById("id").value;
    var vendorCode = document.getElementById("vendorCode").value;
    var title = document.getElementById("bookTitle").value;
    var year = document.getElementById("year").value;
    var brand = document.getElementById("brand").value;
    var stock = document.getElementById("stock").value;
    var price = document.getElementById("price").value;

    var bookData = {
        vendorCode: vendorCode,
        title: title,
        year: year,
        brand: brand,
        stock: stock,
        price: price
    };

    var method = 'POST';
    var url = '/api/books';

    if (id) {
        method = 'PUT';
        url += '/' + id;
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });

        if (response.ok) {
            closeModal();
            loadBooks();
        } else {
            console.error('Error saving book:', response.status);
        }
    } catch (error) {
        console.error('Error saving book:', error);
    }
}

async function deleteBook(id) {
    if (confirm("Are you sure you want to delete this book?")) {
        try {
            const response = await fetch('/api/books/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                loadBooks();
            } else {
                console.error('Error deleting book:', response.status);
            }
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    }
}

function openEditModal(book) {
    document.getElementById("id").value = book.id;
    document.getElementById("vendorCode").value = book.vendorCode;
    document.getElementById("bookTitle").value = book.title;
    document.getElementById("year").value = book.year;
    document.getElementById("brand").value = book.brand;
    document.getElementById("stock").value = book.stock;
    document.getElementById("price").value = book.price;

    $('#bookModal').modal('show');
}

function openAddModal() {
    document.getElementById("id").value = "";
    document.getElementById("vendorCode").value = "";
    document.getElementById("bookTitle").value = "";
    document.getElementById("year").value = "";
    document.getElementById("brand").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("price").value = "";

    $('#bookModal').modal('show');
}

function closeModal() {
    $('#bookModal').modal('hide');
}
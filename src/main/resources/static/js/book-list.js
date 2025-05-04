var currentPage = 0;
var pageSize = 10;
var userRoles = [];

document.addEventListener("DOMContentLoaded", function () {
    renderBasedOnRoles();
    loadBooks();

    document.getElementById("bookForm").addEventListener("submit", function (event) {
        event.preventDefault();
        saveBook();
    });
});

async function renderBasedOnRoles() {
    const response = await fetch("/roles");
    userRoles = await response.json();

    const isAdmin = userRoles.includes("ROLE_ADMIN");

    if (isAdmin) {
        let addBookButton = document.createElement("button");
        addBookButton.type = "button";
        addBookButton.className = "btn btn-success mb-3";
        addBookButton.id = "addBookButton";
        addBookButton.textContent = "Add Book";
        addBookButton.onclick = openAddModal;

        let container = document.getElementById("mainContainer");
        container.insertBefore(addBookButton, document.getElementById("bookTable"));
    }

    let tableHeader = document.getElementById("bookTableHead");
    tableHeader.innerHTML = "";

    let row = document.createElement("tr");
    let headers = ["ID", "Vendor Code", "Title", "Year", "Brand", "Stock", "Price"];

    headers.forEach(headerText => {
        let th = document.createElement("th");
        th.textContent = headerText;
        row.appendChild(th);
    });

    if (isAdmin) {
        let actions = document.createElement("th");
        actions.textContent = "Actions";
        row.appendChild(actions);
    }

    tableHeader.appendChild(row);
}

function applyFilters() {
    let titleFilter = document.getElementById("titleFilter").value;
    let brandFilter = document.getElementById("brandFilter").value;
    let yearFilter = document.getElementById("yearFilter").value;
    currentPage = 0;
    loadBooks(titleFilter, brandFilter, yearFilter);
}

function clearFilters() {
    document.getElementById("titleFilter").value = "";
    document.getElementById("brandFilter").value = "";
    document.getElementById("yearFilter").value = "";
    currentPage = 0;
    loadBooks();
}

function changePageSize() {
    pageSize = parseInt(document.getElementById("pageSizeSelect").value, 10);
    currentPage = 0;
    let titleFilter = document.getElementById("titleFilter").value;
    let brandFilter = document.getElementById("brandFilter").value;
    let yearFilter = document.getElementById("yearFilter").value;
    loadBooks(titleFilter, brandFilter, yearFilter);
}

async function loadBooks(titleFilter, brandFilter, yearFilter) {
    let url = "/api/books?page=" + currentPage + "&size=" + pageSize;
    if (titleFilter) {
        url += "&title=" + titleFilter;
    }
    if (brandFilter) {
        url += "&brand=" + brandFilter;
    }
    if (yearFilter) {
        url += "&year=" + yearFilter;
    }

    const response = await fetch(url);
    const data = await response.json();
    populateTable(data.content);
    populatePagination(data.totalPages, data.number);
}

function populateTable(books) {
    let tableBody = document.getElementById("bookTableBody");
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

        const isAdmin = userRoles.includes("ROLE_ADMIN");
        if (isAdmin) {
            let actionsCell = document.createElement("td");
            let editButton = createButton("Edit", "btn-primary", (function (currentBook) {
                return function () {
                    openEditModal(currentBook);
                };
            })(book));

            let deleteButton = createButton("Delete", "btn-danger", (function (currentBook) {
                return function () {
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
    let button = document.createElement("button");
    button.textContent = text;
    button.className = "btn " + className + " btn-sm ml-1";
    button.addEventListener("click", clickHandler);
    return button;
}

function populatePagination(totalPages, currentPage) {
    let pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    let prevItem = document.createElement("li");
    prevItem.className = "page-item";
    let prevLink = document.createElement("a");
    prevLink.className = "page-link";
    prevLink.textContent = "Previous";
    prevLink.href = "#";

    if (currentPage === 0) {
        prevItem.classList.add("disabled");
    } else {
        prevLink.addEventListener("click", function (e) {
            e.preventDefault();
            goToPage(currentPage - 1);
        });
    }

    prevItem.appendChild(prevLink);
    pagination.appendChild(prevItem);

    for (let i = 0; i < totalPages; i++) {
        let pageItem = document.createElement("li");
        pageItem.className = "page-item";
        let pageLink = document.createElement("a");
        pageLink.className = "page-link";
        pageLink.textContent = (i + 1);
        pageLink.href = "#";

        if (i === currentPage) {
            pageItem.classList.add("active");
        } else {
            (function (pageNum) {
                pageLink.addEventListener("click", function (e) {
                    e.preventDefault();
                    goToPage(pageNum);
                });
            })(i);
        }

        pageItem.appendChild(pageLink);
        pagination.appendChild(pageItem);
    }

    let nextItem = document.createElement("li");
    nextItem.className = "page-item";
    let nextLink = document.createElement("a");
    nextLink.className = "page-link";
    nextLink.textContent = "Next";
    nextLink.href = "#";

    if (currentPage === totalPages - 1) {
        nextItem.classList.add("disabled");
    } else {
        nextLink.addEventListener("click", function (e) {
            e.preventDefault();
            goToPage(currentPage + 1);
        });
    }

    nextItem.appendChild(nextLink);
    pagination.appendChild(nextItem);
}

function goToPage(page) {
    currentPage = page;
    let titleFilter = document.getElementById("titleFilter").value;
    let brandFilter = document.getElementById("brandFilter").value;
    let yearFilter = document.getElementById("yearFilter").value;
    loadBooks(titleFilter, brandFilter, yearFilter);
}

async function saveBook() {
    let id = document.getElementById("id").value;
    let vendorCode = document.getElementById("vendorCode").value;
    let title = document.getElementById("bookTitle").value;
    let year = document.getElementById("year").value;
    let brand = document.getElementById("brand").value;
    let stock = document.getElementById("stock").value;
    let price = document.getElementById("price").value;

    let bookData = {
        vendorCode: vendorCode,
        title: title,
        year: year,
        brand: brand,
        stock: stock,
        price: price
    };

    let method = 'POST';
    let url = '/api/books';
    if (id) {
        method = 'PUT';
        url += '/' + id;
    }

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
    }
}

async function deleteBook(id) {
    if (confirm("Вы уверены, что хотите удалить эту книгу?")) {
        const response = await fetch('/api/books/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            loadBooks();
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
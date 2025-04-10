var currentPage = 0;
var pageSize = 10; // Default page size
var titleFilter = "";
var brandFilter = "";
var yearFilter = "";

document.addEventListener("DOMContentLoaded", function() {
    loadBooks();
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
    currentPage = 0; // Reset to first page
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

    for (var i = 0; i < books.length; i++) {
        var book = books[i];
        var row = document.createElement("tr");

        var idCell = document.createElement("td");
        idCell.textContent = book.id;
        row.appendChild(idCell);

        var vendorCodeCell = document.createElement("td");
        vendorCodeCell.textContent = book.vendorCode;
        row.appendChild(vendorCodeCell);

        var titleCell = document.createElement("td");
        titleCell.textContent = book.title;
        row.appendChild(titleCell);

        var yearCell = document.createElement("td");
        yearCell.textContent = book.year;
        row.appendChild(yearCell);

        var brandCell = document.createElement("td");
        brandCell.textContent = book.brand;
        row.appendChild(brandCell);

        var stockCell = document.createElement("td");
        stockCell.textContent = book.stock;
        row.appendChild(stockCell);

        var priceCell = document.createElement("td");
        priceCell.textContent = book.price;
        row.appendChild(priceCell);

        tableBody.appendChild(row);
    }
}

function populatePagination(totalPages, currentPage) {
    var pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    // Previous Page
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

    // Page Numbers
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

    // Next Page
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

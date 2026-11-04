var selectedCategory = "All";

var productList = document.getElementById("products-grid");
var searchInput = document.getElementById("product-search");
var filterButtons = document.getElementById("category-filters");
var overviewLink = document.getElementById("overview-link");
var settingsLink = document.getElementById("settings-link");
var settingsSection = document.getElementById("settings-section");
var detailsBox = document.getElementById("details-box");
var detailsContent = document.getElementById("details-content");

var activeCount = 0;
var pendingCount = 0;

for (var i = 0; i < products.length; i++) {
    if (products[i].status == "Active") {
        activeCount++;
    }
    if (products[i].status == "Pending") {
        pendingCount++;
    }
}

document.getElementById("total-products").textContent = products.length;
document.getElementById("active-products").textContent = activeCount;
document.getElementById("pending-products").textContent = pendingCount;

overviewLink.addEventListener("click", function (event) {
    event.preventDefault();
    settingsSection.hidden = true;
    document.querySelector(".summary-section").hidden = false;
    document.getElementById("products").hidden = false;
    overviewLink.classList.add("active");
    settingsLink.classList.remove("active");
});

settingsLink.addEventListener("click", function (event) {
    event.preventDefault();
    settingsSection.hidden = false;
    document.querySelector(".summary-section").hidden = true;
    document.getElementById("products").hidden = true;
    settingsLink.classList.add("active");
    overviewLink.classList.remove("active");
});

document.getElementById("settings-form").addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Settings saved");
});

function showProducts() {
    var searchText = searchInput.value.toLowerCase();
    var html = "";

    for (var i = 0; i < products.length; i++) {
        var product = products[i];
        var categoryMatch = selectedCategory == "All" || product.category == selectedCategory;
        var searchMatch = product.name.toLowerCase().indexOf(searchText) >= 0;

        if (categoryMatch && searchMatch) {
            var buttonText = "View Details";
            var buttonClass = "primary-button";

            if (product.status == "Pending") {
                buttonText = "Apply";
                buttonClass = "secondary-button";
            }

            html += '<article class="product-card">';
            html += '<div class="product-card-header"><span class="status-badge ' + product.status.toLowerCase() + '">' + product.status + '</span></div>';
            html += '<p class="product-category">' + product.category + '</p>';
            html += '<h3>' + product.name + '</h3>';
            html += '<div class="product-metrics">';
            html += '<div class="metric"><span>' + product.metrics[0].label + '</span><strong>' + product.metrics[0].value + '</strong></div>';
            html += '<div class="metric"><span>' + product.metrics[1].label + '</span><strong>' + product.metrics[1].value + '</strong></div>';
            html += '</div>';
            html += '<button class="' + buttonClass + ' product-action" data-id="' + product.id + '">' + buttonText + '</button>';
            html += '</article>';
        }
    }

    if (html == "") {
        html = '<div class="empty-state"><h3>No products found</h3><p>Try another search or category.</p></div>';
    }

    productList.innerHTML = html;
}

filterButtons.addEventListener("click", function (event) {
    if (event.target.classList.contains("filter-button")) {
        selectedCategory = event.target.dataset.category;

        var buttons = filterButtons.querySelectorAll(".filter-button");
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove("active");
        }

        event.target.classList.add("active");
        showProducts();
    }
});

searchInput.addEventListener("keyup", showProducts);

productList.addEventListener("click", function (event) {
    if (event.target.classList.contains("product-action")) {
        var id = Number(event.target.dataset.id);

        for (var i = 0; i < products.length; i++) {
            if (products[i].id == id) {
                if (products[i].status == "Pending") {
                    alert("Application submitted for " + products[i].name);
                } else {
                    detailsContent.innerHTML =
                        "<h2>" + products[i].name + "</h2>" +
                        "<p><strong>Category:</strong> " + products[i].category + "</p>" +
                        "<p><strong>Status:</strong> " + products[i].status + "</p>" +
                        "<p><strong>" + products[i].metrics[0].label + ":</strong> " + products[i].metrics[0].value + "</p>" +
                        "<p><strong>" + products[i].metrics[1].label + ":</strong> " + products[i].metrics[1].value + "</p>";
                    detailsBox.hidden = false;
                }
            }
        }
    }
});

document.getElementById("close-details").addEventListener("click", function () {
    detailsBox.hidden = true;
});

showProducts();

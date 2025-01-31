document.addEventListener("DOMContentLoaded", () => {
    // Sidebar and Section Toggle
    const links = document.querySelectorAll(".sidebar ul li a");
    const sections = document.querySelectorAll(".section");

    links.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            const target = event.target.getAttribute("data-target");

            sections.forEach(section => {
                section.classList.remove("active");
                if (section.id === target) {
                    section.classList.add("active");
                }
            });

            // Animate section transition using GSAP
            gsap.fromTo(
                `#${target}`,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
            );
        });
    });

    // Add Articles Logic
    const articleForm = document.getElementById("article-form");
    const articleList = document.getElementById("article-list").querySelector(".article-container");
    const articleSelect = document.getElementById("article-select");

    let articles = [];

    articleForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("article-name").value;
        const cost = document.getElementById("article-cost").value;
        const quantity = document.getElementById("article-quantity").value;
        const image = document.getElementById("article-image").files[0];

        if (name && cost && quantity && image) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const article = {
                    name,
                    cost,
                    quantity,
                    image: e.target.result
                };

                articles.push(article);
                updateArticleList();

                // Animate article addition using GSAP
                gsap.fromTo(
                    articleList.lastElementChild,
                    { opacity: 0, scale: 0.8 },
                    { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
                );

                articleForm.reset();
            };

            reader.readAsDataURL(image);
        }
    });

    function updateArticleList() {
        articleList.innerHTML = "";
        articleSelect.innerHTML = "<option value='' disabled>Select Article</option>";

        articles.forEach(article => {
            const li = document.createElement("div");
            li.classList.add("article-item");
            li.innerHTML = `
                <img src="${article.image}" alt="${article.name}" />
                <h4>${article.name}</h4>
                <p>Cost: ₨${article.cost} | Quantity: ${article.quantity}</p>
            `;
            articleList.appendChild(li);

            const option = document.createElement("option");
            option.value = article.name;
            option.textContent = article.name;
            articleSelect.appendChild(option);
        });
    }

    // Customer Logic
    const customerForm = document.getElementById("customer-form");
    const customerList = document.getElementById("customer-list").querySelector(".customer-cards");
    const customerSelect = document.getElementById("customer-select");

    let customers = [];

    customerForm.addEventListener("submit", event => {
        event.preventDefault();

        const customerName = document.getElementById("customer-name").value;

        if (customerName) {
            const customer = {
                name: customerName,
                transactions: [],
                totalProfitLoss: 0
            };

            customers.push(customer);
            updateCustomerList();

            customerForm.reset();
        }
    });

    function updateCustomerList() {
        customerList.innerHTML = "";
        customerSelect.innerHTML = "<option value='' disabled>Select Customer</option>";

        customers.forEach(customer => {
            const card = document.createElement("div");
            card.classList.add("customer-card");
            card.innerHTML = `
                <h3>${customer.name}</h3>
                <p>Transactions: ${customer.transactions.length}</p>
                <p>Total Profit/Loss: ₨${customer.totalProfitLoss}</p>
            `;
            customerList.appendChild(card);

            const option = document.createElement("option");
            option.value = customer.name;
            option.textContent = customer.name;
            customerSelect.appendChild(option);
        });
    }

    // Sell Articles Logic
    const sellForm = document.getElementById("sell-form");
    const salesList = document.getElementById("sales-list").querySelector("ul");
    let totalProfitLoss = 0;

    sellForm.addEventListener("submit", event => {
        event.preventDefault();

        const articleName = document.getElementById("article-select").value;
        const sellQuantity = document.getElementById("sell-quantity").value;
        const customerName = document.getElementById("customer-select").value;
        const sellPrice = document.getElementById("sell-price").value;

        const article = articles.find(a => a.name === articleName);
        const customer = customers.find(c => c.name === customerName);

        if (article && customer && sellQuantity <= article.quantity) {
            const profitLoss = sellPrice - article.cost;

            customer.transactions.push({
                name: article.name,
                quantity: sellQuantity,
                profitLoss: profitLoss * sellQuantity
            });

            customer.totalProfitLoss += profitLoss * sellQuantity;

            article.quantity -= sellQuantity;

            const li = document.createElement("li");
            li.textContent = `Sold ${sellQuantity} of ${article.name} to ${customer.name} for ₨${sellPrice * sellQuantity}`;
            salesList.appendChild(li);

            updateCustomerList();
            updateArticleList();

            // Animate sale
            gsap.fromTo(
                li,
                { opacity: 0, x: -100 },
                { opacity: 1, x: 0, duration: 0.6, ease: "back.out(1.7)" }
            );

            document.getElementById("total-profit-loss").textContent = `₨${totalProfitLoss += profitLoss * sellQuantity}`;
        }
    });
});

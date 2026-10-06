// ========================================
// My POS - app.js
// ========================================

let products = JSON.parse(localStorage.getItem("posProducts")) || [];

let cart = [];

let sales = JSON.parse(localStorage.getItem("posSales")) || [];

// ========================================
// Wallet Balances
// ========================================

let wallets =
    JSON.parse(localStorage.getItem("posWallets")) || {
        cash: 0,
        kpay: 0,
        wave: 0
    };

function saveWallets() {
    localStorage.setItem(
        "posWallets",
        JSON.stringify(wallets)
    );
}

// Save Products
function saveProducts() {
    localStorage.setItem("posProducts", JSON.stringify(products));
}


// Save Sales
function saveSales() {
    localStorage.setItem("posSales", JSON.stringify(sales));
}


// Money Format
function money(number) {
    return Number(number).toLocaleString() + " Ks";
}


// Page ပြောင်းရန်
function showPage(page) {

    document.querySelectorAll(".page").forEach(function(section) {
        section.classList.add("hidden");
    });

    document.getElementById(page).classList.remove("hidden");

    if (page === "pos") {
        displayProducts(products);
        displayCart();
    }

    if (page === "products") {
        displayManageProducts();
    }

    if (page === "reports") {
        updateReports();
    }
}


// ပစ္စည်းများပြရန်
function displayProducts(list) {

    const productList = document.getElementById("productList");

    productList.innerHTML = "";

    if (list.length === 0) {
        productList.innerHTML = "<p>ပစ္စည်းမရှိသေးပါ။</p>";
        return;
    }

    list.forEach(function(product) {

        const div = document.createElement("div");

        div.className = "product-card";

        div.innerHTML =
            "<strong>" + product.name + "</strong>" +
            "<br>ရောင်းဈေး - " + money(product.price) +
            "<br>Stock - " + product.stock;

        div.onclick = function() {
            addToCart(product.id);
        };

        productList.appendChild(div);
    });
}


// Search
function searchProduct() {

    const keyword = document
        .getElementById("search")
        .value
        .toLowerCase();

    const result = products.filter(function(product) {

        return product.name
            .toLowerCase()
            .includes(keyword);

    });

    displayProducts(result);
}


// Cart ထည့်ရန်
function addToCart(id) {

    const product = products.find(function(p) {
        return p.id === id;
    });

    if (!product) return;

    if (product.stock <= 0) {
        alert("Stock မရှိတော့ပါ။");
        return;
    }

    const existing = cart.find(function(item) {
        return item.id === id;
    });

    if (existing) {

        if (existing.qty >= product.stock) {
            alert("Stock မလုံလောက်ပါ။");
            return;
        }

        existing.qty++;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            buyPrice: product.buyPrice,
            qty: 1
        });
    }

    displayCart();
}


// Cart ပြရန်
function displayCart() {

    const cartList = document.getElementById("cartList");

    cartList.innerHTML = "";

    cart.forEach(function(item) {

        const div = document.createElement("div");

        div.className = "cart-item";

        div.innerHTML =
            "<span>" +
            item.name +
            " x " +
            item.qty +
            "</span>" +

            "<span>" +
            money(item.price * item.qty) +
            "</span>" +

            "<button onclick=\"changeQty(" +
            item.id +
            ", -1)\">−</button>" +

            "<button onclick=\"changeQty(" +
            item.id +
            ", 1)\">+</button>" +

            "<button onclick=\"removeFromCart(" +
            item.id +
            ")\">❌</button>";

        cartList.appendChild(div);
    });

    updateTotal();
}


// Quantity ပြောင်းရန်
function changeQty(id, amount) {

    const item = cart.find(function(i) {
        return i.id === id;
    });

    const product = products.find(function(p) {
        return p.id === id;
    });

    if (!item || !product) return;

    item.qty += amount;

    if (item.qty <= 0) {
        removeFromCart(id);
        return;
    }

    if (item.qty > product.stock) {
        item.qty = product.stock;
        alert("Stock မလုံလောက်ပါ။");
    }

    displayCart();
}


// Cart ဖျက်ရန်
function removeFromCart(id) {

    cart = cart.filter(function(item) {
        return item.id !== id;
    });

    displayCart();
}


// Total
function updateTotal() {

    let total = 0;

    cart.forEach(function(item) {
        total += item.price * item.qty;
    });

    document.getElementById("total").textContent =
        money(total);
}


// ========================================
// ပစ္စည်းအသစ်ထည့်ရန်
// ========================================

function addProduct() {

    const name =
        document.getElementById("productName").value.trim();

    const buyPrice =
        Number(document.getElementById("productBuyPrice").value);

    const price =
        Number(document.getElementById("productPrice").value);

    const stock =
        Number(document.getElementById("productStock").value);

    if (!name) {
        alert("ပစ္စည်းအမည်ထည့်ပါ။");
        return;
    }

    if (buyPrice < 0 || price < 0 || stock < 0) {
        alert("ဈေးနှုန်းနှင့် Stock ကို မှန်ကန်စွာထည့်ပါ။");
        return;
    }

    const product = {

        id: Date.now(),

        name: name,

        buyPrice: buyPrice,

        price: price,

        stock: stock
    };

    products.push(product);

    saveProducts();

    document.getElementById("productName").value = "";

    document.getElementById("productBuyPrice").value = "";

    document.getElementById("productPrice").value = "";

    document.getElementById("productStock").value = "";

    displayManageProducts();

    alert("ပစ္စည်းထည့်ပြီးပါပြီ။");
}


// ========================================
// ပစ္စည်းစာရင်း
// ========================================

function displayManageProducts() {

    const box =
        document.getElementById("manageProducts");

    box.innerHTML = "";

    products.forEach(function(product) {

        const profit =
            product.price - product.buyPrice;

        const div = document.createElement("div");

        div.className = "cart-item";

        let stockText = "Stock - " + product.stock;

        if (product.stock <= 5) {
            stockText += " ⚠️ Stock နည်းနေပြီ";
        }

        div.innerHTML =

            "<div>" +

            "<strong>" +
            product.name +
            "</strong><br>" +

            "ဝယ်ဈေး - " +
            money(product.buyPrice) +
            "<br>" +

            "ရောင်းဈေး - " +
            money(product.price) +
            "<br>" +

            "တစ်ခုအမြတ် - " +
            money(profit) +
            "<br>" +

            stockText +

            "</div>" +

            "<div>" +

            "<button onclick=\"editProduct(" +
            product.id +
            ")\">✏️ Edit</button> " +

            "<button onclick=\"deleteProduct(" +
            product.id +
            ")\">🗑️ ဖျက်</button>" +

            "</div>";

        box.appendChild(div);
    });
}


// Product ဖျက်ရန်
function deleteProduct(id) {

    const ok =
        confirm("ဒီပစ္စည်းကို ဖျက်မလား?");

    if (!ok) return;

    products = products.filter(function(product) {
        return product.id !== id;
    });

    saveProducts();

    displayManageProducts();
}

function editProduct(id) {

    const product =
        products.find(function(p) {
            return p.id === id;
        });

    if (!product) return;

    const newName =
        prompt("ပစ္စည်းအမည်", product.name);

    if (newName === null) return;

    const newBuyPrice =
        prompt("ဝယ်ဈေး", product.buyPrice);

    if (newBuyPrice === null) return;

    const newPrice =
        prompt("ရောင်းဈေး", product.price);

    if (newPrice === null) return;

    const newStock =
        prompt("Stock အရေအတွက်", product.stock);

    if (newStock === null) return;

    product.name = newName.trim();

    product.buyPrice = Number(newBuyPrice);

    product.price = Number(newPrice);

    product.stock = Number(newStock);

    saveProducts();

    displayManageProducts();

    displayProducts(products);

    alert("ပစ္စည်းအချက်အလက် ပြင်ပြီးပါပြီ။");
}


// ========================================
// ရောင်းမည်
// ========================================

function checkout() {

    if (cart.length === 0) {
        alert("ရောင်းရန်ပစ္စည်းမရှိသေးပါ။");
        return;
    }

    const wallet =
        document.getElementById("saleWallet").value;

    let total = 0;
    let profit = 0;

    cart.forEach(function(item) {

        const product =
            products.find(function(p) {
                return p.id === item.id;
            });

        if (!product) return;

        product.stock -= item.qty;

        total +=
            item.price * item.qty;

        profit +=
            (item.price - item.buyPrice) * item.qty;
    });

    // ရောင်းငွေကို ရွေးထားတဲ့ Wallet ထဲ ပေါင်း
    wallets[wallet] += total;

    const sale = {

        id: Date.now(),

        date: new Date().toISOString(),

        items: cart,

        total: total,

        profit: profit,

        wallet: wallet
    };

    sales.push(sale);

    saveProducts();
    saveSales();
    saveWallets();

    cart = [];

    displayCart();
    displayProducts(products);
    displayWallets();
    updateReports();

    alert(
        "ရောင်းချမှုအောင်မြင်ပါပြီ။\n" +
        "ရောင်းအား - " +
        money(total) +
        "\n" +
        "အမြတ် - " +
        money(profit) +
        "\n" +
        "ငွေလက်ခံ - " +
        wallet
    );
}


// ========================================
// Reports
// ========================================

function updateReports() {

    const today =
        new Date().toDateString();

    let todaySales = 0;
    let todayProfit = 0;
    let todayOrders = 0;


    sales.forEach(function(sale) {

        const saleDate =
            new Date(sale.date).toDateString();

        if (saleDate === today) {

            todaySales += sale.total;

            todayProfit += sale.profit;

            todayOrders++;
        }
    });


    document.getElementById("todaySales").textContent =
        money(todaySales);

    document.getElementById("todayProfit").textContent =
        money(todayProfit);

    document.getElementById("todayOrders").textContent =
        todayOrders;
}


// ========================================
// Start App
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        displayProducts(products);

        displayCart();

        displayManageProducts();

        updateReports();

      displaySalesHistory();

      displayExpenses();

      displayWallets();
      
    }
);

function displaySalesHistory() {

    const box =
        document.getElementById("salesHistory");

    if (!box) return;

    box.innerHTML = "";

    if (sales.length === 0) {

        box.innerHTML =
            "<p>ရောင်းထားတဲ့စာရင်း မရှိသေးပါ။</p>";

        return;
    }

    const reversedSales =
        [...sales].reverse();

    reversedSales.forEach(function(sale) {

        const div =
            document.createElement("div");

        div.className = "cart-item";

        let itemsText = "";

        sale.items.forEach(function(item) {

            itemsText +=
                item.name +
                " x " +
                item.qty +
                "<br>";
        });

        const date =
            new Date(sale.date);

        div.innerHTML =

            "<div>" +

            "<strong>🧾 ရောင်းမှတ်တမ်း</strong><br>" +

            "🕐 " +
            date.toLocaleString() +
            "<br><br>" +

            itemsText +

            "<br>" +

            "💰 ရောင်းငွေ - " +
            money(sale.total) +
            "<br>" +

            "📈 အမြတ် - " +
            money(sale.profit) +

            "</div>";

        box.appendChild(div);
    });
}

// ========================================
// Sales Filter
// ========================================

function showTodaySales() {

    const today = new Date();

    const todayString =
        today.toDateString();

    const result =
        sales.filter(function(sale) {

            return new Date(sale.date)
                .toDateString() === todayString;

        });

    displayFilteredSales(result);
}


function showMonthSales() {

    const now = new Date();

    const currentYear =
        now.getFullYear();

    const currentMonth =
        now.getMonth();

    const filtered =
        sales.filter(function(sale) {

            const date =
                new Date(sale.date);

            return (
                date.getFullYear() === currentYear &&
                date.getMonth() === currentMonth
            );
        });

    displayFilteredSales(filtered);
}


function showAllSales() {

    displayFilteredSales(sales);
}


// Filtered Sales ပြရန်
function displayFilteredSales(list) {

    const box =
        document.getElementById("salesFilterResult");

    if (!box) return;

    box.innerHTML = "";

    if (list.length === 0) {

        box.innerHTML =
            "<p>ဒီအချိန်အတွက် ရောင်းထားတဲ့စာရင်း မရှိသေးပါ။</p>";

        return;
    }

    let totalSales = 0;
    let totalProfit = 0;

    const reversed = [...list].reverse();

    reversed.forEach(function(sale) {

        totalSales += sale.total;
        totalProfit += sale.profit;

        const originalIndex =
            sales.indexOf(sale);

        const div =
            document.createElement("div");

        div.className = "cart-item";

        let itemsText = "";

        sale.items.forEach(function(item) {

            itemsText +=
                item.name +
                " × " +
                item.qty +
                "<br>";
        });

        const date =
            new Date(sale.date);

        div.innerHTML =

            "<div>" +

            "<strong>🧾 ရောင်းမှတ်တမ်း</strong><br>" +

            "🕐 " +
            date.toLocaleString() +

            "<br><br>" +

            itemsText +

            "<br>" +

            "💰 ရောင်းငွေ - " +
            money(sale.total) +

            "<br>" +

            "📈 အမြတ် - " +
            money(sale.profit) +

            "</div>" +

            "<div>" +

            "<button onclick=\"deleteSale(" +
            originalIndex +
            ")\">🗑️ ဖျက်</button>" +

          "<button onclick=\"editSale(" +
originalIndex +
")\">✏️ ပြင်</button> " +

"<button onclick=\"deleteSale(" +
originalIndex +
")\">🗑️ ဖျက်</button>" +

            "</div>";

        box.appendChild(div);
    });

    const summary =
        document.createElement("div");

    summary.className = "total-box";

    summary.innerHTML =

        "စုစုပေါင်းရောင်းငွေ " +
        "<strong>" +
        money(totalSales) +
        "</strong>" +

        "<br>" +

        "စုစုပေါင်းအမြတ် " +
        "<strong>" +
        money(totalProfit) +
        "</strong>";

    box.prepend(summary);
}

// ========================================
// Delete Sale
// ========================================

function deleteSale(index) {

    const sale = sales[index];

    if (!sale) return;

    const confirmDelete =
        confirm("ဒီရောင်းမှတ်တမ်းကို ဖျက်မှာ သေချာပါသလား?");

    if (!confirmDelete) return;

    // Stock ပြန်တိုး
    sale.items.forEach(function(item) {

        const product =
            products.find(function(p) {
                return p.id === item.id;
            });

        if (product) {
            product.stock += item.qty;
        }
    });

    // ရောင်းငွေကို Wallet ထဲက ပြန်နုတ်
    if (
        sale.wallet &&
        wallets[sale.wallet] !== undefined
    ) {
        wallets[sale.wallet] -= sale.total;
    }

    // Sales ထဲက ဖျက်
    sales.splice(index, 1);

    saveProducts();
    saveSales();
    saveWallets();

    displayManageProducts();
    displayProducts(products);
    displayWallets();

    updateReports();
    showTodaySales();

    alert("ရောင်းမှတ်တမ်း ဖျက်ပြီးပါပြီ။");
}

// ========================================
// Edit Sale
// ========================================

function editSale(index) {

    const sale = sales[index];

    if (!sale) return;

    const item = sale.items[0];

    if (!item) return;

    const oldProduct =
        products.find(function(p) {
            return p.id === item.id;
        });

    if (!oldProduct) {
        alert("ပစ္စည်းကို ရှာမတွေ့ပါ။");
        return;
    }

    // ပစ္စည်းရွေးရန်
    let productText = "";

    products.forEach(function(product, i) {

        productText +=
            (i + 1) +
            ". " +
            product.name +
            " (Stock " +
            product.stock +
            ")\n";
    });

    const newProductNumber =
        prompt(
            "ပစ္စည်းရွေးပါ\n\n" +
            productText +
            "\nလက်ရှိ - " +
            oldProduct.name +
            "\n\nနံပါတ်ထည့်ပါ",
            products.indexOf(oldProduct) + 1
        );

    if (newProductNumber === null) return;

    const productIndex =
        Number(newProductNumber) - 1;

    if (
        productIndex < 0 ||
        productIndex >= products.length ||
        !Number.isInteger(productIndex)
    ) {
        alert("ပစ္စည်းနံပါတ် မှန်ကန်စွာထည့်ပါ။");
        return;
    }

    const newProduct =
        products[productIndex];

    // အရေအတွက်ပြင်ရန်
    const newQty =
        prompt(
            "အရေအတွက် ပြင်ရန်",
            item.qty
        );

    if (newQty === null) return;

    const qty = Number(newQty);

    if (qty <= 0 || !Number.isInteger(qty)) {
        alert("အရေအတွက် မှန်ကန်စွာထည့်ပါ။");
        return;
    }

    // မူလ Stock ပြန်တိုး
    sale.items.forEach(function(oldItem) {

        const product =
            products.find(function(p) {
                return p.id === oldItem.id;
            });

        if (product) {
            product.stock += oldItem.qty;
        }
    });

    // Stock စစ်
    if (newProduct.stock < qty) {

        // မူလ Stock ပြန်ထား
        sale.items.forEach(function(oldItem) {

            const product =
                products.find(function(p) {
                    return p.id === oldItem.id;
                });

            if (product) {
                product.stock -= oldItem.qty;
            }
        });

        alert("Stock မလုံလောက်ပါ။");
        return;
    }

    // Wallet စစ်
    const oldTotal = sale.total;

    const newTotal =
        newProduct.price * qty;

    const wallet =
        sale.wallet;

    if (
        wallet &&
        wallets[wallet] !== undefined
    ) {

        const newBalance =
            wallets[wallet] -
            oldTotal +
            newTotal;

        if (newBalance < 0) {

            // Stock ပြန်ထား
            sale.items.forEach(function(oldItem) {

                const product =
                    products.find(function(p) {
                        return p.id === oldItem.id;
                    });

                if (product) {
                    product.stock -= oldItem.qty;
                }
            });

            alert(
                "Wallet ထဲမှာ ငွေမလုံလောက်လို့ ပြင်လို့မရပါ။"
            );

            return;
        }

        wallets[wallet] = newBalance;
    }

    // အသစ်ရွေးထားတဲ့ Stock လျော့
    newProduct.stock -= qty;

    // Sale Item ပြောင်း
    item.id =
        newProduct.id;

    item.name =
        newProduct.name;

    item.buyPrice =
        newProduct.buyPrice;

    item.price =
        newProduct.price;

    item.qty =
        qty;

    // Total ပြန်တွက်
    sale.total =
        newTotal;

    sale.profit =
        (item.price - item.buyPrice) * qty;

    saveProducts();
    saveSales();
    saveWallets();

    displayManageProducts();
    displayProducts(products);
    displayWallets();

    updateReports();
    showTodaySales();

    alert("ရောင်းမှတ်တမ်းနဲ့ Wallet ကို ပြင်ပြီးပါပြီ။");
}


// ========================================
// Expenses
// ========================================

let expenses =
    JSON.parse(localStorage.getItem("posExpenses")) || [];

function saveExpenses() {
    localStorage.setItem(
        "posExpenses",
        JSON.stringify(expenses)
    );
}

function addExpense() {

    const name =
        document.getElementById("expenseName").value.trim();

    const amount =
        Number(
            document.getElementById("expenseAmount").value
        );

    const wallet =
        document.getElementById("expenseWallet").value;

    if (!name || amount <= 0) {
        alert("အသုံးစရိတ်အမည်နဲ့ ငွေပမာဏ မှန်ကန်စွာထည့်ပါ။");
        return;
    }

    // Wallet ထဲမှာ ငွေလုံလောက်မှု စစ်
    if (wallets[wallet] < amount) {
        alert("ဒီ Wallet ထဲမှာ ငွေမလုံလောက်ပါ။");
        return;
    }

    // Wallet လက်ကျန် နုတ်
    wallets[wallet] -= amount;

    expenses.push({
        id: Date.now(),
        name: name,
        amount: amount,
        wallet: wallet,
        date: new Date().toISOString()
    });

    saveWallets();
    saveExpenses();

    document.getElementById("expenseName").value = "";
    document.getElementById("expenseAmount").value = "";

    displayExpenses();
    displayWallets();

    alert("အသုံးစရိတ် မှတ်ထားပြီးပါပြီ။");
}
function displayExpenses() {

    const box =
        document.getElementById("expenseList");

    if (!box) return;

    box.innerHTML = "";

    expenses
        .slice()
        .reverse()
        .forEach(function(expense) {

            const originalIndex =
                expenses.indexOf(expense);

            const div =
                document.createElement("div");

            div.className = "cart-item";

            div.innerHTML =
                "<strong>💸 " +
                expense.name +
                "</strong><br>" +

                "💰 " +
                money(expense.amount) +
                "<br>" +

                "💳 " +
                expense.wallet +
                "<br>" +

                "🕐 " +
                new Date(expense.date).toLocaleString() +

                "<br><br>" +

                "<button onclick=\"editExpense(" +
                originalIndex +
                ")\">✏️ ပြင်</button> " +

                "<button onclick=\"deleteExpense(" +
                originalIndex +
                ")\">🗑️ ဖျက်</button>";

            box.appendChild(div);
        });
}

// ========================================
// Edit Expense
// ========================================

function editExpense(index) {

    const expense = expenses[index];

    if (!expense) return;

    const newName =
        prompt(
            "အသုံးစရိတ်အမည်",
            expense.name
        );

    if (newName === null) return;

    const newAmount =
        prompt(
            "ငွေပမာဏ",
            expense.amount
        );

    if (newAmount === null) return;

    const amount = Number(newAmount);

    if (
        !newName.trim() ||
        amount <= 0 ||
        !Number.isFinite(amount)
    ) {
        alert("အချက်အလက် မှန်ကန်စွာထည့်ပါ။");
        return;
    }

    const newWallet =
        prompt(
            "Wallet ရွေးပါ\n\n" +
            "cash = Cash\n" +
            "kpay = KPay\n" +
            "wave = Wave\n\n" +
            "လက်ရှိ - " +
            expense.wallet,
            expense.wallet
        );

    if (newWallet === null) return;

    if (
        newWallet !== "cash" &&
        newWallet !== "kpay" &&
        newWallet !== "wave"
    ) {
        alert("Wallet ကို cash / kpay / wave ထဲမှ ရွေးပါ။");
        return;
    }

    const oldAmount = expense.amount;
    const oldWallet = expense.wallet;

    // မူလအသုံးစရိတ်ငွေကို Wallet ထဲ ပြန်ထည့်
    wallets[oldWallet] += oldAmount;

    // အသစ်နုတ်မယ့်ငွေ စစ်
    if (wallets[newWallet] < amount) {

        // မူလအခြေအနေ ပြန်ထား
        wallets[oldWallet] -= oldAmount;

        alert("ဒီ Wallet ထဲမှာ ငွေမလုံလောက်ပါ။");
        return;
    }

    // အသစ်ရွေးထားတဲ့ Wallet ထဲက နုတ်
    wallets[newWallet] -= amount;

    // Expense ပြင်
    expense.name = newName.trim();
    expense.amount = amount;
    expense.wallet = newWallet;

    saveWallets();
    saveExpenses();

    displayExpenses();
    displayWallets();

    alert("အသုံးစရိတ်ကို ပြင်ပြီးပါပြီ။");
}


// ========================================
// Delete Expense
// ========================================

function deleteExpense(index) {

    const expense = expenses[index];

    if (!expense) return;

    const confirmDelete =
        confirm(
            "ဒီအသုံးစရိတ်မှတ်တမ်းကို ဖျက်မှာ သေချာပါသလား?"
        );

    if (!confirmDelete) return;

    // အသုံးစရိတ်နုတ်ထားတဲ့ငွေကို Wallet ထဲ ပြန်ထည့်
    wallets[expense.wallet] += expense.amount;

    // Expense ဖျက်
    expenses.splice(index, 1);

    saveWallets();
    saveExpenses();

    displayExpenses();
    displayWallets();

    alert("အသုံးစရိတ်ကို ဖျက်ပြီးပါပြီ။");
}

// ========================================
// Display Wallet Balances
// ========================================

function displayWallets() {

    const cashBox =
        document.getElementById("cashBalance");

    const kpayBox =
        document.getElementById("kpayBalance");

    const waveBox =
        document.getElementById("waveBalance");

    const openingCashBox =
        document.getElementById("openingCashBalance");

    const openingKpayBox =
        document.getElementById("openingKpayBalance");

    const openingWaveBox =
        document.getElementById("openingWaveBalance");


    if (cashBox) {
        cashBox.textContent =
            money(wallets.cash);
    }

    if (kpayBox) {
        kpayBox.textContent =
            money(wallets.kpay);
    }

    if (waveBox) {
        waveBox.textContent =
            money(wallets.wave);
    }


    if (openingCashBox) {
        openingCashBox.textContent =
            money(wallets.cash);
    }

    if (openingKpayBox) {
        openingKpayBox.textContent =
            money(wallets.kpay);
    }

    if (openingWaveBox) {
        openingWaveBox.textContent =
            money(wallets.wave);
    }
}

function addOpeningBalance() {

    const wallet =
        document.getElementById("openingWallet").value;

    const amount =
        Number(
            document.getElementById("openingAmount").value
        );

    if (amount <= 0) {
        alert("ငွေပမာဏ မှန်ကန်စွာထည့်ပါ။");
        return;
    }

    wallets[wallet] += amount;

    saveWallets();
    displayWallets();

    document.getElementById("openingAmount").value = "";

    alert("လက်ကျန်ထည့်ပြီးပါပြီ။");
}

function editWalletBalances() {

    const cash =
        prompt(
            "Cash လက်ကျန်",
            wallets.cash
        );

    if (cash === null) return;

    const kpay =
        prompt(
            "KPay လက်ကျန်",
            wallets.kpay
        );

    if (kpay === null) return;

    const wave =
        prompt(
            "Wave လက်ကျန်",
            wallets.wave
        );

    if (wave === null) return;

    const newCash = Number(cash);
    const newKpay = Number(kpay);
    const newWave = Number(wave);

    if (
        newCash < 0 ||
        newKpay < 0 ||
        newWave < 0 ||
        !Number.isFinite(newCash) ||
        !Number.isFinite(newKpay) ||
        !Number.isFinite(newWave)
    ) {
        alert("လက်ကျန်ငွေကို မှန်ကန်စွာထည့်ပါ။");
        return;
    }

    wallets.cash = newCash;
    wallets.kpay = newKpay;
    wallets.wave = newWave;

    saveWallets();
    displayWallets();

    alert("လက်ကျန်ငွေ ပြင်ပြီးပါပြီ။");
}
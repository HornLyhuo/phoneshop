const cart = document.getElementById("cart");
const accessoriesGrid = document.getElementById("accessories");
const categoriesGrid = document.getElementById("categories-grid")
const reviewGrid = document.getElementById("review");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");

const cartCount = document.getElementById("cart-count");
const cartOverlay = document.getElementById("cart-overlay");
const cartPanel = document.getElementById("cart-panel");
const cartItemsBox = document.getElementById("cart-items");
const cartBtn = document.getElementById("cart-btn");
const cartTitleCount = document.getElementById("cart-title-count");
const cartTotal = document.getElementById("cart-total");

let cartItems = [];
let allProducts = [];

//rander stars
function randerStars (rating) { 
    let html = "";
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) html += '<i class="fa-solid fa-star"></i>';
        else if (rating >= i - 0.5) html += '<i class="fa-solid fa-star-half-stroke"></i>';
        else html += '<i class="fa-regular fa-star"></i>';  
    }
    return html;
}


//Products
function createCart(p) {
    return `
        <div data-id="${p.id}" class="cursor-pointer bg-white border rounded-xl overflow-hidden group hover:shadow-xl transition">

            <div class="relative bg-gray-100 p-5">
                <span class="absolute top-4 left-4 ${p.badge.color} text-white text-xs px-3 py-1 rounded-full">
                    ${p.badge.text}
                </span>

                <button aria-label="Add to wishlist" class="absolute top-4 right-4 bg-white rounded-full w-9 h-9 shadow">
                    <i class="fa-regular fa-heart"></i>
                </button>
                <img src="${p.image}" alt="${p.name}"
                    class="w-full h-52 object-contain group-hover:scale-105 transition"
                 >
            </div>
            <div class="p-5">
                <p class="text-xs text-gray-500">${p.brand}</p>

                <h3 class="font-bold text-lg mt-1">${p.name}</h3>

                <div class="flex items-center gap-1 text-yellow-400 text-sm mt-2">
                    ${randerStars(p.rating)}
                    <span class="text-gray-400 ml-1">${p.reviews}</span>
                </div>

                <p class="text-sm text-gray-500 mt-3">${p.storage} / ${p.color}</p>

                <div>
                    <span class="text-xl font-bold text-blue-600">
                        $${p.price.toLocaleString()}

                        ${p.oldPrice ? `<span class="text-sm text-gray-400 line-through">
                        $${p.oldPrice.toLocaleString()} </span>` : ""}
                    </span>
                    
                </div>
                <p class="${p.stock > 5 ? "text-green-500" : p.stock <= 5 && p.stock > 0 ? "text-amber-500" : "text-red-500"} text-sm mt-2">
                    <i class="fa-solid ${p.stock > 5 ? "fa-circle-check" : p.stock <= 5 && p.stock > 0 ? "fa-triangle-exclamation" : "fa-circle-xmark"}"></i>
                    ${p.stock > 5 ? "Instock" : p.stock >= 5 && p.stock > 0 ? "Low Stock" : "Out of Stock"}
                </p>
                <button onclick="addToCart(${p.id})" ${p.stock < 1 ? "disabled" : ""}
                    class="w-full text-white py-3 rounded-lg mt-4 ${p.stock < 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}">
                    ${p.stock < 1 ? "Out of Stock" : "Add to Cart"}
                </button>
            </div>
        </div>
    `;
}
async function loadProducts () {
    try {
        const res = await fetch("http://localhost:3000/products");
        if (!res.ok) throw new Error("HTTP error" + res.status);
        const products = await res.json();
        allProducts = products;
        cart.innerHTML = products.map(p => createCart(p)).join("");
    }catch (error) {
        console.error("Failed to load products: ", error);
        cart.innerHTML = "<p class='text-red-500'>Could not load products.</p>";
    }
}


//Accessories 
function accessories (a) {
    return `
        <div class="border rounded-xl p-5 hover:shadow-lg transition">
            <img src="${a.image}" alt="${a.name}" class="w-full h-40 object-contain">
            <h3 class="font-bold mt-4">${a.name}</h3>
            <p class="text-blue-600 font-bold mt-2">
                $${a.price.toLocaleString()}
            </p>
        </div>
    `;
}


async function loadAccessories() {
    try {
        const response = await fetch("http://localhost:3000/accessories");
        if (!response.ok) throw new Error("HTTP error " + response.status);
        const data = await response.json();
        accessoriesGrid.innerHTML = data.map(a => accessories(a)).join("");
    } catch (error) {
        console.error("Failed to load accessories: ", error);
        accessoriesGrid.innerHTML = "<p class='text-red-500'>Could not load accessories.</p>";
    }
}



//categories
async function loadCategories () {
    try {
        const resCategories = await fetch("http://localhost:3000/categories");
        if (!resCategories.ok) throw new Error("HTTP error " + resCategories.status);
        const categoriesData = await resCategories.json();
        categoriesGrid.innerHTML = categoriesData.map(c  => {
            return `
                <a href="#products" class="bg-white border rounded-xl p-6 text-center hover:shadow-lg hover:border-blue-600 transition">
                    <i class="${c.icon} text-5xl ${c.color}"></i>
                    <h3 class="font-bold mt-4">${c.name}</h3>
                    <p class="text-xs text-gray-500 mt-1">${c.series}</p>
                </a>
            `;
        }).join("");
    } catch (error) {
        console.error("Failed to load categories data: ", error);
        categoriesGrid.innerHTML = "<p class='text-red-500'>Could not load categoris.</p>";
    }
}


//reviews
async function loadReviews() {
    try {
        const resReview = await fetch("http://localhost:3000/customerReviews");
        if(!resReview.ok) throw new Error("HTTP error " + resReview.status);
        const reviewData = await resReview.json();
        reviewGrid.innerHTML = reviewData.map (r => {
            return `
                <div class="bg-white border rounded-xl p-7">
                    <div class="text-yellow-400 mb-4">
                        ${randerStars(r.rating)}
                    </div>

                    <p class="text-gray-600 leading-7">
                        "${r.text}"
                    </p>

                    <div class="flex items-center gap-3 mt-6">
                        <img src="${r.avatar}" class="w-12 h-12 rounded-full">
                        <div>
                            <h3 class="font-bold ">${r.name}</h3>
                            <p class="text-sm text-gray-500">
                                Verified Customer
                            </p>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    }catch (error) {
        console.error("Failed to load reviews: ", error);
    }
}

 
//function closeDetail
function closeDetail() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
}



function showDetail(p) {
    selectedProduct = p;
    modalContent.innerHTML = `
        <button onclick="closeDetail()" class="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 rounded-full w-9 h-9">
            <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">

            <!-- LEFT: image -->
            <div class="flex gap-4 h-full justify-center items-center flex-col">
                <div class="relative bg-gray-100 rounded-xl p-6 w-full flex items-center justify-center h-80">
                    <span class="absolute top-7 left-7 ${p.badge.color} text-white text-xs px-3 py-1 rounded-full">
                        ${p.badge.text}
                    </span>
                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-contain">
                </div>
            </div>

            <!-- RIGHT: info -->
            <div>
                <p class="text-sm text-blue-600 font-semibold">${p.brand} · Smartphones</p>
                <h2 class="text-3xl font-bold mt-1">${p.name}</h2>

                <div class="flex items-center gap-2 text-yellow-400 text-sm mt-3">
                    <span>${randerStars(p.rating)}</span>
                    <span class="text-gray-500">${p.rating} · ${p.reviews} reviews</span>
                </div>

                <!-- Price box -->
                <div class="bg-gray-50 border rounded-xl p-4 mt-5">
                    <div class="flex items-end gap-3">
                        <span class="text-4xl font-bold text-blue-600">$${p.price.toLocaleString()}</span>
                        ${p.oldPrice ? `<span class="text-gray-400 line-through mb-1">$${p.oldPrice.toLocaleString()}</span>` : ""}
                    </div>
                    ${p.oldPrice ? `<p class="text-green-600 text-sm font-semibold mt-1">You save $${(p.oldPrice - p.price).toLocaleString()}</p>` : ""}
                </div>

                <!-- Description -->
                <p class="text-gray-600 text-sm leading-6 mt-5">${p.description}</p>

                <!-- Color options -->
                <div class="mt-5">
                    <p class="text-sm font-semibold">Color: <span class="font-normal text-gray-500">${p.color}</span></p>
                    <div class="flex gap-3 mt-2">
                        ${p.colors.map(c => `
                            <button title="${c.name}" style="background-color: ${c.hex}"
                                class="w-8 h-8 rounded-full border ${c.name === p.color ? "ring-2 ring-offset-2 ring-blue-600" : ""}">
                            </button>
                        `).join("")}
                    </div>
                </div>

                <!-- Storage options -->
                <div class="mt-5">
                    <p class="text-sm font-semibold">Storage</p>
                    <div class="flex flex-wrap gap-3 mt-2">
                        ${p.storages.map(s => `
                            <button class="rounded-lg px-4 py-2 text-sm ${s === p.storage ? "border-2 border-blue-600 text-blue-600" : "border hover:border-blue-600"}">
                                ${s}
                            </button>
                        `).join("")}
                    </div>
                </div>

                <!-- Stock -->
                <p class="${p.stock > 5 ? "text-green-500" : p.stock <= 5 && p.stock > 0 ? "text-amber-500" : "text-red-500"} text-sm mt-2">
                    <i class="fa-solid ${p.stock > 5 ? "fa-circle-check" : p.stock <= 5 && p.stock > 0 ? "fa-triangle-exclamation" : "fa-circle-xmark"}"></i>
                    ${p.stock > 5 ? "In Stock" : p.stock <= 5 && p.stock > 0 ? "Low Stock" : "Out of Stock"} · ${p.condition}
                </p>

                <!-- Quantity + buttons -->
                <div class="flex flex-wrap items-center gap-3 mt-5">
                    <div class="flex items-center border rounded-lg">
                        <button onclick="changeQty(-1)" class="px-4 py-3 hover:bg-gray-100">−</button>
                        <span id="qty" class="px-4">1</span>
                        <button onclick="changeQty(1)" class="px-4 py-3 hover:bg-gray-100">+</button>
                    </div>
                    <button onclick="addFormDetail()" class="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                        <i class="fa-solid fa-cart-plus mr-2"></i>
                        Add to Cart
                    </button>
                    <button class="border rounded-lg w-12 h-12 hover:bg-gray-100">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>

                <!-- Delivery / warranty -->
                <div class="grid grid-cols-3 gap-3 mt-6 text-center text-xs text-gray-600">
                    <div class="border rounded-lg p-3">
                        <i class="fa-solid fa-truck-fast text-blue-600 text-lg"></i>
                        <p class="mt-1">Free delivery</p>
                    </div>
                    <div class="border rounded-lg p-3">
                        <i class="fa-solid fa-shield-halved text-blue-600 text-lg"></i>
                        <p class="mt-1">1 year warranty</p>
                    </div>
                    <div class="border rounded-lg p-3">
                        <i class="fa-solid fa-rotate-left text-blue-600 text-lg"></i>
                        <p class="mt-1">7-day return</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
}



cart.addEventListener("click", (event) => {
    if (event.target.closest("button")) return;

    const card = event.target.closest("[data-id]");
    if (!card) return;

    const productId = Number(card.dataset.id);
    const product = allProducts.find(
        p => Number(p.id) === productId
    );


    if (!product) {
        console.error("Product not found!");
        return;
    }
    showDetail(product);
})

modal.addEventListener("click", (event) => {
    if(event.target === modal) closeDetail();
})

document.addEventListener("keydown", (event) => {
    if(event.key === "Escape") {
        closeDetail();
        closeCart();
    }
})


let selectedProduct = null;
function changeQty(change) {
    const qtyBox = document.getElementById("qty");
    const newQty = Number(qtyBox.textContent) + change;
    if (newQty >= 1) qty.textContent = newQty;

    if (newQty < 1) return;
    if (newQty > selectedProduct.stock) {
        alert("Only " + selectedProduct.stock + " left in stock!");
        return;
    }

    qty.textContent = newQty;

}

function openCart() {
    cartPanel.classList.remove("translate-x-full");
    cartOverlay.classList.remove("hidden");
}
function closeCart() {
    cartPanel.classList.add("translate-x-full");
    cartOverlay.classList.add("hidden");
}


// rander cart items
function renderCart() {
    let totalQty = 0;
    let totalPrice = 0;
    cartItems.forEach(item => {
        totalQty += item.qty;
        totalPrice += item.qty * item.price;
    })

    cartCount.textContent = totalQty;
    cartTitleCount.textContent = totalQty;
    cartTotal.textContent = "$" + totalPrice.toLocaleString();

    if (cartItems.length === 0) {
        cartItemsBox.innerHTML = `
            <div class="text-center text-gray-500 py-20">
            <i class="fa-solid fa-cart-shopping text-5xl mb-4"></i>
            <p>Your cart is empty</p>
        </div>
        `;
        return;
    }

    cartItemsBox.innerHTML = cartItems.map(item => `
        <div class="flex gap-3 justify-between items-center border-b py-4">
            <img src="${item.image}"
                alt="${item.name}"
                class="w-20 h-20 object-contain bg-gray-100 rounded-lg p-2"
            >
            <div class="flex items-center justify-between gap-3 flex-1">
                <div class="w-40">
                    <h3 class="font-semibold text-sm">${item.name}</h3>
                    <p class="text-xs text-gray-500">${item.storage} / ${item.color}</p>
                    <p class="text-blue-600 font-bold mt-1">$${(item.price * item.qty).toLocaleString()}</p>
                </div>

                <div class="flex items-center border rounded-lg w-fit mt-2">
                    <button onclick="changeCartQty(${item.id}, -1)" class="px-3 py-1 hover:bg-gray-100">-</button>
                    <span id="secondQty" class="px-3 text-sm">${item.qty}</span>
                    <button onclick="changeCartQty(${item.id}, 1)" class="px-3 py-1 hover:bg-gray-100">+</button>
                </div>
                <div>
                    <button onclick=removeFromCart(${item.id}) aria-label="Remove" class="text-gray-400 hover:text-red-500 self-start">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

// add to cart 
function addToCart(id, qty = 1) {
    id = Number(id);
    console.log("1. addToCart called, id =", id, "qty =", qty);

    const product = allProducts.find(p => Number(p.id) === id);
    if (!product) {
        console.error("2. Product NOT found. allProducts =", allProducts);
        return;
    }
    console.log("2. Product found:", product.name, "stock =", product.stock);

    if (product.stock < 1) {
        alert(product.name + " is out of stock!");
        return;
    }

    const existing = cartItems.find(item => Number(item.id) === id);
    const currentQty = existing ? existing.qty : 0;

    if (currentQty + qty > product.stock) {
        alert("Only " + product.stock + " left in stock!");
        return;
    }

    if (existing) {
        existing.qty += qty;
    } else {
        cartItems.push({
            id: product.id,
            name: product.name,
            image: product.image,
            storage: product.storage,
            price: product.price,
            qty: qty,
            color: product.color,
            stock: product.stock
        });
    }

    console.log("3. cartItems:", cartItems);
    renderCart();
    openCart();
}

cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openCart();
});

document.getElementById("cart-close").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

function addFormDetail () {
    const qty = Number(document.getElementById("qty").textContent);
    addToCart(selectedProduct.id, qty);
    closeDetail();
}

function changeCartQty(id, change) {
    const item = cartItems.find(i => Number(i.id) === id);
    if(!item) return; 

    const newQty = item.qty + change;
    if (newQty < 1) {
        return;
    }
    if (newQty > item.stock) {
        alert("Only" + item.stock + "left in stock!");
        return;
    }
    item.qty = newQty;
    renderCart();
}

function removeFromCart(id) {
    cartItems = cartItems.filter(item => item.id !== id);
    renderCart();
}


loadCategories();
loadAccessories();
loadProducts();
loadReviews();
renderCart();
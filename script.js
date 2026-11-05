
const products = [
    {
        id: 1,
        name: "তাজা আলু",
        category: "সবজি",
        price: 40,
        unit: "কেজি",
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "লাল টমেটো",
        category: "সবজি",
        price: 60,
        unit: "কেজি",
        image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "তাজা আপেল",
        category: "ফল",
        price: 220,
        unit: "কেজি",
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop"
    },
    {
        id: 4,
        name: "পাকা কলা",
        category: "ফল",
        price: 80,
        unit: "ডজন",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop"
    },
    {
        id: 5,
        name: "তাজা গাজর",
        category: "সবজি",
        price: 70,
        unit: "কেজি",
        image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=600&auto=format&fit=crop"
    },
    {
        id: 6,
        name: "কমলা",
        category: "ফল",
        price: 180,
        unit: "কেজি",
        image: "https://images.unsplash.com/photo-1547514701-42782101795e?w=600&auto=format&fit=crop"
    },
    {
        id: 7,
        name: "দুধ",
        category: "দুগ্ধজাত",
        price: 90,
        unit: "লিটার",
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop"
    },
    {
        id: 8,
        name: "মধু",
        category: "অন্যান্য",
        price: 350,
        unit: "বোতল",
        image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600&auto=format&fit=crop"
    }
];

// HERO SLIDER

const slides = [
    {
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1800&auto=format&fit=crop&q=85",
        number: "01 / 03"
    },
    {
        image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=1800&auto=format&fit=crop&q=85",
        number: "02 / 03"
    },
    {
        image: "download (2).jpg",
        number: "03 / 03"
    }
];

const hero = document.getElementById("hero");
const slideNumber = document.getElementById("slideNumber");

let currentSlide = 0;

function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    hero.style.backgroundImage =
        `linear-gradient(90deg, rgba(8,35,20,.82), rgba(8,35,20,.15)), url("${slides[currentSlide].image}")`;

    slideNumber.textContent = slides[currentSlide].number;
}

document.getElementById("nextSlide").addEventListener("click", () => {
    showSlide(currentSlide + 1);
});

document.getElementById("prevSlide").addEventListener("click", () => {
    showSlide(currentSlide - 1);
});

showSlide(0);

setInterval(() => {
    showSlide(currentSlide + 1);
}, 5000);


// PRODUCT DISPLAY

const productGrid = document.getElementById("productGrid");
const productTotal = document.getElementById("productTotal");
const searchInput = document.getElementById("searchInput");

let selectedCategory = "সব";
let cart = [];

function renderProducts() {
    const searchText = searchInput.value.toLowerCase().trim();

    const filteredProducts = products.filter(product => {
        const matchesCategory =
            selectedCategory === "সব" ||
            product.category === selectedCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText);

        return matchesCategory && matchesSearch;
    });

    productTotal.textContent = `${filteredProducts.length} টি পণ্য`;

    if (filteredProducts.length === 0) {
        productGrid.innerHTML =
            '<p class="no-products">কোনো পণ্য পাওয়া যায়নি।</p>';
        return;
    }

    productGrid.innerHTML = filteredProducts.map(product => `
        <article class="product-card">
            <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3>${product.name}</h3>
                <p class="product-price">
                    ৳ ${product.price} / ${product.unit}
                </p>
                <button class="add-button"
                    onclick="addToCart(${product.id})">
                    কার্টে যোগ করুন +
                </button>
            </div>
        </article>
    `).join("");
}

renderProducts();

searchInput.addEventListener("input", renderProducts);

document.getElementById("searchButton").addEventListener("click", renderProducts);


// CATEGORY FILTER

document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        selectedCategory = button.dataset.category;
        renderProducts();
    });
});

document.querySelectorAll(".category-card").forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;

        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.toggle(
                "active",
                btn.dataset.category === selectedCategory
            );
        });

        renderProducts();
        document.getElementById("products").scrollIntoView();
    });
});


// SHOPPING CART

function addToCart(id) {
    const product = products.find(item => item.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    renderCart();

    document.getElementById("cartDrawer").classList.add("open");
    document.getElementById("cartOverlay").classList.add("show");
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}

function changeQuantity(id, amount) {
    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        removeFromCart(id);
    } else {
        renderCart();
    }
}

function renderCart() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    const totalQuantity = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = totalPrice;

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">আপনার কার্ট এখন খালি।</p>';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong>
                <p>৳ ${item.price} × ${item.quantity}</p>
            </div>

            <div>
                <button onclick="changeQuantity(${item.id}, -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
                <button onclick="removeFromCart(${item.id})">✕</button>
            </div>
        </div>
    `).join("");
}


// CART DRAWER CONTROLS

function closeCart() {
    document.getElementById("cartDrawer").classList.remove("open");
    document.getElementById("cartOverlay").classList.remove("show");
}

document.getElementById("cartButton").addEventListener("click", () => {
    document.getElementById("cartDrawer").classList.add("open");
    document.getElementById("cartOverlay").classList.add("show");
});

document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("cartOverlay").addEventListener("click", closeCart);


// CHECKOUT DEMO

document.getElementById("checkoutButton").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("আপনার কার্টে কোনো পণ্য নেই!");
        return;
    }

    const message = cart.map(item =>
        `${item.name} x ${item.quantity} = ৳${item.price * item.quantity}`
    ).join("\n");

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    const orderMessage =
        `GasForing Order\n\n${message}\n\nমোট: ৳${total}`;

    const whatsappURL =
        `https://wa.me/01988940955?text=${encodeURIComponent(orderMessage)}`;

    window.open(whatsappURL, "_blank");
});


// MOBILE MENU

document.getElementById("menuToggle").addEventListener("click", () => {
    document.getElementById("navLinks").classList.toggle("open");
});

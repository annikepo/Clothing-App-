document.addEventListener("DOMContentLoaded", () => {
    console.log("App loaded successfully on localhost!");

    // Shopping Cart State
    let cart = [];
    let selectedProduct = null;
    let selectedSize = null;

    // DOM Elements
    const cartBtn = document.getElementById("cartBtn");
    const shopNavTrigger = document.getElementById("shopNavTrigger");
    const cartModal = document.getElementById("cartModal");
    const closeCart = document.getElementById("closeCart");
    const cartCount = document.getElementById("cartCount");
    const cartBody = document.getElementById("cartBody");
    const cartSubtotal = document.getElementById("cartSubtotal");
    const formTotalAmount = document.getElementById("formTotalAmount");

    // Product Detail Modal Elements
    const productDetailModal = document.getElementById("productDetailModal");
    const closeProdModal = document.getElementById("closeProdModal");
    const modalProdImg = document.getElementById("modalProdImg");
    const modalProdName = document.getElementById("modalProdName");
    const modalProdPrice = document.getElementById("modalProdPrice");
    const modalProdMeasurements = document.getElementById("modalProdMeasurements");
    const sizePillContainer = document.getElementById("sizePillContainer");
    const addToBagBtn = document.getElementById("addToBagBtn");

    // View Switcher Containers
    const modalHeading = document.getElementById("modalHeading");
    const basketView = document.getElementById("basketView");
    const checkoutFormView = document.getElementById("checkoutFormView");
    const orderSuccessView = document.getElementById("orderSuccessView");

    // Buttons & Form
    const proceedCheckoutBtn = document.getElementById("proceedCheckoutBtn");
    const backToBasketBtn = document.getElementById("backToBasketBtn");
    const checkoutForm = document.getElementById("checkoutForm");
    const finishOrderBtn = document.getElementById("finishOrderBtn");

    const productCards = document.querySelectorAll(".product-card");
    const tags = document.querySelectorAll(".filter-tags .tag");

    // 1. Open Product Detail & Size Picker Modal
    productCards.forEach((card) => {
        card.addEventListener("click", () => {
            const name = card.getAttribute("data-name");
            const price = parseFloat(card.getAttribute("data-price"));
            const sizes = card.getAttribute("data-sizes") ? card.getAttribute("data-sizes").split(",") : ["S", "M", "L"];
            const measurements = card.getAttribute("data-measurements") || "Standard fit.";
            const imgEl = card.querySelector("img");
            const imgSrc = imgEl ? imgEl.src : "";

            selectedProduct = { name, price, imgSrc };
            selectedSize = sizes[0];

            if (modalProdName) modalProdName.innerText = name;
            if (modalProdPrice) modalProdPrice.innerText = `$${price.toFixed(2)}`;
            if (modalProdImg) modalProdImg.src = imgSrc;
            if (modalProdMeasurements) modalProdMeasurements.innerText = measurements;

            if (sizePillContainer) {
                sizePillContainer.innerHTML = sizes.map((size, index) => `
                    <button class="size-pill ${index === 0 ? 'active' : ''}" 
                            data-size="${size}"
                            style="padding: 6px 14px; border-radius: 16px; border: 1px solid #ccc; background: ${index === 0 ? '#000' : '#fff'}; color: ${index === 0 ? '#fff' : '#000'}; font-weight: 700; font-size: 0.75rem; cursor: pointer;">
                        ${size}
                    </button>
                `).join("");

                const sizeBtns = sizePillContainer.querySelectorAll(".size-pill");
                sizeBtns.forEach(btn => {
                    btn.addEventListener("click", (e) => {
                        e.stopPropagation();
                        sizeBtns.forEach(b => {
                            b.style.background = "#fff";
                            b.style.color = "#000";
                        });
                        btn.style.background = "#000";
                        btn.style.color = "#fff";
                        selectedSize = btn.getAttribute("data-size");
                    });
                });
            }

            if (productDetailModal) productDetailModal.classList.add("active");
        });
    });

    if (closeProdModal) {
        closeProdModal.addEventListener("click", () => {
            if (productDetailModal) productDetailModal.classList.remove("active");
        });
    }

    if (addToBagBtn) {
        addToBagBtn.addEventListener("click", () => {
            if (selectedProduct) {
                cart.push({
                    name: selectedProduct.name,
                    price: selectedProduct.price,
                    size: selectedSize
                });
                updateCartUI();
                if (productDetailModal) productDetailModal.classList.remove("active");
                openCart();
            }
        });
    }

    // 2. Open Basket Drawer
    function openCart() {
        showBasketView();
        if (cartModal) cartModal.classList.add("active");
    }

    function closeCartDrawer() {
        if (cartModal) cartModal.classList.remove("active");
    }

    if (cartBtn) cartBtn.addEventListener("click", openCart);
    if (shopNavTrigger) shopNavTrigger.addEventListener("click", openCart);
    if (closeCart) closeCart.addEventListener("click", closeCartDrawer);

    if (cartModal) {
        cartModal.addEventListener("click", (e) => {
            if (e.target === cartModal) closeCartDrawer();
        });
    }

    // 3. View Switcher
    function showBasketView() {
        if (modalHeading) modalHeading.innerText = "YOUR BASKET";
        if (basketView) basketView.style.display = "block";
        if (checkoutFormView) checkoutFormView.style.display = "none";
        if (orderSuccessView) orderSuccessView.style.display = "none";
    }

    function showCheckoutView() {
        if (cart.length === 0) {
            alert("Your basket is empty! Add items from the shop first.");
            return;
        }
        if (modalHeading) modalHeading.innerText = "CHECKOUT";
        if (basketView) basketView.style.display = "none";
        if (checkoutFormView) checkoutFormView.style.display = "block";
        if (orderSuccessView) orderSuccessView.style.display = "none";
    }

    function showSuccessView() {
        if (modalHeading) modalHeading.innerText = "PURCHASE COMPLETE";
        if (basketView) basketView.style.display = "none";
        if (checkoutFormView) checkoutFormView.style.display = "none";
        if (orderSuccessView) orderSuccessView.style.display = "block";
    }

    if (proceedCheckoutBtn) proceedCheckoutBtn.addEventListener("click", showCheckoutView);
    if (backToBasketBtn) backToBasketBtn.addEventListener("click", showBasketView);

    // 4. Update Cart UI
    function updateCartUI() {
        if (cartCount) cartCount.innerText = cart.length;

        if (cart.length === 0) {
            if (cartBody) cartBody.innerHTML = `<p class="empty-msg">Your shopping bag is empty. Click any item to select size and add it!</p>`;
            if (cartSubtotal) cartSubtotal.innerText = "$0.00";
            if (formTotalAmount) formTotalAmount.innerText = "$0.00";
            return;
        }

        let total = 0;
        if (cartBody) {
            cartBody.innerHTML = cart.map((item) => {
                total += item.price;
                return `
                    <div class="cart-item-row" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                        <div>
                            <span style="font-weight: 700; display: block; font-size: 0.85rem;">${item.name}</span>
                            <span style="font-size: 0.72rem; color: #666;">Size: <strong>${item.size}</strong></span>
                        </div>
                        <strong style="font-size: 0.85rem;">$${item.price.toFixed(2)}</strong>
                    </div>
                `;
            }).join("");
        }

        if (cartSubtotal) cartSubtotal.innerText = `$${total.toFixed(2)}`;
        if (formTotalAmount) formTotalAmount.innerText = `$${total.toFixed(2)}`;
    }

    // 5. Form Submit Handler
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();
            showSuccessView();
            cart = [];
            updateCartUI();
        });
    }

    if (finishOrderBtn) {
        finishOrderBtn.addEventListener("click", () => {
            closeCartDrawer();
            showBasketView();
        });
    }

    // 6. Category Filter Handler
    tags.forEach((tag) => {
        tag.addEventListener("click", () => {
            tags.forEach((t) => t.classList.remove("active"));
            tag.classList.add("active");

            const selectedCategory = tag.getAttribute("data-category");

            productCards.forEach((card) => {
                const cardCategory = card.getAttribute("data-category");
                if (selectedCategory === "All" || cardCategory === selectedCategory) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
});
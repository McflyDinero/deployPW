document.addEventListener('DOMContentLoaded', () => {
    const cartToggle = document.getElementById('cartToggle');
    const closeCart = document.getElementById('closeCart');
    const cartDrawer = document.getElementById('cartDrawer');
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);

    const cartCounter = document.getElementById('cartCounter');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const toastNotification = document.getElementById('toastNotification');
    const checkoutBtn = document.getElementById('checkoutBtn');

    let cart = [];

    function toggleCart() {
        cartDrawer.classList.toggle('open');
        overlay.classList.toggle('active');
    }

    cartToggle.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    overlay.addEventListener('click', toggleCart);

    function showToast(message) {
        toastNotification.textContent = message;
        toastNotification.classList.add('show');
        setTimeout(() => {
            toastNotification.classList.remove('show');
        }, 2200);
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, quantity: 1 });
            }

            updateCartUI();
            showToast(`Añadido: ${name}`);
        });
    });

    function updateCartUI() {
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCounter.textContent = totalCount;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<div class="empty-cart-msg">El carrito está vacío.</div>`;
            cartTotalPrice.textContent = '$0.00';
            return;
        }

        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;

            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span>$${item.price.toFixed(2)} x ${item.quantity}</span>
                </div>
                <button class="remove-item" data-index="${index}">Eliminar</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotalPrice.textContent = `$${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

        document.querySelectorAll('.remove-item').forEach(removeBtn => {
            removeBtn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCartUI();
            });
        });
    }

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('El carrito está vacío.');
            return;
        }
        alert('Orden generada con éxito. Redirigiendo a pasarela de pago...');
        cart = [];
        updateCartUI();
        toggleCart();
    });
});
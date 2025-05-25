document.addEventListener('alpine:init', () => {
  Alpine.data('frequentlyBoughtTogether', () => ({
    openPopup() {
      Alpine.store('xPopup').open = true;
    },
    closePopup() {
      Alpine.store('xPopup').open = false;
    },
    addToCart(el) {
      const hasVariant = el.closest(".x-product-fbt-data").querySelector(".current-variant")?.value;
      const price = !hasVariant && JSON.parse(el.closest(".x-product-fbt-data").querySelector(".current-price").textContent);
      const productQuantity = el.closest(".x-product-fbt-data").querySelector(".quantity-input")?.value || 1;
      const productId = el.closest(".x-product-fbt-data").querySelector(".current-product-id").value;
      const variantId = hasVariant ? el.closest(".x-product-fbt-data").querySelector(".current-variant").value : null;
      const featured_image = el.closest(".x-product-fbt-data").querySelector(".current-featured-image")?.value;
      
      const formData = {
        items: [{
          id: variantId || productId,
          quantity: productQuantity,
          properties: {
            '_fbt': true,
            '_fbt_price': price
          }
        }]
      };

      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
        this.closePopup(el);
        Alpine.store('xMiniCart').openCart();
      })
      .catch(error => {
        console.error('Error:', error);
      });
    },
    init() {
      this.totalPrice = 0;
    }
  }));
}); 
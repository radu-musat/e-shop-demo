import CartStorageService from "../services/cart.service.js";
import PageFrame from "../web-components/page-frame.js";
import DrawService from "../services/draw.services.js";
import LoaderService from "../services/loader.service.js";

export default class CartPage {
    constructor() {
        this.loader = new LoaderService();
        this.cartService = new CartStorageService();
        this.cartItems = this.cartService.orderedProducts;

        this.container = document.querySelector('.cart__table');
        this.drawService  = new DrawService(this.container);

        this.init();
    }

   async init(){
        console.log(this.cartItems);
        customElements.define('rm-frame', PageFrame);

        //trebuie sa astepte sa deseneze tot pana se aduga evenimentele pe containerul butoanelor si butonul de purchase
        await this.drawService.draw('cart-page', this.cartItems);

        this.setItemsTotals();
        this.setTableItemsButtonClicks();
        this.setPurchaseConfirm();
    }

    setItemsTotals() {
        let totalPriceSpans = document.querySelectorAll('.cart__total-price span');
        let totalProductSpans = document.querySelectorAll('.cart__total-products span');

        let totalPrice = 10;
        let totalProducts = 0;

        for (let cartItem of this.cartItems) {
            let cartItemTotalPrice = cartItem.price * cartItem.orders;

            totalPrice += cartItemTotalPrice;
            totalProducts += cartItem.orders;
        }

        for (let priceSpan of totalPriceSpans) {
            priceSpan.textContent = totalPrice;
        }

        for (let productSpan of totalProductSpans) {
            productSpan.textContent = totalProducts;
        }
    }

    setTableItemsButtonClicks() {
        let cartTableItems = document.querySelectorAll('.cart__table-item');

        for (let cartTableItem of cartTableItems) {
            cartTableItem.addEventListener('click', (event) => {
                let id = cartTableItem.dataset.id;

                if (event.target.classList.contains('cart__table-item-increase')) {
                    for( let cartItem of this.cartItems ) {
                            if(cartItem.id === id && (cartItem.orders < (cartItem.stock + cartItem.orders))){
                                let subtotalTextContainer = cartTableItem.querySelector('.cart__table-item-subtotal');

                                cartItem.orders++;
                                cartItem.stock--;

                                event.target.nextElementSibling.textContent = cartItem.orders;
                                subtotalTextContainer.textContent = (cartItem.price * cartItem.orders) + ' lei';
                                this.setItemsTotals();

                                this.cartService.storeOrderedProducts();

                            }
                    }
                } else if (event.target.classList.contains('cart__table-item-decrease') ) {
                    for(let cartItem of this.cartItems) {
                            if(cartItem.id === id && cartItem.orders > 1 ) {
                                let subtotalTextContainer = cartTableItem.querySelector('.cart__table-item-subtotal');

                                cartItem.orders--;
                                cartItem.stock++;

                                event.target.previousElementSibling.textContent = cartItem.orders;
                                subtotalTextContainer.textContent = (cartItem.price * cartItem.orders) + ' lei';
                                this.setItemsTotals();

                                this.cartService.storeOrderedProducts();
                            }
                    }
                } else if (event.target.classList.contains('cart__table-item-delete')) {
                    for(let cartItem of this.cartItems) {
                        if(cartItem.id === id ) {
                            let deleteConfirm = confirm(`Esti sigur ca vrei sa stergi '${cartItem.name}' din cos?`);
                                if (deleteConfirm === true ){
                                    let table = document.querySelector('.cart__table');
                                    this.cartItems.splice(this.cartItems.indexOf(cartItem), 1);
                                    table.removeChild(cartTableItem);
                                    this.cartService.storeOrderedProducts();
                                    this.setItemsTotals();
                                } else if ( deleteConfirm === false) {
                                    return;
                                }
                        }
                    }
                }

            });
        }
    }

   setPurchaseConfirm() {
        let purchaseButtons = document.querySelectorAll('.cart__buy .button');
        for (let purchaseButton of purchaseButtons) {
            purchaseButton.addEventListener('click', async () => {
                let purchaseConfirm = confirm(`Esti sigur ca vrei sa plasezi  comanda ?`);

                if(purchaseConfirm === false) {
                    return;
                } else if(purchaseConfirm === true) {
                    if(this.cartItems.length < 1) {
                        alert('Cosul este gol, te rugam sa adaugi un produs main intai!');
                        return;
                    }

                    let dbResponse =  await fetch('https://web-e-shop.firebaseio.com/.json');
                    let dbProducts = await dbResponse .json();

                    for (let i in dbProducts) {
                        let dbProduct = dbProducts[i];
                        for (let cartItem of this.cartItems) {
                            if (cartItem.id === i) {
                                console.log(true);
                                console.log(cartItem.stock);
                                let response = await fetch(`https://web-e-shop.firebaseio.com/${i}/stock.json`, {
                                    method: "PUT",
                                    body: JSON.stringify(cartItem.stock)
                                });
                                localStorage.clear();
                            }
                        }
                    }
                    window.location.replace('purchase-confirm.html')
                }
            });
        }
    }

}

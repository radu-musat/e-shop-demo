import PageFrame from "../web-components/page-frame.js";
import CarouselService from "../services/carousel.service.js";
import CartStorageService from "../services/cart.service.js";
import LoaderService from "../services/loader.service.js";

export default class Details {

    constructor() {
        this.productList = undefined;
        this.selectedProduct = undefined;
        this.loader = new LoaderService();

        this.cartService = new CartStorageService();
        this.carouselService = new CarouselService();

        this.init();
    }

    init() {
        customElements.define('rm-frame', PageFrame);
        this.setPage();
        this.carouselService.setCarousel();
    }

    async setPage() {
        let id = window.location.search.substring(4);

        let response = await fetch("https://web-e-shop.firebaseio.com/.json");
        this.productList = await response.json();

        let image = document.querySelector('.details-content img');
        let title = document.querySelector('.details-content__name');
        let stock = document.querySelector('.details-content__stoc span');
        let description = document.querySelector('.details-content__description p');
        let price = document.querySelector('.details-content__price span');


        for ( let i in this.productList ) {

             let product = this.productList[i];

             if (product === null ){
                 continue
             }

             if (i === id) {
                 this.selectedProduct = product;
                 this.selectedProduct.id = i;
                 this.selectedProduct.orders = 0;

                 console.log(this.selectedProduct);


                 image.setAttribute('src', product.image);
                 title.textContent = product.name;
                 stock.textContent = product.stock;
                 description.textContent = product.description;
                 price.textContent = product.price;

                 this.setFormFunctionality();
             }

        }

    }

    setFormFunctionality() {
        let page = this;
        let stock = this.selectedProduct.stock;

        let orderedProduct = this.cartService.setOrderedProduct(this.selectedProduct);
        let orderedQuantity;
        let orderedQuantitySpan = document.querySelector('.details-content__current-quantity span');

        orderedQuantitySpan.textContent = stock - orderedProduct.stock;

        let input = document.querySelector('input');
        let button = document.querySelector('.button');
        let stockErrorMesageParagraph = document.querySelector('.details-content__quantity-error');
        let addedMessageParagraph = document.querySelector('.details-content__quantity-added');

        button.addEventListener('click', function (event) {
            event.preventDefault();
            orderedQuantity = Number(input.value);

            if (orderedQuantity < 1) {
                alert('Valoarea aduagata nu este validata - aduaga o cantiate de minim 1!');
                return;
            }


            if (orderedProduct.stock < 1) {
                stockErrorMesageParagraph.textContent = `Produsul respectiv nu este pe stock!`;
                stockErrorMesageParagraph.classList.add('details-content__quantity-error--active');
                return;
            }

            if (orderedQuantity > orderedProduct.stock) {
                stockErrorMesageParagraph.textContent = `Comanda nu poate depasi stocul curent - 
                te rugam sa revizuiesti cantitatea adaugata!`;
                stockErrorMesageParagraph.classList.add('details-content__quantity-error--active');
                return;
            }

            if(orderedQuantity < orderedProduct.stock) {
                addedMessageParagraph.textContent = `Produsul a fost adaugat in cos cu succes!`;
                addedMessageParagraph.classList.add('details-content__quantity-added--active');
            }

            orderedProduct.stock -= orderedQuantity;
            orderedProduct.orders += orderedQuantity;

            orderedQuantitySpan.textContent = orderedProduct.orders;

            page.cartService.storeOrderedProduct(orderedProduct);

            console.log(page.cartService.orderedProducts);
        });

        stockErrorMesageParagraph.addEventListener("animationend", function () {
            stockErrorMesageParagraph.classList.remove('details-content__quantity-error--active');
        });

        addedMessageParagraph.addEventListener("animationend", function () {
            addedMessageParagraph.classList.remove('details-content__quantity-added--active');
        });
    }


    displayNoResultError() {
        let body = document.querySelector("body");
        body.innerHTML = `
                        <div class="container container--error">
                            <h1>Oops! nu trebuia sa ajungi aici!</h1>
                            <p>Click <a href="index.html">aici</a> sa te intorci pe gaina principala!</p>        
                        </div>
                 `
    }

}


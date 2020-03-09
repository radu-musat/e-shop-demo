import PageFrame from "../web-components/page-frame.js";
import DrawService from "../services/draw.services.js";
import CrudService from "../services/crud.service.js";
import LoaderService from "../services/loader.service.js";

export default class Admin {
    constructor() {
        this.loader = new LoaderService();
        this.container = document.querySelector('.admin-content');
        this.drawService = new DrawService(this.container);
        this.crudService = new CrudService();
        this.init();
    }

    init() {
        customElements.define('rm-frame', PageFrame);
        this.drawService.draw('admin-page');
        this.setTotalProducts();
        this.setDeleteListener();
    }

    async setTotalProducts() {
        let stockText = document.querySelector('.admin-aside h2:nth-child(1) span');
        let totalPriceText = document.querySelector('.admin-aside h2:nth-child(2) span');

        let response = await fetch("https://web-e-shop.firebaseio.com/.json");
        let productList = await response.json();
        let sum = 0;
        let totalPrice = 0;

        for (let i in productList) {
            let product = productList[i];

            sum += product.stock;
            totalPrice += product.price * product.stock;
        }

        stockText.textContent = sum;
        totalPriceText.textContent = totalPrice;
    }

    setDeleteListener() {
        let contentContainer = document.querySelector('.admin-content');
        contentContainer.addEventListener('click',  (event) => {
            if(event.target.nodeName === 'BUTTON' && event.target.classList.contains('button--remove')) {
                 let productId = event.target.dataset.id;
                 console.log(productId);
                 console.log( typeof productId);
                 this.crudService.delete(productId);
            }
        });
    }
}

import PageFrame from "../web-components/page-frame.js";
import CrudService from "../services/crud.service.js";
import LoaderService from "../services/loader.service.js";

export default class Save {
    constructor() {
        this.loader = new LoaderService();
        this.saveMode = undefined;
        this.productId = undefined;
        this.editedProduct = undefined;

        this.init();
        this.crudService = new CrudService(this.saveMode);
    }

   async init() {
        customElements.define('rm-frame', PageFrame);
        await this.setMode();
        this.setTitle();
        this.setFormLogic();
    }

    setTitle() {
       let title = document.querySelector('.save h2');
       this.saveMode === 'save' ? title.textContent = 'Adauga un produs nou'
           : title.innerHTML = `Produsul <br> '${this.editedProduct.name}' este sub editare`;
    }

    async setMode() {
        let params = new URLSearchParams(window.location.search);
        let mode = params.get('mode');
        let id = params.get('id');

        if(id !== null || undefined) {
            this.productId = id;
            console.log(this.productId);
            this.setProduct(this.productId);
        }

        this.saveMode = mode;

        if(this.saveMode === 'edit') {
            await this.setProduct(this.productId);
        }

        console.log(this.saveMode);
        console.log(typeof this.saveMode);
    }

    async setProduct(id) {
        let response = await fetch('https://web-e-shop.firebaseio.com/.json');
        let productList = await  response.json();
        for ( let i in productList) {
            if (i === this.productId) {
                this.editedProduct = productList[i];
            }
        }
        console.log(this.editedProduct);
    }

   setFormLogic() {
        let form = document.querySelector('.save form');
        let imageInput = document.querySelector('#image');
        let nameInput = document.querySelector('#name');
        let descriptionInput = document.querySelector('#description');
        let stockInput = document.querySelector('#stock');
        let priceInput = document.querySelector('#price');

        let negativeValuesPresent = false;
        let emptyFieldsPresent = false;

        let inputs = [imageInput, nameInput, descriptionInput, stockInput, priceInput];

        if (this.saveMode === 'edit') {
            imageInput.value = this.editedProduct.image;
            nameInput.value = this.editedProduct.name;
            descriptionInput.value = this.editedProduct.description;
            stockInput.value = this.editedProduct.stock;
            priceInput.value = this.editedProduct.price;
        }

        form.addEventListener('submit',  async (event) => {
            event.preventDefault();

            for (let input of inputs) {
                negativeValuesPresent = false;
                emptyFieldsPresent = false;
                input.classList.remove('invalid');
                input.classList.remove('invalid-negative');
                input.nextElementSibling.classList.remove('save__invalid-message--active');
                stockInput.nextElementSibling.nextElementSibling.classList.remove('save__negative-message--active');
                priceInput.nextElementSibling.nextElementSibling.classList.remove('save__negative-message--active');

                if (input.value.length < 1) {
                    emptyFieldsPresent = true;
                    input.classList.add('invalid');
                    input.nextElementSibling.classList.add('save__invalid-message--active');
                }
            }

            if ((stockInput.value < 0) || (priceInput.value < 0)) {
                negativeValuesPresent = true;

                if(stockInput.value < 0) {
                    stockInput.classList.add('invalid-negative');
                    stockInput.nextElementSibling.nextElementSibling.classList.add('save__negative-message--active');
                }

                if(priceInput.value < 0) {
                    priceInput.classList.add('invalid-negative');
                    priceInput.nextElementSibling.nextElementSibling.classList.add('save__negative-message--active');
                }
            }

            if(emptyFieldsPresent === true || negativeValuesPresent === true ) {
                return;
            }

            let product = {
                description: descriptionInput.value,
                image: imageInput.value,
                name: nameInput.value,
                price: Number(priceInput.value),
                stock: Number(stockInput.value)
            };

            await this.crudService.save(product, this.productId);
            if (this.saveMode ==='save') {
                alert('Produsul a fost adaugat cu succes!');
            }

            if(this.saveMode === 'edit') {
                alert('Datele produsului au fost modificate cu succes!');
            }

            window.location.assign('admin.html');
        });
    }


}



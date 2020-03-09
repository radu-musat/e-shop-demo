/* -- Draw service -- */

export default class DrawService {
    constructor (container) {
        this.container = container;
        this.productList = undefined;
    }

    async draw(drawType, cartItems) {
        let response = await fetch("https://web-e-shop.firebaseio.com/.json");
        this.productList = await response.json();

        if (drawType === 'front-page') {
            this.drawProducts(this.productList);
        } else  if (drawType === 'admin-page') {
            this.drawAdminProducts(this.productList);
        } else if (drawType ==='cart-page') {
            this.drawCart(cartItems);
        }
    }

    drawProducts(list) {
        let container = this.container;
        let template = ``;


        for(let i in list){
            let product = list[i];

            if( product === null ) {
                continue
            }

            template += `
                <div class="content__item">
                    <a href="details.html?id=${i}" class="card" target="_blank">
                        <div class="card__visual">
                            <h2 class="h4 card__name">${ product.name }</h2>
                            <picture>
                                <img src="${ product.image }">
                            </picture>
                        </div>
                        <div class="card__footer">
                            <h4 class="h3 card__price">${ product.price } - lei</h4>
                        </div>
                    </a>
                </div>
            `
        }

        container.innerHTML = template;
    }

    drawCarouselItems(carouselItems) {
        let carousel =  document.querySelector('.owl-carousel');
        let template = ''
        for( let i in carouselItems) {
            let item = carouselItems[i];

            template += `
                        <a href="details.html?id=${i}">
                            <h3>${item.name}</h3>
                            <picture>
                                <img src="${item.image}">
                            </picture>
                        </a>
                    `

            carousel.innerHTML = template;
        }
    }

    drawAdminProducts(list){
        let container = this.container;
        let template = ``;

        for(let i in list){
            let product = list[i];

            if( product === null ) {
                continue
            }

            template += `
                <ul class="admin-content__row">
                    <li class="admin-content__picture">
                        <picture>
                            <img src="${product.image}">
                        </picture>
                    </li>
                    <li class="admin-content__name">${product.name}</li>
                    <li class="admin-content__price">${product.price}</li>
                    <li class="admin-content__stock">${product.stock}</li>
                    <li class="admin-content__options">
                        <a  href="save.html?mode=edit&id=${i}" class="button button--edit">Editeaza</a>
                        <button class="button button--remove" data-id="${i}">Sterge</button>
                    </li>
                </ul>
            `
        }

        container.innerHTML += template;
    }

    drawCart(cart) {
        let container = this.container;
        let template = ``;
        for (let cartItem of cart) {
            let cartItemTotalCost = cartItem.orders * cartItem.price;

            template+= `
                    <li class="cart__table-item" data-id="${cartItem.id}">
                        <ul>
                            <li><a href="details.html?id=${cartItem.id}">${cartItem.name}</a></li>
                            <li>
                                <i class="fas fa-plus-square cart__table-item-increase"></i>
                                <span class="cart__table-item-quantity">${cartItem.orders}</span>
                                <i class="fas fa-minus-square cart__table-item-decrease"></i>
                            </li>
                            <li class="card__table-item-price">${cartItem.price} lei</li>
                            <li>
                                <span class="cart__table-item-subtotal">${cartItemTotalCost} lei</span>
                                <button class="button cart__table-item-delete">Sterge</button>
                            </li>
                        </ul>
                    </li>
            `
        }

        container.innerHTML += template;
    }
}

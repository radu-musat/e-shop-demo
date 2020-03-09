export default class CartStorageService {
    constructor() {
        this.orderedProducts = [];
        this.setOrderedProducts();
        console.log(this.orderedProducts);
    }

    setOrderedProduct(orderedProduct) {
        if (this.orderedProducts.length > 0) {
            for (let product of this.orderedProducts) {
                if(orderedProduct.id === product.id) {
                    return product;
                } else {
                    return orderedProduct;
                }
            }
        } else  {
            return orderedProduct;
        }
    }

    setOrderedProducts() {
        if(localStorage.getItem('list')  !== null ){
          this.orderedProducts = JSON.parse(localStorage.getItem('list'))
        }
    }

    storeOrderedProduct(orderedProduct) {
        if (this.orderedProducts.indexOf(orderedProduct) === -1) {
            this.orderedProducts.push(orderedProduct);
        }

        localStorage.setItem('list', JSON.stringify(this.orderedProducts));
    }

    storeOrderedProducts() {
        localStorage.setItem('list', JSON.stringify(this.orderedProducts));
    }
}

export default class CrudService {
    constructor(saveMode) {
        this.saveMode = saveMode;
    }

    async save(product, id) {
        if (this.saveMode ==='save') {
            let response = await fetch('https://web-e-shop.firebaseio.com/.json',{
                method: 'POST',
                body: JSON.stringify(product)
            });
        }

        if(this.saveMode === 'edit') {
            let response = await fetch('https://web-e-shop.firebaseio.com/.json');
            let productList = await  response.json();

            for ( let i in productList ) {
                if( id === i ) {
                    let response = await fetch(`https://web-e-shop.firebaseio.com/${id}.json`, {
                        method: "PUT",
                        body: JSON.stringify(product)
                    });
                }
            }

        }
    }

    async delete(productId) {
        let response = await fetch('https://web-e-shop.firebaseio.com/.json');
        let productList = await response.json();
        let selectedProduct = undefined;
        let deleteConfirmation = false;

        for (let i in productList) {
            let product = productList[i];
            if(product === null) {
                continue
            }

            if (productId === i) {
                selectedProduct = product;
            }
        }

        deleteConfirmation = confirm(`Esti sigur ca vrei sa stergi ${selectedProduct.name} ?`);
        if (deleteConfirmation === false){
            return;
        }

        let deleteResponse = await fetch(`https://web-e-shop.firebaseio.com/${productId}.json`, {method: 'DELETE'});
        alert(`Produsul ${selectedProduct.name} a fost sters cu succes!`);

        location.reload();
    }
}

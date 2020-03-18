import { LightningElement } from 'lwc';

export default class ShoppingCart extends LightningElement {

    handleAddToCartClick(){
        const addToCart = new CustomEvent('addtocart', {
			detail: {
                Valor__c : this.product.Valor__c,
                Name : this.product.Name
            }
		});
		this.dispatchEvent(addToCart);
    }
}
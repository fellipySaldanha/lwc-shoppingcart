import { LightningElement, wire } from 'lwc';
import hitoric from '@salesforce/apex/ProductsController.historic'
import { NavigationMixin } from 'lightning/navigation';
import userId from '@salesforce/user/Id';

export default class ShoppingManager extends NavigationMixin(LightningElement) {

    @wire(hitoric, {ident: userId})
    historic;    
    
    connectedCallback(){      
        window.console.log('h ' + this.historic[0]);
    }
    

}
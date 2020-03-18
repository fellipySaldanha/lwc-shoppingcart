import { LightningElement, api, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';
export default class ProductCard extends LightningElement {
    
	@api product;
	
	@track openmodel = false;

    @wire(CurrentPageReference) pageRef;    

    openmodal() {		
        this.openmodel = true
    }

    closeModal() {
        this.openmodel = false
    } 

    handleOpenRecordClick() {
        var aux = {
            name: this.product.Name,
            valor__c: this.product.Valor__c,
            quantidade: '1',   
            Id : this.product.Id,
            Url : this.product.Foto__c         
        }
        this.closeModal();
        fireEvent(this.pageRef, 'addToCart', aux);	        
	}
}
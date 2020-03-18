import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import HIST_OBJECT from '@salesforce/schema/Historico_de_compras__c'
import CURRENT from '@salesforce/schema/Historico_de_compras__c.Usuario__c'
import AMOUNT from '@salesforce/schema/Historico_de_compras__c.TotalDaCompra__c'
import SHIPPING from '@salesforce/schema/Historico_de_compras__c.Entrega__c'
import Id from '@salesforce/user/Id';

const columns = [
    { label: 'Produto', fieldName: 'name' },
    { label: 'Valor', fieldName: 'valor__c', type: 'currency' }, 
    { label: 'Quantidade', fieldName: 'quantidade' },    
];

var myMap = new Map();
export default class CartDetails extends LightningElement {
    delivery;   
    @track data = [];
    @track columns = columns;   
    @track price = 0;
    @track shippingType = true;
    @track shippingDate = true;
    @track address = true;  
    @track finish = true;   
    @wire(CurrentPageReference) pageRef;          

    connectedCallback() {                   
        registerListener('addToCart', this.addToCart, this);        
    }
    
    disconnectedCallback() {		
		unregisterAllListeners(this);
	}
  
    addToCart(product){           
        if(myMap.get(product.Id) == null){
            myMap.set(product.Id, product);                
            this.totalCart();
            this.refreshDataTable();                     
            this.shippingType = false;                      
        }else{          
           // eslint-disable-next-line no-alert
           alert('Item já está no carrinho');
        }            
        return this.data;        
    }

    refreshDataTable(){
        this.data =[];
            myMap.forEach(e => {
                this.data.push(e);
            }) 
    }

    get shipping() {
        return [                    
            { label: 'Em domicilio', value: 'Em domicilio' },
            { label: 'No local', value: 'No local' },
        ];
    }  

    setshipping(event){
        const deliveryValue = event.target.value;       	
        this.delivery = deliveryValue;    
        if(deliveryValue === 'No local'){
           this.shippingDate = false;
           this.address = true;
        }
        if(deliveryValue === 'Em domicilio'){
            this.shippingDate = false;
            this.address = false;
        }
        
        if(deliveryValue !== '' && this.price !== 0){
            this.finish = false;
        }
    }   

    quantityHandle(event){                      
        let mapItem = myMap.get(event.target.getAttribute('data-ident'));                
        mapItem.quantidade = event.target.value;
        this.totalCart();                 
    }

    totalCart(){        
        let total = 0;
        myMap.forEach(element => {
            let totalItem = element.quantidade * element.valor__c;
            total += totalItem;
        });
        this.price = total;
    }

    buy(){        
        const fields = {};
        fields[AMOUNT.fieldApiName] = this.price;
        fields[SHIPPING.fieldApiName] = this.delivery;
        fields[CURRENT.fieldApiName] = Id;                 
        const recordInput = {
            apiName: HIST_OBJECT.objectApiName,
            fields
        };
        
        createRecord(recordInput)
        .then(result => {   
            window.console.log('result ===> '+result);             
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Successo',
                        message: 'Compra Finalizada',
                        variant: 'success',
                    }),
                );
                window.location.assign('https://resourceful-wolf-fn2s9-dev-ed.lightning.force.com/lightning/n/Minhas_Compras');
              /*  this.data =[];
                myMap.forEach(e => {
                    myMap.delete(e.Id);
                })
                this.shippingType = true;
                this.shippingDate = true;
                this.address = true;  
                this.finish = true;  */                       
            })
        .catch(error => {
            window.console.log('error'+ error); 
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Compra não efetuada',
                        message: 'Tente novamente em instantes',
                        variant: 'error',
                    }),
                );
            });
    }

    remove(event){         
        myMap.delete(event.target.value);

        this.totalCart();
        this.refreshDataTable();       
        
        if(this.price === 0){
            this.finish = true;
        }
        else{
            this.finish = false;
        }  
        
    }

    
}
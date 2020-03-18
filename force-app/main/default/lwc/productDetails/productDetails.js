import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import PRODUCT_FIELD from '@salesforce/schema/SF_Produtos__c';
const productFields = [PRODUCT_FIELD];

export default class ProductDetails extends LightningElement {
    @api recordId;
	@wire(getRecord, { recordId: '$recordId', fields: productFields })
	product;
	get productId() {
		return getFieldValue(this.product.data, PRODUCT_FIELD);
	}
}
import { LightningElement, wire, track } from 'lwc';
import searchProducts from '@salesforce/apex/ProductsController.searchProducts';

const columns = [
    { label: 'Produto', fieldName: 'name' },
    { label: 'Valor', fieldName: 'valor__c', type: 'currency' },    
];

export default class ListShopping extends LightningElement {
    
    @track categoryInput = true;
    @track term = '';
    @track searchTerm = '';   
    @wire(searchProducts, {searchTerm: '$searchTerm'})
    products;
    
    @track data = [];
    @track columns = columns;

    handleSearchTermChange(event){               
        const term = event.target.value;                
        this.term = term;  
        this.categoryInput = false;
        if(this.category === ''){
            this.categoryInput = true; 
        }              
    }

    handleSearch(event){       
        const term = event.target.value;         
        this.searchTerm = term;
    }

    get category() {
        return [           
            { label: 'Eletrônicos', value: 'Eletrônicos' },
            { label: 'Livros', value: 'Livros' },
        ];        
    }   

    get type(){
        if(this.term === 'Eletrônicos'){
            return [               
                { label: 'Celular', value: 'Celular' },
                { label: 'Computador', value: 'Computador' },
            ];
        }

        return [               
            { label: 'Romance', value: 'Romance' },
            { label: 'Suspense', value: 'Suspense' },
        ];
        
    }

    get hasResults(){       
        return (this.products.data.length > 0);                
    }
        
}
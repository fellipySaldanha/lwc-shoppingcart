public inherited sharing class ProductsController {
    @AuraEnabled(Cacheable=true)
    public static SF_Produtos__c[] getAllProducts(){
       return [SELECT Id, Name, Valor__c, Tipo__c, Categoria__c, Foto__c  FROM SF_Produtos__c ORDER BY Name LIMIT 50];
    }

    @AuraEnabled(Cacheable=true)
    public static SF_Produtos__c[] searchProducts(String searchTerm) {
        List<SF_Produtos__c> sfList = new List<SF_Produtos__c>();
        searchTerm = searchTerm.trim();
        if (searchTerm == '') {
            return sfList;
        }       
        searchTerm = '%'+ searchTerm +'%';       
        sfList = [SELECT Id, Name, Valor__c, Tipo__c, Foto__c, Categoria__c FROM SF_Produtos__c WHERE Tipo__c LIKE :searchTerm ORDER BY Name LIMIT 50];
        return sfList;
    }

    @AuraEnabled(Cacheable=true)
    public static void create(String ident){
        system.debug('create');
        Historico_de_compras__c historico = new Historico_de_compras__c();
        historico.Usuario__c = ident;      
        insert historico;            
    }

    @AuraEnabled(Cacheable=true)
    public static List<Historico_de_compras__c> historic(String ident){
        return [SELECT Id, Entrega__c, Name, Usuario__r.Name, TotalDaCompra__c FROM Historico_de_compras__c WHERE Usuario__c =: ident];
    }

     
}
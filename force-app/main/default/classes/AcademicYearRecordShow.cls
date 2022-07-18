public with sharing class AcademicYearRecordShow {
    @AuraEnabled(cacheable=true)
    public static List<Academic_Year__c> recordShow(){
    return [Select id, From_Month__c, To_Month__c, From_Year__c, To_Year__c, LastModifiedBy.Name, 
    LastModifiedDate From Academic_Year__c ORDER BY CreatedDate DESC];
   
}
}

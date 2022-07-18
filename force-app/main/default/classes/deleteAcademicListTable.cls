public with sharing class deleteAcademicListTable {
    @AuraEnabled
    public static List<Academic_Year__c> deleteAclistTable(List<String> arr) {
	List<Academic_Year__c> str = [SELECT Id from Academic_Year__c WHERE
						Id IN: arr ];

     delete str;
        return [Select From_Month__c, To_Month__c, From_Year__c, To_Year__c, LastModifiedBy.Name, LastModifiedDate From Academic_Year__c];
    }
}
public without sharing class Lookup {

    @AuraEnabled(cacheable=true)
    public static List<sObject> search(String searchTerm, string myObject, String filter) {

        String myQuery = null;

        if(myObject!='Academic_Year__c' && myObject!='Contact'){
            if(filter != null && filter != ''){
                myQuery = 'Select Id, Name from '+myObject+' Where Name Like  \'%' + searchTerm + '%\' AND '+filter+' LIMIT  5';
            }
    
            
            else {
                myQuery = 'Select Id, Name from '+myObject+' Where Name Like  \'%' + searchTerm + '%\' LIMIT  5';
            }  
        }
        
        else if(myObject =='Contact'){
            filter = 'Teacher';
            if(filter != null && filter != ''){
                myQuery = 'Select Id, Name, RecordType.Name from '+myObject+' Where Name Like  \'%' + searchTerm + '%\' AND RecordType.Name=:filter LIMIT  5';
            }
    
            
            else {
                myQuery = 'Select Id, Name from '+myObject+' Where Name Like  \'%' + searchTerm + '%\' AND RecordType.Name = '+ 'Teacher' +' LIMIT  5';
            }  
        }
        else if(myObject =='Academic_Year__c'){
            if(filter != null && filter != ''){
                myQuery = 'Select Id, Name,From_Year__c,From_Month__c,To_Month__c,To_Year__c from '+myObject+' Where Name Like  \'%' + searchTerm + '%\' AND '+filter+' LIMIT  5';
            }
    
            
            else {
                myQuery = 'Select Id, Name,From_Year__c,From_Month__c,To_Month__c,To_Year__c from '+myObject+' Where Name Like  \'%' + searchTerm + '%\' LIMIT  5';
            }
        }
        
        
        List<sObject> lookUpList = database.query(myQuery);
        return lookUpList;        
    }
    
    @AuraEnabled
    public static String deleteRecord(string myObject, List<String> recordId){
        try {
            System.debug(recordId);
            if(myObject == 'Contact'){
                List<Contact> recordList = new List<Contact>();
                recordList = [SELECT Id FROM Contact WHERE Id IN : recordId];
                delete recordList;
                return 'success'; 
        }

        if(myObject == 'Academic_Year__c'){
            List<Academic_Year__c> recordList = new List<Academic_Year__c>();
            recordList = [SELECT Id FROM Academic_Year__c WHERE Id IN : recordId];
            delete recordList;

            return 'success';
    }
    if(myObject == 'Admission__c'){
        List<Admission__c> recordList = new List<Admission__c>();
        recordList = [SELECT Id FROM Admission__c WHERE Id IN : recordId];
        delete recordList;

        return 'success';
}
    if(myObject == 'Department__c'){
        List<Department__c> recordList = new List<Department__c>();
        recordList = [SELECT Id FROM Department__c WHERE Id IN : recordId];
        delete recordList;
        return 'success'; 
     }

         if(myObject == 'Subject_Course__c'){
        List<Subject_Course__c> recordList = new List<Subject_Course__c>();
        recordList = [SELECT Id FROM Subject_Course__c WHERE Id IN : recordId];
        delete recordList;
        return 'success'; 
     }

     if(myObject == 'section__c'){
        List<section__c> recordList = new List<section__c>();
        recordList = [SELECT Id FROM section__c WHERE Id IN : recordId];
        delete recordList;
        return 'success'; 
}
if(myObject == 'Class_Sub_Teach__c'){
    List<Class_Sub_Teach__c> recordList = new List<Class_Sub_Teach__c>();
    recordList = [SELECT Id FROM Class_Sub_Teach__c WHERE Id IN : recordId];
    delete recordList;
    return 'success'; 
}
        /* if(myObject == 'Dept_Teacher__c'){
            recordList = [SELECT Id FROM Dept_Teacher__c WHERE Id IN : recordId];
        } */
        System.debug(recordId); 
        return '';
    }
    catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }  
}

}
public with sharing class AcademicYear {
    @AuraEnabled
    public static string academicyearsession( string fromMonth, string fromYear, string toMonth, string toYear){
        try{
        // Date myFromMonth = fromMonth;
        // Date myFromYear = fromYear;
        // Date myFromDate = Date.parse(fromDate);
        // Date myToDate = Date.parse(toDate);
        Academic_Year__c acc = new Academic_Year__c();
       // acc.From__c = myFromDate;
        // acc.From__c = myFromDate;
        // acc.To__c = myToDate;
        acc.From_Month__c = fromMonth;
        acc.From_Year__c = fromYear;
        acc.To_Month__c = toMonth;
        acc.To_Year__c = toYear;
       // acc.To__c = myToDate;
        insert acc;
        return 'success';
    }
    catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}


    @AuraEnabled(cacheable=true)
    public static List<Academic_Year__c> methodName(string recId){
        try {
            return [SELECT From_Month__c, From_Year__c, To_Month__c, To_Year__c FROM Academic_Year__c WHERE Id =: recId];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string updateAY(string recId, List<string> AY){
        try {
            Academic_Year__c acadYear = [SELECT From_Month__c, From_Year__c, To_Month__c, To_Year__c FROM Academic_Year__c WHERE Id =: recId];
                acadYear.From_Month__c = AY[0];
                acadYear.From_Year__c = AY[1];
                acadYear.To_Month__c = AY[2];
                acadYear.To_Year__c = AY[3];

            update acadYear;
            return 'success';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
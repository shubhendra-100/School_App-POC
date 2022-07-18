import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import academicyearsession from '@salesforce/apex/AcademicYear.academicyearsession';
export default class AcademicYear extends LightningElement {


    @track isModalOpen = false;
    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
    }


    @track fromMonth;
    @track fromYear;
    @track toMonth;
    @track toYear;
     @track fromDate;
     @track toDate;

    handleInput(event) {
         console.log(event.target.value);
        const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        if (event.target.name == 'fromDate') {
             this.fromDate = event.target.value;
            console.log("Year: ", event.target.value.split("-")[0], "Month: ", monthArr[+event.target.value.split("-")[1] - 1]);
            this.fromMonth = monthArr[+event.target.value.split("-")[1] - 1];
            this.fromYear = event.target.value.split("-")[0];
        }

        else {
             console.log(event.target.value);
             this.toDate = event.target.value;
            this.toMonth = monthArr[+event.target.value.split("-")[1] - 1];
            this.toYear = event.target.value.split("-")[0];
        }
    }


    showSuccessToast() {
        const evt = new ShowToastEvent({
            title: 'Academic Year Created',
            message: 'Academic Year record has been created',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    showValidityToast() {
        const evt = new ShowToastEvent({
            title: 'Validity Error',
            message: 'Academic year duration can be between 6 Months to 1 Year',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    showErrorToast(err) {
        const evt = new ShowToastEvent({
            title: err ? `Academic Year already exists !` : 'Provide Details',
            message: err ? err : 'Fields can not be empty',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    saveHandler() {
        const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        console.log(Number(this.toYear));

        console.log(monthArr.map((item, index) => {
            return (item == this.fromMonth ? index + 1 : null);
        }).filter(item => item != null)[0]);

        const fromMonthIndex = monthArr.map((item, index) => {
            return (item == this.fromMonth ? index + 1 : null);
        }).filter(item => item != null)[0];

        const toMonthIndex = monthArr.map((item, index) => {
            return (item == this.toMonth ? index + 1 : null);
        }).filter(item => item != null)[0];

console.log((12 - fromMonthIndex));
console.log((toMonthIndex - 0));

        if (this.fromMonth == null || this.fromMonth == '' || this.toMonth == null || this.toMonth == '') {
            this.showErrorToast();
            
            return;
                 }


        else if (((Number(this.toYear) == Number(this.fromYear)) && (toMonthIndex - fromMonthIndex >= 6)) ||
            ((Number(this.toYear) - 1 == Number(this.fromYear)) && ((12 - fromMonthIndex) + (toMonthIndex - 0) < 12) &&
             (12 - fromMonthIndex) + (toMonthIndex - 0) >= 6))
            {

                console.log(this.fromMonth, this.fromYear, this.toMonth, this.toYear);
            academicyearsession({ fromMonth: this.fromMonth, fromYear: this.fromYear, toMonth: this.toMonth, toYear: this.toYear })
                .then((res) => {
                   
                     console.log("success");
                    this.showSuccessToast();
                   // this.closeModal();
                    setTimeout(() => {
                        location.reload()
                    }, 1500);

                })
                .catch(error => {
                    console.log('HII');
                     console.log(error);
                    this.showErrorToast(error.body);
                    return;
                });
            // { console.log(JSON.stringify(error.body.output.errors[0].duplicateRecordError.matchResults[0].matchRule)); 
            //     const err = "Email_Duplicate_Rule";
            //     if(error.body.output.errors[0].duplicateRecordError.matchResults[0].matchRule === err) {
            //         this.showErrorToast('Duplicate Email alert');
            //     } 
            //  });
        }

        else {

            this.showValidityToast();
            return;
            // this.closeModal();

        }
    }

}
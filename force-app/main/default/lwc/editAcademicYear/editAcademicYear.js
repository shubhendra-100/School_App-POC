import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import methodName from '@salesforce/apex/AcademicYear.methodName';
import updateAY from '@salesforce/apex/AcademicYear.updateAY';

import academicyearsession from '@salesforce/apex/AcademicYear.academicyearsession';
export default class EditAcademicYear extends LightningElement {
    @api recordId;

    @track fromMonthOld;
    @track fromYearOld;
    @track toMonthOld;
    @track toYearOld;

    @track fromMonth;
    @track fromYear;
    @track toMonth;
    @track toYear;
    //@track ModalRes;

    @api isShowModal;

    closeModal() {
        this.isShowModal = false;
        this.dispatchEvent(new CustomEvent('modalchange', { detail: this.isShowModal }));
    }


    // handleSuccessToast() {

    //     this.dispatchEvent(new ShowToastEvent({

    //         title: "Academic Year Updated!",

    //         message: "Academic year record has been updated successfully.",

    //         variant: "success",
    //     }),
    //         location.reload()
    //     )
    // }

    connectedCallback() {
        console.log(this.recordId);
    }

    @track fromValue;
    @track toValue;

    @wire(methodName, ({ recId: '$recordId' }))
    WiredAY({ error, data }) {
        if (data) {
            const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

            this.fromValue = `${data[0].From_Year__c}-${monthArr.map((item, index) => {
                if (item == data[0].From_Month__c) {
                    if (index < 9) {
                        return `0${index + 1}`
                    }
                    return index + 1;
                }
            })}`;

            this.toValue = `${data[0].To_Year__c}-${monthArr.map((item, index) => {
                if (item == data[0].To_Month__c) {
                    if (index < 9) {
                        return `0${index + 1}`
                    }
                    return index + 1;
                }
            })}`;

            this.fromValue = this.fromValue.replaceAll(',', '');
            this.toValue = this.toValue.replaceAll(',', '');
            // console.log(this.fromValue);
            // console.log(this.toValue);
            console.log(JSON.stringify(data));
            this.fromMonthOld = data[0].From_Month__c;
            this.fromYearOld = data[0].From_Year__c;
            this.toMonthOld = data[0].To_Month__c;
            this.toYearOld = data[0].To_Year__c;
        }
        if (error) {
            this.fromMonth = undefined;
            this.error = error;
        }
    }


    handleInput(event) {
        this.fromMonth ? this.fromMonth : this.fromMonth = this.fromMonthOld;
        this.fromYear ? this.fromYear : this.fromYear = this.fromYearOld;
        this.toMonth ? this.toMonth : this.toMonth = this.toMonthOld;
        this.toYear ? this.toYear : this.toYear = this.toYearOld;
        
        
        const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        if (event.target.name == 'fromDate') {
            // this.fromDate = event.target.value;
            // console.log("Year: ", event.target.value.split("-")[0], "Month: ", monthArr[+event.target.value.split("-")[1] - 1]);
            this.fromYear = event.target.value.split("-")[0];
            this.fromMonth = monthArr[+event.target.value.split("-")[1] - 1];
        }
        
        else {
            // console.log(event.target.value);         
            // this.toDate = event.target.value;
            this.toYear = event.target.value.split("-")[0];
            this.toMonth = monthArr[+event.target.value.split("-")[1] - 1];
        }
    }



    showSuccessToast() {
        const evt = new ShowToastEvent({
            title: 'Academic Year Updated',
            message: 'Academic Year record has been updated',
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

    showErrorToast() {
        const evt = new ShowToastEvent({
            title: 'Provide New Details',
            message: 'New values required while updating!',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    showDuplicationToast(err) {
        const evt = new ShowToastEvent({
            title: `Don't Duplicate Academic Year and month !`,
            message: err,
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    updateRecord() {
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

        if ((this.fromMonth == this.fromMonthOld || !this.fromMonth) && (this.fromYear == this.fromYearOld || !this.fromYear) && (this.toMonth == this.toMonthOld || !this.toMonth) && (this.toYear == this.toYearOld || !this.toYear)) {
            this.showErrorToast();
            // this.closeModal();
            return;
        }


        else if (((Number(this.toYear) == Number(this.fromYear)) && (toMonthIndex - fromMonthIndex >= 6)) ||
            ((Number(this.toYear) - 1 == Number(this.fromYear)) && (((12 - fromMonthIndex) + (toMonthIndex) < 12) &&
             ((12 - fromMonthIndex) + (toMonthIndex) >= 6)) )) {

            let academicYear = [this.fromMonth, this.fromYear, this.toMonth, this.toYear];
            updateAY({ recId: this.recordId, AY: academicYear })
                .then((res) => {
                    // console.log(res);
                    this.showSuccessToast();
                   // this.closeModal();
                    setTimeout(() => {
                        location.reload()
                    }, 1500);
                })
                .catch((error) => {
                    console.error(error);
                    this.showDuplicationToast(error.body);
                    return;
                })
        }
        else {
            this.showValidityToast();
            return;
            // this.closeModal();
        }
        // location.reload();

    }


}
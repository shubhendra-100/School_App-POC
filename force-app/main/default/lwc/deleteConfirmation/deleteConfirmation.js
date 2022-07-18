import { LightningElement, track, api, wire } from 'lwc';
import deleteRecord from '@salesforce/apex/Lookup.deleteRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class DeleteConfirmation extends LightningElement {

    @api objName;
    @api recordsId;

    ShowToast() {
        const toastEvent = new ShowToastEvent({
            title: 'Record Deleted!',
            message: 'Record Deleted successfully',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(toastEvent);
    }

    showError() {
        const toastEvent = new ShowToastEvent({
            title: 'Error deleting record',
            message: 'record is associated with other object',
            variant: 'error',
        });
        this.dispatchEvent(toastEvent);
    }

    showAcademicYearError() {
        const toastEvent = new ShowToastEvent({
            title: 'Error deleting record',
            message: 'Record is related to other objects, Delete the reference records first',
            variant: 'error',
        });
        this.dispatchEvent(toastEvent);
    }

    handleDelete() {
        console.log(JSON.stringify(this.recordsId));
        console.log(this.objName);

        deleteRecord({ myObject: this.objName, recordId: this.recordsId })
            .then(res => {
                console.log('deleteRecord Method Success', res);
                this.ShowToast();
                setTimeout(() => {
                    location.reload();
                }, 1500);
            })
            .catch(error => {
                console.log("deleteRecord Method Error", error);
                if (this.objName == 'Academic_Year__c') {
                    this.showAcademicYearError();
                }
              else{  this.showError();
              }
            })
    }

    //Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded 
    @track isModalOpen = true;
    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
        this.ModalValue = false;
        this.dispatchEvent(new CustomEvent('modalchange', { detail: this.ModalValue }));
    }
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
    }
}
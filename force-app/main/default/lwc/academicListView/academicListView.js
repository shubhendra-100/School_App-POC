import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import recordShow from '@salesforce/apex/AcademicYearRecordShow.recordShow';
import deleteAclistTable from '@salesforce/apex/deleteAcademicListTable.deleteAclistTable';
import { deleteRecord } from 'lightning/uiRecordApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import modal from '@salesforce/resourceUrl/globalcss';
import { loadStyle } from 'lightning/platformResourceLoader';
import id from '@salesforce/user/Id';
import Id from '@salesforce/schema/Account.Id';


const actions = [
    {
        label: 'edit', name: 'edit', iconName: "utility:edit",
        alternativeText: "edit",
        title: "edit"
    },
    {
        label: 'Delete', name: 'delete', iconName: "utility:delete",
        alternativeText: "Delete",
        title: "Delete"
    }

];


const columns = [
    { label: 'From', fieldName: 'From__c' },
    { label: 'To', fieldName: 'To__c' },
    { label: 'Last Modified By', fieldName: 'LastModifiedBy' },
    { label: 'Last Modified Date', fieldName: 'LastModifiedDate' },
    { type: 'action', typeAttributes: { rowActions: actions } }

    // {
    //     type: "button-icon", typeAttributes: {
    //         iconName: "utility:delete",
    //         alternativeText: "Delete", title: "Delete", name: 'delete'
    //     }
    // },

    // {
    //     type: 'action',
    //     typeAttributes: { rows: action },
    // },
];

export default class AcademicListView extends NavigationMixin(LightningElement) {

    connectedCallback() {
        Promise.all([
            loadStyle(this, modal)
        ])
    }


    @track isModalOpen = false;

    @track DelId = [];

    @track isDelete;



    openModal() {

        this.isModalOpen = true;

    }

    closeModal() {

        this.isModalOpen = false;

    };

    submitDetails() {

        this.isModalOpen = false;

    };

    handleModalChange(event) {

        this.isModalOpen = event.detail;

    };

    closemodaldelete(event) {
        this.isDelete = event.detail
    };


    @track arr = [];
    @track recordId;
    @track dataList;
    @track rows = [];

    @wire(recordShow) wiredAccounts({ data, error }) {

        if (data) {
            const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
            this.dataList = data.map(item => {
                let from = monthArr.map((el, index) => {
                    return (el == item.From_Month__c ? index + 1 : null);
                }).filter(el => el != null)[0];

                let to = monthArr.map((el, index) => {
                    return (el == item.To_Month__c ? index + 1 : null);
                }).filter(el => el != null)[0];

                return {
                    Id: item.Id,
                    From__c: `${item.From_Year__c}/${from > 9 ? from : '0'+ from}`,
                    To__c: `${item.To_Year__c}/${to > 9 ? to : '0'+ to}`,
                    LastModifiedBy: item.LastModifiedBy.Name,
                    LastModifiedDate: item.LastModifiedDate.split('T')[0]
                }
            });

        }

        else if (error) {
            console.log(error);
        }
    };

    showNonSelectedDeleteToast() {
        const evt = new ShowToastEvent({
            title: 'Error While Deleting the Record',
            message: 'Please select a record to Delete',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    showDeleteToast() {
        const evt = new ShowToastEvent({
            title: 'Academic Year Deleted',
            message: 'Academic Year record has been Deleted',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    // // data = [
    // //     {
    // //         FROM_MONTH: 'MARCH',
    // //         FROM_YEAR: '1999',
    // //         TO_MONTH: 'APRIL',
    // //         TO_YEAR: '2022'
    // //     },
    // //     {
    // //         FROM_MONTH: 'APRIL',
    // //         FROM_YEAR: '2009',
    // //         TO_MONTH: 'JUNE',
    // //         TO_YEAR: '2019'
    // //     },-
    // //     {
    // //         FROM_MONTH: 'JUNE',
    // //         FROM_YEAR: '2015',
    // //         TO_MONTH: 'JULY',
    // //         TO_YEAR: '2020'
    // //     }
    // // ];
    columns = columns;


    deleteRec() {
        this.isDelete = true;

        if (this.arr.length > 0) {

            // deleteAclistTable({ arr: this.arr })
            //     .then((res) => this.dataList = res);
            // this.showDeleteToast();
            this.DelId = this.arr;
        }


    }



    getSelectedRec() {
        var selectedRecords = this.template.querySelector("lightning-datatable").getSelectedRows();
        if (selectedRecords.length > 0) {

            // console.log('selectedRecords are ', JSON.stringify(selectedRecords));
            selectedRecords.map((currentItem) => {
                this.arr.push(currentItem.Id);
                // alert(currentItem.Id);
            });
            //// this.selectedIds = ids.replace(/^,/, '');
            // this.lstSelectedRecords = selectedRecords;
            // this.arr = selectedIds;
            // alert(this.selectedIds);
            this.deleteRec();

        }
        else {
            this.showNonSelectedDeleteToast();
        }

    }

    //     // // handleContactDelete(event){
    //     // //     this.recordId = event.target.value;
    //     // //     //window.console.log('recordId# ' + this.recordId);
    //     // //     deleteRecord(this.recordId) 
    //     // //     .then(() =>{

    //     // //        const toastEvent = new ShowToastEvent({
    //     // //            title:'Record Deleted',
    //     // //            message:'Record deleted successfully',
    //     // //            variant:'success',
    //     // //        })
    //     // //        this.dispatchEvent(toastEvent);

    //     // //        return refreshApex(this.getContact);

    //     // //     })
    //     // //     .catch(error =>{
    //     // //         window.console.log('Unable to delete record due to ' + error.body.message);
    //     // //     });
    //     // // }

    rowActionHandler(evt) {
        const rowDel = [];

        if (evt.detail.action.name === "delete") {
            this.isDelete = true;
            rowDel.push(evt.detail.row.Id);
            // deleteAclistTable({ arr: rowDel })
            //     .then((res) => this.dataList = res);

            // this.showDeleteToast();

            this.DelId = rowDel;
        }
        else if (evt.detail.action.label === 'edit') {

            this.recordId = evt.detail.row.Id;

            this.isModalOpen = true;

        }
    }
    // cloneHandler(){
    //     var selectedRecordss = this.template.querySelector("lightning-datatable").getSelectedRows();
    //     if (selectedRecordss.length > 0) {
    //         // console.log('selectedRecords are ', JSON.stringify(selectedRecords));
    //         selectedRecordss.map((currentItems) => {
    //             this.arr.push(currentItems.Id);
    //             console.log(currentItems.Id);
    //         });
    //         //// this.selectedIds = ids.replace(/^,/, '');
    //         // this.lstSelectedRecords = selectedRecords;
    //         // this.arr = selectedIds;
    //         // alert(this.selectedIds);


    //     }
    //     console.log(currentItems.Id);
    // }


    navigateToTabPage() {
        // Navigate to a specific CustomTab.
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Home_Page'
            }
        });
    }
}

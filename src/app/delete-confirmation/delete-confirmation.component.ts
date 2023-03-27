import {Component, Inject} from '@angular/core';
import {RequestSendService} from "../request-send.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {DeleteData} from "../gen-background/gen-background.component";


@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.css']
})
export class DeleteConfirmationComponent {
    constructor(private req_service: RequestSendService,
                @Inject(MAT_DIALOG_DATA) public data: DeleteData) {
    }




    deleteImage(model_id, image_id){
        this.req_service.deleteImage(model_id, image_id).subscribe({next: result => {
                console.log('image ' + image_id + ' deleted')
            }, error: console.log})
    }

}

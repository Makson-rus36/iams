import {Component, OnInit} from '@angular/core';
import {AndroidActivityBackPressedEventData, AndroidApplication, Page} from '@nativescript/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProfileService} from '@src/app/services/profile.service';
import {ModelUser} from '@src/app/models/modelUser';
import {ErrorModel} from '@src/app/models/error.model';
import {Subscription} from 'rxjs';
import {DiagnosisModel} from '@src/app/models/diagnosis.model';
import {DiagnosService} from '@src/app/services/diagnos.service';
import * as application from 'tns-core-modules/application';

@Component({
    selector: 'app-profile',
    templateUrl:'./profile.component.html',
    styleUrls:['./profile.component.css']
})

export class ProfileUserComponent implements OnInit{
    private id:number = -1;
    usersData: ModelUser;
    usersDiagnosis: DiagnosisModel[]=[];
    private subscription: Subscription;
    constructor(private page:Page, private router:Router, private profileService: ProfileService, private activateRoute: ActivatedRoute, private diagnosService:DiagnosService) {
        this.subscription = activateRoute.params.subscribe(params => this.id = params['id']);
    }

    ngOnInit() {
        if (application.android) {
            application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
                if (this.router.isActive("/profile", false)) {
                    data.cancel = true;
                    this.router.navigate(['/settings'])
                }
            });
        }
        this.page.actionBarHidden = true;
        this.profileService.getUsersDataWithId(this.id).subscribe((x:ModelUser)=>{
            this.usersData = x;
            this.diagnosService.getListDiagnosis(this.id).subscribe((x)=>{
                this.usersDiagnosis = <DiagnosisModel[]>x['content']
            }, (error:ErrorModel) => {
                console.log(error)
            })
        }, (error:ErrorModel) => {
            console.log(error)
        })
    }
    goToSearch($event){
        this.router.navigate(['search']);
    }

    addDiagnosis($event){
        this.router.navigate(['diagnosis_add'], {queryParams:{
            'user':this.id
        }})
    }
}

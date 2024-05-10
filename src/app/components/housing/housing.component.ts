import { Component } from '@angular/core';
import { IHousing } from '../../models/housing';
import {FormsModule} from '@angular/forms';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { HousingService } from '../../services/housing.service';
import mongoose from 'mongoose';

@Component({
    selector: 'app-housing',
    standalone: true,
    imports: [FormsModule,ReactiveFormsModule],
    templateUrl: './housing.component.html',
    styleUrl: './housing.component.css'
  })
  export class HousingComponent{
  searchBarHousingString: string='';
  housings: IHousing[] = [];//Housing retrieved from the server
  selectedHousing: IHousing | null = null;
  housingSelected: boolean = false;
  createMode:boolean=false;
  searchHousingMode:boolean=false;
  editMode:boolean=false;
  searchedHousing: IHousing | null = null;
  deactivateHousingId:string='';
  housingToBeEdited: IHousing | null = null;
  pagesize:number=10;
  currentPage:number=1;
  
  
  housingForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    owner: new FormControl('', Validators.required),
    rating: new FormControl(''),
    coords: new FormGroup({
        latitude: new FormControl(''),
        longitude: new FormControl('')
      }),
    photo: new FormControl(''),
    address: new FormControl(''),
    availability: new FormControl(false),
    coffee: new FormControl(false),
    schedule: new FormGroup({
        monday: new FormControl(''),
        tuesday: new FormControl(''),
        wednesday: new FormControl(''),
        thursday: new FormControl(''),
        friday: new FormControl(''),
        saturday: new FormControl(''),
        sunday: new FormControl('')
      }),
    verified: new FormControl(false),
    house_deactivated: new FormControl(false)
  });
  
  constructor( public housingService: HousingService, private formBuilder: FormBuilder)
  {
    
  }
  
  ngOnInit(): void {
  // Fetch data from API
  console.log('fetching housings');
  this.refreshHousingList();
  // this.userService.getUsers(this.currentPage, this.pagesize).subscribe(users => {
  //   this.users = users;
  //   console.log(this.users);
  // })
  }
  
  onSelectHousing(housing:IHousing): void{
    this.housingSelected = true;
    this.selectedHousing = housing;
  }
  
  backToHousingList(): void{
    this.housingSelected = false;
    this.selectedHousing = null;
    this.createMode = false;
    this.searchHousingMode = false;
    this.searchedHousing = null;
    this.editMode = false;
  }
  
  createHousingBtn(): void{
  this.createMode = true;
  }
  
  onSubmit(): void {
    if (this.housingForm.valid) {
      // Extract form values
      const formValues = this.housingForm.value;
  
      // Create a new user object from form values
      const newHousing: IHousing = {
        title: formValues.title || '',
        description: formValues.description || '',
        owner: formValues.owner || '',
        rating: formValues.rating || '',
        coords: {
            latitude: (formValues.coords?.latitude || ''),
            longitude: (formValues.coords?.longitude || '')
          },
        photo:  formValues.photo || '',
        address:  formValues.address || '',
        availability:  formValues.availability || false,
        coffee:  formValues.coffee || false,
        schedule: {
            monday: (formValues.schedule?.monday || ''),
            tuesday: (formValues.schedule?.tuesday || ''),
            wednesday: (formValues.schedule?.wednesday || ''),
            thursday: (formValues.schedule?.thursday || ''),
            friday: (formValues.schedule?.friday || ''),
            saturday: (formValues.schedule?.saturday || ''),
            sunday: (formValues.schedule?.sunday || '')
          },
        verified: formValues.verified || false
      };
  
      this.housingService.createHouse(newHousing).subscribe({
        next: (createdHousing: IHousing) => {
          console.log('v created:', createdHousing);
          // Optionally, reset the form after successful submission
          this.refreshHousingList();
          this.housingForm.reset();
          this.createMode = false;
          // You may also want to navigate the user back to the housing list view or perform any other action
        },
        error: (error: any) => {
          console.error('Error creating Housing:', error);
          // Handle error cases
        }
      });
    }
}
  
  refreshHousingList(): void {
    // Fetch the updated housing list from the server
    this.housingService.getHouses(this.currentPage, this.pagesize).subscribe(housings => {
      this.housings = housings;
      console.log('Housing list updated:', this.housings);
    });
  }
  
  previousPage(): void {
    if(this.currentPage > 1){
      this.currentPage--;
      this.refreshHousingList();
    }
  }
  
  nextPage(): void {
    this.currentPage++;
    this.refreshHousingList();
  }
  
    searchForHousing(): void {
      this.searchHousingMode = true;
      if(this.searchBarHousingString != ''){
        this.housingService.getHouse(this.searchBarHousingString).subscribe(housing => {
          this.searchedHousing = housing;
        });
      }else{
        this.searchedHousing = null;
      }
    }
  
    deactivateHousing(): void {
      if(this.selectedHousing){
        this.deactivateHousingId = this.selectedHousing._id || '';
      }else if(this.searchedHousing){
        this.deactivateHousingId = this.searchedHousing._id || '';
      }
      this.housingService.deleteHouse(this.deactivateHousingId).subscribe(() => { // Removed empty parentheses
        this.refreshHousingList();
        this.backToHousingList();
      });
    }
  
  
  
    editHousingMode(): void {
      this.editMode = true;
      if(this.selectedHousing){
        this.housingToBeEdited = this.selectedHousing;
      }else if(this.searchedHousing){
        this.housingToBeEdited = this.searchedHousing;
      }
      this.housingForm.patchValue({
        title: this.housingToBeEdited?.title || '',
        description: this.housingToBeEdited?.description || '',
        owner: this.housingToBeEdited?.owner || '',
        rating: this.housingToBeEdited?.rating || '',
        coords: {
            latitude: (this.housingToBeEdited?.coords.latitude || ''),
            longitude: (this.housingToBeEdited?.coords.longitude || '')
          },
        photo:  this.housingToBeEdited?.photo || '',
        address:  this.housingToBeEdited?.address || '',
        availability: this.housingToBeEdited?.availability || false,
        coffee:  this.housingToBeEdited?.coffee || false,
        schedule: {
            monday: (this.housingToBeEdited?.schedule.monday || ''),
            tuesday: (this.housingToBeEdited?.schedule.tuesday || ''),
            wednesday: (this.housingToBeEdited?.schedule.wednesday || ''),
            thursday: (this.housingToBeEdited?.schedule.thursday || ''),
            friday: (this.housingToBeEdited?.schedule.friday || ''),
            saturday: (this.housingToBeEdited?.schedule.saturday || ''),
            sunday: (this.housingToBeEdited?.schedule.sunday || '')
          },
        verified: this.housingToBeEdited?.verified || false,
        house_deactivated: this.housingToBeEdited?.house_deactivated || false    
      });
    }

    editHousingSubmit(): void {
        // Extract form values
        const formValues = this.housingForm.value;
    
        // Create a new user object from form values
        const edit: IHousing = {
          _id: this.housingToBeEdited?._id,
          title: formValues.title || this.housingToBeEdited?.title || '',
          description: formValues.description || this.housingToBeEdited?.description || '',
          owner: formValues.owner || this.housingToBeEdited?.owner || '',
          rating: formValues.rating || this.housingToBeEdited?.rating || '',
          coords: {
              latitude: (formValues.coords?.latitude || this.housingToBeEdited?.coords?.latitude || ''),
              longitude: (formValues.coords?.longitude || this.housingToBeEdited?.coords?.longitude || '')
            },
          photo:  formValues.photo || this.housingToBeEdited?.photo || '',
          address:  formValues.address || this.housingToBeEdited?.address || '',
          availability:  !!formValues.availability || this.housingToBeEdited?.availability || false,
          coffee:  !!formValues.coffee || this.housingToBeEdited?.coffee || false,
          schedule: {
              monday: (formValues.schedule?.monday || this.housingToBeEdited?.schedule?.monday || ''),
              tuesday: (formValues.schedule?.tuesday || this.housingToBeEdited?.schedule?.tuesday || ''),
              wednesday: (formValues.schedule?.wednesday || this.housingToBeEdited?.schedule?.wednesday || ''),
              thursday: (formValues.schedule?.thursday || this.housingToBeEdited?.schedule?.thursday || ''),
              friday: (formValues.schedule?.friday || this.housingToBeEdited?.schedule?.friday || ''),
              saturday: (formValues.schedule?.saturday || this.housingToBeEdited?.schedule?.saturday || ''),
              sunday: (formValues.schedule?.sunday || this.housingToBeEdited?.schedule?.sunday || '')
            },
          verified: !!formValues.verified || this.housingToBeEdited?.verified || false,
          house_deactivated: !!formValues.house_deactivated || this.housingToBeEdited?.house_deactivated || false
          // Include other properties similarly
        };
        console.log(edit)
    
        this.housingService.updateHouse(edit).subscribe({
          next: (editedHousing: IHousing) => {
            console.log('Housing created:', editedHousing);
            // Optionally, reset the form after successful submission
            this.refreshHousingList();
            this.housingForm.reset();
            this.editMode = false;
            this.backToHousingList();
            // You may also want to navigate the housing back to the housing list view or perform any other action
          },
          error: (error: any) => {
            console.error('Error creating housing:', error);
            // Handle error cases
          }
        });
    }
  
  }




import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Place } from '../../models/place';
import { PlaceService } from '../../services/place.service';

@Component({
  selector: 'app-place',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './place.component.html',
  styleUrl: './place.component.css'
})
export class PlaceComponent {
  searchBarPlaceString: string='';
  places: Place[] = [];
  selectedPlace: Place | null = null;
  placeSelected: boolean = false;
  createMode: boolean = false;
  searchPlaceMode: boolean = false;
  editMode: boolean = false;
  searchedPlace: Place | null = null;
  deactivatePlaceId:string='';
  placeToBeEdited: Place | null = null;

  placeForm = new FormGroup({
    title: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
    author: new FormControl('', Validators.required),
    reviews: new FormControl(['']),
    rating: new FormControl(0, Validators.required),
    coords: new FormGroup({
      latitude: new FormControl(0, Validators.required),
      longitude: new FormControl(0, Validators.required)
    }),
    photo: new FormControl('', Validators.required),
    typeOfPlace: new FormGroup({
      bankito: new FormControl(false),
      public: new FormControl(false),
      covered: new FormControl(false)
    }),
    schedule: new FormGroup({
      monday: new FormControl(''),
      tuesday: new FormControl(''),
      wednesday: new FormControl(''),
      thursday: new FormControl(''),
      friday: new FormControl(''),
      saturday: new FormControl(''),
      sunday: new FormControl('')
    }),
    address: new FormControl('', Validators.required),
    creation_date: new FormControl(''),
    modified_date: new FormControl(''),
    deactivated: new FormControl('')
  });

  constructor( public placeService: PlaceService, private formBuilder: FormBuilder){
  }

  ngOnInit(): void {
    // Fetch data from API
    console.log('fetching users');
    this.placeService.getPlaces().subscribe(places => {
      this.places = places;
      console.log(this.places);
    })
    }

    onSelectPlace(place:Place): void{
      this.placeSelected = true;
      this.selectedPlace = place;
    }
    
    backToPlaceList(): void{
      this.placeSelected = false;
      this.selectedPlace = null;
      this.createMode = false;
      this.searchPlaceMode = false;
      this.searchedPlace = null;
      this.editMode = false;
    }
    
    createPlaceBtn(): void{
    this.createMode = true;
    }
    
    onSubmit(): void {
      if (this.placeForm.valid) {
        // Extract form values
        const formValues = this.placeForm.value;
            
        // Create a new user object from form values
        const newPlace: Place = {
          title: formValues.title || '',
          content: formValues.content || '',
          author: formValues.author || '',
          reviews: formValues.reviews || [],
          rating: formValues.rating || 0,
          coords: {
            latitude: (formValues.coords?.latitude || 0),
            longitude: (formValues.coords?.longitude || 0)
          },
          photo: formValues.photo || '',
          typeOfPlace: {
            bankito: (formValues.typeOfPlace?.bankito || false),
            public: (formValues.typeOfPlace?.public || false),
            covered: (formValues.typeOfPlace?.covered || false),
          },
          schedule: {
            monday: (formValues.schedule?.monday || ''),
            tuesday: (formValues.schedule?.tuesday || ''),
            wednesday: (formValues.schedule?.wednesday || ''),
            thursday: (formValues.schedule?.thursday || ''),
            friday: (formValues.schedule?.friday || ''),
            saturday: (formValues.schedule?.saturday || ''),
            sunday: (formValues.schedule?.sunday || '')
          },
          address: formValues.address || '',
          creation_date: new Date,
          modified_date: new Date,
          deactivated: false
        };
    
        this.placeService.createPlace(newPlace).subscribe({
          next: (createdPlace: Place) => {
            console.log('Place created:', createdPlace);
            // Optionally, reset the form after successful submission
            this.refreshPlaceList();
            this.placeForm.reset();
            this.createMode = false;
            // You may also want to navigate the user back to the user list view or perform any other action
          },
          error: (error: any) => {
            console.error('Error creating place:', error);
            // Handle error cases
          }
        });
        
      }
      console.log("no es válido")
    }
    
    refreshPlaceList(): void {
      // Fetch the updated user list from the server
      this.placeService.getPlaces().subscribe(places => {
        this.places = places;
        console.log('Place list updated:', this.places);
      });
    }
    
      searchForPlace(): void {
        this.searchPlaceMode = true;
        if(this.searchBarPlaceString != ''){
          this.placeService.getPlace(this.searchBarPlaceString).subscribe(place => {
            this.searchedPlace = place;
          });
        }else{
          this.searchedPlace = null;
        }
      }
    
      deactivatePlace(): void {
        if(this.selectedPlace){
          this.deactivatePlaceId = this.selectedPlace._id || '';
        }else if(this.searchedPlace){
          this.deactivatePlaceId = this.searchedPlace._id || '';
        }
        this.placeService.deletePlace(this.deactivatePlaceId).subscribe(() => { // Removed empty parentheses
          this.refreshPlaceList();
          this.backToPlaceList();
        });
      }
    
      editPlaceMode(): void {
        this.editMode = true;
        console.log("editando...")
        if(this.selectedPlace){
          this.placeToBeEdited = this.selectedPlace;
        }else if(this.searchedPlace){
          this.placeToBeEdited = this.searchedPlace;
        }
        this.placeForm.patchValue({
          title: this.placeToBeEdited?.title || '',
          content: this.placeToBeEdited?.content || '',
          author: this.placeToBeEdited?.author || '', 
          reviews: this.placeToBeEdited?.reviews || [], 
          rating: this.placeToBeEdited?.rating || 0,
          coords: {
            latitude: (this.placeToBeEdited?.coords?.latitude || 0),
            longitude: (this.placeToBeEdited?.coords?.longitude || 0)
          },
          photo: this.placeToBeEdited?.photo || '',
          typeOfPlace: {
            bankito: (this.placeToBeEdited?.typeOfPlace?.bankito || false),
            public: (this.placeToBeEdited?.typeOfPlace?.public || false),
            covered: (this.placeToBeEdited?.typeOfPlace?.covered || false),
          },
          schedule: {
            monday: (this.placeToBeEdited?.schedule?.monday || ''),
            tuesday: (this.placeToBeEdited?.schedule?.tuesday || ''),
            wednesday: (this.placeToBeEdited?.schedule?.wednesday || ''),
            thursday: (this.placeToBeEdited?.schedule?.thursday || ''),
            friday: (this.placeToBeEdited?.schedule?.friday || ''),
            saturday: (this.placeToBeEdited?.schedule?.saturday || ''),
            sunday: (this.placeToBeEdited?.schedule?.sunday || '')
          },
          address: this.placeToBeEdited?.address || '',
        });
      }
      editPlaceSubmit(): void {
          // Extract form values
          console.log("mandamos edit...")
          const formValues = this.placeForm.value;
          
      
          // Create a new user object from form values
          const edit: Place = {
            _id: this.placeToBeEdited?._id,
            title: formValues.title || this.placeToBeEdited?.title || '',
            content: formValues.content || this.placeToBeEdited?.content || '',
            author: formValues.author || this.placeToBeEdited?.author || '',
            reviews: formValues.reviews || this.placeToBeEdited?.reviews || [],
            rating: formValues.rating || this.placeToBeEdited?.rating || 0,
            coords: {
              latitude: (formValues.coords?.latitude || this.placeToBeEdited?.coords?.latitude || 0),
              longitude: (formValues.coords?.longitude || this.placeToBeEdited?.coords?.longitude || 0)
            },
            photo: formValues.photo || this.placeToBeEdited?.photo || '',
            typeOfPlace: {
              bankito: (formValues.typeOfPlace?.bankito || this.placeToBeEdited?.typeOfPlace?.bankito || false),
              public: (formValues.typeOfPlace?.public || this.placeToBeEdited?.typeOfPlace?.public || false),
              covered: (formValues.typeOfPlace?.covered || this.placeToBeEdited?.typeOfPlace?.covered || false),
            },
            schedule: {
              monday: (formValues.schedule?.monday || this.placeToBeEdited?.schedule?.monday || ''),
              tuesday: (formValues.schedule?.tuesday || this.placeToBeEdited?.schedule?.tuesday || ''),
              wednesday: (formValues.schedule?.wednesday || this.placeToBeEdited?.schedule?.wednesday || ''),
              thursday: (formValues.schedule?.thursday || this.placeToBeEdited?.schedule?.thursday || ''),
              friday: (formValues.schedule?.friday || this.placeToBeEdited?.schedule?.friday || ''),
              saturday: (formValues.schedule?.saturday || this.placeToBeEdited?.schedule?.saturday || ''),
              sunday: (formValues.schedule?.sunday || this.placeToBeEdited?.schedule?.sunday || ''),
            },
            address: formValues.address || this.placeToBeEdited?.address || '',
            creation_date: new Date,
            modified_date: new Date,
            deactivated: false
          };
          console.log("edit: "+edit)
      
          this.placeService.updatePlace(edit).subscribe({
            next: (editedPlace: Place) => {
              console.log('Place created: ', editedPlace);
              // Optionally, reset the form after successful submission
              this.refreshPlaceList();
              this.placeForm.reset();
              this.editMode = false;
              this.backToPlaceList();
              // You may also want to navigate the user back to the user list view or perform any other action
            },
            error: (error: any) => {
              console.error('Error creating place: ', error);
              // Handle error cases
            }
          });
      }
}

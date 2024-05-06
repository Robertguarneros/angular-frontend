import { Component, Output, Input, EventEmitter } from '@angular/core';
import { User } from '../../models/user';
import {FormsModule} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent{
searchBarUserString: string='';
users: User[] = [];//users retrieved from the server
selectedUser: User | null = null;
userSelected: boolean = false;
createMode:boolean=false;
searchUserMode:boolean=false;
editMode:boolean=false;
searchedUser: User | null = null;
deactivateUserId:string='';
userToBeEdited: User | null = null;
pagesize:number=10;
currentPage:number=1;


userForm = new FormGroup({
  first_name: new FormControl('', Validators.required),
  middle_name: new FormControl(''),
  last_name: new FormControl('', Validators.required),
  email: new FormControl('', Validators.required),
  phone_number: new FormControl('', Validators.required),
  gender: new FormControl('', Validators.required),
  user_rating: new FormControl(''),
  photo: new FormControl(''),
  description: new FormControl(''),
  dni: new FormControl(''),
  personality: new FormControl(''),
  password: new FormControl('', Validators.required),
  birth_date: new FormControl('', Validators.required),
  address: new FormControl(''),
  emergency_contact: new FormGroup({
    full_name: new FormControl(''),
    telephone: new FormControl('')
  })
});

constructor( public userService: UserService, private formBuilder: FormBuilder)
{
  
}

ngOnInit(): void {
// Fetch data from API
console.log('fetching users');
this.refreshUserList();
// this.userService.getUsers(this.currentPage, this.pagesize).subscribe(users => {
//   this.users = users;
//   console.log(this.users);
// })
}

onSelectUser(user:User): void{
  this.userSelected = true;
  this.selectedUser = user;
}

backToUserList(): void{
  this.userSelected = false;
  this.selectedUser = null;
  this.createMode = false;
  this.searchUserMode = false;
  this.searchedUser = null;
  this.editMode = false;
}

createUserBtn(): void{
this.createMode = true;
}

onSubmit(): void {
  if (this.userForm.valid) {
    // Extract form values
    const formValues = this.userForm.value;
    
    // Check if birth_date is a valid date string
    const birthDate = formValues.birth_date ? new Date(formValues.birth_date) : null;

    // Create a new user object from form values
    const newUser: User = {
      first_name: formValues.first_name || '',
      middle_name: formValues.middle_name || '',
      last_name: formValues.last_name || '', 
      email: formValues.email || '', 
      phone_number: formValues.phone_number || '',
      gender: formValues.gender || '',
      user_rating: formValues.user_rating || '',
      photo: formValues.photo || '',
      description: formValues.description || '',
      dni: formValues.dni || '',
      personality: formValues.personality || '',
      password: formValues.password || '',
      birth_date: birthDate || new Date(),
      address: formValues.address || '', 
      emergency_contact: {
        full_name: (formValues.emergency_contact?.full_name || ''), // Ensure full_name is a string or empty string
        telephone: (formValues.emergency_contact?.telephone || '') // Ensure telephone is a string or empty string
      }
      // Include other properties similarly
    };

    this.userService.createUser(newUser).subscribe({
      next: (createdUser: User) => {
        console.log('User created:', createdUser);
        // Optionally, reset the form after successful submission
        this.refreshUserList();
        this.userForm.reset();
        this.createMode = false;
        // You may also want to navigate the user back to the user list view or perform any other action
      },
      error: (error: any) => {
        console.error('Error creating user:', error);
        // Handle error cases
      }
    });
    
  }
}

refreshUserList(): void {
  // Fetch the updated user list from the server
  this.userService.getUsers(this.currentPage, this.pagesize).subscribe(users => {
    this.users = users;
    console.log('User list updated:', this.users);
  });
}

previousPage(): void {
  if(this.currentPage > 1){
    this.currentPage--;
    this.refreshUserList();
  }
}

nextPage(): void {
  this.currentPage++;
  this.refreshUserList();
}

  searchForUser(): void {
    this.searchUserMode = true;
    if(this.searchBarUserString != ''){
      this.userService.getUser(this.searchBarUserString).subscribe(user => {
        this.searchedUser = user;
      });
    }else{
      this.searchedUser = null;
    }
  }

  deactivateUser(): void {
    if(this.selectedUser){
      this.deactivateUserId = this.selectedUser._id || '';
    }else if(this.searchedUser){
      this.deactivateUserId = this.searchedUser._id || '';
    }
    this.userService.deleteUser(this.deactivateUserId).subscribe(() => { // Removed empty parentheses
      this.refreshUserList();
      this.backToUserList();
    });
  }



  editUserMode(): void {
    this.editMode = true;
    if(this.selectedUser){
      this.userToBeEdited = this.selectedUser;
    }else if(this.searchedUser){
      this.userToBeEdited = this.searchedUser;
    }
    this.userForm.patchValue({
      first_name: this.userToBeEdited?.first_name || '',
        middle_name:this.userToBeEdited?.middle_name || '',
        last_name:this.userToBeEdited?.last_name || '', 
        email:this.userToBeEdited?.email || '', 
        phone_number:this.userToBeEdited?.phone_number || '',
        gender:this.userToBeEdited?.gender || '',
        user_rating: this.userToBeEdited?.user_rating || '',
        photo: this.userToBeEdited?.photo || '',
        description: this.userToBeEdited?.description || '',
        dni: this.userToBeEdited?.dni || '',
        personality: this.userToBeEdited?.personality || '',
        password:  this.userToBeEdited?.password || '',
        address: this.userToBeEdited?.address || '', 
        emergency_contact: {
          full_name: (this.userToBeEdited?.emergency_contact?.full_name || ''), // Ensure full_name is a string or empty string
          telephone: (this.userToBeEdited?.emergency_contact?.telephone || '') // Ensure telephone is a string or empty string
        }
        

    });
  }
  editUserSubmit(): void {
      // Extract form values
      const formValues = this.userForm.value;
      
      // Check if birth_date is a valid date string
      const birthDate = formValues.birth_date ? new Date(formValues.birth_date) : null;
  
      // Create a new user object from form values
      const edit: User = {
        _id: this.userToBeEdited?._id,
        first_name: formValues.first_name || this.userToBeEdited?.first_name || '',
        middle_name: formValues.middle_name || this.userToBeEdited?.middle_name || '',
        last_name: formValues.last_name || this.userToBeEdited?.last_name || '', 
        email: formValues.email || this.userToBeEdited?.email || '', 
        phone_number: formValues.phone_number || this.userToBeEdited?.phone_number || '',
        gender: formValues.gender || this.userToBeEdited?.gender || '',
        user_rating: formValues.user_rating || this.userToBeEdited?.user_rating || '',
        photo: formValues.photo || this.userToBeEdited?.photo || '',
        description: formValues.description || this.userToBeEdited?.description || '',
        dni: formValues.dni || this.userToBeEdited?.dni || '',
        personality: formValues.personality || this.userToBeEdited?.personality || '',
        password: formValues.password || this.userToBeEdited?.password || '',
        birth_date: birthDate || this.userToBeEdited?.birth_date || new Date(),
        address: formValues.address || this.userToBeEdited?.address || '', 
        emergency_contact: {
          full_name: (formValues.emergency_contact?.full_name || this.userToBeEdited?.emergency_contact?.full_name || ''), // Ensure full_name is a string or empty string
          telephone: (formValues.emergency_contact?.telephone || this.userToBeEdited?.emergency_contact?.telephone || '') // Ensure telephone is a string or empty string
        }
        // Include other properties similarly
      };
      console.log(edit)
  
      this.userService.updateUser(edit).subscribe({
        next: (editedUser: User) => {
          console.log('User created:', editedUser);
          // Optionally, reset the form after successful submission
          this.refreshUserList();
          this.userForm.reset();
          this.editMode = false;
          this.backToUserList();
          // You may also want to navigate the user back to the user list view or perform any other action
        },
        error: (error: any) => {
          console.error('Error creating user:', error);
          // Handle error cases
        }
      });
  }

}

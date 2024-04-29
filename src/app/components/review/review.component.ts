import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Review } from '../../models/review';
import { FormBuilder,FormControl, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import {FormsModule} from '@angular/forms';
@Component({
  selector: 'app-review',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {
  token: string | null = null;
  id: string|null= null;
  loggedIn: boolean = false;
  user: User | null = null;
  selectedOption: string = 'author';
  searchBar: string='';
  reviews: Review[] = [];
  reviewsFilter: Review[] = [];
 review: Review | null = null;
selectedReview: Review | null = null;
reviewSelected: boolean = false;
createMode:boolean=false;
searchReviewMode:boolean=false;
editMode:boolean=false;
searchedReviews: Review[] =[];
deactivateReviewId:string = '';
username: string | null=null;
reviewToBeEdited: Review | null = null;

reviewForm = new FormGroup({
  title: new FormControl('', Validators.required),
  content: new FormControl('', Validators.required),
  author: new FormControl(''),
  stars: new FormControl(0,Validators.required),
  place_id: new FormControl('',Validators.required),
  housing_id: new FormControl('',Validators.required),
  review_deactivated: new FormControl(false,Validators.required),
  creation_date: new FormControl(''),
  modified_date:new FormControl(''),
});


  constructor( public reviewService: ReviewService,public userService: UserService,public authService: AuthService,private formBuilder: FormBuilder)
  {
    
  }
  

  ngOnInit(): void {
  this.loggedIn = this.reviewService.isLoggedIn();
  this.id = this.reviewService.getUser();
  this.username = this.authService.getUserName();
  console.log(this.username);
  this.reviewService.getReviews().subscribe(reviews => {
    
    this.reviews=reviews;
    
  })
  }
  onSelectReview(review:Review): void{
    this.reviewSelected = true;
    this.selectedReview = review;
    this.searchReviewMode= false;
  }
  
  backToReviewList(): void{
    this.reviewSelected = false;
    this.selectedReview = null;
    this.createMode = false;
    this.searchReviewMode = false;
    this.searchedReviews = [];
    this.editMode = false;
  }
  createReviewBtn(): void{
    this.createMode = true;
  }
  editReviewBtn(): void{
      this.editMode = true;
  }
  searchForReview(): void {
    this.searchReviewMode = true;
    this.reviewSelected= false;
    if(this.searchBar != ''){
      if(this.selectedOption=='author'){
        console.log('searchbarrrrr:'+this.searchBar);
        this.reviewService.getReviewsbyAuthor(this.searchBar).subscribe(review => {
          this.searchedReviews = review;
        });
      }
      else if(this.selectedOption=='place'){
        this.reviewService.getReviewsbyPlace(this.searchBar).subscribe(review => {
          this.searchedReviews = review;
        });
      }
      else if(this.selectedOption=='housing'){
        this.reviewService.getReviewsbyHousing(this.searchBar).subscribe(review => {
          this.searchedReviews = review;
        });
      }
    }else{
      //this.searchedReview = [];
    }

  }

  onSubmit(): void {
    
      const formValues = this.reviewForm.value;
      
      
      
  
      
      const newReview: Review = {
        
        content: formValues.content || '',
        stars: formValues.stars||0 ,
        title: formValues.title || '',
        place_id: formValues.place_id||'',
        housing_id: formValues.housing_id||'',
        review_deactivated: formValues.review_deactivated||false,
        
        
      };
  
      this.reviewService.createReview(newReview).subscribe({
        next: (createdReview: Review) => {
          console.log('Review created:', createdReview);
        
          this.refreshReviewList();
          this.reviewForm.reset();
          this.createMode = false;
          
        },
        error: (error: any) => {
          console.error('Error creating user:', error);
          // Handle error cases
        }
      });
      
    //}
  }
  refreshReviewList(): void {
    
    this.reviewService.getReviews().subscribe(reviews => {
      this.reviews = reviews;
      console.log('User list updated:', this.reviews);
    });
  }
  editReviewSubmit(): void {
    
    const formValues = this.reviewForm.value;
    this.editMode=true;
    
    const edit:   Review = {
      _id: this.selectedReview?._id,
      title: formValues.title || this.selectedReview?.title || '',
      content: formValues.content || this.selectedReview?.content || '',
      author:  this.selectedReview?.author|| '',
      place_id: formValues.place_id || this.selectedReview?.place_id || '', 
      housing_id: formValues.housing_id || this.selectedReview?.housing_id || '', 
      stars: formValues.stars || this.selectedReview?.stars|| 0,
      review_deactivated: formValues.review_deactivated || this.selectedReview?.review_deactivated || false,
      
      
  
    };
    console.log(edit)

    this.reviewService.updateReview(edit).subscribe({
      next: (editedReview: Review) => {
        console.log('Review edited:', editedReview);
        this.refreshReviewList();
        this.reviewForm.reset();
        this.editMode = false;
        this.backToReviewList();
        
      },
      error: (error: any) => {
        console.error('Error creating user:', error);
      }
    });
  }
  deactivateReview(): void {
    
    if(this.selectedReview){
      this.deactivateReviewId = this.selectedReview._id || '';
      this.reviewService.deleteReview(this.deactivateReviewId).subscribe(()=> {
        this.refreshReviewList();
        this.backToReviewList();
      });
    }
    
  }
}

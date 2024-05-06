import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { PlaceComponent } from './components/place/place.component';
import { ReviewComponent } from './components/review/review.component';
import { HousingComponent } from './components/housing/housing.component';
import { ConversationComponent } from './components/conversation/conversation.component';

export const routes: Routes = [
    {path: 'user',title:'User', component: UserComponent}, 
    {path: 'place',title:'Place', component: PlaceComponent},
    {path: 'review',title:'Review', component: ReviewComponent},
    {path: 'housing',title:'Housing', component: HousingComponent},
    {path: 'conversation',title:'Conversation', component: ConversationComponent}
    ];

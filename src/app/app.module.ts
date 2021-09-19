import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MaterialModule } from './material.module';
import { LoginComponent } from './components/login/login.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './auth/auth.guard';
import { TemporaryStorageService } from './services/temporary-storage.service';
import { LocalStorageService} from 'ngx-webstorage';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatRoomComponent,
    RegisterComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,

  ],
  exports: [
  ],
  providers: [DatePipe, AuthGuard,TemporaryStorageService,LocalStorageService],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FileSystemService } from './services/FileSystemService';
import { FolderContentComponent } from './components/folder-content';
import { HttpClient } from 'selenium-webdriver/http';
import { AddressBarComponent } from './components/address-bar';


@NgModule({
  declarations: [
    AppComponent,
    FolderContentComponent,
    AddressBarComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    FileSystemService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

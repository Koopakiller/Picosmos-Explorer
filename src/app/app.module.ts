import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';

import { AppComponent } from './components/app';
import { FileSystemService } from './services/FileSystemService';
import { FolderContentComponent } from './components/folder-content';
import { AddressBarComponent } from './components/address-bar';
import { TreeViewComponent } from './components/tree-view';


@NgModule({
  declarations: [
    AppComponent,
    FolderContentComponent,
    AddressBarComponent,
    TreeViewComponent
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

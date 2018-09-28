import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';

import { AppComponent } from './components/App';
import { FileSystemService } from './services/FileSystemService';
import { FolderContentComponent } from './components/FolderContent';
import { AddressBarComponent } from './components/AddressBar';
import { TreeViewComponent } from './components/TreeView';
import { LeftViewComponent } from './components/LeftView';


@NgModule({
  declarations: [
    AppComponent,
    FolderContentComponent,
    AddressBarComponent,
    TreeViewComponent,
    LeftViewComponent
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

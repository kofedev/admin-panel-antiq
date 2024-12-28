import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ElementRef, Renderer2 } from '@angular/core';
import {LanguageService} from "../../services/language.service";
import {Subscription} from "rxjs";
import {Language} from "../../model/language.model";
import {SnapshotService} from "../../services/snapshot.service";
import {UiElementService} from "../../services/ui-element.service";

@Component({
  selector: 'app-admin-tools',
  templateUrl: './admin-tools.component.html',
  styleUrls: ['./admin-tools.component.scss']
})
export class AdminToolsComponent implements OnInit, OnDestroy  {
  @ViewChild('myElement') myElement: ElementRef | undefined;

  constructor(private languageService: LanguageService,
              private shapshotService: SnapshotService,
              public uiElementService: UiElementService,
              private renderer: Renderer2, private el: ElementRef) { }

  exportUiElementsByLanguageToExcel$!: Subscription;
  uploadExcelFile$!: Subscription;
  exportCategoriesToJson$!: Subscription;
  exportProductsToJson$!: Subscription;

  ngOnDestroy(): void {
    if (this.exportUiElementsByLanguageToExcel$) this.exportUiElementsByLanguageToExcel$.unsubscribe();
    if (this.uploadExcelFile$) this.uploadExcelFile$.unsubscribe();
    if (this.getAllLanguages$) this.getAllLanguages$.unsubscribe();
    if (this.exportCategoriesToJson$) this.exportCategoriesToJson$.unsubscribe();
    if (this.exportProductsToJson$) this.exportProductsToJson$.unsubscribe();
  }

  file!: File | null;
  languages: Language[] = [];
  getAllLanguages$!: Subscription;

  public readonly EXCEL_FILE_MAX_SIZE = 10_000_000; // 10 Mb.

  _showAlertOnFileSize = false;
  _showAlertUploading = false;

  ngOnInit(): void {
    this.loadLanguageArray();
  }

  loadLanguageArray() {
    this.getAllLanguages$ = this.languageService.getAllLanguages().subscribe({
      next: value => {
        this.languages = structuredClone(value);
        this.languages.sort((a, b) => a.languageId - b.languageId);
      }
    })
  }

  exportUiElementsCurrentLanguageToExcel(language: Language) {
    this.exportUiElementsByLanguageToExcel$ =
      this.languageService.exportUiElementsByLanguageToExcel(language.languageId).subscribe({
        next: data => {
          const blobUrl = URL.createObjectURL(data);
          const link = document.createElement('a');
          link.href = blobUrl;
          const currentDate = new Date().toISOString().slice(0, 16).replace('T', '-');
          const fileName = `UI_ELEMENTS_FOR_${language.languageCode}_${currentDate}`;
          link.download = fileName + '.xlsx';
          link.click();
          // Clean up the Blob URL
          URL.revokeObjectURL(blobUrl);
        },

        error: err => { console.error('Error downloading file:'); }

      })}

  onFileChange(event: any) {
    this.file = event.target.files[0];
  }

  upload() {
    if (this.file) {

      // console.log("FILE SIZE: " + this.file.size);
      if (this.file.size > this.EXCEL_FILE_MAX_SIZE) {
        this._showAlertOnFileSize = true;
        return;
      }

      this.uploadExcelFile$ = this.languageService.importUiElementsForLanguageFromExcel(this.file).subscribe({
        next: value => {
          this.resetInput();
          this.file = null;
          this._showAlertUploading = true;
        }
      })

    } else {
      // console.log("Error upload file");
    }
  }

  resetInput() {
    // Reset the input field value to clear it
    this.myElement!.nativeElement.value = '';
  }


  exportCategoriesToJson(): void {
    this.exportCategoriesToJson$ = this.shapshotService.exportCategoriesToJson().subscribe({
      next: data => {
        const blob = new Blob([data], { type: 'application/json' });
        // Create a link element
        const link = document.createElement('a');
        // Set the href attribute with the data URI
        link.href = window.URL.createObjectURL(blob);

        // Set the download attribute with the desired file name
        const currentDate = new Date().toISOString().slice(0, 16).replace('T', '-');
        const fileName = `SNAPSHOT-CATEGORIES-${currentDate}.json`;
        link.download = fileName;

        // Append the link to the body
        document.body.appendChild(link);
        // Trigger a click on the link to initiate the download
        link.click();
        // Remove the link from the DOM
        document.body.removeChild(link);
      }
    })
  }



  exportProductsToJson(): void {
    this.exportProductsToJson$ = this.shapshotService.exportProductsToJson().subscribe({
      next: data => {
        const blob = new Blob([data], { type: 'application/json' });
        // Create a link element
        const link = document.createElement('a');
        // Set the href attribute with the data URI
        link.href = window.URL.createObjectURL(blob);

        // Set the download attribute with the desired file name
        const currentDate = new Date().toISOString().slice(0, 16).replace('T', '-');
        const fileName = `SNAPSHOT-PRODUCTS-${currentDate}.json`;
        link.download = fileName;

        // Append the link to the body
        document.body.appendChild(link);
        // Trigger a click on the link to initiate the download
        link.click();
        // Remove the link from the DOM
        document.body.removeChild(link);
      }
    })
  }

}

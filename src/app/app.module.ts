import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { RouterModule, Routes } from "@angular/router";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthInterceptorService } from "./services/auth.interceptor.service";
import { AccountComponent } from './components/account/account.component';
import { AuthGuard } from "./auth.guard";
import { StaffComponent } from './components/staff/staff.component';
import { LanguageComponent } from './components/language/language.component';
import { UiElementComponent } from './components/ui-element/ui-element.component';
import { LanguageEditComponent } from './components/language/language-edit/language-edit.component';
import { LanguageNewComponent } from './components/language/language-new/language-new.component';
import { ErrorComponent } from './components/error/error.component';
import { StaffEditComponent } from './components/staff/staff-edit/staff-edit.component';
import { StaffNewComponent } from './components/staff/staff-new/staff-new.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { BackupDataComponent } from './components/backup-data/backup-data.component';
import { UiElementEditComponent } from './components/ui-element/ui-element-edit/ui-element-edit.component';
import { DescriptorEditorComponent } from './components/descriptor/descriptor-editor/descriptor-editor.component';
import { CategoryComponent } from './components/category/category.component';
import { CategoryEditorComponent } from './components/category/category-editor/category-editor.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { CategoryTreeComponent } from './components/category/category-tree/category-tree.component';
import { CategoryRootComponent } from './components/category/category-root/category-root.component';
import { SortSubCategoriesPipe } from './pipes/sort-sub-categories.pipe';
import { ProductEditorComponent } from './components/product-editor/product-editor.component';
import { ProductExplorerComponent } from './components/product-explorer/product-explorer.component';
import { ProductRootComponent } from './components/product-root/product-root.component';
import { SortProductsByDatePipe } from './pipes/sort-products-by-date.pipe';
import { SortProductsByPricePipe } from './pipes/sort-products-by-price.pipe';
import { SortProductsByQuantityPipe } from './pipes/sort-products-by-quantity.pipe';
import { SortProductsByTitlePipe } from './pipes/sort-products-by-title.pipe';
import { ImageByMainPipe } from './pipes/image-by-main.pipe';
import { ProductFilterTitleByLanguagePipe } from './pipes/product-filter-title-by-language.pipe';
import { ImageEditComponent } from './components/image-edit/image-edit.component';
import {NgOptimizedImage} from "@angular/common";
import { ImageEditOneComponent } from './components/image-edit-one/image-edit-one.component';
import { UiElementBigComponent } from './components/ui-element-big/ui-element-big.component';
import { UiElementBigEditComponent } from './components/ui-element-big/ui-element-big-edit/ui-element-big-edit.component';
import { AdminToolsComponent } from './components/admin-tools/admin-tools.component';
import { UrlFileNamePipe } from './pipes/url-file-name.pipe';
import { OrderExplorerComponent } from './components/order-explorer/order-explorer.component';
import {OrderByDatePipe} from "./pipes/order-by-date.pipe";
import {OrderDetailComponent} from "./components/order-detail/order-detail.component";
import {ProductInfoComponent} from "./components/product-info/product-info.component";
import {SanitizeHtmlPipe} from "./pipes/sanitize-html.pipe";
import {SortDescriptorsByLanguagePipe} from "./pipes/sort-descriptors-by-language.pipe";
import {SortUiElementsByKeyPipe} from "./pipes/sort-ui-elements-by-key.pipe";
import {AboutComponent} from "./components/common/about/about.component";
import {OrderByIdPipe} from "./pipes/order-by-id.pipe";

const appRoutes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'auth', component: AuthenticationComponent},
  {path: 'account', component: AccountComponent, canActivate: [AuthGuard(["Staff", "Admin"])]},

  {path: 'staff', component: StaffComponent, canActivate: [AuthGuard(["Admin"])]},
  {path: 'staff/edit/:staffEmail', component: StaffEditComponent, canActivate: [AuthGuard(["Admin"])]},
  {path: 'staff/new', component: StaffNewComponent, canActivate: [AuthGuard(["Admin"])]},

  {path: 'language', component: LanguageComponent, canActivate: [AuthGuard(["Admin"])]},
  {path: 'language/edit/:languageId', component: LanguageEditComponent, canActivate: [AuthGuard(["Admin"])]},
  {path: 'language/new', component: LanguageNewComponent, canActivate: [AuthGuard(["Admin"])]},

  {path: 'ui-elements', component: UiElementComponent, canActivate: [AuthGuard(["Staff", "Admin"])]},
  {path: 'ui-elements/edit/:key', component: UiElementEditComponent, canActivate: [AuthGuard(["Staff", "Admin"])]},

  {path: 'ui-elements-big', component: UiElementBigComponent, canActivate: [AuthGuard(["Staff", "Admin"])]},
  {path: 'ui-elements-big/edit/:key', component: UiElementBigEditComponent, canActivate: [AuthGuard(["Staff", "Admin"])]},

  {path: 'category', component: CategoryRootComponent, canActivate: [AuthGuard(["Staff", "Admin"])]},
  {path: 'category/:categoryId', component: CategoryComponent, canActivate: [AuthGuard(["Staff", "Admin"])]},
  {path: 'category/edit/:categoryId', component: CategoryEditorComponent, canActivate: [AuthGuard(["Staff", "Admin"])]},

  {path: 'product', component: ProductRootComponent, canActivate: [AuthGuard(["Staff", "Admin"])]},
  {path: 'product/category/:categoryId', component: ProductExplorerComponent, canActivate: [AuthGuard(["Staff", "Admin"])]},
  {path: 'product/edit/:productId', component: ProductEditorComponent, canActivate: [AuthGuard(["Staff", "Admin"])]},
  {path: 'product/info/:productId', component: ProductInfoComponent, canActivate: [AuthGuard(["Staff", "Admin"])]},

  {path: 'image/:imageId', component: ImageEditOneComponent, canActivate: [AuthGuard(["Staff", "Admin"])]},

  {path: 'tools', component: AdminToolsComponent, canActivate: [AuthGuard(["Admin"])]},

  // {path: 'about', component: AboutComponent, canActivate: [AuthGuard(["Staff", "Admin"])]},
  {path: 'about', component: AboutComponent},

  {path: 'order', component: OrderExplorerComponent, canActivate: [AuthGuard(["Staff", "Admin"])]},
  {path: 'order/detail/:orderId', component: OrderDetailComponent, canActivate: [AuthGuard(["Staff", "Admin"])]},

  {path: '**', component: ErrorComponent},
  {path: 'error', component: ErrorComponent},

]


@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    AccountComponent,
    StaffComponent,
    LanguageComponent,
    UiElementComponent,
    LanguageEditComponent,
    LanguageNewComponent,
    ErrorComponent,
    StaffEditComponent,
    StaffNewComponent,
    HomePageComponent,
    BackupDataComponent,
    UiElementEditComponent,
    DescriptorEditorComponent,
    CategoryComponent,
    CategoryEditorComponent,
    LanguageSelectorComponent,
    CategoryTreeComponent,
    CategoryRootComponent,
    SortSubCategoriesPipe,
    ProductEditorComponent,
    ProductExplorerComponent,
    ProductRootComponent,
    SortProductsByDatePipe,
    SortProductsByPricePipe,
    SortProductsByQuantityPipe,
    SortProductsByTitlePipe,
    ImageByMainPipe,
    ProductFilterTitleByLanguagePipe,
    ImageEditComponent,
    ImageEditOneComponent,
    UiElementBigComponent,
    UiElementBigEditComponent,
    AdminToolsComponent,
    UrlFileNamePipe,
    OrderExplorerComponent,
    ProductInfoComponent
  ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes, {enableTracing: false}),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        NgOptimizedImage,
        OrderByDatePipe,
        SanitizeHtmlPipe,
        SortDescriptorsByLanguagePipe,
        SortUiElementsByKeyPipe,
        OrderByIdPipe
    ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }],
  exports: [
    CategoryTreeComponent,
    DescriptorEditorComponent,
    ImageEditComponent,
    ImageByMainPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

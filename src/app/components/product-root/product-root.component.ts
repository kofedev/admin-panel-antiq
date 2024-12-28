import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CategoryService} from "../../services/category.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-product-root',
  templateUrl: './product-root.component.html',
  styleUrls: ['./product-root.component.scss']
})
export class ProductRootComponent implements OnInit, OnDestroy {

  categoryId: number | undefined;
  constructor(private router: Router, private categoryService: CategoryService) {}

  getRootCategory$!: Subscription;

  ngOnDestroy() {
    if (this.getRootCategory$) this.getRootCategory$.unsubscribe();
  }

  ngOnInit(): void { this.init(); }

  init() {
    this.getRootCategory$ = this.categoryService.getRootCategory().subscribe({
      next: value => {
        if (value != null) {
          this.router.navigateByUrl("/product/category/" + value.categoryId).then(r => console.log("Routing"));
        } else {
          console.error("Root category not received");
        }
      }
    })
  }


}

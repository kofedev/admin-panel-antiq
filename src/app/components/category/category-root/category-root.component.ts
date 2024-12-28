import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryService} from "../../../services/category.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-category-root',
  templateUrl: './category-root.component.html',
  styleUrls: ['./category-root.component.scss']
})
export class CategoryRootComponent implements OnInit, OnDestroy {

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
          this.router.navigateByUrl("/category/" + value.categoryId).then(r => console.log("Routing"));
        } else {
          console.error("Root category not received");
        }
      }
    })
  }

}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {UiElementService} from "../../services/ui-element.service";
import {StatService} from "../../services/stat.service";
import {Stat} from "../../model/stat";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {

  stat!: Stat;
  getStat$!: Subscription;

  constructor(public uiElementService: UiElementService, private statService: StatService) { }

  ngOnDestroy(): void {
    if (this.getStat$) this.getStat$.unsubscribe();
    }

  ngOnInit(): void {
    this.loadStat();
    }

  loadStat() {
    this.getStat$ = this.statService.getStat().subscribe({
      next: value => {
        this.stat = value;
      }
    })
  }

}

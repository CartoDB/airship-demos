import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('categoryWidget') categoryWidget: ElementRef;

  categories = [
    { name: 'Bars & Restaurants', value: 1000, color: '#FABADA' },
    { name: 'Fashion', value: 900 },
    { name: 'Grocery', value: 800 },
    { name: 'Health', value: 400 },
    { name: 'Shopping mall', value: 250 },
    { name: 'Transportation', value: 1000 },
    { name: 'Leisure', value: 760 }
  ]

  getSelectedCategories() {
    return this.categoryWidget.nativeElement.getSelectedCategories();
  }

  clearWidgetSelection() {
    this.categoryWidget.nativeElement.clearSelection();
  }
}

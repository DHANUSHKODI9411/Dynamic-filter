import { Component, OnInit } from '@angular/core';
import { DynamicFilterService } from '../dynamic-filter-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-filter-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-filter-component.html',
  styleUrl: './dynamic-filter-component.css',
})
export class DynamicFilterComponent  implements OnInit { 

  public data : any[] =[]; // for data in table
  public tableKeys : string[] = []; // for table title
  public selectedFile : string = 'cars.json'; // default file
  public origianlData : any[] = []; // for orginal data
  public filterKeys : string[]=[] // for filter keys
  public activeFilters : any = {}; // for active filters
  public filter : any ={}; // for dropdown
  public selectedColumn : string =''; // for selected column in dropdown


  constructor( private dynamicFilterService : DynamicFilterService) {} // inject service

  ngOnInit(): void {
    this.loadData(); // load data on component initialization
  }

  loadData(){
    this.dynamicFilterService.loadData(this.selectedFile).subscribe((data: any[]) => {

      this.origianlData = data; // store original data
      this.data = data; // set data for table
      this.tableKeys = Object.keys(data[0]); // set table keys
     
    });
  }
  changeData(file: string){
    this.selectedFile = file; // update selected file
    this.loadData(); // reload data based on new file selection
  }

  applyFilter(key: string, value: any){
    this.activeFilters[key] = value; // set active filter

    this.data = this.origianlData.filter((item) => {
      for (let key in this.activeFilters) { // iterate through active filters
        if (item[key] !== this.activeFilters[key]) { // check if item matches active filter
          return false; // if any filter does not match, exclude the item
        }
      }
      return true; // include the item if all filters match
    });
  }
  applyContainsFilter(value: string){
    this.data = this.origianlData.filter((item) => {
      for (let key in this.activeFilters) { // iterate through active filters
        if (item[key] !== this.activeFilters[key]) { // check if item matches active filter
          return false; // if any filter does not match, exclude the item
        }
      }
      return Object.values(item).some(val => String(val).toLowerCase().includes(value.toLowerCase())); // include the item if any value contains the search term
    });
  }
}

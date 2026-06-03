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
  public originalData : any[] = []; // for original data
  public filterKeys : string[]=[] // for filter keys
  public activeFilters : any = {}; // for active filters
  public filter : any ={}; // for dropdown
  public selectedColumn : string =''; // for selected column in dropdown
  public selectedOperator : string =''; // for selected operator in dropdown
  public rangeValues : number[] = []; // for range filter values


  constructor( private dynamicFilterService : DynamicFilterService) {} 

  ngOnInit(): void {
    this.loadData(); 
  }

  loadData(){
    this.dynamicFilterService.loadData(this.selectedFile).subscribe((data: any[]) => {

      this.originalData = data; // store original data
      this.data = data; // set data for table
      this.tableKeys = Object.keys(data[0]); // set table keys
     
    });
  }
  changeData(file: string){
    this.selectedFile = file;
    this.loadData(); 
  }
  // method to apply filter based on selected column and value
  applyFilter(key: string, value: any){
    this.activeFilters[key] = value; 

    this.data = this.originalData.filter((item) => {
      for (let key in this.activeFilters) { 
        if (item[key] !== this.activeFilters[key]) { 
          return false; 
        }
      }
      return true; 
    });
  }
  onColumnChange() {

  // extract values from selected column
  const values = this.originalData
    .map(item => Number(item[this.selectedColumn]))
    .filter(val => !isNaN(val));

  // ✅ unique + sorted
  this.rangeValues = [...new Set(values)].sort((a, b) => a - b);
  console.log(this.rangeValues);
}
  // method to apply contains filter based on selected column and value
//   applyContainsFilter(value: string){

//   if (!this.selectedColumn || !value) {
//     this.data = this.originalData;
//     return;
//   }

//   this.data = this.originalData.filter(item => {
//     const columnValue = String(item[this.selectedColumn]).toLowerCase();

//     return columnValue.includes(value.toLowerCase());
//   });
// }
//   applyRangeFilter(min: any, max: any) {

//   const minValue = Number(min);
//   const maxValue = Number(max);

//   if (!this.selectedColumn || isNaN(minValue) || isNaN(maxValue)) {
//     this.data = this.originalData;
//     return;
//   }

//   this.data = this.originalData.filter(item => {
//     const val = Number(item[this.selectedColumn]);

//     return val >= minValue && val <= maxValue;
//   });
// }

// unified method to apply both contains and range filters based on selected operator
  applyFilterUnified(val: any, max?: any) {

  if (!this.selectedColumn) {
    this.data = this.originalData;
    return;
  }

  // ✅ Contains filter
  if (this.selectedOperator === 'contains') {

    if (!val) {
      this.data = this.originalData;
      return;
    }

    this.data = this.originalData.filter(item =>
      String(item[this.selectedColumn])
        .toLowerCase()
        .includes(val.toLowerCase())
    );
  }

  // ✅ Improved Range filter
if (this.selectedOperator === 'range') {

  const minValue = Number(val);
  const maxValue = Number(max);

  this.data = this.originalData.filter(item => {

    const num = Number(item[this.selectedColumn]);

    // ✅ Skip non-numeric values
    if (isNaN(num)) {
      return true;
    }

    // ✅ Only min provided
    if (!isNaN(minValue) && isNaN(maxValue)) {
      return num >= minValue;
    }

    // ✅ Only max provided
    if (isNaN(minValue) && !isNaN(maxValue)) {
      return num <= maxValue;
    }

    // ✅ Both provided
    if (!isNaN(minValue) && !isNaN(maxValue)) {

      // ✅ Validate range
      if (minValue > maxValue) {
        alert("Min value cannot be greater than Max");
        return true;
      }

      return num >= minValue && num <= maxValue;
    }

    // ✅ No filter applied
    return true;
  });
}
  }
}


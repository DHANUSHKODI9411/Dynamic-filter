import { Component, OnInit } from '@angular/core';
import { DynamicFilterService } from '../dynamic-filter-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dynamic-filter-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dynamic-filter-component.html',
  styleUrl: './dynamic-filter-component.css',
})
export class DynamicFilterComponent implements OnInit {

  public data: any[] = []; //  holds the data to be displayed in the table
  public tableKeys: string[] = [];//  holds the keys of the data objects for dynamic table headers

  public selectedDataset: string = 'Cars'; // default dataset
  public selectedColumn: string = ''; // holds the currently selected column for filtering
  public selectedOperator: string = 'contains'; // holds the currently selected filter operator (e.g., contains, equals, greater than, etc.)

  public searchValue: string = ''; // holds the value entered by the user for filtering
  public minValue: number | null = null; // holds the minimum value for range filters (e.g., greater than)
  public maxValue: number | null = null; // holds the maximum value for range filters (e.g., less than)

  public rangeValue: number [] = [] ; // holds the range values for range filters (e.g., between)

  constructor(private dynamicFilterService: DynamicFilterService) {}

  ngOnInit(): void {
    this.loadData();
  }

  // ✅ LOAD DATA
  loadData() {
    this.dynamicFilterService.getData(this.selectedDataset)
      .subscribe((data: any) => {

        this.data = data;

        if (data.length > 0) {
          this.tableKeys = Object.keys(data[0]);
        }

        this.rangeValue =[];
      });
  }

  resetFilter() {

  // ✅ clear filter fields
  this.searchValue = '';
  this.minValue = null;
  this.maxValue = null;

  this.selectedColumn = '';
  this.selectedOperator = 'contains';

  // ✅ reload original data
  this.loadData();
}

onColumnChange() {

  const value = this.data
    .map((item) => item[this.selectedColumn])
    .filter((val) => val !== null && val !== undefined);

  this.rangeValue = [... new Set(value)].sort((a, b) => a - b); } // unique values for dropdown
  // ✅ APPLY FILTER
  applyFilterUnified(val: any, max?: any) {

    if (!this.selectedColumn) return;

    const params = {
      dataset: this.selectedDataset, // dataset to filter (e.g., Cars, Employees, etc.)
      column: this.selectedColumn, // column to filter on (e.g., Make, Model, Price, etc.)
      filterType: this.selectedOperator, // type of filter (e.g., contains, equals, greater than, less than, between, etc.)
      value: val, // value to filter by (e.g., "Toyota", 50000, etc.)
      max: max // optional max value for range filters (e.g., less than, between, etc.)
    };

    this.dynamicFilterService.getFilteredData(params)
      .subscribe((res: any) => {

        this.data = res;

        if (res.length > 0) {
          this.tableKeys = Object.keys(res[0]);
        }
      });
  }
}
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

  public data: any[] = [];
  public tableKeys: string[] = [];

  public selectedDataset: string = '';
  public selectedColumn: string = '';
  public selectedOperator: string = 'contains';

  public searchValue: string = '';
  public minValue: number | null = null;
  public maxValue: number | null = null;

  public rangeValue: number[] = [];
  public isnumber: boolean = false;
  public sortOrder: string = '';

  // Multi-select UI state for current column
  public columnValues: any[] = [];
  public filteredData: any[] = [];
  public searchText: string = '';
  public selectedValue: any[] = [];

  // Store selected values per column
  public selectedFilters: { [key: string]: string[] } = {};

  // Count how many columns currently have filters
  get selectedFiltersCount(): number {
    return Object.keys(this.selectedFilters).length;
  }

  constructor(private dynamicFilterService: DynamicFilterService) { }

  ngOnInit(): void {
    this.loadData();
  }

  // LOAD DATA
  loadData() {
    if (!this.selectedDataset) return;

    this.dynamicFilterService.getData(this.selectedDataset)
      .subscribe((data: any) => {
        this.data = data;

        if (data.length > 0) {
          this.tableKeys = Object.keys(data[0]);
        } else {
          this.tableKeys = [];
        }

        this.rangeValue = [];

        if (this.selectedColumn) {
          this.onColumnChange();
        }
      });
  }

  // RESET ALL FILTERS
  resetFilter() {
    this.searchValue = '';
    this.minValue = null;
    this.maxValue = null;

    this.selectedColumn = '';
    this.selectedOperator = 'contains';

    this.columnValues = [];
    this.filteredData = [];
    this.searchText = '';
    this.selectedValue = [];
    this.selectedFilters = {};

    this.loadData();
  }

  // HANDLE COLUMN CHANGE
  onColumnChange() {
    if (!this.selectedColumn) {
      this.columnValues = [];
      this.filteredData = [];
      this.selectedValue = [];
      this.searchText = '';
      this.rangeValue = [];
      this.isnumber = false;
      return;
    }

    const values = this.data
      .map(item => item[this.selectedColumn])
      .filter(val => val !== null && val !== undefined);

    // Unique values for dropdown
    this.columnValues = [...new Set(values)];

    // Restore already selected values for current column
    this.selectedValue = this.selectedFilters[this.selectedColumn]
      ? [...this.selectedFilters[this.selectedColumn]]
      : [];

    // Show values that are not already selected
    this.filteredData = this.columnValues.filter(val =>
      !this.selectedValue.includes(val?.toString())
    );

    this.searchText = '';

    // Detect numeric column
    this.isnumber = values.length > 0 && values.every(val => !isNaN(Number(val)));

    // Prepare range values if numeric
    if (this.isnumber) {
      const numericValues = values.map(val => Number(val));
      this.rangeValue = [...new Set(numericValues)].sort((a, b) => a - b);
    } else {
      this.rangeValue = [];
    }

    // If current operator is range but selected column is not numeric
    if (!this.isnumber && this.selectedOperator === 'range') {
      this.selectedOperator = 'contains';
    }
  }

  // FILTER DROPDOWN SEARCH
  filterDropdown() {
    const search = this.searchText.toLowerCase().trim();

    this.filteredData = this.columnValues.filter(val => {
      const text = val?.toString().toLowerCase() || '';
      const notAlreadySelected = !this.selectedValue.includes(val?.toString());
      return text.includes(search) && notAlreadySelected;
    });
  }

  // TOGGLE SELECTED VALUE FOR CURRENT COLUMN
  toggleSelection(value: any) {
    const stringValue = value?.toString();

    if (!this.selectedColumn || !stringValue) return;

    if (!this.selectedFilters[this.selectedColumn]) {
      this.selectedFilters[this.selectedColumn] = [];
    }

    const index = this.selectedFilters[this.selectedColumn].indexOf(stringValue);

    if (index === -1) {
      this.selectedFilters[this.selectedColumn].push(stringValue);
    } else {
      this.selectedFilters[this.selectedColumn].splice(index, 1);
    }

    // Remove empty column array completely
    if (this.selectedFilters[this.selectedColumn].length === 0) {
      delete this.selectedFilters[this.selectedColumn];
    }

    // Sync current view
    this.selectedValue = this.selectedFilters[this.selectedColumn]
      ? [...this.selectedFilters[this.selectedColumn]]
      : [];

    this.filterDropdown();
  }

  // CLEAR ONLY CURRENT COLUMN SELECTION
  clearCurrentColumnSelection() {
    if (!this.selectedColumn) return;

    delete this.selectedFilters[this.selectedColumn];
    this.selectedValue = [];
    this.searchText = '';
    this.filteredData = [...this.columnValues];
  }

  // REMOVE FILTER FROM APPLIED FILTERS SUMMARY
  toggleSelectionFromSummary(column: string, value: string) {
    if (!this.selectedFilters[column]) return;

    this.selectedFilters[column] = this.selectedFilters[column].filter(v => v !== value);

    if (this.selectedFilters[column].length === 0) {
      delete this.selectedFilters[column];
    }

    if (this.selectedColumn === column) {
      this.selectedValue = this.selectedFilters[column]
        ? [...this.selectedFilters[column]]
        : [];
      this.filterDropdown();
    }
  }

  // NORMAL FILTER (CONTAINS / RANGE)
  applyFilterUnified(val: any, max?: any) {
    if (!this.selectedColumn) return;

    const params = {
      dataset: this.selectedDataset,
      column: this.selectedColumn,
      filterType: this.selectedOperator,
      value: val,
      max: max
    };

    this.dynamicFilterService.getFilteredData(params)
      .subscribe((res: any) => {
        this.data = res;

        if (res.length > 0) {
          this.tableKeys = Object.keys(res[0]);
        } else {
          this.tableKeys = [];
        }
      });
  }

  // SORT ASC
  sortAsc() {
    if (!this.selectedColumn) return;

    const params = {
      dataset: this.selectedDataset,
      sortColumn: this.selectedColumn,
      sortOrder: 'asc'
    };

    this.dynamicFilterService.getSortedData(params)
      .subscribe((res: any) => {
        this.data = res;

        if (res.length > 0) {
          this.tableKeys = Object.keys(res[0]);
        } else {
          this.tableKeys = [];
        }
      });
  }

  // SORT DESC
  sortDesc() {
    if (!this.selectedColumn) return;

    const params = {
      dataset: this.selectedDataset,
      sortColumn: this.selectedColumn,
      sortOrder: 'desc'
    };

    this.dynamicFilterService.getSortedData(params)
      .subscribe((res: any) => {
        this.data = res;

        if (res.length > 0) {
          this.tableKeys = Object.keys(res[0]);
        } else {
          this.tableKeys = [];
        }
      });
  }

  // APPLY MULTI-COLUMN FILTER
  applyMultiFilter() {
    if (!this.selectedDataset) return;

    const cleanedFilters: { [key: string]: string[] } = {};

    Object.keys(this.selectedFilters).forEach(key => {
      if (this.selectedFilters[key] && this.selectedFilters[key].length > 0) {
        cleanedFilters[key] = this.selectedFilters[key];
      }
    });

    if (Object.keys(cleanedFilters).length === 0) return;

    const payload = {
      dataset: this.selectedDataset,
      filters: cleanedFilters
    };

    this.dynamicFilterService.getMultiFilteredData(payload)
      .subscribe((res: any) => {
        this.data = res;

        if (res.length > 0) {
          this.tableKeys = Object.keys(res[0]);
        } else {
          this.tableKeys = [];
        }
      });
  }
}
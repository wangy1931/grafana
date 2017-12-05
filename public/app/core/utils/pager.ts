function clamp(val, min, max) {
  return Math.min(Math.max(min, val), max);
}

export default class Pager {
  currentPage: any;
  totalItems: any;
  pageSize: any;
  startIndex: any;
  totalPages: any;
  startItem: any;
  endItem: any;

  constructor(totalItems, pageSize, startingPage) {
    this.currentPage = startingPage;
    this.totalItems = totalItems;
    this.pageSize = pageSize;
    this.startIndex = 0;
    this.updateMeta();
  }

  get pageCount() {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get hasNextPage() {
    return this.currentPage < this.totalPages;
  }

  get hasPreviousPage() {
    return this.currentPage > 1;
  }

  changePage(pageNumber) {
    this.currentPage = pageNumber;
    this.updateMeta();
  }

  nextPage() {
    this.currentPage += 1;
    this.updateMeta();
  }

  previousPage() {
    this.currentPage -= 1;
    this.updateMeta();
  }

  setTotalItems(count) {
    this.totalItems = count;
    this.updateMeta();
  }

  setPageSize(count) {
    this.pageSize = count;
    this.updateMeta();
  }

  updateMeta() {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.currentPage = clamp(this.currentPage, 1, this.totalPages);

    this.startItem = ((this.currentPage - 1) * this.pageSize) + 1;
    this.startItem = clamp(this.startItem, 0, this.totalItems);

    this.endItem = (this.startItem - 1) + this.pageSize;
    this.endItem = clamp(this.endItem, 0, this.totalItems);

    this.startIndex = this.startItem - 1;
  }
}

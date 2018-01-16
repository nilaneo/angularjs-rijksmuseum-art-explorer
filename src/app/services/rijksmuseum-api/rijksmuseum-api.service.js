import { defaultSortOrderToken } from '../../values/sort-orders.value';

export class RijksmuseumApiService {
  static get $inject() {
    return ['$http', defaultSortOrderToken];
  }
  constructor($http, defaultSortOrder) {
    this.$http = $http;
    this.defaultSortOrder = defaultSortOrder;
  }

  getList({
    searchQuery = '',
    sortOrder = this.defaultSortOrder,
    page = 1,
    pageSize = 10
  } = {}) {
    return this.$http
      .get('https://www.rijksmuseum.nl/api/en/collection', {
        params: {
          format: 'json',
          key: '3tYxhQmI',
          q: searchQuery,
          s: sortOrder,
          ps: pageSize,
          p: page
        }
      })
      .then((response) => response.data);
  }

  getDetails(objectNumber) {
    return this.$http
      .get(`https://www.rijksmuseum.nl/api/en/collection/${objectNumber}`, {
        params: {
          format: 'json',
          key: '3tYxhQmI'
        }
      })
      .then((response) => response.data.artObject);
  }
}

export const rijksmuseumApiServiceToken = 'rijksmuseumApiService';
export const rijksmuseumApiServiceDeclaration = {
  [rijksmuseumApiServiceToken]: RijksmuseumApiService
};

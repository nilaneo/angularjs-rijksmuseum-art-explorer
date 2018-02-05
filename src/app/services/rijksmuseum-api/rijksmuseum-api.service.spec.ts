import { IPromise } from 'angular';
import {
  RijksmuseumApiService,
  IArtObjectsListResponseData,
  IArtObjectDetailsResponseData,
  IArtObjectDetails,
} from './rijksmuseum-api.service';
import { SortOrder, defaultSortOrderToken } from '../../values/sort-orders.value';

describe('rijksmuseumApiService', () => {
  let rijksmuseumApiService: RijksmuseumApiService;
  let $http: {
    get: jest.Mock,
  };
  let $httpGetDefer: any;

  beforeEach(() => {
    $http = {
      get: jest.fn(),
    };
    $httpGetDefer = {};
    $httpGetDefer.promise = new Promise((resolve, reject) => {
      $httpGetDefer.resolve = resolve;
      $httpGetDefer.reject = reject;
    });
    $http.get.mockReturnValue($httpGetDefer.promise);
    rijksmuseumApiService = new RijksmuseumApiService($http as any, SortOrder.ARTIST_ASC);
  });

  describe('$inject', () => {
    it('should return list of dependencies', () => {
      expect(RijksmuseumApiService.$inject).toEqual(['$http', defaultSortOrderToken]);
    });
  });

  describe('getList', () => {
    let getListResult: IPromise<IArtObjectsListResponseData>;

    describe('when all params are passed', () => {
      beforeEach(() => {
        getListResult = rijksmuseumApiService.getList({
          searchQuery: 'some search query',
          sortOrder: SortOrder.RELEVANCE,
          page: 23,
          pageSize: 5,
        });
      });

      it('should make get request for collection with passed params', () => {
        expect($http.get).toHaveBeenCalledWith('https://www.rijksmuseum.nl/api/en/collection', {
          params: {
            format: 'json',
            key: '3tYxhQmI',
            q: 'some search query',
            s: SortOrder.RELEVANCE,
            ps: 5,
            p: 23,
          },
        });
      });

      describe('when get request is done', () => {
        let artObjectsListResponseData: IArtObjectsListResponseData;

        beforeEach(() => {
          artObjectsListResponseData = {
            artObjects: [
              { objectNumber: 'abc123', title: 'Art #1' },
              { objectNumber: 'bcd345', title: 'Art #2' },
            ],
            count: 2,
          };

          $httpGetDefer.resolve({
            data: artObjectsListResponseData,
          });
        });

        describe('returned value', () => {
          it('should be promise resolved by response\'s data', () => {
            expect(getListResult).resolves.toEqual(artObjectsListResponseData);
          });
        });
      });
    });

    describe('when params are not passed', () => {
      beforeEach(() => {
        getListResult = rijksmuseumApiService.getList();
      });

      it('should make get request for collection with passed params', () => {
        expect($http.get).toHaveBeenCalledWith('https://www.rijksmuseum.nl/api/en/collection', {
          params: {
            format: 'json',
            key: '3tYxhQmI',
            q: '',
            s: SortOrder.ARTIST_ASC,
            ps: 10,
            p: 1,
          },
        });
      });

      describe('when get request is done', () => {
        let artObjectsListResponseData: IArtObjectsListResponseData;

        beforeEach(() => {
          artObjectsListResponseData = {
            artObjects: [
              { objectNumber: 'abc123', title: 'Art #1' },
              { objectNumber: 'bcd345', title: 'Art #2' },
            ],
            count: 2,
          };

          $httpGetDefer.resolve({
            data: artObjectsListResponseData,
          });
        });

        describe('returned value', () => {
          it('should be promise resolved by response\'s data', () => {
            return expect(getListResult).resolves.toEqual(artObjectsListResponseData);
          });
        });
      });
    });
  });

  describe('getDetails', () => {
    let getDetailsResult: IPromise<IArtObjectDetails>;

    beforeEach(() => {
      getDetailsResult = rijksmuseumApiService.getDetails('abc123');
    });

    it('should make get request for details', () => {
      expect($http.get).toHaveBeenCalledWith('https://www.rijksmuseum.nl/api/en/collection/abc123', {
        params: {
          format: 'json',
          key: '3tYxhQmI',
        },
      });
    });

    describe('when details request is done', () => {
      let artObjectDetailsResponseData: IArtObjectDetailsResponseData;

      beforeEach(() => {
        artObjectDetailsResponseData = {
          artObject: {
            longTitle: 'very long title',
            description: 'nice art object',
            webImage: {
              url: '...',
            },
          },
        };
        $httpGetDefer.resolve({
          data: artObjectDetailsResponseData,
        });
      });

      describe('returned value', () => {
        it('should be promise resolved by response\'s data', () => {
          return expect(getDetailsResult).resolves.toEqual(artObjectDetailsResponseData.artObject);
        });
      });
    });
  });
});

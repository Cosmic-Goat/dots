import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createContext } from '../../../utils';
import {listLoadBalancers} from './list-load-balancers';
import * as MOCK from './list-load-balancers.mock';

describe('load-balancer', () => {
  const PAGE = 3;
  const PER_PAGE = 26;
  const URL = '/load_balancers';
  const TOKEN = 'bearer-token';
  const mock = new MockAdapter(axios);
  mock.onGet(URL).reply(
    MOCK.response.headers.status,
    MOCK.response.body,
    MOCK.response.headers,
  );
  const context = createContext({
    axios,
    token: TOKEN,
  });
  beforeEach(() => {
    mock.resetHistory();
  });
  describe('list-load-balancers', () => {
    it('should be a fn', () => {
      expect(typeof listLoadBalancers).toBe('function');
    });
    it('should return a fn', () => {
      expect(typeof listLoadBalancers(context)).toBe('function');
    });
    it('should return a valid response', async () => {
      const _listLoadBalancers = listLoadBalancers(context);
      const response = await _listLoadBalancers({page: PAGE, per_page: PER_PAGE});
      Object.assign(response, { request: mock.history.get[0]});
      /// validate response schema
      expect(typeof response).toBe('object');
      expect(typeof response.data).toBe('object');
      expect(typeof response.headers).toBe('object');
      expect(typeof response.request).toBe('object');
      expect(typeof response.status).toBe('number');
      /// validate request
      const {request} = response;
      expect(request.url).toBe(context.endpoint + URL);
      expect(request.method).toBe('get');
      expect(request.headers).toMatchObject(MOCK.request.headers);
      expect(request.params).toBeDefined();
      expect(request.params.page).toBe(PAGE);
      expect(request.params.per_page).toBe(PER_PAGE);
      /// validate data
      expect(response.data).toBeDefined();
      expect(response.data.links).toBeDefined();
      expect(response.data.meta).toBeDefined();
      expect(response.data.load_balancers).toBeDefined();
      const {load_balancers} = response.data;
      const [loadBalancer] = load_balancers;
      expect(typeof loadBalancer.id).toBe('string');
      expect(typeof loadBalancer.name).toBe('string');
      /// validate headers
      const {headers, status} = response;
      expect(headers).toMatchObject(MOCK.response.headers);
      expect(status).toBe(MOCK.response.headers.status);
    });
    it('should have default parameters', async () => {
      const defaultPage = 1;
      const defaultper_page = 25;
      const _listLoadBalancers = listLoadBalancers(context);
      const response = await _listLoadBalancers({});
      Object.assign(response, { request: mock.history.get[0]});
      /// validate request
      const {request} = response;
      expect(request.params).toBeDefined();
      expect(request.params.page).toBe(defaultPage);
      expect(request.params.per_page).toBe(defaultper_page);
    });
  });
});
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createContext } from '../../../utils';
import {getDatabaseCluster} from './get-database-cluster';
import * as MOCK from './get-database-cluster.mock';

describe('database', () => {
  const DATABASE_CLUSTER_ID = MOCK.response.body.database.id;
  const URL = `/databases/${DATABASE_CLUSTER_ID}`;
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
  describe('get-database-cluster', () => {
    it('should be a fn', () => {
      expect(typeof getDatabaseCluster).toBe('function');
    });
    it('should return a fn', () => {
      expect(typeof getDatabaseCluster(context)).toBe('function');
    });
    it('should return a valid response', async () => {
      const _getDatabaseCluster = getDatabaseCluster(context);
      const response = await _getDatabaseCluster({
        database_cluster_id: DATABASE_CLUSTER_ID,
      });
      Object.assign(response, {request: mock.history.get[0]});
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
      /// validate data
      expect(response.data).toBeDefined();
      const {database} = response.data;
      expect(typeof database.id).toBe('string');
      expect(typeof database.name).toBe('string');
      /// validate headers
      const {headers, status} = response;
      expect(headers).toMatchObject(MOCK.response.headers);
      expect(status).toBe(MOCK.response.headers.status);
    });
  });
});

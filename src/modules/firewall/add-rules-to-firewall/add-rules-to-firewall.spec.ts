import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createContext } from '../../../utils';
import {addRulesToFirewall} from './add-rules-to-firewall';
import * as MOCK from './add-rules-to-firewall.mock';

describe('firewall', () => {
  const FIREWALL_ID = 'firewall-id';
  const URL = `/firewalls/${FIREWALL_ID}/rules`;
  const TOKEN = 'bearer-token';
  const mock = new MockAdapter(axios);
  mock.onPost(URL, MOCK.request.body).reply(
    MOCK.response.headers.status,
    undefined,
    MOCK.response.headers,
  );
  const context = createContext({
    axios,
    token: TOKEN,
  });
  beforeEach(() => {
    mock.resetHistory();
  });
  describe('add-rules-to-firewall', () => {
    it('should be a fn', () => {
      expect(typeof addRulesToFirewall).toBe('function');
    });
    it('should return a fn', () => {
      expect(typeof addRulesToFirewall(context)).toBe('function');
    });
    it('should return a valid response', async () => {
      const _addRulesToFirewall = addRulesToFirewall(context);
      const response = await _addRulesToFirewall({
        ...MOCK.request.body,
        firewall_id: FIREWALL_ID,
      });
      Object.assign(response, {request: mock.history.post[0]});
      /// validate response schema
      expect(typeof response).toBe('object');
      expect(typeof response.headers).toBe('object');
      expect(typeof response.request).toBe('object');
      expect(typeof response.status).toBe('number');
      /// validate request
      const {request} = response;
      expect(request.url).toBe(context.endpoint + URL);
      expect(request.method).toBe('post');
      expect(request.headers).toMatchObject(MOCK.request.headers);
      expect(request.data).toBeDefined();
      const requestBody = JSON.parse(request.data);
      expect(requestBody).toMatchObject(MOCK.request.body);
      /// validate data
      expect(response.data).toBeUndefined();
      /// validate headers
      const {headers, status} = response;
      expect(headers).toMatchObject(MOCK.response.headers);
      expect(status).toBe(MOCK.response.headers.status);
    });
  });
});
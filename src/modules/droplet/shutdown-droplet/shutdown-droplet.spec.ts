import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createContext } from '../../../utils';
import {shutdownDroplet} from './shutdown-droplet';
import * as MOCK from './shutdown-droplet.mock';

describe('droplet', () => {
  const DROPLET_ID = Number(MOCK.response.body.action.resource_id);
  const URL = `/droplets/${DROPLET_ID}/actions`;
  const TOKEN = 'bearer-token';
  const mock = new MockAdapter(axios);
  mock.onPost(URL, MOCK.request.body).reply(
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
  describe('shutdown-droplet', () => {
    it('should be a fn', () => {
      expect(typeof shutdownDroplet).toBe('function');
    });
    it('should return a fn', () => {
      expect(typeof shutdownDroplet(context)).toBe('function');
    });
    it('should return a valid response', async () => {
      const _shutdownDroplet = shutdownDroplet(context);
      const response = await _shutdownDroplet({
        droplet_id: DROPLET_ID,
      });
      Object.assign(response, {request: mock.history.post[0]});
      /// validate response schema
      expect(typeof response).toBe('object');
      expect(typeof response.data).toBe('object');
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
      expect(requestBody.type).toBe('shutdown');
      /// validate data
      expect(response.data).toBeDefined();
      const {action} = response.data;
      expect(typeof action.id).toBe('number');
      expect(typeof action.status).toBe('string');
      /// validate headers
      const {headers, status} = response;
      expect(headers).toMatchObject(MOCK.response.headers);
      expect(status).toBe(MOCK.response.headers.status);
    });
  });
});
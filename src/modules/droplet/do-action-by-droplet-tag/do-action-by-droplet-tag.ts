import { IResponse, IContext } from '../../../types';
import { IAction } from '../../action';

export interface IDoActionByDropletTagApiResponse {
  actions: IAction[];
}

export interface IDoActionByDropletTagApiRequest {
  tag_name: string;
  type: "power_cycle"
    | "power_on"
    | "power_off"
    | "shutdown"
    | "enable_private_networking"
    | "enable_ipv6"
    | "enable_backups"
    | "disable_backups"
    | "snapshot"
    | string;
}

export type DoActionByDropletTagResponse = IResponse<IDoActionByDropletTagApiResponse>;

export const doActionByDropletTag = ({
  httpClient,
}: IContext) => ({
  tag_name,
  type,
}: IDoActionByDropletTagApiRequest): Promise<Readonly<DoActionByDropletTagResponse>> => {
  const path = '/droplets/actions';
  const queryParams = {tag_name};
  const body = {type};
  const url = `${path}`;

  return httpClient.post<IDoActionByDropletTagApiResponse>(url, body, {
    params: queryParams,
  });
};

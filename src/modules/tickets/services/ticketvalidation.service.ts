import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { GroupsApiService } from '../../groups/services/groupapi.service';
import mongoose from "mongoose";
import { ProvidersApiService } from '../../providers/services/providerapi.service';
import AppConfig from '../../../../configs/app.config';
import axios from "axios";
import { RequestContextService } from '../../shares/appRequestContext';
import { InvalidWorkspaceEnum } from "../enums/invalid-workspace.enum";

@Injectable()
export class TicketsValidationsService {

    constructor(
        private readonly groupsApiService: GroupsApiService,
        private readonly providersApiService: ProvidersApiService
    ) { }

    async validateGroup(groupId: ObjectId): Promise<boolean> {

        const group = await this.groupsApiService.findById(groupId);
        if (!group) return false;

        return true;
    }

    async validateProvider(providerId: ObjectId): Promise<boolean> {
       
        const provider = await this.providersApiService.findById(providerId);
        if (!provider) return false;

        return true;
    }

    async checkWorkspaceAccess(workspaceId: number) {
        const { authorization } = RequestContextService.getHeaders();
        const workspaceResult = await this.getWorkspaces(authorization); // {data, statusCode}
        if (workspaceResult.statusCode !== 200) {
            return { isWorkspaceValid: false, error: InvalidWorkspaceEnum.INTERNAL_SERVER_ERROR }
        }

        const workspaces = workspaceResult.data;
        let workspaceAccess = false;

        for (const workspace of workspaces) {
            if (workspace.id === workspaceId) {
                workspaceAccess = true;
                break;
            }
        }

        if (!workspaceAccess) {
            return { isWorkspaceValid: false, error: InvalidWorkspaceEnum.NO_ACCESS };
        }

        return { isWorkspaceValid: true }

    }


    async getWorkspaces(bearerToken: string) {
        const config = {
            method: 'get',
            url: `${AppConfig().sanawProfileServiceUrl}`,
            headers: {
                Authorization: bearerToken
            }
        };

        let result: { statusCode: number, data?: any };

        try {
            const response = await axios(config);
            result = { statusCode: 200, data: response.data };
        } catch (err) {
            result = { statusCode: 400 };
        }

        return result;
    }
}
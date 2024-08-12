import { Injectable } from "@nestjs/common";
import { TicketsRepository } from "../ticket.repository";
import { ObjectId } from "mongodb";
import { GroupsApiService } from "src/modules/groups/services/groupapi.service";
import mongoose from "mongoose";
import { ProvidersApiService } from "src/modules/providers/services/providerapi.service";
import { Provider } from "src/modules/providers/provider.schema";
import { Group } from "src/modules/groups/group.schema";


@Injectable()
export class TicketsValidationsService {

    constructor(
        private readonly groupsApiService: GroupsApiService,
        private readonly providersApiService: ProvidersApiService
    ) { }


    async validateTicket(
        { groupId, providerId, workspaceId }:
            { groupId: ObjectId, providerId: ObjectId, workspaceId: number }
    ): Promise<boolean> {
        const isGroupIdValid = mongoose.Types.ObjectId.isValid(groupId);
        const isProviderIdValid = mongoose.Types.ObjectId.isValid(groupId);
        if (!isGroupIdValid || !isProviderIdValid) false;

        const group = await this.groupsApiService.findById(groupId);
        const provider = await this.providersApiService.findById(providerId);
        if (!group || !provider) return false;
        //validate workspace
        return true;
    }
}
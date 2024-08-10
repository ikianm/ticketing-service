import { RequestContext } from "nestjs-request-context";

export class RequestContextService {

    static getContext(): RequestContext {
        const ctx: RequestContext = RequestContext.currentContext?.req;
        return ctx;
    }

    static getUserInfo(): {
        id: string,
        phoneNumber: string,
        name: string,
        roles: []
    } {
        const ctx: any = RequestContext.currentContext?.req;
        return ctx?.user;
    }
}
import { RequestContext } from "nestjs-request-context";

export class RequestContextService {

    static getContext(): RequestContext {
        const ctx = RequestContext.currentContext?.req;
        return ctx;
    }

    static getHeaders() {
        const ctx = RequestContext.currentContext?.req;
        return ctx?.headers;
    }

    static getUserInfo(): {
        id: string,
        phoneNumber: string,
        name: string,
        isAdmin: boolean
    } {
        const ctx: any = RequestContext.currentContext?.req;
        return ctx?.user;
    }
}
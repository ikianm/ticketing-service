
export { };
declare global {
    namespace Express {
        export interface Request {
            fileError?: string
            user?: {
                id: string,
                phoneNumber: string,
                name: string,
                isAdmin: boolean
            }
        }
    }
}
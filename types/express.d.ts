
export { };
declare global {
    namespace Express {
        export interface Request {
            fileError?: string
        }
    }
}
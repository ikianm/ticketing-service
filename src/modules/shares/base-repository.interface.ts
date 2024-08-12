
export interface IBaseRepository<T> {
    create(data: Partial<T>): Promise<T>;
    findAll(requestQuery?: { skip: number, limit: number }): Promise<T[]>;
    findByName?(name: string): Promise<T>;
}
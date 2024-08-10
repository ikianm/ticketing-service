
export interface IBaseRepository<T> {
    create(data: Partial<T>): Promise<T>;
    findAll(): Promise<T[]>;
    findByName(name: string): Promise<T>;
}
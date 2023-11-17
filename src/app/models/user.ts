export class User {
  constructor (
    public id: number,
    public name: string,
    public email: string,
    public emailVerifiedAt: string,
    public idCard: string,
    public role: string,
    public type: string,
    public zone: string,
    public creationDate: string,
    public updatedDate: string,
  ) {}
}

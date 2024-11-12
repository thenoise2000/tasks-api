class Task {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public createdAt: Date,
    public isCompleted: boolean
  ) {}
}

export default Task;
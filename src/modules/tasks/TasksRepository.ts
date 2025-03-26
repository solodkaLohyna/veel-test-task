import axios from 'axios';

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

class TasksRepository {
  async getAll(): Promise<Task[]> {
    const response = await axios.get(
      'https://jsonplaceholder.typicode.com/todos?_limit=10',
    );
    return response.data;
  }

  async get(taskId: number): Promise<Task> {
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/todos/${taskId}`,
    );
    return response.data;
  }

  async create(task: Task): Promise<Task> {
    const response = await axios.post(
      'https://jsonplaceholder.typicode.com/todos',
      task,
    );
    return response.data;
  }

  async update(taskId: number, task: Task): Promise<Task> {
    const response = await axios.patch(
      `https://jsonplaceholder.typicode.com/todos/${taskId}`,
      task,
    );
    return response.data;
  }

  async delete(taskId: number): Promise<void> {
    await axios.delete(`https://jsonplaceholder.typicode.com/todos/${taskId}`);
  }
}

export const tasksRepository = new TasksRepository();
export type { Task };

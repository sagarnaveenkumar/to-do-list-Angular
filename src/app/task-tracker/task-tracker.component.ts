import { Component } from '@angular/core';
import { TaskService } from '../task.service';

export interface Task {
  task_name: string;
  task_id: any;
  description: string;
  status: string; 
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

@Component({
  selector: 'app-task-tracker',
  templateUrl: './task-tracker.component.html',
  styleUrl: './task-tracker.component.css'
})
export class TaskTrackerComponent {

  email!: string;
  user!:string;
  message!: string;
  tasks: Task[] = [];
  pop!: boolean;
  user_id!: string;
  description!: string;
  status!: string;
  task_name!: string;
  editeMode!: boolean;
  editeTaskId!: string;
  Id!: string;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void { }

  submit(): void {
    this.gettasks();
  }
  validateEmail(email: string): boolean {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  }

  gettasks() {
    this.clear();
    this.tasks = [];
    this.message = '';

    if (this.validateEmail(this.email)) {
      const [localPart] = this.email.split('@');
      const [user_id] = localPart.split('.');
      this.user_id = user_id;
      this.taskService.getpartcular(this.user_id).subscribe(
        (res) => {
          alert('task founded!');
          if (res && res.length > 0) {
            this.tasks = res;
          } else {
            this.message = 'No tasks found for this user';
          }
        },
        (err) => {
          alert('task not founde');
          this.message = 'Error fetching tasks. Please try again later.';
          this.tasks = [];
        }
      );
    } else {
      this.message = 'Invalid email address. Please enter a valid Gmail address.';
    }
  }

  sent(): void {
    if (this.editeMode) {
      this.updateTask();
    } else {
      this.createtask();
    }
  }

  validater(user: string): boolean {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(user);
  }


  createtask() {
    this.clear();
    this.message = '';
    alert('creating task');
    const id = this.user;

    if (this.validater(id)) {
      const [localPart] = id.split('@');
      const [user_id] = localPart.split('.');
      this.Id = user_id;

      const info = {
        user_id: this.Id,
        task_name: this.task_name,
        description: this.description,
        status: this.status
      };
    
      this.taskService.send(info).subscribe(
        (response) => {
          this.message = 'Task created successfully';
          this.task_name = '';
          this.description = '';
          this.status = '';
        },
        (err) => {
          this.message = 'Error creating task. Please try again later.';
          console.error(err);
        }
      );
    }
    else
    {
      this.message = 'Invalid email address. Please enter a valid Gmail address.';  
    }
  }

  editeTask(task: any): void {
    this.editeMode = true;
    this.editeTaskId = task.task_id;
    this.task_name = task.task_name;
    this.description = task.description;
    this.status = task.status;
    this.pop = true;
    this.tasks = []; 
  }

  updateTask(): void {
    this.email = '';
    const task = {
      task_name: this.task_name,
      description: this.description,
      status: this.status
    };
    alert('updated successfully');
    const taskId = +this.editeTaskId;
    this.taskService.updateTask(taskId, task).subscribe(
      (response) => {
      this.message = 'task updated.';
      this.editeMode = false;
      this.clear();
      this.pop = false;
      this.email='';
      },
      (error) => {
        console.error(error);
      }
    );
  }

  delete(task: any): void {
    this.message = '';

    this.taskService.remove(task.task_id).subscribe(
      () => {
        console.log('daleted');
        this.message = 'task successfully dalated';
        this.tasks = this.tasks.filter(t => t.task_id !== task.task_id);
        alert('deleted');
        this.message = 'task deleted successfully.';
        this.email = '';
      },
      (err) => {
        console.error('Failed to delete the task:', err);
        this.message = 'Failed to delete the task.';
      }
    );
  }

  navigatetoadd(): void {
    this.email='';
    this.message = '';
    this.task_name = '';
    this.user='';
    this.description = '';
    this.status = '';
    this.tasks = [];
    this.pop = true;
    this.editeMode = false;
    this.editeTaskId = '';
  }

  clear(): void {
    this.pop = false;
  }

  close(): void {
    this.pop = false;
    this.editeMode = false;
    this.user='';
    this.task_name='';
    this.description='';
    this.status='';
  }

  back(): void {
    this.gettasks();
    this.pop = false;
    this.user='';
    this.task_name='';
    this.description='';
    this.status='';
  }
}


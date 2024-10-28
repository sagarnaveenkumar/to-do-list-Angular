import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:9090/user/get';
  private apiUrl1= 'http://localhost:9090/user/delete';
  
  constructor(private http: HttpClient) {}
  
  getpartcular(user_id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${user_id}`);
  }

  send(info: any): Observable<any> {
    return this.http.post(this.apiUrl,info);
    
  }

  remove(taskId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl1}/${taskId}`);
  }

  updateTask(taskId: Number, task:any): Observable<any> {
    console.log(`Updating task ${taskId} with values:`, task);
    return this.http.patch(`${this.apiUrl }/${taskId}`,task )
  }

}

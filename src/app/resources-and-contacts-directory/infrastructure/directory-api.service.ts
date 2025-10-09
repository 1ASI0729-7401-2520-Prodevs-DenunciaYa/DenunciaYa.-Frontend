
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DirectoryEntity } from '../domain/model/directory.entity';

@Injectable({
  providedIn: 'root'
})
export class DirectoryApiService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAll(): Observable<DirectoryEntity[]> {
    const url = `${this.apiUrl}/directory-entities`;
    return this.http.get<DirectoryEntity[]>(url);
  }
}

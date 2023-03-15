import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment } from '../model/Comment';

@Injectable({
  providedIn: 'root'
})
export class CommentSectionService {

  constructor(private http: HttpClient) { }
  header = new HttpHeaders();
  url = "";

  public get(pageIndex: number, pageSize: number) {
    let url = "http://localhost/Susthita_Projects/ERP/infraerp/ERP/ajax/comments.php";
    this.header.set('Content-Type', 'application/x-www-form-urlencoded');
    const payload = new HttpParams()
      .set('action', 'GetComments')
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize);

    return this.http.post(url, payload, { headers: this.header });
  }

  public post(comment: Comment) {
    let url = "http://localhost/Susthita_Projects/ERP/infraerp/ERP/ajax/comments.php";
    this.header.set('Content-Type', 'application/x-www-form-urlencoded');
    const payload = new HttpParams()
      .set('action', 'InsertComments')
      .set('name', comment.name)
      .set('message', comment.message)
    return this.http.post(url, payload, { headers: this.header });
  }

  public update(id: number, comment : string) {
    let url = "http://localhost/Susthita_Projects/ERP/infraerp/ERP/ajax/comments.php";
    this.header.set('Content-Type', 'application/x-www-form-urlencoded');
    const payload = new HttpParams()
      .set('action', 'UpdateComments')
      .set('commentId', id)
      .set('comment', comment);
    return this.http.post(url, payload, { headers: this.header });
  }

  public delete(id: any) {
    let url = "http://localhost/Susthita_Projects/ERP/infraerp/ERP/ajax/comments.php";
    this.header.set('Content-Type', 'application/x-www-form-urlencoded');
    const payload = new HttpParams()
      .set('action', 'DeleteComment')
      .set('commentId', id);
    return this.http.post(url, payload, { headers: this.header });
  }
}

import { HttpHeaders, HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Comment } from './model/Comment';
import { CommentSectionService } from './services/comment-section.service';

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss']
})
export class CommentSectionComponent implements OnInit {

  constructor(private commentSectionService: CommentSectionService) { }

  @ViewChild('scrollComment', { static: false }) public scrollComment !: ElementRef;
  inputComments: string = "";

  comments: Comment[] = [];
  totalCount = 0;
  pageIndex = 0;
  pageSize = 10;

  showMenuIcon = null;
  isMenuOpen = false;
  editMode = false;
  editMessage = "";
  deleteCommentString = "";
  deleteCommentId = null;
  items: string[] = ["Om", "Krushna", "Dhruti"];
  mentionConfig = {
    items: [ "Noah", "Liam", "Mason", "Jacob"],
    triggerChar: "@"
  }

  async ngOnInit(): Promise<void> {
    await this.getComments(this.pageIndex, this.pageSize);
    this.pageIndex += 1;
    this.pageSize = this.pageSize + 10;
  }

  addComments() {
    if (this.inputComments !== "") {
      let comment = {
        name: "Om Joshi",
        message: this.inputComments,
      }
      this.commentSectionService.post(comment).subscribe((response: any) => {
        this.pushToCommentList(response);
      });
      this.inputComments = "";
    }
  }

  async getComments(pageIndex: number, pageSize: number) {
    try {
      const response: any = await this.commentSectionService.get(this.pageIndex, this.pageSize).toPromise();
      const filteredResponse = response.data.filter((el: any) => {
        return !this.comments.find((element: any) => {
          return element.id === el.id;
        });
      });
      this.comments = [...this.comments, ...filteredResponse];
      this.totalCount = response.totalCount;
    } catch (error) {
      console.log(error)
    }

  }


  pushToCommentList(comments: any) {
    comments.data.map((comment: any) => {
      this.comments.unshift(JSON.parse(JSON.stringify(comment)));
    })
  }

  updateComment(id: any) {
    if (this.editMessage !== "") {
      this.commentSectionService.update(id, this.editMessage).subscribe((response: any) => {
        console.log(response)
        let updatedId = response.data[0].id;
        this.comments.forEach((data, index) => {
          if (data.id == updatedId) {
            this.comments[index] = response.data[0];
            return;
          }
        });
      });
      this.editMode = false;
    }
  }

  deleteComment() {
    this.commentSectionService.delete(this.deleteCommentId).subscribe(() => {
      this.comments.forEach((data, index) => {
        if (data.id == this.deleteCommentId) {
          this.comments.splice(index, 1);
          $('#ConfirmDelete').appendTo("body").modal('hide');

          return;
        }
      });
    });
    this.editMode = false;
  }
  enterComment(id: any) {
    if (!this.editMode) {
      this.showMenuIcon = id;
    }
  }

  exitComment() {
    this.showMenuIcon = null;
    this.editMode = false;
  }

  editComment(id: any) {
    this.showMenuIcon = id;
    this.editMode = true;
    this.editMessage = "";
  }

  cancelEditComment() {
    this.editMode = false;
  }
  onKey(e: any) {
    this.editMessage = e.target.value;
  }

  openDeleteModel(deleteCommentString: string, deleteCommentId: any) {
    this.deleteCommentString = deleteCommentString;
    this.deleteCommentId = deleteCommentId;
    $('#ConfirmDelete').appendTo("body").modal('show');
  }

  public async onScrollLoadData() {
    const scrollCommentElement = this.scrollComment.nativeElement;
    if (scrollCommentElement.clientHeight - Math.round(scrollCommentElement.scrollTop) === scrollCommentElement.scrollHeight - 1 && this.comments.length != this.totalCount) {
      await this.getComments(this.pageIndex, this.pageSize);
      this.pageIndex += 1;
      this.pageSize = this.pageSize + 10;
    }
  }
}

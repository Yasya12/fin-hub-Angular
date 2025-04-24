import { signalStoreFeature, withMethods, withState } from "@ngrx/signals"
import { CreateCommentDto } from "../../../models/interfaces/create-comment-dto.interface";
import { inject } from "@angular/core";
import { CommentService } from "../../../services/comment.service";
import { ToastrService } from "ngx-toastr";
import { CommentDisplay } from "../../../models/interfaces/comment-display.interface";
import { Observable, tap } from "rxjs";

type InitialState = {
    commentCount: number;
}

const initialState: InitialState = {
    commentCount: 0,
}

export function withCommentsFeature() {
    return signalStoreFeature(
        withState(initialState),
        withMethods((store, commentService = inject(CommentService), toastr = inject(ToastrService)) => ({
            addComment(newComment: CreateCommentDto): Observable<CommentDisplay> {
                return commentService.addComment(newComment).pipe(
                    tap(() => {
                        toastr.success('Comment added successfully!');
                    })
                );
            },
            isNewComment(comment: CommentDisplay): boolean {
                const now = new Date();
                const commentDate = new Date(comment.createdAt);
                const diffInMinutes = (now.getTime() - commentDate.getTime()) / 60000;
                return diffInMinutes <= 1;
            }
        }))
    )
}
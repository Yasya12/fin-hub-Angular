import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../../core/models/interfaces/user/user.interface';
import { CommentDisplay } from '../../models/interfaces/comment-display.interface';
import { CommentService } from '../../services/comment.service';
import { LikeService } from '../../../../shared/services/like.service';
import { withLoadingInitialValues } from './features/withLoadingInitialValues.feature';
import { withCommentsFeature } from './features/withComments.feature';
import { CreateCommentDto } from '../../models/interfaces/create-comment-dto.interface';
import { withFilterFeature } from './features/withFilter.feature';

type PostDetailState = {
    comments: CommentDisplay[];
    currentUser: User | undefined;
    pageNumber: number;
    pageSize: number;
    //selectedFilter: string;
    hasMoreComments: boolean;

}

const initialState: PostDetailState = {
    comments: [],
    currentUser: undefined,
    pageNumber: 1,
    pageSize: 10,
    //selectedFilter: 'newest',
    hasMoreComments: true,

}

export const PostDetailStore = signalStore(
    withState(initialState),
    withLoadingInitialValues(),
    withCommentsFeature(),
    withFilterFeature(),
    withMethods((store, authService = inject(AuthService), toastr = inject(ToastrService), commentService = inject(CommentService), likeService = inject(LikeService)) => ({
        getComments(postId: string): void {
            console.log("Pagenumber ", store.pageNumber())
            console.log("Pagesize ", store.pageSize())
            commentService.getComments(postId, store.pageNumber(), store.pageSize(), store.selectedFilter()).subscribe({
                next: (newComments) => {
                    //console.log('Fetched comments: ', newComments.length);
                    if (newComments.length < store.pageSize()) {
                        console.warn('No more comments to load.');
                        patchState(store, { hasMoreComments: false })
                    }
                    patchState(store, { comments: [...store.comments(), ...newComments] })
                },
                error: (error) => console.error('Error fetching comments:', error)
            })
        },
        increasePageNumberForComments(): void {
            patchState(store, { pageNumber: store.pageNumber() + 1 });
        },
        setFilterForComments(filter: string)
        {
            //console.log('Setting filter:', filter);
            store.setFilter(filter);
            patchState(store, { comments: [] });
            patchState(store, { pageNumber: 1 });
            patchState(store, { hasMoreComments: true })
            //console.log('Filter set:', store.selectedFilter());
            // console.log('Page number:', store.pageNumber());
            // console.log('Page size:', store.pageSize());
            this.getComments(store.postId()!);

        },
        checkUserAuthentification(): boolean {
            if (!authService.currentUser()) {

                return false;
            }
            return true;
        },
        getCurrentUserId(): string | undefined {
            if (!this.checkUserAuthentification()) {
                console.warn('User is not logged in. You won’t get the current user\'s ID');
                return;
            }

            return authService.currentUser()!.user.id;
        },
        getCurrentUser(): User | undefined {
            if (!this.checkUserAuthentification()) {
                console.warn('User is not logged in. You won’t get the current user\'s ID');
                return;
            }

            return authService.currentUser()?.user;
        },
        displayCreateCommentAuthWarning() {
            toastr.warning('You need to log in to create a comment.', 'Authentication Required');
        },
        toggleLike(): void {
            if (!store.postId()) return;
            likeService.toggleLike(store.postId()!).subscribe((response: boolean) => {
                patchState(store, { isLiked: response });
                patchState(store, {
                    post: {
                        ...store.post()!,
                        likesCount: store.post()!.likesCount + (response ? 1 : -1),
                    }
                });
            });
        },
        addCommentToPost(newComment: CreateCommentDto) {
            store.addComment(newComment).subscribe({
                next: (response) => {
                    if (response.parentId) {
                        const parent = this.findCommentById(response.parentId);

                        if (parent) {
                            parent.replies = [response, ...(parent.replies || [])];
                            patchState(store, { comments: [...store.comments()] });
                        }
                    } else {
                        patchState(store, { comments: [response, ...store.comments()] });
                    }
                    store.incrementCommentCount();
                },
                error: (err) => console.error('Error adding reply:', err),
            })
        },
        findCommentById(id: string): CommentDisplay | undefined { //read how it works
            const stack = [...store.comments()];
            while (stack.length) {
                const current = stack.pop();
                if (current?.id === id) return current;
                if (current?.replies?.length) stack.push(...current.replies);
            }
            return undefined;
        },
        deleteComment(commentId: string): void {
            commentService.deleteComment(commentId).subscribe({
                next: () => {
                    toastr.success('Comment deleted successfully!');
                    const updated = this.removeCommentRecursive(store.comments(), commentId);
                    patchState(store, { comments: updated });
                },
                error: (err) => console.error('Error deleting comment:', err),
            });
        },
        removeCommentRecursive(comments: CommentDisplay[], commentId: string): CommentDisplay[] {
            return comments
                .filter(comment => comment.id !== commentId)
                .map(comment => ({
                    ...comment,
                    replies: comment.replies ? this.removeCommentRecursive(comment.replies, commentId) : []
                }));
        }
    }))
)
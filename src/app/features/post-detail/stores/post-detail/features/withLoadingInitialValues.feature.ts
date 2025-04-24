import { inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { signalStoreFeature, withState, withMethods, patchState, withHooks } from "@ngrx/signals";
import { AuthService } from "../../../../../core/services/auth.service";
import { LikeService } from "../../../../../shared/services/like.service";
import { SinglePost } from "../../../models/interfaces/single-post.interface";
import { PostService } from "../../../../../shared/services/post.service";

type InitialState = {
    postId: string | undefined | null;
    post: SinglePost | undefined;
    isLiked: boolean;
}

const initialState: InitialState = {
    postId: undefined,
    post: undefined,
    isLiked: false,
}

export function withLoadingInitialValues() {
    return signalStoreFeature(
        withState(initialState),
        withMethods((store, postService = inject(PostService), authService = inject(AuthService), likeService = inject(LikeService), route = inject(ActivatedRoute)) => ({
            _loadPostId() {
                const postId = route.snapshot.paramMap.get('id');
                patchState(store, { postId })

                //TODO: separate from the LoadPostId method
                this._loadPost();
            },
            _loadPost() {
                if (!store.postId()) {
                    return;
                }
                postService.getPostById(store.postId()!).subscribe((post) => {
                    patchState(store, { post });
                    this._checkIfLiked();
                });

            },
            _checkIfLiked() {
                const token = authService.currentUser()?.token;
                if (token && store.postId()) {
                    likeService.isPostLiked(store.postId()!).subscribe((response: boolean) => {
                        patchState(store, { isLiked: response });
                    });
                }
            },
            incrementCommentCount() {
                const post = store.post?.();
                if (post) {
                    patchState(store, {
                        post: {
                            ...post,
                            commentCount: post.commentCount + 1
                        }
                    });
                }
            }
        })),
        withHooks({
            onInit(store) {
                store._loadPostId();
            }
        })
    )
}
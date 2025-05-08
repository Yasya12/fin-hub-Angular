import { inject } from "@angular/core";
import { signalStore, withState, withMethods, patchState, withHooks } from "@ngrx/signals";
import { User } from "../models/interfaces/user/user.interface";
import { AuthService } from "../services/auth.service";

type AuthStore = {
    currentUser: User | undefined;
    token: string | undefined;
}

const initialState: AuthStore = {
    currentUser: undefined,
    token: undefined,

}

export const AuthStore = signalStore(
    withState(initialState),
    withMethods((store, authService = inject(AuthService)) => ({
        checkUserAuthentification(): boolean {
            if (!authService.currentUser()) {

                return false;
            }
            return true;
        },
        setCurrentUserState() {
            if (!this.checkUserAuthentification()) {
                return;
            }

            authService.getMember().subscribe({
                next: (u: User) => {
                    patchState(store, { currentUser: u })
                },
                error: (error) => console.error('Error fetching user:', error)
            })
        },
        setToken() {
            if (!this.checkUserAuthentification()) {
                return;
            }

            patchState(store, { token: authService.currentUser()?.token })
        },
    })),
    withHooks({
        onInit(store) {
            store.setCurrentUserState();
            store.setToken();
        }
    })
)
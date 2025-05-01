import { patchState, signalStoreFeature, withMethods, withState } from "@ngrx/signals";

type Filter = { label: string; value: string };

type InitialState = {
    readonly filters: Filter[];
    selectedFilter: string;
}

const initialState: InitialState = {
    filters: [
        { label: 'Найновіші', value: 'newest' },
        { label: 'Найстаріші', value: 'oldest' }
    ],
    selectedFilter: 'newest',
}

export function withFilterFeature() {
    return signalStoreFeature(
        withState(initialState),
        withMethods((store) => ({
            setFilter(filter: string) {
                patchState(store, { selectedFilter: filter });
            },
            getSelectedFilterLabel(): string {
                const selectedFilter = store.filters().find(f => f.value === store.selectedFilter());
                return selectedFilter ? selectedFilter.label : 'Найновіші';
            }
        }))
    )
}
import {create} from "zustand";

export const usePlanesStore = create((set) => ({
    planes: [],
    setPlanes: (p) => set({planes: p}),
    addOrUpdatePlan: (item)
     => set((state) => {
        const incomingId = item.idPlan || item.id;
        const exists = state.planes.find((x) => (x.idPlan || x.id) === incomingId);
        if (exists) {
            return {
                planes: state.planes.map((b) =>
                    (b.idPlan || b.id) === incomingId ? { ...b, ...item } : b
                ),
            };
        }
        if (item && !item._temp) {
            const likelyIndex = state.planes.findIndex((b) => b._temp && b.nombrePlan === item.nombrePlan && Number(b.precio) === Number(item.precio));
            if (likelyIndex !== -1) {
                const next = [...state.planes];
                next[likelyIndex] = { ...next[likelyIndex], ...item };
                delete next[likelyIndex]._temp;
                return { planes: next };
            }
        }
        return { planes: [item, ...state.planes] };
    }),
}));
export default usePlanesStore;
import { create } from "zustand";

export const useBeneficiosStore = create((set) => ({
  beneficios: [],
  setBeneficios: (b) => set({ beneficios: b }),
  addOrUpdateBeneficio: (item) =>
    set((state) => {
      const incomingId = item.idBeneficio || item.id;
      // 1) exact id match
      const exists = state.beneficios.find((x) => (x.idBeneficio || x.id) === incomingId);
      if (exists) {
        return {
          beneficios: state.beneficios.map((b) =>
            (b.idBeneficio || b.id) === incomingId ? { ...b, ...item } : b
          ),
        };
      }

      // 2) try to match a temporary optimistic item: look for items marked with _temp and same key fields
      if (item && !item._temp) {
        const likelyIndex = state.beneficios.findIndex((b) => b._temp && b.nombreBeneficio === item.nombreBeneficio && Number(b.precioPuntos) === Number(item.precioPuntos));
        if (likelyIndex !== -1) {
          const next = [...state.beneficios];
          // replace the optimistic item with the real one
          next[likelyIndex] = { ...next[likelyIndex], ...item };
          // ensure we remove the _temp flag
          delete next[likelyIndex]._temp;
          return { beneficios: next };
        }
      }

      // default: prepend
      return { beneficios: [item, ...state.beneficios] };
    }),
}));

export default useBeneficiosStore;


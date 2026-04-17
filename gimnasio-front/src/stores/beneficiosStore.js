import { create } from "zustand";

export const useBeneficiosStore = create((set) => ({
  beneficios: [],
  setBeneficios: (b) => set({ beneficios: b }),
  addOrUpdateBeneficio: (item) =>
    set((state) => {
      const incomingId = item.idBeneficio || item.id;
      // Primero verificamos si ya existe un beneficio con el mismo ID
      const exists = state.beneficios.find((x) => (x.idBeneficio || x.id) === incomingId);
      if (exists) {
        return {
          beneficios: state.beneficios.map((b) =>
            (b.idBeneficio || b.id) === incomingId ? { ...b, ...item } : b
          ),
        };
      }

      if (item && !item._temp) {
        const likelyIndex = state.beneficios.findIndex((b) => b._temp && b.nombreBeneficio === item.nombreBeneficio && Number(b.precioPuntos) === Number(item.precioPuntos));
        if (likelyIndex !== -1) {
          const next = [...state.beneficios];
          
          next[likelyIndex] = { ...next[likelyIndex], ...item };
          
          delete next[likelyIndex]._temp;
          return { beneficios: next };
        }
      }

    
      return { beneficios: [item, ...state.beneficios] };
    }),
}));

export default useBeneficiosStore;


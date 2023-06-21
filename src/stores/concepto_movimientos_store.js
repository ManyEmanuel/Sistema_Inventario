import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useConceptoMovimientoStore = defineStore("concepto_movimiento", {
  state: () => ({
    modal: false,
    isEditar: false,
    listConceptoMovimiento: [],
    conceptos_movimientos: [],
    concepto_movimiento: {
      id: null,
      tipo_Movimiento_Inventario_Id: null,
      tipo_Movimiento_Inventario: null,
      concepto: null,
      descripcion: null,
    },
  }),
  actions: {
    initConceptoMovimiento() {
      this.concepto_movimiento.id = null;
      this.concepto_movimiento.tipo_Movimiento_Inventario_Id = null;
      this.concepto_movimiento.tipo_Movimiento_Inventario = null;
      this.concepto_movimiento.concepto = null;
      this.concepto_movimiento.descripcion = null;
    },

    async loadInformacionConceptoMovimiento() {
      try {
        let resp = await api.get("/ConceptosMovimientosInventarios");
        let { data } = resp.data;
        console.log("Esto es la lsita de concepto", data);
        let listTiposMovimientos = data.map((concepto) => {
          return {
            id: concepto.id,
            tipo_Movimiento_Inventario: concepto.tipo_Movimiento_Inventario,
            concepto: concepto.concepto,
            descripcion: concepto.descripcion,
          };
        });
        this.conceptos_movimientos = listTiposMovimientos;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadConceptoMovimiento(id) {
      try {
        let resp = null;
        resp = await api.get(`/ConceptosMovimientosInventarios/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.concepto_movimiento.id = data.id;
            this.concepto_movimiento.tipo_Movimiento_Inventario_Id =
              data.tipo_Movimiento_Inventario_Id;
            this.concepto_movimiento.tipo_Movimiento_Inventario =
              data.tipo_Movimiento_Inventario;
            this.concepto_movimiento.concepto = data.concepto;
            this.concepto_movimiento.descripcion = data.descripcion;
          }
        }
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadConceptoMovimientoList() {
      try {
        let resp = await api.get("/ConceptosMovimientosInventarios");
        let { data } = resp.data;
        let listConcepto = data.map((concepto) => {
          return {
            label: concepto.concepto,
            value: concepto.id,
          };
        });
        this.listConceptoMovimiento = listConcepto;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadConceptoMovimientoListFiltro(filtro) {
      try {
        let resp = await api.get("/ConceptosMovimientosInventarios");
        let { data } = resp.data;
        let listData = data.filter(
          (x) => x.tipo_Movimiento_Inventario == filtro
        );
        let listConcepto = listData.map((concepto) => {
          return {
            label: concepto.concepto,
            value: concepto.id,
          };
        });
        this.listConceptoMovimiento = listConcepto;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async createConceptoMovimiento(concepto) {
      try {
        const resp = await api.post(
          "/ConceptosMovimientosInventarios",
          concepto
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async updateTipoMovimiento(concepto) {
      try {
        const resp = await api.put(
          `/ConceptosMovimientosInventarios/${concepto.id}`,
          concepto
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async deleteConceptoMovimiento(id) {
      try {
        const resp = await api.delete(`/ConceptosMovimientosInventarios/${id}`);
        if (resp.status == 200) {
          let { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrio un error, intentelo de nuevo",
          };
        }
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    actualizarModal(valor) {
      this.modal = valor;
    },
    updateEditar(valor) {
      this.isEditar = valor;
    },
  },
});

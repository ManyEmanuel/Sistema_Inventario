import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useTipoMovimientoStore = defineStore("tipo_movimiento", {
  state: () => ({
    modal: false,
    isEditar: false,
    listTipoMovimiento: [],
    tipos_movimientos: [],
    tipo_movimiento: {
      id: null,
      tipo_Movimiento: null,
      naturaleza: null,
    },
  }),
  actions: {
    initTipoMovimiento() {
      this.tipo_movimiento.id = null;
      this.tipo_movimiento.tipo_Movimiento = null;
      this.tipo_movimiento.naturaleza = null;
    },

    async loadInformacionTipoMovimiento() {
      try {
        let resp = await api.get("/TiposMovimientosInventarios");
        let { data } = resp.data;
        let listTiposMovimientos = data.map((movimientos) => {
          return {
            id: movimientos.id,
            tipo_Movimiento: movimientos.tipo_Movimiento,
            naturaleza: movimientos.naturaleza,
          };
        });
        this.tipos_movimientos = listTiposMovimientos;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadTipoMovimiento(id) {
      try {
        let resp = null;
        resp = await api.get(`/TiposMovimientosInventarios/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.tipo_movimiento.id = data.id;
            this.tipo_movimiento.tipo_Movimiento = data.tipo_Movimiento;
            this.tipo_movimiento.naturaleza = data.naturaleza;
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

    async loadTipoMovimientoList() {
      try {
        let resp = await api.get("/TiposMovimientosInventarios");
        let { data } = resp.data;
        let listMovimiento = data.map((movimiento) => {
          return {
            label: movimiento.tipo_Movimiento,
            value: movimiento.id,
          };
        });
        this.listTipoMovimiento = listMovimiento;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async createTipoMovimiento(tipo) {
      try {
        const resp = await api.post("/TiposMovimientosInventarios", tipo);
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

    async deleteTipoMovimiento(id) {
      try {
        const resp = await api.delete(`/TiposMovimientosInventarios/${id}`);
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

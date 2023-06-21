import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useUnidadMedidaStore = defineStore("unidad", {
  state: () => ({
    modal: false,
    isEditar: false,
    listaUnidades: [],
    unidades: [],
    unidad: {
      id: null,
      nombre: null,
      clave: null,
    },
  }),
  actions: {
    initUnidad() {
      this.unidad.id = null;
      this.unidad.nombre = null;
      this.unidad.clave = null;
    },
    async loadInformacionUnidades() {
      try {
        let resp = await api.get("/UnidadesMedidas");
        let { data } = resp.data;
        let listUnidades = data.map((unidad) => {
          return {
            id: unidad.id,
            nombre: unidad.nombre,
            clave: unidad.clave,
          };
        });
        this.unidades = listUnidades;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadUnidad(id) {
      try {
        let resp = null;
        resp = await api.get(`/UnidadesMedidas/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.unidad.id = data.id;
            this.unidad.nombre = data.nombre;
            this.unidad.clave = data.clave;
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

    async loadListaUnidades() {
      try {
        let resp = await api.get("/UnidadesMedidas");
        let { data } = resp.data;
        let listUnidades = data.map((unidad) => {
          return {
            value: unidad.id,
            label: unidad.clave + " - " + unidad.nombre,
          };
        });
        this.listaUnidades = listUnidades;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async createUnidad(unidad) {
      try {
        const resp = await api.post("/UnidadesMedidas", unidad);
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

    async updateUnidad(unidad) {
      try {
        const resp = await api.put(`/UnidadesMedidas/${unidad.id}`, unidad);
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

    async deleteUnidad(id) {
      try {
        const resp = await api.delete(`/UnidadesMedidas/${id}`);
        if (resp.status == 200) {
          let { success, data } = resp.data;
          console.log(resp.data);
          console.log("Esto es success", success, "Esto es data", data);
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

import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useClasificacionConsumibleStore = defineStore("clasificacion", {
  state: () => ({
    modal: false,
    isEditar: false,
    listaClasificacion: [],
    clasificaciones: [],
    clasificacion: {
      id: null,
      nombre: null,
      nombre_Corto: null,
    },
  }),
  actions: {
    initClasificacion() {
      this.clasificacion.id = null;
      this.clasificacion.nombre = null;
      this.clasificacion.nombre_Corto = null;
    },
    async loadInformacionClasificacion() {
      try {
        let resp = await api.get("/ClasificacionesConsumibles");
        let { data } = resp.data;
        let listClasificacion = data.map((clasificacion) => {
          return {
            id: clasificacion.id,
            nombre: clasificacion.nombre,
            nombre_Corto: clasificacion.nombre_Corto,
          };
        });
        this.clasificaciones = listClasificacion;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadClasificacion(id) {
      try {
        let resp = null;
        resp = await api.get(`/ClasificacionesConsumibles/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.clasificacion.id = data.id;
            this.clasificacion.nombre = data.nombre;
            this.clasificacion.nombre_Corto = data.nombre_Corto;
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

    async loadListaClasificacion(especial) {
      try {
        let resp = await api.get("/ClasificacionesConsumibles");
        let { data } = resp.data;
        let listClasificacion = data.map((clasificacion) => {
          return {
            value: clasificacion.id,
            label: clasificacion.nombre_Corto,
          };
        });
        if (especial == true) {
          listClasificacion.splice(0, 0, {
            value: 0,
            label: "Todos",
          });
        }

        this.listaClasificacion = listClasificacion;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async createClasificacion(clasificacion) {
      try {
        const resp = await api.post(
          "/ClasificacionesConsumibles",
          clasificacion
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

    async updateClasificacion(clasificacion) {
      try {
        const resp = await api.put(
          `/ClasificacionesConsumibles/${clasificacion.id}`,
          clasificacion
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

    async deleteClasificacion(id) {
      try {
        const resp = await api.delete(`/ClasificacionesConsumibles/${id}`);
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

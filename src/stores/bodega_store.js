import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useBodegaStore = defineStore("bodega", {
  state: () => ({
    modal: false,
    isEditar: false,
    listBodega: [],
    bodegas: [],
    areas: [],
    bodega: {
      id: null,
      area_Id: null,
      area: null,
      nombre: null,
      eliminado: null,
    },
  }),
  actions: {
    initBodega() {
      this.bodega.id = null;
      this.bodega.area_Id = null;
      this.bodega.area = null;
      this.bodega.nombre = null;
      this.bodega.eliminado = null;
    },
    async loadInformacionBodega() {
      try {
        let resp = await api.get("/Bodegas");
        let { data } = resp.data;
        let listBodega = data.map((bodega) => {
          return {
            id: bodega.id,
            area: bodega.area,
            nombre: bodega.nombre,
          };
        });
        this.bodegas = listBodega;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadBodega(id) {
      try {
        let resp = null;
        resp = await api.get(`/Bodegas/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.bodega.id = data.id;
            this.bodega.area_Id = data.area_Id;
            this.bodega.area = data.area;
            this.bodega.nombre = data.nombre;
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
    async loadAreasList() {
      try {
        this.areas = [];
        let resp = await api.get("/Areas/GetLista");
        let { data } = resp.data;
        let listaArea = data.map((area) => {
          return {
            label: area.label,
            value: area.value,
          };
        });
        this.areas = listaArea;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadBodegasList() {
      try {
        let resp = await api.get("/Bodegas/GetLista");
        let { data } = resp.data;
        let listaBodega = data.map((bodega) => {
          return {
            label: bodega.text,
            value: bodega.value,
          };
        });
        this.listBodega = listaBodega;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async createBodega(bodega) {
      try {
        const resp = await api.post("/Bodegas", bodega);
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

    async updateBodega(bodega) {
      try {
        const resp = await api.put(`/Bodegas/${bodega.id}`, bodega);
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

    async deleteBodega(id) {
      try {
        const resp = await api.delete(`/Bodegas/${id}`);
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

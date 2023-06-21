import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useCatalogoProductoStore = defineStore("catalogo", {
  state: () => ({
    modal: false,
    isEditar: false,
    catalogos: [],
    catalogo: {
      id: null,
      nombre: null,
      clave: null,
      nombre_Corto: null,
    },
  }),
  actions: {
    initCatalago() {
      this.catalogo.id = null;
      this.catalogo.nombre = null;
      this.catalogo.clave = null;
      this.catalogo.nombre_Corto = null;
    },
    async loadInformacionCatalago() {
      try {
        let resp = await api.get("/Catalagos");
        let { data } = resp.data;
        let listCatalogo = data.map((catalogo) => {
          return {
            id: catalogo.id,
            nombre: catalogo.nombre,
            clave: catalogo.clave,
            nombre_Corto: catalogo.nombre_Corto,
          };
        });
        this.catalogos = listCatalogo;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadCatalago(id) {
      try {
        let resp = null;
        resp = await api.get(`/Catalagos/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.catalogo.id = data.id;
            this.catalogo.nombre = data.nombre;
            this.catalogo.clave = data.clave;
            this.catalogo.nombre_Corto = data.nombre_Corto;
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

    async createCatalogo(catalogo) {
      try {
        const resp = await api.post("/Catalagos", catalogo);
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

    async updateCatalogo(catalogo) {
      try {
        const resp = await api.put(`/Catalagos/${catalogo.id}`, catalogo);
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

    async deleteCatalogo(id) {
      try {
        const resp = await api.delete(`/Catalagos/${id}`);
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

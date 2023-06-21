import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useProveedorStore = defineStore("proveedor", {
  state: () => ({
    modal: false,
    isEditar: false,
    listProveedor: [],
    proveedores: [],
    proveedor: {
      id: null,
      nombre: null,
      razon_Social: null,
      rfc: null,
      telefono: null,
      eMail: null,
      direccion: null,
    },
  }),
  actions: {
    initProveedor() {
      this.proveedor.id = null;
      this.proveedor.nombre = null;
      this.proveedor.razon_Social = null;
      this.proveedor.rfc = null;
      this.proveedor.telefono = null;
      this.proveedor.eMail = null;
      this.proveedor.direccion = null;
    },

    async loadInformacionProveedor() {
      try {
        let resp = await api.get("/Proveedores");
        let { data } = resp.data;
        let listProveedor = data.map((proveedor) => {
          return {
            id: proveedor.id,
            nombre: proveedor.nombre,
            rfc: proveedor.rfc,
            telefono: proveedor.telefono,
            eMail: proveedor.eMail,
          };
        });
        this.proveedores = listProveedor;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadProveedor(id) {
      try {
        let resp = null;
        resp = await api.get(`/Proveedores/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.proveedor.id = data.id;
            this.proveedor.nombre = data.nombre;
            this.proveedor.razon_Social = data.razon_Social;
            this.proveedor.rfc = data.rfc;
            this.proveedor.telefono = data.telefono;
            this.proveedor.eMail = data.eMail;
            this.proveedor.direccion = data.direccion;
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

    async loadProveedorList() {
      try {
        let resp = await api.get("/Proveedores");
        let { data } = resp.data;
        let listProveedor = data.map((proveedor) => {
          return {
            label: proveedor.nombre,
            value: proveedor.id,
          };
        });
        this.listProveedor = listProveedor;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async createProveedor(proveedor) {
      try {
        const resp = await api.post("/Proveedores", proveedor);
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

    async updateProveedor(proveedor) {
      try {
        const resp = await api.put(`/Proveedores/${proveedor.id}`, proveedor);
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

    async deleteProveedor(id) {
      try {
        const resp = await api.delete(`/Proveedores/${id}`);
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

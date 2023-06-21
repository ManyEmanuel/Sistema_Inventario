import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useConsumibleStore = defineStore("consumible", {
  state: () => ({
    modal: false,
    isEditar: false,
    catalogos: [],
    bodegas: [],
    clasificaciones: [],
    unidades: [],
    listaConsumibles: [],
    consumibles: [],
    consumible: {
      id: null,
      bodega_Id: null,
      bodega: null,
      catalago_Id: null,
      catalago: "EY-99",
      clasificacion_Id: null,
      clasificacion: null,
      unidad_Medida_Id: null,
      unidad_Medida: null,
      nombre: null,
      marca: null,
      stock_Maximo: null,
      stock_Minimo: null,
      stock: 0,
      descripcion: null,
      color: null,
      fecha_Caducidad: null,
      abreviatura: null,
      clave: null,
      precio_Compra: null,
    },
    myLocale: {
      /* starting with Sunday */
      days: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),
      daysShort: "Dom_Lun_Mar_Mié_Jue_Vie_Sáb".split("_"),
      months:
        "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
          "_"
        ),
      monthsShort: "Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic".split("_"),
      firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
      format24h: true,
      pluralDay: "dias",
    },
  }),
  actions: {
    initConsumible() {
      this.consumible.id = null;
      this.consumible.bodega_Id = null;
      this.consumible.bodega = null;
      this.consumible.catalago_Id = null;
      this.consumible.catalago = "EY-99";
      this.consumible.clasificacion_Id = null;
      this.consumible.clasificacion = null;
      this.consumible.unidad_Medida_Id = null;
      this.consumible.unidad_Medida = null;
      this.consumible.nombre = null;
      this.consumible.marca = null;
      this.consumible.stock_Maximo = null;
      this.consumible.stock_Minimo = null;
      this.consumible.stock = 0;
      this.consumible.descripcion = null;
      this.consumible.color = null;
      this.consumible.fecha_Caducidad = null;
      this.consumible.abreviatura = null;
      this.consumible.clave = null;
      this.consumible.precio_Compra = null;
    },

    async loadConsumibles() {
      try {
        let resp = await api.get("/Consumibles");
        let { data } = resp.data;
        let listConsumible = data.map((consumible) => {
          let tamanoClave = consumible.clave;
          let clave = "";
          if (tamanoClave <= 9) {
            clave = "000" + tamanoClave;
          } else if (tamanoClave <= 99) {
            clave = "00" + tamanoClave;
          } else if (tamanoClave <= 999) {
            clave = "0" + tamanoClave;
          } else if (tamanoClave <= 9999) {
            clave = tamanoClave;
          }

          return {
            id: consumible.id,
            bodega: consumible.bodega,
            bodega_Id: consumible.bodega_Id,
            catalago: consumible.catalago + "-" + clave,
            catalago_Id: consumible.catalago_Id,
            clasificacion: consumible.clasificacion,
            clasificacion_Id: consumible.clasificacion_Id,
            unidad_Medida: consumible.unidad_Medida,
            unidad_Medida_Id: consumible.unidad_Medida_Id,
            nombre: consumible.nombre,
            marca: consumible.marca,
            stock_Maximo: consumible.stock_Maximo,
            stock_Minimo: consumible.stock_Minimo,
            stock: consumible.stock,
            abreviatura: consumible.abreviatura,
            clave: consumible.clave,
            precio_Compra: consumible.precio_Compra,
          };
        });
        this.consumibles = listConsumible;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadConsumible(id) {
      try {
        let resp = null;
        resp = await api.get(`/Consumibles/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          let tamanoClave = data.clave;
          let clave = "";
          if (tamanoClave <= 9) {
            clave = "000" + tamanoClave;
          } else if (tamanoClave <= 99) {
            clave = "00" + tamanoClave;
          } else if (tamanoClave <= 999) {
            clave = "0" + tamanoClave;
          } else if (tamanoClave <= 9999) {
            clave = tamanoClave;
          }
          let fechaFiltroUno = data.fecha_Caducidad.split("T");
          let fechaFiltroDos = fechaFiltroUno[0].split("-");
          console.log("fechados", fechaFiltroDos);
          if (success == true) {
            this.consumible.id = data.id;
            this.consumible.bodega_Id = data.bodega_Id;
            this.consumible.bodega = data.bodega;
            this.consumible.catalago_Id = data.catalago_Id;
            this.consumible.catalago = data.catalago + "-" + clave;
            this.consumible.clasificacion_Id = data.clasificacion_Id;
            this.consumible.clasificacion = data.clasificacion;
            this.consumible.unidad_Medida_Id = data.unidad_Medida_Id;
            this.consumible.unidad_Medida = data.unidad_Medida;
            this.consumible.nombre = data.nombre;
            this.consumible.marca = data.marca;
            this.consumible.stock_Maximo = data.stock_Maximo;
            this.consumible.stock_Minimo = data.stock_Minimo;
            this.consumible.stock = data.stock;
            this.consumible.descripcion = data.descripcion;
            this.consumible.color = data.color;
            this.consumible.fecha_Caducidad =
              fechaFiltroDos[2] +
              "-" +
              fechaFiltroDos[1] +
              "-" +
              fechaFiltroDos[0];
            this.consumible.abreviatura = data.abreviatura;
            this.consumible.clave = data.clave;
            this.consumible.precio_Compra = data.precio_Compra;
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

    async loadListaConsumible(id) {
      try {
        let resp = await api.get("/Consumibles");
        let { data } = resp.data;
        let ListaFiltro = [];
        if (id == 0) {
          ListaFiltro = data;
        } else {
          ListaFiltro = data.filter((x) => x.clasificacion_Id == id);
        }

        console.log("Esto es listaFiltro", ListaFiltro);
        let listConsumible = ListaFiltro.map((consumible) => {
          let tamanoClave = consumible.clave;
          let clave = "";
          if (tamanoClave <= 9) {
            clave = "000" + tamanoClave;
          } else if (tamanoClave <= 99) {
            clave = "00" + tamanoClave;
          } else if (tamanoClave <= 999) {
            clave = "0" + tamanoClave;
          } else if (tamanoClave <= 9999) {
            clave = tamanoClave;
          }
          return {
            value: consumible.id,
            label: consumible.catalago + "-" + clave + " -" + consumible.nombre,
          };
        });
        this.listaConsumibles = listConsumible;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async createConsumible(consumible) {
      try {
        const resp = await api.post("/Consumibles", consumible);
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

    async updateConsumible(consumible) {
      try {
        const resp = await api.put(`/Consumibles/${consumible.id}`, consumible);
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

    async deleteConsumible(id) {
      try {
        const resp = await api.delete(`/Consumibles/${id}`);
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

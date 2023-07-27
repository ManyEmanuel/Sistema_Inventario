import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useMovimientoConsumibleStore = defineStore(
  "movimiento_consumible",
  {
    state: () => ({
      modal: false,
      isEditar: false,
      isConsulta: false,
      isCompra: false,
      listaConsumibleMovimiento: [],
      movimientos: [],
      movimiento: {
        id: null,
        concepto_Id: null,
        concepto: null,
        folio: null,
        estatus: null,
        tipo_Movimiento_Id: null,
        tipo_Movimiento: null,
        empleado_Id: null,
        empleado: null,
        solicitud_Consumible_Id: null,
        solicitud_Consumible: null,
        proveedor_Id: null,
        proveedor: null,
        observaciones: null,
        pdF_Url: null,
        xmL_Url: null,
        fecha_Movimiento: null,
        fecha_Registro: null,
        fecha_Movimiento_Tabla: null,
        fecha_Registro_Tabla: null,
        detalle: [],
      },
      myLocale: {
        days: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),
        daysShort: "Dom_Lun_Mar_Mié_Jue_Vie_Sáb".split("_"),
        months:
          "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
            "_"
          ),
        monthsShort: "Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic".split(
          "_"
        ),
        firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
        format24h: true,
        pluralDay: "dias",
      },
    }),
    actions: {
      initMovimiento() {
        this.movimiento.id = null;
        this.movimiento.concepto = null;
        this.movimiento.concepto_Id = null;
        this.movimiento.folio = null;
        this.movimiento.estatus = null;
        this.movimiento.tipo_Movimiento_Id = null;
        this.movimiento.tipo_Movimiento = null;
        this.movimiento.empleado_Id = null;
        this.movimiento.empleado = null;
        this.movimiento.solicitud_Consumible_Id = null;
        this.movimiento.solicitud_Consumible = null;
        this.movimiento.proveedor_Id = null;
        this.movimiento.proveedor = null;
        this.movimiento.observaciones = null;
        this.movimiento.pdF_Url = null;
        this.movimiento.xmL_Url = null;
        this.movimiento.fecha_Movimiento = null;
        this.movimiento.fecha_Registro = null;
        this.movimiento.fecha_Movimiento_Tabla = null;
        this.movimiento.fecha_Registro_Tabla = null;
        this.movimiento.detalle = [];
      },
      initListaConsumibleMovimiento() {
        this.listaConsumibleMovimiento = [];
      },
      initListaConsumible() {
        this.listConsumible = [];
      },

      async loadInformacionMovimiento() {
        try {
          let resp = await api.get("/MovimientosConsumibles");
          let { data } = resp.data;
          let listMovimientos = data.map((movimiento) => {
            return {
              id: movimiento.id,
              folio: movimiento.folio,
              estatus: movimiento.estatus,
              tipo_Movimiento: movimiento.tipo_Movimiento,
              concepto: movimiento.concepto,
              empleado: movimiento.empleado,
              fecha_Movimiento_Tabla: movimiento.fecha_Movimiento_Tabla,
            };
          });
          this.movimientos = listMovimientos.reverse();
        } catch (error) {
          console.error(error);
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      },

      async loadMovimiento(id) {
        try {
          this.listaConsumibleMovimiento = [];
          let resp = null;
          //await this.detalleMovimiento(id);
          resp = await api.get(`/MovimientosConsumibles/${id}`);
          if (resp.status == 200) {
            const { success, data } = resp.data;
            if (success == true) {
              this.movimiento.id = data.id;
              this.movimiento.concepto = data.concepto;
              if (this.movimiento.concepto == "Entrada por compra") {
                this.updateCompra(true);
              }
              this.movimiento.concepto_Id = data.concepto_Id;
              this.movimiento.folio = data.folio;
              this.movimiento.estatus = data.estatus;
              this.movimiento.tipo_Movimiento_Id = data.tipo_Movimiento_Id;
              this.movimiento.tipo_Movimiento = data.tipo_Movimiento;
              this.movimiento.empleado_Id = data.empleado_Id;
              this.movimiento.empleado = data.empleado;
              this.movimiento.solicitud_Consumible_Id =
                data.solicitud_Consumible_Id;
              this.movimiento.solicitud_Consumible = data.solicitud_Consumible;
              this.movimiento.proveedor_Id = data.proveedor_Id;
              this.movimiento.proveedor = data.proveedor;
              this.movimiento.observaciones = data.observaciones;
              this.movimiento.pdF_Url = data.pdF_Url;
              this.movimiento.xmL_Url = data.xmL_Url;
              this.movimiento.fecha_Movimiento = data.fecha_Movimiento;
              this.movimiento.fecha_Registro = data.fecha_Registro;
              this.movimiento.fecha_Movimiento_Tabla =
                data.fecha_Movimiento_Tabla;
              this.movimiento.fecha_Registro_Tabla = data.fecha_Registro_Tabla;
            }
          }
          //await this.detalleMovimiento(id);
        } catch (error) {
          console.error(error);
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      },

      async detalleMovimiento(id) {
        try {
          let detalle = await api.get(
            `/DetalleMovimientoConsumible/BySolicitud/${id}`
          );
          let detalleArray = detalle.data.data.map((detalle) => {
            return {
              nombre: detalle.consumible,
              cantidad: detalle.cantidad,
              precio_Unitario: detalle.precio_Unitario,
              importe: detalle.importe,
              consumible_Id: detalle.id,
            };
          });
          this.listaConsumibleMovimiento = detalleArray;
          console.log("Este es el listado", this.listaConsumibleMovimiento);
        } catch (error) {
          console.error(error);
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      },

      async addConsumible(nombre, cantidad, unitario, importe, id) {
        try {
          this.listaConsumibleMovimiento.push({
            nombre: nombre,
            cantidad: cantidad,
            precio_Unitario: unitario,
            importe: importe,
            consumible_Id: id,
          });
        } catch (error) {
          console.error(error);
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      },

      async fechaHoy() {
        let fecha = new Date().toISOString().slice(0, 10);
        this.movimiento.fecha_Movimiento = fecha;
        console.log("Esto es fecha", fecha);
      },

      async deleteConsumible(id) {
        try {
          let nIndex = this.listaConsumibleMovimiento.findIndex(
            (x) => x.consumible_Id == id
          );

          console.log("Este es el nIndex", nIndex);
          this.listaConsumibleMovimiento.splice(nIndex, 1);
          return {
            success: true,
            data: "Consumible eliminado de la solicitud",
          };
        } catch (error) {
          console.error(error);
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      },

      async createMovimiento(movimiento) {
        try {
          console.log("Esto es movimiento", movimiento);
          const resp = await api.post("/MovimientosConsumibles", movimiento);
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

      async afectarMovimiento(id) {
        try {
          const resp = await api.get(`/MovimientosConsumibles/Afectar/${id}`);
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

      async deleteMovimiento(id) {
        try {
          const resp = await api.delete(`/MovimientosConsumibles/${id}`);
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
      updateConsultar(valor) {
        this.isConsulta = valor;
      },
      updateCompra(valor) {
        this.isCompra = valor;
      },
    },
  }
);

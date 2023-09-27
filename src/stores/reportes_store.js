import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useReportesStore = defineStore("reportes", {
  state: () => ({
    listadoConsumibles: [],
    listadoSolicitudes: [],
    listadoAreasConsumibles: [],
    listAreas: [],
    modal: false,
    myLocale: {
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
    async loadConsumiblesEntregados(inicio, fin, tipo) {
      try {
        let resp = await api.get("/SolicitudesConsumibles");
        let filtroEntregado = null;

        let { data } = resp.data;
        let entregados = data.filter((x) => x.estatus == "Entregado");
        if (tipo == 0) {
          filtroEntregado = entregados;
        } else if (tipo == 1) {
          console.log("Esto es inicio", inicio);
          console.log("Esto es entregados", entregados);
          filtroEntregado = entregados.filter(
            (x) => x.fecha_Entrega === inicio.value
          );
        } else if (tipo == 2) {
          let inicial = new Date(inicio);
          let final = new Date(fin);
          inicial.setMinutes(
            inicial.getMinutes() + inicial.getTimezoneOffset()
          );
          final.setMinutes(final.getMinutes() + final.getTimezoneOffset());
          filtroEntregado = entregados.filter((item) => {
            const fechaEntrega = new Date(item.fecha_Entrega);
            fechaEntrega.setMinutes(
              fechaEntrega.getMinutes() + fechaEntrega.getTimezoneOffset()
            );
            return fechaEntrega >= inicial && fechaEntrega <= final;
          });
        }
        let respSolicitudes = await api.get("/DetalleSolicitudesConsumibles");
        let filtroSolicitudes = respSolicitudes.data.data;
        const productosPedidos = filtroSolicitudes.filter((consumibles) =>
          filtroEntregado.some(
            (solicitudes) => solicitudes.id === consumibles.solicitud_Id
          )
        );

        productosPedidos.sort((x, y) => x.clave - y.clave);
        const agruparProductos = productosPedidos.reduce((acc, obj) => {
          let claveProducto = "";
          const {
            consumible,
            cantidad_Entregada,
            cantidad_Solicitada,
            precio_Unitario,
            clave,
          } = obj;
          if (!acc[consumible]) {
            if (clave <= 9) {
              claveProducto = "EY-99-000" + clave;
            } else if (clave <= 99) {
              claveProducto = "EY-99-00" + clave;
            } else if (clave <= 999) {
              claveProducto = "EY-99-0" + clave;
            } else {
              claveProducto = "EY-99-" + clave;
            }
            acc[consumible] = {
              consumible,
              totalEntregada: 0,
              totalSolicitado: 0,
              precio_Unitario,
              claveProducto,
            };
          }
          acc[consumible].totalEntregada += cantidad_Entregada;
          acc[consumible].totalSolicitado += cantidad_Solicitada;
          return acc;
        }, {});
        this.listadoConsumibles = Object.values(agruparProductos);
        return this.listadoConsumibles;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadAreasConsumibles() {
      try {
        this.listAreas = [];
        let resp = await api.get("/Areas/GetLista");
        let { data } = resp.data;
        let listaArea = data.map((area) => {
          return {
            label: area.label,
            value: area.value,
            select: false,
          };
        });
        this.listAreas = listaArea;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadConsumiblesEntregadosPorArea(inicio, fin, tipo, area) {
      try {
        let resp = await api.get("/SolicitudesConsumibles");
        let filtroEntregado = null;
        let filtroArea = null;
        let { data } = resp.data;
        let entregados = data.filter((x) => x.estatus == "Entregado");
        if (tipo == 0) {
          filtroEntregado = entregados;
        } else if (tipo == 1) {
          filtroEntregado = entregados.filter(
            (x) => x.fecha_Entrega === inicio.value
          );
        } else if (tipo == 2) {
          let inicial = new Date(inicio);
          let final = new Date(fin);
          inicial.setMinutes(
            inicial.getMinutes() + inicial.getTimezoneOffset()
          );
          final.setMinutes(final.getMinutes() + final.getTimezoneOffset());
          filtroEntregado = entregados.filter((item) => {
            const fechaEntrega = new Date(item.fecha_Entrega);
            fechaEntrega.setMinutes(
              fechaEntrega.getMinutes() + fechaEntrega.getTimezoneOffset()
            );
            return fechaEntrega >= inicial && fechaEntrega <= final;
          });
          console.log("Esto es el filtro", filtroEntregado);
        }

        if (area != 0) {
          filtroArea = filtroEntregado.filter((x) => x.area_Id == area);
        } else {
          filtroArea = filtroEntregado;
        }
        console.log("Esto es filtroArea", filtroArea);

        let respSolicitudes = await api.get("/DetalleSolicitudesConsumibles");
        let filtroSolicitudes = respSolicitudes.data.data;
        const productosPedidos = filtroSolicitudes.filter((consumibles) =>
          filtroArea.some(
            (solicitudes) => solicitudes.id === consumibles.solicitud_Id
          )
        );

        productosPedidos.sort((x, y) => x.clave - y.clave);
        const agruparProductos = productosPedidos.reduce((acc, obj) => {
          let claveProducto = "";
          const {
            consumible,
            cantidad_Entregada,
            cantidad_Solicitada,
            precio_Unitario,
            clave,
          } = obj;
          if (!acc[consumible]) {
            if (clave <= 9) {
              claveProducto = "EY-99-000" + clave;
            } else if (clave <= 99) {
              claveProducto = "EY-99-00" + clave;
            } else if (clave <= 999) {
              claveProducto = "EY-99-0" + clave;
            } else {
              claveProducto = "EY-99-" + clave;
            }
            acc[consumible] = {
              consumible,
              totalEntregada: 0,
              totalSolicitado: 0,
              precio_Unitario,
              claveProducto,
            };
          }
          acc[consumible].totalEntregada += cantidad_Entregada;
          acc[consumible].totalSolicitado += cantidad_Solicitada;
          return acc;
        }, {});
        this.listadoAreasConsumibles = Object.values(agruparProductos);
        return this.listadoAreasConsumibles;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadSolicitudes(inicio, fin, tipo) {
      try {
        let resp = await api.get("/SolicitudesConsumibles");
        let filtroEntregado = null;
        let filtroArea = null;
        let { data } = resp.data;
        let entregados = data.filter((x) => x.estatus == "Entregado");
        if (tipo == 0) {
          filtroEntregado = entregados;
        } else if (tipo == 1) {
          filtroEntregado = entregados.filter(
            (x) => x.fecha_Entrega === inicio
          );
        } else if (tipo == 2) {
          let inicial = new Date(inicio);
          let final = new Date(fin);
          inicial.setMinutes(
            inicial.getMinutes() + inicial.getTimezoneOffset()
          );
          final.setMinutes(final.getMinutes() + final.getTimezoneOffset());
          filtroEntregado = entregados.filter((item) => {
            const fechaEntrega = new Date(item.fecha_Entrega);
            fechaEntrega.setMinutes(
              fechaEntrega.getMinutes() + fechaEntrega.getTimezoneOffset()
            );
            return fechaEntrega >= inicial && fechaEntrega <= final;
          });
          console.log("Esto es el filtro", filtroEntregado);
        }
        this.listadoSolicitudes = filtroEntregado;
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
  },
});

import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useSolicitudConsumibleStore = defineStore("solicitud", {
  state: () => ({
    modal: false,
    isEditar: false,
    isConsulta: false,
    isSurtir: false,
    isEntregada: false,
    tipoSolicitud: ["Ordinaria", "Evento", "Urgente", "Otro"],
    listaSolicitud: [],
    jefeArea: false,
    solicitudes: [],
    solicitud: {
      id: null,
      borrador: null,
      justificacion: null,
      tipo: null,
      area_Id: null,
      area: null,
      empleado_Solicitante_Id: null,
      empleado_Solicitante: null,
      puesto_Empleado_Solicitante_Id: null,
      puesto_Empleado_Solicitante: null,
      responsable_Area_Id: null,
      responsable_Area: null,
      puesto_Responsable_Area_Id: null,
      puesto_Responsable_Area: null,
      empleado_Entrega_Id: null,
      empleado_Entrega: null,
      puesto_Empleado_Entrega_Id: null,
      puesto_Empleado_Entrega: null,
      estatus: null,
      fecha_Solicitud: null,
      fecha_Aprobo: null,
      fecha_Entrega: null,
      fecha_Solicitud_Tabla: null,
      fecha_Aprobo_Tabla: null,
      fecha_Entrega_Tabla: null,
      aprobado: null,
      fecha_Registro: null,
      fecha_Registro_Tabla: null,
      empleado_Recibe_Id: null,
      empleado_Recibe: null,
      puesto_Empleado_Recibe_Id: null,
      puesto_Empleado_Recibe: null,
      detalle: [],
    },
  }),
  actions: {
    initSolicitud() {
      this.solicitud.id = null;
      this.solicitud.borrador = null;
      this.solicitud.justificacion = null;
      this.solicitud.tipo = null;
      this.solicitud.area_Id = null;
      this.solicitud.area = null;
      this.solicitud.empleado_Solicitante_Id = null;
      this.solicitud.empleado_Solicitante = null;
      this.solicitud.puesto_Empleado_Solicitante_Id = null;
      this.solicitud.puesto_Empleado_Solicitante = null;
      this.solicitud.responsable_Area_Id = null;
      this.solicitud.responsable_Area = null;
      this.solicitud.puesto_Responsable_Area_Id = null;
      this.solicitud.puesto_Responsable_Area = null;
      this.solicitud.empleado_Entrega_Id = null;
      this.solicitud.empleado_Entrega = null;
      this.solicitud.puesto_Empleado_Entrega_Id = null;
      this.solicitud.puesto_Empleado_Entrega = null;
      this.solicitud.estatus = null;
      this.solicitud.fecha_Solicitud = null;
      this.solicitud.fecha_Aprobo = null;
      this.solicitud.fecha_Entrega = null;
      this.solicitud.fecha_Solicitud_Tabla = null;
      this.solicitud.fecha_Aprobo_Tabla = null;
      this.solicitud.fecha_Entrega_Tabla = null;
      this.solicitud.aprobado = null;
      this.solicitud.fecha_Registro = null;
      this.solicitud.fecha_Registro_Tabla = null;
      this.solicitud.empleado_Recibe_Id = null;
      this.solicitud.empleado_Recibe = null;
      this.solicitud.puesto_Empleado_Recibe_Id = null;
      this.solicitud.puesto_Empleado_Recibe = null;
      this.solicitud.detalle = [];
    },
    initListaSolicitud() {
      this.listaSolicitud = [];
    },

    async loadJefeArea() {
      try {
        let empleado = await api.get("/Empleados/ByUsuario");
        let empleadoData = empleado.data.data;
        if (empleadoData.area_Id != 13) {
          let jefe = await api.get(
            `/ResponsablesAreas/ResposableByArea/${empleadoData.area_Id}`
          );
          let jefeData = jefe.data.data;
          if (empleadoData.id == jefeData.empleado_Id) {
            this.jefeArea = true;
          } else {
            this.jefeArea = false;
          }
        } else {
          this.jefeArea = true;
        }
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadSolicitudes() {
      try {
        let resp = await api.get("/SolicitudesConsumibles/MiSolicitudes");
        let { data } = resp.data;
        let listSolicitudes = data.map((solicitud) => {
          return {
            id: solicitud.id,
            empleado_Solicitante: solicitud.empleado_Solicitante,
            fecha_Solicitud: solicitud.fecha_Solicitud_Tabla,
            estatus: solicitud.estatus,
            folio: solicitud.folio,
            tipo: solicitud.tipo,
          };
        });
        this.solicitudes = listSolicitudes;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadSolicitudesJefeArea() {
      try {
        this.solicitudes = [];
        let areaEmpleadoList = await api.get("/Empleados/ByUsuario");
        let areaEmpleado = areaEmpleadoList.data.data;
        let resp = null;
        let data = null;
        if (areaEmpleado.area_Id != 13) {
          resp = await api.get("/SolicitudesConsumibles/SolicitudesByArea");
          data = resp.data.data;
        } else {
          let responsableAreaList = await api.get("/ResponsablesAreas");
          let responsableArea = responsableAreaList.data.data;
          let filtro = responsableArea.find(
            (x) => x.empleado_Id == areaEmpleado.id
          );
          console.log("Esto es filtro", filtro);
          let solicitudesList = await api.get("/SolicitudesConsumibles");
          let solicitudes = solicitudesList.data.data.filter(
            (x) => x.area_Id == filtro.area_Id
          );
          data = solicitudes;
        }
        console.log("Esto es data", data);
        let listSolicitudes = data.map((solicitud) => {
          let jefeSolicita = false;
          let isBorradorEmpleado = false;
          if (
            parseInt(solicitud.empleado_Solicitante_Id) ==
            parseInt(solicitud.responsable_Area_Id)
          ) {
            jefeSolicita = true;
          }
          if (solicitud.estatus == "Borrador") {
            if (jefeSolicita == false) {
              isBorradorEmpleado = true;
            }
          }
          return {
            id: solicitud.id,
            empleado_Solicitante: solicitud.empleado_Solicitante,
            fecha_Solicitud: solicitud.fecha_Solicitud_Tabla,
            estatus: solicitud.estatus,
            folio: solicitud.folio,
            tipo: solicitud.tipo,
            filtro: jefeSolicita,
            borrador: isBorradorEmpleado,
          };
        });
        console.log("Esto es la solicitud del jefe", listSolicitudes);
        this.solicitudes = listSolicitudes.filter((x) => x.borrador == false);
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadConsumiblesSolicitud(id) {
      try {
        let respu = await api.get(`/SolicitudesConsumibles/${id}`);
        if (respu.status == 200) {
          let listSolicitud = respu.data.data;
          this.solicitud.id = listSolicitud.id;
          this.solicitud.borrador = listSolicitud.borrador;
          this.solicitud.justificacion = listSolicitud.justificacion;
          this.solicitud.tipo = listSolicitud.tipo;
          this.solicitud.area_Id = listSolicitud.area_Id;
          this.solicitud.area = listSolicitud.area;
          this.solicitud.empleado_Solicitante_Id =
            listSolicitud.empleado_Solicitante_Id;
          this.solicitud.empleado_Solicitante =
            listSolicitud.empleado_Solicitante;
          this.solicitud.puesto_Empleado_Solicitante_Id =
            listSolicitud.puesto_Empleado_Solicitante_Id;
          this.solicitud.puesto_Empleado_Solicitante =
            listSolicitud.puesto_Empleado_Solicitante;
          this.solicitud.responsable_Area_Id =
            listSolicitud.responsable_Area_Id;
          this.solicitud.responsable_Area = listSolicitud.responsable_Area;
          this.solicitud.puesto_Responsable_Area_Id =
            listSolicitud.puesto_Responsable_Area_Id;
          this.solicitud.puesto_Responsable_Area =
            listSolicitud.puesto_Responsable_Area;
          this.solicitud.empleado_Entrega_Id =
            listSolicitud.empleado_Entrega_Id;
          this.solicitud.empleado_Entrega = listSolicitud.empleado_Entrega;
          this.solicitud.puesto_Empleado_Entrega_Id =
            listSolicitud.puesto_Empleado_Entrega_Id;
          this.solicitud.puesto_Empleado_Entrega =
            listSolicitud.puesto_Empleado_Entrega;
          this.solicitud.estatus = listSolicitud.estatus;
          this.solicitud.fecha_Solicitud = listSolicitud.fecha_Solicitud;
          this.solicitud.fecha_Aprobo = listSolicitud.fecha_Aprobo;
          this.solicitud.fecha_Entrega = listSolicitud.fecha_Entrega;
          this.solicitud.fecha_Solicitud_Tabla =
            listSolicitud.fecha_Solicitud_Tabla;
          this.solicitud.fecha_Aprobo_Tabla = listSolicitud.fecha_Aprobo_Tabla;
          this.solicitud.fecha_Entrega_Tabla =
            listSolicitud.fecha_Entrega_Tabla;
          this.solicitud.aprobado = listSolicitud.aprobado;
          this.solicitud.fecha_Registro = listSolicitud.fecha_Registro;
          this.solicitud.fecha_Registro_Tabla =
            listSolicitud.fecha_Registro_Tabla;
          this.solicitud.empleado_Recibe_Id = listSolicitud.empleado_Recibe_Id;
          this.solicitud.empleado_Recibe = listSolicitud.empleado_Recibe;
          this.solicitud.puesto_Empleado_Recibe_Id =
            listSolicitud.puesto_Empleado_Recibe_Id;
          this.solicitud.puesto_Empleado_Recibe =
            listSolicitud.puesto_Empleado_Recibe;
          //--------------------------------------------------------------------------//
          this.listaSolicitud = [];
          if (
            listSolicitud.estatus == "Aprobado" ||
            listSolicitud.estatus == "Entregado" ||
            listSolicitud.estatus == "Rechazado" ||
            listSolicitud.estatus == "Rechazada por administración"
          ) {
            this.isEntregada = true;
          }
          let resp = await api.get(
            `/DetalleSolicitudesConsumibles/BySolicitud/${id}`
          );
          let { data } = resp.data;
          let listConsumible = data.map((consumible) => {
            return {
              nombre: consumible.consumible,
              cantidad_Solicitada: consumible.cantidad_Solicitada,
              cantidad_Entregada: consumible.cantidad_Entregada,
              unidad_Medida: consumible.unidad,
              consumible_Id: consumible.consumible_Id,
              observaciones: consumible.observaciones,
              solicitud_Id: consumible.solicitud_Id,
              id: consumible.id,
            };
          });
          this.listaSolicitud = listConsumible;
        }
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
    async loadListaConsumiblesSolicitud(id) {
      try {
        this.listaSolicitud = [];
        let resp = await api.get(
          `/DetalleSolicitudesConsumibles/BySolicitud/${id}`
        );
        let { data } = resp.data;
        let listConsumible = data.map((consumible) => {
          return {
            nombre: consumible.consumible,
            cantidad_Solicitada: consumible.cantidad_Solicitada,
            unidad_Medida: consumible.unidad,
            consumible_Id: consumible.consumible_Id,
            observaciones: consumible.observaciones,
            solicitud_Id: consumible.solicitud_Id,
            id: consumible.id,
          };
        });
        this.listaSolicitud = listConsumible;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadConsumiblesSolicitudSurtir(id) {
      try {
        let respu = await api.get(`/SolicitudesConsumibles/${id}`);
        if (respu.status == 200) {
          let listSolicitud = respu.data.data;
          console.log("Esto es la lista de la solicitud", listSolicitud);
          this.solicitud.id = listSolicitud.id;
          this.solicitud.borrador = listSolicitud.borrador;
          this.solicitud.justificacion = listSolicitud.justificacion;
          this.solicitud.tipo = listSolicitud.tipo;
          this.solicitud.area_Id = listSolicitud.area_Id;
          this.solicitud.area = listSolicitud.area;
          this.solicitud.estatus = listSolicitud.estatus;
          this.solicitud.empleado_Solicitante_Id =
            listSolicitud.empleado_Solicitante_Id;
          this.solicitud.empleado_Solicitante =
            listSolicitud.empleado_Solicitante;
          this.solicitud.puesto_Empleado_Solicitante_Id =
            listSolicitud.puesto_Empleado_Solicitante_Id;
          this.solicitud.puesto_Empleado_Solicitante =
            listSolicitud.puesto_Empleado_Solicitante;
          this.solicitud.responsable_Area_Id =
            listSolicitud.responsable_Area_Id;
          this.solicitud.responsable_Area = listSolicitud.responsable_Area;
          this.solicitud.puesto_Responsable_Area_Id =
            listSolicitud.puesto_Responsable_Area_Id;
          this.solicitud.puesto_Responsable_Area =
            listSolicitud.puesto_Responsable_Area;
          this.solicitud.empleado_Entrega_Id =
            listSolicitud.empleado_Entrega_Id;
          this.solicitud.empleado_Entrega = listSolicitud.empleado_Entrega;
          this.solicitud.puesto_Empleado_Entrega_Id =
            listSolicitud.puesto_Empleado_Entrega_Id;
          this.solicitud.puesto_Empleado_Entrega =
            listSolicitud.puesto_Empleado_Entrega;
          this.solicitud.estatus = listSolicitud.estatus;
          this.solicitud.fecha_Solicitud = listSolicitud.fecha_Solicitud;
          this.solicitud.fecha_Aprobo = listSolicitud.fecha_Aprobo;
          this.solicitud.fecha_Entrega = listSolicitud.fecha_Entrega;
          this.solicitud.fecha_Solicitud_Tabla =
            listSolicitud.fecha_Solicitud_Tabla;
          this.solicitud.fecha_Aprobo_Tabla = listSolicitud.fecha_Aprobo_Tabla;
          this.solicitud.fecha_Entrega_Tabla =
            listSolicitud.fecha_Entrega_Tabla;
          this.solicitud.aprobado = listSolicitud.aprobado;
          this.solicitud.fecha_Registro = listSolicitud.fecha_Registro;
          this.solicitud.fecha_Registro_Tabla =
            listSolicitud.fecha_Registro_Tabla;
          this.solicitud.empleado_Recibe_Id = listSolicitud.empleado_Recibe_Id;
          this.solicitud.empleado_Recibe = listSolicitud.empleado_Recibe;
          this.solicitud.puesto_Empleado_Recibe_Id =
            listSolicitud.puesto_Empleado_Recibe_Id;
          this.solicitud.puesto_Empleado_Recibe =
            listSolicitud.puesto_Empleado_Recibe;
          //--------------------------------------------------------------------------//
          this.listaSolicitud = [];

          let resp = await api.get(
            `/DetalleSolicitudesConsumibles/BySolicitud/${id}`
          );
          let { data } = resp.data;
          let consumiblesList = await api.get("/Consumibles");
          let consumibles = consumiblesList.data.data;
          let listConsumible = data.map((consumible) => {
            let filtro = consumibles.find(
              (x) => x.id == consumible.consumible_Id
            );
            return {
              nombre: consumible.consumible,
              cantidad_Solicitada: consumible.cantidad_Solicitada,
              cantidad_Entregada: consumible.cantidad_Entregada,
              cantidad_Stock: filtro.stock,
              unidad_Medida: consumible.unidad,
              consumible_Id: consumible.consumible_Id,
              observaciones: consumible.observaciones,
              solicitud_Id: consumible.solicitud_Id,
              id: consumible.id,
            };
          });
          this.listaSolicitud = listConsumible;
        }
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async datosSolicitante() {
      let datosResponsablelist = null;
      let datosResponsable = null;
      let datosSolicitantelist = await api.get("/Empleados/ByUsuario");
      let datosAreaslist = await api.get("/Areas/AreaByUsuario");
      //-----------------------------------------------------------------------------//
      let datosSolicitante = datosSolicitantelist.data.data;
      let datosAreas = datosAreaslist.data.data;
      /*let jefe = await api.get(
        `/ResponsablesAreas/ResposableByArea/${empleadoData.area_Id}`
      );
      let jefeData = jefe.data.data;
      if (empleadoData.id == jefeData.empleado_Id) {
        this.jefeArea = true;
      } else {
        this.jefeArea = false;
      }*/

      //-------------------------------------------------------------------------//
      if (datosAreas.area_Id == 13) {
        let areaConsejeroList = await api.get("/ResponsablesAreas");
        let areaConsejero = areaConsejeroList.data.data;
        let filtroArea = areaConsejero.find(
          (x) => x.empleado_Id == datosSolicitante.id
        );
        this.solicitud.area_Id = filtroArea.area_Id;
        this.solicitud.area = filtroArea.area;
        datosResponsablelist = await api.get(
          `/ResponsablesAreas/ResposableByArea/${filtroArea.area_Id}`
        );
        datosResponsable = datosResponsablelist.data.data;
      } else {
        this.solicitud.area_Id = datosAreas.area_Id;
        this.solicitud.area = datosAreas.area;
        datosResponsablelist = await api.get(
          `/ResponsablesAreas/ResposableByArea/${datosSolicitante.area_Id}`
        );
        datosResponsable = datosResponsablelist.data.data;
      }

      this.solicitud.empleado_Solicitante_Id = datosSolicitante.id;
      this.solicitud.puesto_Empleado_Solicitante_Id =
        datosSolicitante.puesto_Id;
      this.solicitud.empleado_Solicitante = datosSolicitante.nombre_Completo;

      this.solicitud.responsable_Area_Id = datosResponsable.empleado_Id;
      this.solicitud.puesto_Responsable_Area_Id = datosResponsable.puesto_Id;
      this.solicitud.responsable_Area =
        datosResponsable.empleado + " - " + datosResponsable.puesto;
    },

    async addConsumible(nombre, cantidad, unidad, id) {
      try {
        this.listaSolicitud.push({
          nombre: nombre,
          cantidad_Solicitada: cantidad,
          unidad_Medida: unidad,
          consumible_Id: id,
          observaciones: "",
          solicitud_Id: 0,
          id: 0,
        });
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
        let nIndex = this.listaSolicitud.findIndex(
          (x) => x.consumible_Id == id
        );

        console.log("Este es el nIndex", nIndex);
        this.listaSolicitud.splice(nIndex, 1);
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

    async enviarSolicitud(id) {
      try {
        let resp = null;
        resp = await api.get(`/SolicitudesConsumibles/EnviarSolicitud/${id}`);
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

    async deleteConsumibleBD(id) {
      try {
        let filtro = this.listaSolicitud.find((x) => x.consumible_Id == id);
        let nIndex = this.listaSolicitud.findIndex(
          (x) => x.consumible_Id == id
        );
        this.listaSolicitud.splice(nIndex, 1);
        const resp = await api.delete(
          `/DetalleSolicitudesConsumibles/${filtro.id}`
        );
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

    async sumarConsumible(id, cantidad) {
      console.log("id", id, "cantidad", cantidad);
      try {
        let nIndex = this.listaSolicitud.findIndex(
          (x) => x.consumible_Id == id
        );
        let cantidadActual = parseInt(
          this.listaSolicitud[nIndex].cantidad_Solicitada
        );
        cantidadActual = cantidadActual + parseInt(cantidad);
        this.listaSolicitud[nIndex].cantidad_Solicitada = cantidadActual;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async cambiarConsumible(id, cantidad) {
      try {
        let nIndex = this.listaSolicitud.findIndex(
          (x) => x.consumible_Id == id
        );
        this.listaSolicitud[nIndex].cantidad_Solicitada = cantidad;
        return {
          success: true,
        };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async createSolicitud(solicitud) {
      try {
        const resp = await api.post("/SolicitudesConsumibles", solicitud);
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

    async updateSolicitud(solicitud) {
      try {
        console.log("Este es el valor de solicitud al actualizar", solicitud);
        let resp = await api.get(
          `/DetalleSolicitudesConsumibles/BySolicitud/${this.solicitud.id}`
        );
        let { data } = resp.data;
        let filtroNuevos = solicitud.filter((x) => x.solicitud_Id == 0);
        let filtroSolicitado = solicitud.filter((x) => x.solicitud_Id != 0);
        if (filtroNuevos.length > 0) {
          for (let Nuevo of filtroNuevos) {
            let resp = await api.post(
              `/DetalleSolicitudesConsumibles/${this.solicitud.id}`,
              Nuevo
            );
            console.log("Esto es resp", resp.data);
          }
        }
        if (filtroSolicitado.length > 0) {
          let respu = null;
          for (let Solicitado of filtroSolicitado) {
            let filtro = data.find(
              (x) => x.consumible_Id == Solicitado.consumible_Id
            );
            if (
              filtro.cantidad_Solicitada !=
              parseInt(Solicitado.cantidad_Solicitada)
            ) {
              respu = await api.put(
                `/DetalleSolicitudesConsumibles/${Solicitado.id}`,
                Solicitado
              );
            }
          }
        }
        return {
          success: true,
          data: "Solicitud de consumibles actualizada con éxito",
        };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async deleteSolicitud(id) {
      try {
        const resp = await api.delete(`/SolicitudesConsumibles/${id}`);
        if (resp.status == 200) {
          let { success, data } = resp.data;
          console.log(resp.data);
          console.log("Esto es success", success, "Esto es data", data);
          if (success === false) {
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

    async aceptarSolicitud(id) {
      try {
        const resp = await api.get(`/SolicitudesConsumibles/AprobarJA/${id}`);
        if (resp.status == 200) {
          let { success, data } = resp.data;
          console.log(resp.data);
          console.log("Esto es success", success, "Esto es data", data);
          if (success === false) {
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

    async cancelarSolicitud(id) {
      try {
        const resp = await api.get(`/SolicitudesConsumibles/Rechazar/${id}`);
        if (resp.status == 200) {
          let { success, data } = resp.data;
          if (success === false) {
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
    updateConsulta(valor) {
      this.isConsulta = valor;
    },
    updateSurtir(valor) {
      this.isSurtir = valor;
    },
    updateEntregar(valor) {
      this.isEntregada = valor;
    },
  },
});

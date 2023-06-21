import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const useSolicitudAreaStore = defineStore("solicitudesAreas", {
  state: () => ({
    modal: false,
    isEditar: false,
    isConsulta: false,
    isFinalizado: false,
    modalEntrega: false,
    personalEntrega: [],
    //isSurtir: false,
    listaSolicitud: [],
    //jefeArea: false,
    solicitudes: [],
    solicitud: {
      id: null,
      borrador: null,
      justificacion: null,
      tipo: null,
      area_Id: null,
      area: null,
      folio: null,
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
      fecha_Aprobo_JA: null,
      fecha_Aprobo_JA_Tabla: null,
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
      this.solicitud.fecha_Aprobo_JA = null;
      this.solicitud.fecha_Aprobo_JA_Tabla = null;
      this.solicitud.detalle = [];
      this.solicitud.empleado_Recibe = null;
      this.solicitud.empleado_Recibe_Id = null;
      this.solicitud.puesto_Empleado_Recibe = null;
      this.solicitud.puesto_Empleado_Recibe_Id = null;
    },
    initListaSolicitud() {
      this.listaSolicitud = [];
    },
    initListaPersonal() {
      this.personalEntrega = [];
    },

    async loadSolicitudes() {
      try {
        let resp = await api.get("/SolicitudesConsumibles");
        let { data } = resp.data;
        let listSolicitudes = data.map((solicitud) => {
          return {
            id: solicitud.id,
            folio: solicitud.folio,
            tipo: solicitud.tipo,
            area: solicitud.area,
            empleado_Solicitante: solicitud.empleado_Solicitante,
            fecha_Solicitud: solicitud.fecha_Solicitud,
            estatus: solicitud.estatus,
          };
        });
        this.solicitudes = listSolicitudes.filter(
          (x) =>
            x.estatus != "Pendiente" &&
            x.estatus != "Rechazado" &&
            x.estatus != "Borrador"
        );
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadSolicitudesFiltro(filtro) {
      try {
        let resp = await api.get("/SolicitudesConsumibles");
        let { data } = resp.data;
        let listSolicitudes = data.map((solicitud) => {
          return {
            id: solicitud.id,
            folio: solicitud.folio,
            tipo: solicitud.tipo,
            area: solicitud.area,
            empleado_Solicitante: solicitud.empleado_Solicitante,
            fecha_Solicitud: solicitud.fecha_Solicitud,
            estatus: solicitud.estatus,
          };
        });
        this.solicitudes = listSolicitudes.filter((x) => x.estatus == filtro);
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
          this.solicitud.folio = listSolicitud.folio;
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
          this.solicitud.fecha_Aprobo_JA = listSolicitud.fecha_Aprobo_JA;
          this.solicitud.fecha_Aprobo_JA_Tabla =
            listSolicitud.fecha_Aprobo_JA_Tabla;
          this.solicitud.empleado_Recibe = listSolicitud.empleado_Recibe;
          this.solicitud.empleado_Recibe_Id = listSolicitud.empleado_Recibe_Id;
          this.solicitud.puesto_Empleado_Recibe =
            listSolicitud.puesto_Empleado_Recibe;
          this.solicitud.puesto_Empleado_Recibe_Id =
            listSolicitud.puesto_Empleado_Recibe_Id;
          //--------------------------------------------------------------------------//
          this.listaSolicitud = [];
          let resp = await api.get(
            `/DetalleSolicitudesConsumibles/BySolicitud/${id}`
          );
          let { data } = resp.data;
          let consumiblesList = await api.get("/Consumibles");
          let consumibles = consumiblesList.data.data;
          let listConsumible = data.map((consumible) => {
            let entregado = 0;
            let filtro = consumibles.find(
              (x) => x.id == consumible.consumible_Id
            );
            console.log(
              "Esto es filtro stock",
              filtro.stock,
              "Esto es la cantidad de consumible",
              consumible.cantidad_Solicitada
            );

            if (consumible.cantidad_Entregada == null) {
              if (
                parseInt(consumible.cantidad_Solicitada) <=
                parseInt(filtro.stock)
              ) {
                entregado = consumible.cantidad_Solicitada;
              } else {
                entregado = filtro.stock;
              }
            } else {
              entregado = consumible.cantidad_Entregada;
            }
            return {
              nombre: consumible.consumible,
              cantidad_Solicitada: consumible.cantidad_Solicitada,
              cantidad_Entregada: entregado,
              cantidad_Stock: filtro.stock,
              cantidad_Tope: entregado,
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

    async loadEntrega(id) {
      try {
        await this.loadConsumiblesSolicitudSurtir(id);
        let resp = await api.get(`/Empleados/ByArea/${this.solicitud.area_Id}`);
        let { data } = resp.data;
        let listPersonal = data.map((personal) => {
          return {
            value: personal.id,
            label:
              personal.nombres +
              " " +
              personal.apellido_Paterno +
              " " +
              personal.apellido_Materno,
          };
        });
        this.personalEntrega = listPersonal;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async atenderSolicitud(solicitud) {
      try {
        console.log("Esto es la solicitud", solicitud);
        const resp = await api.post(
          `/SolicitudesConsumibles/Aprobar/${solicitud.id}`,
          solicitud
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

    async entregarSolicitud(personal) {
      try {
        const resp = await api.get(
          `/SolicitudesConsumibles/Entregar/${this.solicitud.id}/${personal.value.value}`
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

    async cancelarSolicitudAdministracion(id) {
      try {
        const resp = await api.get(
          `/SolicitudesConsumibles/RechazarAdmon/${id}`
        );
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

    async crearPase(id) {
      try {
        let resp = await this.loadConsumiblesSolicitudSurtir(id);
        let img = new Image();
        let num = 1;
        let tamano1 = 0;
        let body = [];
        img.src = require("../assets/IEEN300.png");
        if (this.solicitud.id != null) {
          const doc = new jsPDF();
          doc.addImage(img, "png", 10, 8, 35, 20);
          doc.addImage(img, "png", 10, 144, 35, 20);

          doc.setFontSize(9);
          doc.text("FECHA: " + this.solicitud.fecha_Registro, 15, 35);
          doc.text(
            "NOMBRE DEL SOLICITANTE: " + this.solicitud.empleado_Solicitante,
            15,
            40
          );
          let texto = "JUSTIFICACIÓN: " + this.solicitud.justificacion;
          var lines = doc.splitTextToSize(texto, 180); // 80 is the maximum width of line (you can change it according to your needs)
          var y = 45;
          for (var i = 0; i < lines.length; i++) {
            doc.text(15, y, lines[i], {
              align: "justify",
            });
            y = y + 4; // Change this value to increase or decrease the vertical space between lines
          }
          doc.text(
            "FOLIO: " +
              this.solicitud.folio +
              "\n" +
              "TIPO: " +
              this.solicitud.tipo,
            195,
            35,
            null,
            null,
            "right"
          );
          doc.text("FECHA: " + this.solicitud.fecha_Registro, 15, 169);
          doc.text(
            "NOMBRE DEL SOLICITANTE: " + this.solicitud.empleado_Solicitante,
            15,
            174
          );
          var lines2 = doc.splitTextToSize(texto, 180); // 80 is the maximum width of line (you can change it according to your needs)
          var y2 = 179;
          for (var i = 0; i < lines2.length; i++) {
            doc.text(15, y2, lines2[i], {
              align: "justify",
            });
            y2 = y2 + 4; // Change this value to increase or decrease the vertical space between lines
          }
          doc.text(
            "FOLIO: " +
              this.solicitud.folio +
              "\n" +
              "TIPO: " +
              this.solicitud.tipo,
            195,
            169,
            null,
            null,
            "right"
          );

          doc.setFont("times", "normal");
          doc.setFontSize(12);
          doc.text(
            "INSTITUTO ESTATAL ELECTORAL DE NAYARIT \n" +
              this.solicitud.area +
              "\n" +
              "Vale de salida de almacén",
            105,
            20,
            null,
            null,
            "center"
          );

          doc.setFont("times", "normal");
          doc.setFontSize(12);
          doc.text(
            "INSTITUTO ESTATAL ELECTORAL DE NAYARIT \n" +
              this.solicitud.area +
              "\n" +
              "Vale de salida de almacén",
            105,
            154,
            null,
            null,
            "center"
          );

          doc.setTextColor(150);
          doc.text(
            "Copia para la Dirección de Administración",
            10,
            113,
            null,
            90
          );
          doc.text("Copia del solicitante", 10, 240, null, 90);
          jsPDF.autoTableSetDefaults({
            headStyles: { fillColor: [84, 37, 131], halign: "center" },
            styles: {
              halign: "center",
              valign: "middle",
              fontSize: 7,
            },
          });
          this.listaSolicitud.forEach((item) => {
            body.push([
              num.toString(),
              item.nombre,
              item.cantidad_Solicitada,
              item.cantidad_Entregada,
              item.observaciones,
            ]);
            num = num + 1;
          });
          doc.setFontSize(7);
          console.log("Esto es Y", y);
          autoTable(doc, {
            theme: "grid",
            startY: y - 2,
            head: [
              [
                "#",
                "Consumible",
                "Cantidad solicitada",
                "Cantidad entregada",
                "Observaciones",
              ],
            ],
            body: body,
          });
          doc.setFontSize(9);
          doc.setTextColor(0);
          doc.text("Autorizó", 35, 117, null, null, "center");
          doc.text(
            "Autorizado con fecha " + this.solicitud.fecha_Aprobo_JA_Tabla,
            35,
            130,
            null,
            null,
            "center"
          );
          doc.text(
            this.solicitud.responsable_Area +
              "\n" +
              "Responsable del área solicitante",
            35,
            135,
            null,
            null,
            "center"
          );
          doc.line(15, 132, 55, 132);
          doc.text("Entregó", 105, 117, null, null, "center");
          doc.text(
            this.solicitud.empleado_Entrega +
              "\n" +
              "Personal de la Dirección de Administración",
            105,
            135,
            null,
            null,
            "center"
          );
          doc.line(80, 132, 130, 132);
          doc.text("Recibió", 175, 117, null, null, "center");
          doc.text(
            "Recibido con fecha " + this.solicitud.fecha_Entrega_Tabla,
            175,
            130,
            null,
            null,
            "center"
          );
          doc.text(
            this.solicitud.empleado_Recibe +
              "\n" +
              "Personal del área solicitante",
            175,
            135,
            null,
            null,
            "center"
          );
          doc.line(155, 132, 195, 132);
          autoTable(doc, {
            theme: "grid",
            startY: y2 - 2,
            // styles: { fontSize: 7 },
            head: [
              [
                "#",
                "Consumible",
                "Cantidad solicitada",
                "Cantidad entregada",
                "Observaciones",
              ],
            ],
            body: body,
          });

          doc.setFontSize(9);
          doc.setTextColor(0);
          doc.text("Autorizó", 35, 251, null, null, "center");
          doc.text(
            "Autorizado con fecha " + this.solicitud.fecha_Aprobo_JA_Tabla,
            35,
            264,
            null,
            null,
            "center"
          );
          doc.text(
            this.solicitud.responsable_Area +
              "\n" +
              "Responsable del área solicitante",
            35,
            269,
            null,
            null,
            "center"
          );
          /*doc.text(
            "Nombre y Firma \n Responsable del Área",
            35,
            269,
            null,
            null,
            "center"
          );*/
          doc.line(15, 266, 55, 266);
          doc.text("Entregó", 105, 251, null, null, "center");
          doc.text(
            this.solicitud.empleado_Entrega +
              "\n" +
              "Personal de la Dirección de Administración",
            105,
            269,
            null,
            null,
            "center"
          );
          /*doc.text(
            "Nombre y firma \n Dirección de Administración",
            105,
            269,
            null,
            null,
            "center"
          );*/
          doc.line(80, 266, 130, 266);
          doc.text("Recibió", 175, 251, null, null, "center");
          doc.text(
            "Recibido con fecha " + this.solicitud.fecha_Entrega_Tabla,
            175,
            264,
            null,
            null,
            "center"
          );
          doc.text(
            this.solicitud.empleado_Recibe +
              "\n" +
              "Personal del área solicitante",
            175,
            269,
            null,
            null,
            "center"
          );
          // doc.text("Nombre y firma", 175, 269, null, null, "center");
          doc.line(155, 266, 195, 266);

          doc.setLineDash([2.5]);
          doc.line(5, 142, 205, 142);
          doc.save(this.solicitud.folio + ".pdf");

          return {
            success: true,
            msj: "Recibo generado con éxito",
          };
        } else {
          return {
            success: false,
            msj: "Error al generar el recibo",
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

    actualizarModalEntrega(valor) {
      this.modalEntrega = valor;
    },

    updateConsulta(valor) {
      this.isConsulta = valor;
    },

    updateFinalizado(valor) {
      this.isFinalizado = valor;
    },
  },
});

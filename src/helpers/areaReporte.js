import { api } from "src/boot/axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { storeToRefs } from "pinia";
import { useReportesStore } from "../stores/reportes_store";
const ReportesStore = useReportesStore();
const { listadoSolicitudes } = storeToRefs(ReportesStore);
const ReportePorArea = async (areas, inicio, fin, tipo) => {
  try {
    let respSolicitudes = await api.get("/DetalleSolicitudesConsumibles");
    let filtroSolicitudes = respSolicitudes.data.data;
    const doc = new jsPDF();
    let logo = new Image();
    let textoTitulo = "";
    let textoArchivo = "";
    if (tipo == 0) {
      textoTitulo = "hasta el día de hoy";
      textoArchivo = "Reporte_General_Por_Area.pdf";
    } else if (tipo == 1) {
      textoTitulo = "el día " + inicio;
      textoArchivo = "Report_Por_Area_Del_" + inicio + ".pdf";
    } else {
      0;
      textoTitulo = " del día " + inicio + " hasta el " + fin;
      textoArchivo = "Report_Por_Area_Del_" + inicio + "_hasta_" + fin + ".pdf";
    }

    logo.src = require("../assets/IEEN300.png");
    function createHeader() {
      doc.addImage(logo, "png", 15, 15, 32, 18);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(
        "Reporte de consumibles entregados por área\n" + textoTitulo,
        105,
        22,
        null,
        null,
        "center"
      );
    }
    function createfooter(hoja, total) {
      doc.setFont("times", "normal");
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(
        "Página " + hoja + " de " + total,
        195,
        285,
        null,
        null,
        "right"
      );
    }
    let y = 40;

    for (let areaSelect of areas) {
      console.log("Esto es Y", y);
      let filtroArea = listadoSolicitudes.value.filter(
        (x) => x.area_Id == areaSelect.value
      );
      const productosPedidos = filtroSolicitudes.filter((consumibles) =>
        filtroArea.some(
          (solicitudes) => solicitudes.id === consumibles.solicitud_Id
        )
      );
      let finalYTabla = 0;
      let importeTotal = 0;
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
      let listadoFinal = Object.values(agruparProductos);
      //--------------------------------------------------------------------------------------//
      if (listadoFinal.length >= 1) {
        doc.setFillColor(161, 55, 147);
        doc.rect(14, y, 182, 10, "F");
        doc.setFontSize(11);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text(areaSelect.label, 105, y + 7, null, null, "center");

        let body = [];
        listadoFinal.forEach((item) => {
          let total = item.totalEntregada * item.precio_Unitario;
          let totalSimplificado = total.toFixed(2);
          body.push([
            item.claveProducto,
            item.consumible,
            item.totalSolicitado,
            item.totalEntregada,
            "$" + item.precio_Unitario,
            "$" + totalSimplificado,
          ]);
        });
        /*let head = [
          { header: "Clave de consumible", dataKey: "claveProducto" },
          { header: "Consumible", dataKey: "consumible" },
          { header: "Total solicitado", dataKey: "totalSolicitado" },
          { header: "Total entregado", dataKey: "totalEntregada" },
          { header: "Precio unitario", dataKey: "precio_Unitario" },
          { header: "Total", dataKey: "totalSimplificado" },
        ];*/
        let head = [
          "Clave de consumible",
          "Consumible",
          "Total solicitado",
          "Total entregado",
          "Precio unitario",
          "Importe",
        ];
        jsPDF.autoTableSetDefaults({
          headStyles: { fillColor: [161, 55, 147], halign: "center" },
          styles: {
            halign: "center",
            valign: "middle",
            fontSize: 10,
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
          },
        });
        autoTable(doc, {
          theme: "grid",
          startY: y + 10,
          head: [head],
          body: body,
          bodyStyles: { fontSize: 9 },
          margin: { top: 40 },
        });
        let sum = 0;

        for (let i = 0; i < body.length; i++) {
          let value = parseFloat(body[i][5].substring(1));
          sum += value;
        }
        importeTotal = sum.toFixed(2);

        finalYTabla = doc.lastAutoTable.finalY;
        console.log("Area ", areaSelect.label, "PuntoFinal ", finalYTabla);

        if (finalYTabla <= 255) {
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.text(
            "El importe total del área de " +
              areaSelect.label +
              ": $" +
              importeTotal,
            193,
            finalYTabla + 5,
            null,
            null,
            "right"
          );
        } else {
          doc.addPage();
          finalYTabla = 38;
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.text(
            "El importe total del área de " +
              areaSelect.label +
              ": $" +
              importeTotal,
            193,
            finalYTabla + 2,
            null,
            null,
            "right"
          );
        }
        if (finalYTabla >= 240) {
          doc.addPage();
          y = 45;
        } else {
          y = finalYTabla + 10;
        }
      }
    }
    var pageCount = doc.internal.getNumberOfPages();
    for (let i = 0; i < pageCount; i++) {
      doc.setPage(i + 1);
      createHeader();
      createfooter(i + 1, pageCount);
    }
    doc.save(textoArchivo);
    return {
      success: true,
      msj: "Reporte generado con éxito",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
    };
  }
};

export default ReportePorArea;

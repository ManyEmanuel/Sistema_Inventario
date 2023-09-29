import { api } from "src/boot/axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { storeToRefs } from "pinia";
import { useReportesStore } from "../stores/reportes_store";
const ReportesStore = useReportesStore();
const { listadoConsumibles } = storeToRefs(ReportesStore);
const ReportePorConsumible = async (inicio, fin, tipo) => {
  try {
    //await ReportesStore.loadConsumiblesEntregados(0, 0, 0);

    const doc = new jsPDF();
    let logo = new Image();
    let textoTitulo = "";
    let textoArchivo = "";
    if (tipo == 0) {
      textoTitulo = "Al momento";
      textoArchivo = "Reporte_General.pdf";
    } else if (tipo == 1) {
      textoTitulo = "el día de " + inicio;
      textoArchivo = "Reporte_del_día_" + inicio + ".pdf";
    } else {
      textoTitulo = "del dia " + inicio + " hasta el " + fin;
      textoArchivo = "Reporte_del_día_" + inicio + "_hasta_" + fin + ".pdf";
    }

    logo.src = require("../assets/IEEN300.png");
    function createHeader() {
      doc.addImage(logo, "png", 15, 15, 32, 18);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text(
        "Reporte de consumibles entregados\n" + textoTitulo,
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

    let body = [];
    listadoConsumibles.value.forEach((item) => {
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
    let head = [
      "Clave de consumible",
      "Consumible",
      "Total solicitado",
      "Total entregado",
      "Precio unitario",
      "Total",
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
      startY: 40,
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
    let importeTotal = sum.toFixed(2);
    let finalYTabla = doc.lastAutoTable.finalY;
    let y = 0;

    if (finalYTabla <= 278) {
      y = finalYTabla;
    } else {
      doc.addPage();
      y = 45;
    }
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      "Monto calculado con el último precio registrado del consumible. $" +
        importeTotal,
      193,
      y + 5,
      null,
      null,
      "right"
    );

    var pageCount = doc.internal.getNumberOfPages();
    for (let i = 0; i < pageCount; i++) {
      doc.setPage(i + 1);
      createHeader();
      createfooter(i + 1, pageCount);
    }

    doc.save(textoArchivo);
    return {
      success: true,
      msj: "Recibo generado con éxito",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
    };
  }
};

export default ReportePorConsumible;

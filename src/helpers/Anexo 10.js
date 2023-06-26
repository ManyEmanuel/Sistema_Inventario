import { api } from "src/boot/axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth_store";

const Reporte = async () => {
  try {
    let img = new Image();

    img.src = require("../assets/IEEN300.png");
    let totalPagesExp = "{total_pages_count_string}";
    const doc = new jsPDF({ format: "letter" });
    doc.addImage(img, "png", 96, 4, 28, 16);
    doc.setFontSize(12);
    doc.text(
      "Anexo 10 \n Archivo de trámite \n Cédula de identificación por caja ",
      110,
      25,
      null,
      null,
      "center"
    );
    //--------------------------------------------------------------------------//

    //--------------------------------------------------------------------------//
    //Encabezados en rojo estaticos
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setFillColor(239, 107, 107);
    doc.rect(13, 40, 95, 7, "FD");
    doc.rect(108, 40, 95, 7, "FD");
    doc.text("Transferencia", 61, 45, null, null, "center");
    doc.text("Caja", 156, 45, null, null, "center");
    doc.setFillColor(239, 107, 107);
    doc.rect(13, 54, 95, 7, "FD");
    doc.rect(108, 54, 95, 7, "FD");
    doc.text("Área responsable", 61, 59, null, null, "center");
    doc.text("Área generadora", 156, 59, null, null, "center");

    //Campos de variables estaticos
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.rect(13, 47, 95, 7);
    doc.rect(108, 47, 95, 7);
    doc.text("**Variable transferencia**", 61, 51, null, null, "center");
    doc.text("**Variable Caja**", 156, 51, null, null, "center");
    doc.rect(13, 61, 95, 7);
    doc.rect(108, 61, 95, 7);
    doc.text("**Variable area responsable**", 61, 65, null, null, "center");
    doc.text("**Variable area generadora**", 156, 65, null, null, "center");

    //Crecimiento Dinamico de campos
    let y = 75;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setFillColor(239, 107, 107);
    doc.rect(13, 68, 95, 7, "FD");
    doc.rect(108, 68, 95, 7, "FD");
    doc.text("Sección", 61, 73, null, null, "center");
    doc.text("Serie y Subserie", 156, 73, null, null, "center");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    var linesSeccion = doc.splitTextToSize("Variable de sección", 10);
    var linesSerie = doc.splitTextToSize("Variable de serie y subserie", 10);
    let mayor = Math.max(linesSeccion.length, linesSerie.length);

    console.log("Este es mayor", mayor);
    //let mayor = Math.max(linesSeccion.length,linesSerie.length)
    /*for (var i = 0; i < lines.length; i++) {
        doc.text(38 + posicion, y, lines[i], null, "center");
        y = y + 4;
      }*/

    doc.rect(13, 75, 95, 7);
    doc.rect(108, 75, 95, 7);
    doc.text("**Variable transferencia**", 61, 51, null, null, "center");
    doc.text("**Variable Caja**", 156, 51, null, null, "center");

    //_------------------------------------------------------------------------------

    //Codigo numeracion de paginas
    doc.setFontSize(9);
    var footer = function () {
      var pageCount = doc.internal.getNumberOfPages();
      console.log("Esto es el total de paginas", pageCount);
      for (var i = 0; i < pageCount; i++) {
        doc.setPage(i + 1);
        doc.text(
          "Página " + (i + 1) + " de " + pageCount,
          340,
          205,
          null,
          null,
          "right"
        );
      }
    };
    footer();
    doc.save("Anexo 10" + ".pdf");
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

export default Reporte;

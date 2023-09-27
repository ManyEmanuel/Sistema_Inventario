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
    const doc = new jsPDF({ orientation: "landscape", format: "legal" });
    doc.addImage(img, "png", 10, 5, 35, 21);
    doc.setFontSize(13);
    doc.text(
      "Anexo 13 \n Archivo de concentración \n Calendario de caducidades \n" +
        "**Variable de area**",
      180,
      10,
      null,
      null,
      "center"
    );
    //--------------------------------------------------------------------------//

    //----------------------------------------------------------------------------------------//
    var rows = [
      [
        "001",
        "1",
        "IEEN/6C/6C.12/001/2008.",
        "2010",
        "5",
        "2015",
        "X",
        "",
        "Pasillo 5, Anaquel 40, Nivel 3, Estante 6.",
      ],
    ];

    var header = [
      [
        { content: "No. transferencia", rowSpan: 2 },
        { content: "No. caja", rowSpan: 2 },
        { content: "Clave de sección, serie y subserie", rowSpan: 2 },
        { content: "Fecha de recepción", rowSpan: 2 },
        { content: "Plazo de conservación", rowSpan: 2 },
        { content: "Año de vencimiento", rowSpan: 2 },
        { content: "Destino final", colSpan: 2 },
        { content: "Signatura topográfica", rowSpan: 2 },
      ],
      ["Baja", "Histórico"],
    ];

    jsPDF.autoTableSetDefaults({
      headStyles: { fillColor: [239, 107, 107], halign: "center" },
      styles: {
        halign: "center",
        valign: "middle",
        fontSize: 10,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
      },
    });
    autoTable(doc, {
      theme: "grid",
      startY: 30,
      margin: { left: 10, rigth: 16 },
      head: header,
      body: rows,
      bodyStyles: { fontSize: 9 },
      tableLineColor: [0, 0, 0],
    });

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
    doc.save("Anexo 13" + ".pdf");
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

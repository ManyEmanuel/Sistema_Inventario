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
    doc.addImage(img, "png", 10, 4, 35, 21);
    doc.setFontSize(14);
    doc.text(
      "Anexo 9 \n Archivo de trámite \n Inventario de transferencia primaria ",
      180,
      10,
      null,
      null,
      "center"
    );
    //--------------------------------------------------------------------------//

    //--------------------------------------------------------------------------//
    //Encabezados en rojo
    doc.setFillColor(239, 107, 107);
    doc.rect(10, 25, 100, 5, "FD");
    doc.rect(240, 25, 100, 5, "FD");
    doc.rect(10, 30, 100, 5, "FD");
    doc.rect(10, 35, 100, 5, "FD");
    doc.rect(240, 35, 100, 5, "FD");
    doc.rect(10, 40, 100, 5, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Nombre del área responsable", 12, 29);
    doc.text("Área generadora", 12, 34);
    doc.text("Nombre y cargo del Encargado de archivo de tramíte", 12, 39);
    doc.text("Sección", 12, 44);
    doc.text("Fecha de elaboración ", 290, 29, null, null, "center");
    doc.text("No. de transferencia ", 290, 39, null, null, "center");
    //Rectangulos de información y variables
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.rect(110, 25, 130, 5);
    doc.text("**Area responsable", 112, 29);
    doc.rect(110, 30, 130, 5);
    doc.text("**Area generadora", 112, 34);
    doc.rect(240, 30, 100, 5);
    doc.text("**Fecha de elaboración", 290, 34, null, null, "center");
    doc.rect(110, 35, 130, 5);
    doc.text("**Nombre y cargo del encargado de archivo de tramite", 112, 39);
    doc.rect(110, 40, 130, 5);
    doc.text("**Sección", 112, 44);
    doc.rect(240, 40, 100, 5);
    doc.text("**No. de transferencia", 290, 44, null, null, "center");
    //----------------------------------------------------------------------------------------//
    var rows = [
      [
        "6C.12",
        "Almacenamiento, control y distribución de bienes muebles",
        "IEEN/6C/6C.12/001/2008",
        "001",
        "Resguardos de inventario de bienes inmuebles del consejo municipal electoral de Acaponeta.",
        "Abril/2008",
        "Jun/2008",
        "Caja 1 Archivo tamaño carta",
        "Administrativo",
        "5",
        "B",
        "Pasillo 5, Anaquel 40, Nivel 3, Estante 6.",
      ],
    ];

    var header = [
      [
        { content: "Serie y Subserie", rowSpan: 2 },
        { content: "Nombre del expediente", rowSpan: 2 },
        { content: "Clave de clasificación", rowSpan: 2 },
        { content: "No. de expediente interno", rowSpan: 2 },
        {
          content: "Descripción del asunto del expediente \n Observaciones",
          rowSpan: 2,
        },
        { content: "Fecha inicio", rowSpan: 2 },
        { content: "Fecha término", rowSpan: 2 },
        { content: "Caja", rowSpan: 2 },
        { content: "Valor documental", rowSpan: 2 },
        { content: "Vigencia documental (Años)", colSpan: 1 },
        { content: "Destino final", colSpan: 1 },
        { content: "Signatura topográfica", rowSpan: 2 },
      ],
      ["Concentración", "Baja / Histórico"],
    ];

    jsPDF.autoTableSetDefaults({
      headStyles: { fillColor: [239, 107, 107], halign: "center" },
      styles: {
        halign: "center",
        valign: "middle",
        fontSize: 7,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
      },
    });
    autoTable(doc, {
      theme: "grid",
      startY: 46,
      margin: { left: 10, rigth: 16 },
      head: header,
      body: rows,
      bodyStyles: { fontSize: 6 },
      tableLineColor: [0, 0, 0],
    });

    doc.setFillColor(239, 107, 107);
    doc.rect(10, doc.lastAutoTable.finalY, 332, 5, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    console.log("Total de hojas", totalPagesExp);

    let inicioFirmas = 0;
    if (doc.lastAutoTable.finalY <= 154) {
      inicioFirmas = 165;
    } else {
      doc.addPage();
      inicioFirmas = 30;
      doc.setPage(doc.internal.getNumberOfPages() - 1);
    }
    doc.text(
      "El presente inventario consta de " +
        doc.internal.getNumberOfPages() +
        " hoja(s) y ampara la cantidad de " +
        rows.length +
        " expediente(s) de los años " +
        "*Variable de rango de año**" +
        " contenidos en " +
        "**Variable cantidad cajas** " +
        " caja(s) con un peso aproximado de " +
        "**Variable peso**" +
        " Kilogramos",
      12,
      doc.lastAutoTable.finalY + 4
    );
    doc.setPage(doc.internal.getNumberOfPages());
    //Aqui se ingresan las firmas//
    doc.setFontSize(11);
    doc.text("Elaboró", 45, inicioFirmas, null, null, "center");
    doc.line(20, inicioFirmas + 15, 70, inicioFirmas + 15);
    doc.text("Valida", 130, inicioFirmas, null, null, "center");
    doc.line(105, inicioFirmas + 15, 155, inicioFirmas + 15);
    doc.text("Coteja", 215, inicioFirmas, null, null, "center");
    doc.line(190, inicioFirmas + 15, 240, inicioFirmas + 15);
    doc.text("Valida", 290, inicioFirmas, null, null, "center");
    doc.line(265, inicioFirmas + 15, 315, inicioFirmas + 15);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      "**Variable nombre**",
      45,
      inicioFirmas + 20,
      null,
      null,
      "center"
    );
    doc.text(
      "**Variable nombre**",
      130,
      inicioFirmas + 20,
      null,
      null,
      "center"
    );
    doc.text(
      "**Variable nombre**",
      215,
      inicioFirmas + 20,
      null,
      null,
      "center"
    );
    doc.text(
      "**Variable nombre**",
      290,
      inicioFirmas + 20,
      null,
      null,
      "center"
    );

    doc.setFont("helvetica", "bold");

    var linesElaboro = doc.splitTextToSize("**Variable Puesto**", 65);
    var y = inicioFirmas + 24;
    for (var i = 0; i < linesElaboro.length; i++) {
      doc.text(45, y, linesElaboro[i], null, "center");
      y = y + 4;
    }

    var linesValido = doc.splitTextToSize("**Variable Puesto**", 65);
    var y = inicioFirmas + 24;
    for (var i = 0; i < linesElaboro.length; i++) {
      doc.text(130, y, linesElaboro[i], null, "center");
      y = y + 4;
    }

    var linesVobo = doc.splitTextToSize("**Variable Puesto**", 65);
    var y = inicioFirmas + 24;
    for (var i = 0; i < linesElaboro.length; i++) {
      doc.text(215, y, linesElaboro[i], null, "center");
      y = y + 4;
    }

    var linesSuperviso = doc.splitTextToSize("**Variable Puesto**", 65);
    var y = inicioFirmas + 24;
    for (var i = 0; i < linesElaboro.length; i++) {
      doc.text(290, y, linesElaboro[i], null, "center");
      y = y + 4;
    }

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
    doc.save("Anexo 9" + ".pdf");
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

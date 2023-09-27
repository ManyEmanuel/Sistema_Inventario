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
    doc.setFontSize(14);
    doc.text(
      "Anexo 4 \n Archivo de trámite \n Inventario general por expediente",
      180,
      10,
      null,
      null,
      "center"
    );
    //--------------------------------------------------------------------------//
    doc.setFillColor(239, 107, 107);
    doc.rect(255, 25, 45, 5, "FD");
    doc.rect(300, 25, 40, 5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Fecha de elaboración", 277, 29, null, null, "center");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("**Fecha**", 320, 29, null, null, "center");
    //--------------------------------------------------------------------------//

    doc.setFillColor(239, 107, 107);
    doc.rect(10, 30, 165, 5, "FD");
    doc.rect(10, 35, 165, 5, "FD");
    doc.rect(10, 40, 165, 5, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Nombre del área responsable", 12, 34);
    doc.text("Área generadora", 12, 39);
    doc.text(
      "Nombre, cargo del archivo de trámite del área responsable",
      12,
      44
    );
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.rect(175, 30, 165, 5);
    doc.text("**Nombre del area responsable**", 177, 34);
    doc.rect(175, 35, 165, 5);
    doc.text("**Area generadora**", 177, 39);
    doc.rect(175, 40, 165, 5);
    doc.text("**Nombre, cargo** ", 177, 44);

    //----------------------------------------------------------------------------------------//
    var rows = [
      [
        "6C. Recursos, materiales y obras públicas",
        "6C.12",
        "Almacenamiento, control y distribucion de bienes muebles",
        "IEEN/6C/6C.12/001/2008",
        "001",
        "Resguardo de inventario de bienes inmuebles del consejo municipal electoral de Ahuacatlán",
        "Abril/2008",
        "Jun/2008",
        "Caja 1 de archivo tamaño carta",
        "Administrativo",
        "2",
        "5",
        "7",
        "X",
        "",
        "",
        "",
        "",
      ],
    ];

    var header = [
      [
        { content: "Sección", rowSpan: 2 },
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
        { content: "Ubicación fisica del expediente", rowSpan: 2 },
        { content: "Valor Documental", rowSpan: 2 },
        { content: "Vigencia documental", colSpan: 3 },
        { content: "Destino final", colSpan: 2 },
        { content: "Fecha clasificación", rowSpan: 2 },
        { content: "Fecha desclasificación", rowSpan: 2 },
        { content: "Fecha ampliacion", rowSpan: 2 },
      ],
      ["Trámite", "Concentración", "Completa", "Baja", "Histórico"],
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
        " expediente(s) del año " +
        "*Rango de año**",
      12,
      doc.lastAutoTable.finalY + 4
    );
    doc.setPage(doc.internal.getNumberOfPages());
    //Aqui se ingresan las firmas//
    doc.setFontSize(11);
    doc.text("Elaboró", 45, inicioFirmas, null, null, "center");
    doc.line(20, inicioFirmas + 15, 70, inicioFirmas + 15);
    doc.text("Validó", 130, inicioFirmas, null, null, "center");
    doc.line(105, inicioFirmas + 15, 155, inicioFirmas + 15);
    doc.text("Vo.Bo.", 215, inicioFirmas, null, null, "center");
    doc.line(190, inicioFirmas + 15, 240, inicioFirmas + 15);
    doc.text("Supervisa", 290, inicioFirmas, null, null, "center");
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
    doc.save("Anexo 4" + ".pdf");
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

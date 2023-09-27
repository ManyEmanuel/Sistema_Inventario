import { api } from "src/boot/axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth_store";

const Reporte = async () => {
  try {
    let img = new Image();

    img.src = require("../assets/IEEN300.png");
    const doc = new jsPDF({ format: "letter" });
    doc.addImage(img, "png", 13, 4, 28, 16);
    doc.setFontSize(12);
    doc.text(
      "Anexo 7 \n Archivo de trámite \n Cédula de prestamo de expedientes de Archivo de Trámite ",
      110,
      10,
      null,
      null,
      "center"
    );
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Folio: " + " *Variable de folio*", 203, 28, null, null, "right");
    doc.setFillColor(252, 213, 180);
    doc.rect(13, 30, 190, 5, "FD");
    //-------Datos del solicitante estaticos---------------------------//
    doc.setFontSize(9);
    doc.text("Datos del solicitante", 108, 34, null, null, "center");
    doc.rect(13, 35, 40, 5);
    doc.text("Área responsable", 15, 39);
    doc.rect(53, 35, 150, 5);
    doc.rect(13, 40, 40, 5);
    doc.text("Área solicitante", 15, 44);
    doc.rect(53, 40, 150, 5);
    doc.rect(13, 45, 40, 5);
    doc.text("Fecha de préstamo", 15, 49);
    doc.rect(53, 45, 55, 5);
    doc.rect(108, 45, 40, 5);
    doc.text("Fecha de devolución", 110, 49);
    doc.rect(148, 45, 55, 5);
    doc.rect(13, 50, 40, 5);
    doc.text("Nombre y cargo", 15, 54);
    doc.rect(53, 50, 150, 5);
    //---------------------Datos del solicitante variables-----------------------------------------------------//
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("**Variable area responsable**", 55, 39);
    doc.text("**Variable area solicitante**", 55, 44);
    doc.text("**Fecha prestamo**", 81, 49, null, null, "center");
    doc.text("**Fecha devolución**", 176, 49, null, null, "center");
    doc.text("**Variable de Nombre y cargo de solicitante**", 55, 54);
    //----------------------Autotable----------------------------------------------------//
    doc.setFont("helvetica", "bold");
    doc.setFillColor(252, 213, 180);
    doc.rect(13, 55, 190, 5, "FD");
    doc.setFontSize(9);
    doc.text("Información solicitada", 108, 59, null, null, "center");
    var rows = [
      [
        "IEEN/1C.14/001/2022",
        "Diciembre/2022",
        "Pasillo 5, Anaquel 40, Nivel 3, Estante 6.",
        "001",
      ],
      [
        "IEEN/1C.14/001/2022",
        "Diciembre/2022",
        "Pasillo 5, Anaquel 40, Nivel 3, Estante 6.",
        "001",
      ],
      [
        "IEEN/1C.14/001/2022",
        "Diciembre/2022",
        "Pasillo 5, Anaquel 40, Nivel 3, Estante 6.",
        "001",
      ],
      [
        "IEEN/1C.14/001/2022",
        "Diciembre/2022",
        "Pasillo 5, Anaquel 40, Nivel 3, Estante 6.",
        "001",
      ],
      [
        "IEEN/1C.14/001/2022",
        "Diciembre/2022",
        "Pasillo 5, Anaquel 40, Nivel 3, Estante 6.",
        "001",
      ],
    ];

    var header = [
      [
        { content: "Clave de clasificación del expediente", rowSpan: 2 },
        { content: "Fecha de inicio o conclusión del expediente", rowSpan: 2 },
        { content: "Signatura topográfica", colSpan: 1 },
        { content: "No. interno del expediente", rowSpan: 2 },
      ],
      ["Librero/Estante/Archivero - Nivel/Entrepaño/Cajón"],
    ];

    jsPDF.autoTableSetDefaults({
      headStyles: { fillColor: [255, 255, 255], halign: "center" },
      styles: {
        halign: "center",
        valign: "middle",
        fontSize: 9,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
      },
    });
    autoTable(doc, {
      theme: "grid",
      startY: 60,
      margin: { left: 10, rigth: 16 },
      head: header,
      body: rows,
      margin: { left: 13, right: 13 },
      bodyStyles: { fontSize: 8 },
      tableLineColor: [0, 0, 0],
    });

    //-------------Datos estaticos descripcion del contenido------------------------------------------//
    let y = doc.lastAutoTable.finalY;
    doc.setFont("helvetica", "bold");
    doc.setFillColor(252, 213, 180);
    doc.rect(13, y, 190, 5, "FD");
    doc.setFontSize(9);
    doc.text(
      "Descripción del contenido del expediente",
      108,
      y + 4,
      null,
      null,
      "center"
    );
    y = y + 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    let linesContenido = doc.splitTextToSize("**Variable contenido**", 190);
    let alturaContenido = linesContenido.length * 5;
    let inicioContenido = y + 4;
    for (var i = 0; i < linesContenido.length; i++) {
      doc.text(108, inicioContenido, linesContenido[i], null, "center");
      inicioContenido = inicioContenido + 4;
    }
    doc.rect(13, y, 190, alturaContenido);
    //---------------------------------------------------------------------------------------------------------------------------------//
    y = y + alturaContenido;
    doc.setFont("helvetica", "bold");
    doc.setFillColor(252, 213, 180);
    doc.rect(13, y, 190, 5, "FD");
    doc.setFontSize(9);
    doc.text("Observaciones", 108, y + 4, null, null, "center");
    y = y + 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    let linesObservaciones = doc.splitTextToSize(
      "**Variable observaciones**",
      190
    );
    let alturaObservaciones = linesObservaciones.length * 5;
    let inicioObservaciones = y + 4;
    for (var i = 0; i < linesObservaciones.length; i++) {
      doc.text(108, inicioObservaciones, linesObservaciones[i], null, "center");
      inicioObservaciones = inicioObservaciones + 4;
    }
    doc.rect(13, y, 190, alturaObservaciones);
    //-------------------------------------------------------------------------------------------//
    y = y + alturaObservaciones + 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setFillColor(252, 213, 180);
    doc.rect(13, y, 90, 10, "FD");
    doc.rect(113, y, 90, 10, "FD");
    doc.text("Nombre y firma del solicitante", 58, y + 6, null, null, "center");
    doc.text(
      "Nombre y firma del encargado \n del archivo de trámite",
      158,
      y + 4,
      null,
      null,
      "center"
    );

    y = y + 10;
    doc.rect(13, y, 90, 15);
    doc.rect(113, y, 90, 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("**Nombre solicitante**", 58, y + 8, null, null, "center");
    doc.text("**Nombre encargado**", 158, y + 8, null, null, "center");
    y = y + 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setFillColor(252, 213, 180);
    doc.rect(13, y, 40, 5, "FD");
    doc.text("Fecha de devolución", 15, y + 4);
    doc.rect(53, y, 50, 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("**Variable fecha devolución**", 78, y + 4, null, null, "center");

    doc.addPage();
    doc.addImage(img, "png", 13, 4, 28, 16);
    doc.setFontSize(12);
    doc.text(
      "Anexo 7 \n Archivo de trámite \n Cédula de prestamo de expedientes de Archivo de Trámite ",
      110,
      10,
      null,
      null,
      "center"
    );
    doc.setFillColor(252, 213, 180);
    doc.rect(13, 30, 190, 5, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Comprobante de devolución", 108, 34, null, null, "center");

    doc.rect(13, 35, 40, 5);
    doc.text("Folio", 15, 39);
    doc.rect(53, 35, 55, 5);
    doc.rect(108, 35, 40, 5);
    doc.text("Fecha de devolución", 110, 39);
    doc.rect(148, 35, 55, 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("**Variable folio**", 80, 39, null, null, "center");
    doc.text("**Variable fecha devolucion**", 175, 39, null, null, "center");

    y = 45;

    doc.setFont("helvetica", "bold");
    doc.setFillColor(252, 213, 180);
    doc.rect(13, y, 190, 5, "FD");
    doc.setFontSize(9);
    doc.text("Observaciones", 108, y + 4, null, null, "center");
    y = y + 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    let linesObservacionesCopia = doc.splitTextToSize(
      "**Variable observaciones**",
      190
    );
    let alturaObservacionesCopia = linesObservacionesCopia.length * 5;
    let inicioObservacionesCopia = y + 4;
    for (var i = 0; i < linesObservacionesCopia.length; i++) {
      doc.text(
        108,
        inicioObservacionesCopia,
        linesObservacionesCopia[i],
        null,
        "center"
      );
      inicioObservacionesCopia = inicioObservacionesCopia + 4;
    }
    doc.rect(13, y, 190, alturaObservacionesCopia);

    y = y + alturaObservacionesCopia + 35;
    doc.line(70, y, 150, y);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      "**Nombre responsable de archivo** ",
      110,
      y - 1,
      null,
      null,
      "center"
    );
    doc.setFont("helvetica", "bold");
    doc.text(
      "Nombre, Firma y Sello del \n Responsable del Archivo de Trámite",
      110,
      y + 4,
      null,
      null,
      "center"
    );

    //Encabezados en rojo estaticos

    doc.save("Anexo 7" + ".pdf");
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

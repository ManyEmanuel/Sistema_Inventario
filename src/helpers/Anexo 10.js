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
    var linesSeccion = doc.splitTextToSize("**Variable de sección**", 90);
    var linesSerie = doc.splitTextToSize(
      "**Variable de serie y subserie**",
      90
    );
    let mayor = Math.max(linesSeccion.length, linesSerie.length);
    doc.rect(13, 75, 95, 4 + mayor * 4);
    doc.rect(108, 75, 95, 4 + mayor * 4);
    let inicio = y + 4;
    for (var i = 0; i < linesSeccion.length; i++) {
      doc.text(61, inicio, linesSeccion[i], null, "center");
      inicio = inicio + 4;
    }
    inicio = y + 4;
    for (var i = 0; i < linesSerie.length; i++) {
      doc.text(156, inicio, linesSerie[i], null, "center");
      inicio = inicio + 4;
    }
    y = y + 4 + mayor * 4;
    //------------------------------------------------------------------------------------------//
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setFillColor(239, 107, 107);
    doc.rect(13, y, 190, 7, "FD");
    doc.text("Valor documental ", 110, y + 4, null, null, "center");
    y = y + 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    var linesValor = doc.splitTextToSize(
      "**Variable de valor documental**",
      180
    );
    doc.rect(13, y, 190, 4 + linesValor.length * 4);
    let inicioValor = y + 4;
    for (var i = 0; i < linesValor.length; i++) {
      doc.text(110, inicioValor, linesValor[i], null, "center");
      inicioValor = inicioValor + 4;
    }
    y = y + 4 + linesValor.length * 4;

    //_------------------------------------------------------------------------------
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setFillColor(239, 107, 107);
    doc.rect(13, y, 95, 7, "FD");
    doc.rect(108, y, 95, 7, "FD");
    doc.text("Total expedientes", 61, y + 4, null, null, "center");
    doc.text("Fechas extremas", 156, y + 4, null, null, "center");
    y = y + 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    var linesTotal = doc.splitTextToSize("**Variable de Total**", 90);
    var linesFechas = doc.splitTextToSize("**Variable fecha**", 90);
    let mayorFechas = Math.max(linesTotal.length, linesFechas.length);
    doc.rect(13, y, 95, 4 + mayorFechas * 4);
    doc.rect(108, y, 95, 4 + mayorFechas * 4);
    let inicioFechas = y + 4;
    for (var i = 0; i < linesTotal.length; i++) {
      doc.text(61, inicioFechas, linesTotal[i], null, "center");
      inicioFechas = inicioFechas + 4;
    }
    inicioFechas = y + 4;
    for (var i = 0; i < linesFechas.length; i++) {
      doc.text(156, inicioFechas, linesFechas[i], null, "center");
      inicioFechas = inicioFechas + 4;
    }
    y = y + 4 + mayorFechas * 4;
    //----------------------------------------------------------------------------------------------------

    var bodyElements = [
      ["6C.12", "Almacenamiento, control y distribución de bienes muebles"],
      ["6C.12", "Almacenamiento, control y distribución de bienes muebles"],
      ["6C.12", "Almacenamiento, control y distribución de bienes muebles"],
      ["6C.12", "Almacenamiento, control y distribución de bienes muebles"],
      ["6C.12", "Almacenamiento, control y distribución de bienes muebles"],
      ["6C.12", "Almacenamiento, control y distribución de bienes muebles"],
      ["6C.12", "Almacenamiento, control y distribución de bienes muebles"],
      ["6C.12", "Almacenamiento, control y distribución de bienes muebles"],
      ["6C.12", "Almacenamiento, control y distribución de bienes muebles"],
      ["6C.12", "Almacenamiento, control y distribución de bienes muebles"],
      ["6C.12", "Almacenamiento, control y distribución de bienes muebles"],
      ["6C.12", "Almacenamiento, control y distribución de bienes muebles"],
      ["6C.12", "Almacenamiento, control y distribución de bienes muebles"],
      ["6C.12", "Almacenamiento, control y distribución de bienes muebles"],
      ["6C.12", "Almacenamiento, control y distribución de bienes muebles"],
      ["6C.12", "Almacenamiento, control y distribución de bienes muebles"],
      ["6C.12", "Almacenamiento, control y distribución de bienes muebles"],
      ["6C.12", "Almacenamiento, control y distribución de bienes muebles"],
    ];
    var raw = bodyElements;
    var body = [];

    for (var i = 0; i < raw.length; i++) {
      var row = [];
      for (var key in raw[i]) {
        console.log("Esto es key", key);
        row.push(raw[i][key]);
      }
      if (i == 0) {
        row.push({
          rowSpan: raw.length,
          content: "**Variable numero de caja**",
          styles: { valign: "middle", halign: "center" },
        });
      }
      body.push(row);
    }
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

    doc.autoTable({
      startY: y,
      head: [
        [
          {
            content: "Clave de clasificación",
            styles: { halign: "center" },
          },
          {
            content: "Vigencia documental",
            styles: { halign: "center" },
          },
          {
            content: "Total de cajas",
            styles: { halign: "center" },
          },
        ],
      ],
      body: body,
      theme: "grid",
      margin: { left: 13, right: 13 },
      bodyStyles: { fontSize: 8 },
      tableLineColor: [0, 0, 0],
    });
    y = doc.lastAutoTable.finalY;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setFillColor(239, 107, 107);
    doc.rect(13, y, 190, 7, "FD");
    doc.text(
      "Para uso exclusivo del archivo de concentración ",
      110,
      y + 4,
      null,
      null,
      "center"
    );
    y = y + 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setFillColor(239, 107, 107);
    doc.rect(13, y, 50, 20, "FD");
    doc.text("Signatura \n topográfica ", 38, y + 8, null, null, "center");
    doc.setFillColor(239, 107, 107);
    doc.rect(63, y, 35, 7, "FD");
    doc.text("Inmueble", 81, y + 4, null, null, "center");
    doc.setFillColor(239, 107, 107);
    doc.rect(98, y, 35, 7, "FD");
    doc.text("Pasillo", 116, y + 4, null, null, "center");
    doc.setFillColor(239, 107, 107);
    doc.rect(133, y, 35, 7, "FD");
    doc.text("Estante", 151, y + 4, null, null, "center");
    doc.setFillColor(239, 107, 107);
    doc.rect(168, y, 35, 7, "FD");
    doc.text("Nivel", 186, y + 4, null, null, "center");
    y = y + 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.rect(63, y, 140, 13);
    y = y + 4;
    var linesSignatura = doc.splitTextToSize(
      "**Variable de signatura topografica**",
      135
    );
    for (var i = 0; i < linesSignatura.length; i++) {
      doc.text(133, y, linesSignatura[i], null, "center");
      y = y + 4;
    }

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

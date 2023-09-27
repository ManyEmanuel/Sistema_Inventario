import { api } from "src/boot/axios";
import { jsPDF } from "jspdf";

import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth_store";

const Reporte = async () => {
  try {
    let img = new Image();

    img.src = require("../assets/IEEN300.png");
    const doc = new jsPDF("landscape");
    let multiplo = 0;
    for (let j = 0; j < 11; j++) {
      let posicion = multiplo * 68;
      doc.rect(8 + posicion, 6, 60, 20);
      doc.addImage(img, "png", 22 + posicion, 7, 32, 18);

      //--------------------------------------------------------------------------//
      doc.setFillColor(221, 217, 196);
      doc.rect(8 + posicion, 26, 60, 8, "FD");
      doc.setFontSize(15);
      doc.text("Fondo", 38 + posicion, 32, null, null, "center");
      //--------------------------------------------------------------------------//
      doc.rect(8 + posicion, 34, 60, 10);
      doc.setFontSize(10);
      doc.text(
        "Instituto Estatal Electoral",
        38 + posicion,
        40,
        null,
        null,
        "center"
      );
      //--------------------------------------------------------------------------//
      doc.setFillColor(221, 217, 196);
      doc.rect(8 + posicion, 44, 60, 8, "FD");
      doc.setFontSize(15);
      doc.text("Sección", 38 + posicion, 50, null, null, "center");
      //--------------------------------------------------------------------------//
      doc.setFontSize(10);
      //let textSeccion = **Ingresa variable**
      let textSeccion =
        "13. Partidos Políticos, Candidatos Independientes y Fiscalización de Organizaciones Ciudadanas Locales.";
      var lines = doc.splitTextToSize(textSeccion, 55);
      console.log("Esto es lines", lines.length);
      var y = 56;
      for (var i = 0; i < lines.length; i++) {
        doc.text(38 + posicion, y, lines[i], null, "center");
        y = y + 4;
      }
      let rectanguloSeccion = lines.length * 5;
      doc.rect(8 + posicion, 52, 60, rectanguloSeccion);
      //--------------------------------------------------------------------------//
      let puntoFinSeccion = 52 + rectanguloSeccion;
      doc.setFillColor(221, 217, 196);
      doc.rect(8 + posicion, puntoFinSeccion, 60, 8, "FD");
      doc.setFontSize(15);
      doc.text(
        "Serie",
        38 + posicion,
        puntoFinSeccion + 6,
        null,
        null,
        "center"
      );

      //--------------------------------------------------------------------------//
      doc.setFontSize(10);
      y = puntoFinSeccion + 12;
      //let textSerie = **Ingresa variable**
      let textSerie = "15.3";
      var linesSeries = doc.splitTextToSize(textSerie, 55);
      for (var i = 0; i < linesSeries.length; i++) {
        doc.text(38 + posicion, y, linesSeries[i], null, "center");
        y = y + 4;
      }
      let rectanguloSerie = linesSeries.length * 5;
      doc.rect(8 + posicion, puntoFinSeccion + 8, 60, rectanguloSerie);
      let puntoFinSerie = puntoFinSeccion + rectanguloSerie + 8;

      //--------------------------------------------------------------------------//
      doc.setFillColor(221, 217, 196);
      doc.rect(8 + posicion, puntoFinSerie, 60, 8, "FD");
      doc.setFontSize(15);
      doc.text(
        "Subserie",
        38 + posicion,
        puntoFinSerie + 6,
        null,
        null,
        "center"
      );

      //-------------------------------------------------------------------------------------//
      doc.setFontSize(10);
      y = puntoFinSerie + 12;
      //let textSerie = **Ingresa variable**
      let textSubserie = "15.3.1";
      var linesSubSeries = doc.splitTextToSize(textSubserie, 55);
      for (var i = 0; i < linesSubSeries.length; i++) {
        doc.text(38 + posicion, y, linesSubSeries[i], null, "center");
        y = y + 4;
      }
      let rectanguloSubSerie = linesSubSeries.length * 5;
      doc.rect(8 + posicion, puntoFinSerie + 8, 60, rectanguloSubSerie);
      let puntoFinSubSerie = puntoFinSerie + rectanguloSubSerie + 8;

      //---------------------------------------------------------------------------------------//
      doc.setFillColor(221, 217, 196);
      doc.rect(8 + posicion, puntoFinSubSerie, 60, 8, "FD");
      doc.setFontSize(15);
      doc.text(
        "Área responsable",
        38 + posicion,
        puntoFinSubSerie + 6,
        null,
        null,
        "center"
      );
      //----------------------------------------------------------------------------------------//
      doc.setFontSize(10);
      y = puntoFinSubSerie + 12;
      //let textSerie = **Ingresa variable**
      let textAreaResponsable = "Unidad Tecnica de Informatica y Estadistica";
      var lineAreaReponsable = doc.splitTextToSize(textAreaResponsable, 55);
      for (var i = 0; i < lineAreaReponsable.length; i++) {
        doc.text(38 + posicion, y, lineAreaReponsable[i], null, "center");
        y = y + 4;
      }
      let rectanguloAreaResponsable = lineAreaReponsable.length * 5;
      doc.rect(
        8 + posicion,
        puntoFinSubSerie + 8,
        60,
        rectanguloAreaResponsable
      );
      let puntoFinAreaResponsable =
        puntoFinSubSerie + rectanguloAreaResponsable + 8;

      //---------------------------------------------------------------------------------------//
      doc.setFillColor(221, 217, 196);
      doc.rect(8 + posicion, puntoFinAreaResponsable, 60, 8, "FD");
      doc.setFontSize(15);
      doc.text(
        "Área responsable",
        38 + posicion,
        puntoFinAreaResponsable + 6,
        null,
        null,
        "center"
      );

      //---------------------------------------------------------------------------------------//
      doc.setFontSize(10);
      y = puntoFinAreaResponsable + 12;
      //let textSerie = **Ingresa variable**
      let textAreaGeneradora = "Secretaria General";
      var lineAreaGeneradora = doc.splitTextToSize(textAreaGeneradora, 55);
      for (var i = 0; i < lineAreaGeneradora.length; i++) {
        doc.text(38 + posicion, y, lineAreaGeneradora[i], null, "center");
        y = y + 4;
      }
      let rectanguloAreaGeneradora = lineAreaGeneradora.length * 5;
      doc.rect(
        8 + posicion,
        puntoFinAreaResponsable + 8,
        60,
        rectanguloAreaGeneradora
      );
      let puntoFinAreaGeneradora =
        puntoFinAreaResponsable + rectanguloAreaGeneradora + 8;

      //---------------------------------------------------------------------------------------//
      doc.setFillColor(221, 217, 196);
      doc.rect(8 + posicion, puntoFinAreaGeneradora, 60, 8, "FD");
      doc.setFontSize(15);
      doc.text(
        "Clave de clasificación",
        38 + posicion,
        puntoFinAreaGeneradora + 6,
        null,
        null,
        "center"
      );

      //---------------------------------------------------------------------------------------//
      doc.setFontSize(10);
      y = puntoFinAreaGeneradora + 12;
      //let textSerie = **Ingresa variable**
      let textClaveClasificacion = "IEEN/15/15.3/15.3.1/011/1998";
      var lineClaveClasificacion = doc.splitTextToSize(
        textClaveClasificacion,
        55
      );
      for (var i = 0; i < lineClaveClasificacion.length; i++) {
        doc.text(38 + posicion, y, lineClaveClasificacion[i], null, "center");
        y = y + 4;
      }
      let rectanguloClaveClasificacion = lineClaveClasificacion.length * 5;
      doc.rect(
        8 + posicion,
        puntoFinAreaGeneradora + 8,
        60,
        rectanguloClaveClasificacion
      );
      let puntoFinClaveClasificacion =
        puntoFinAreaGeneradora + rectanguloClaveClasificacion + 8;

      //---------------------------------------------------------------------------------------//
      doc.setFillColor(221, 217, 196);
      doc.rect(8 + posicion, puntoFinClaveClasificacion, 60, 8, "FD");
      doc.setFontSize(14);
      doc.text(
        "No. de Expediente Externo",
        38 + posicion,
        puntoFinClaveClasificacion + 6,
        null,
        null,
        "center"
      );

      //---------------------------------------------------------------------------------------//
      doc.setFontSize(10);
      y = puntoFinClaveClasificacion + 12;
      //let textSerie = **Ingresa variable**
      let textExpedienteExterno = "SG-011";
      var lineExpedienteExterno = doc.splitTextToSize(
        textExpedienteExterno,
        55
      );
      for (var i = 0; i < lineExpedienteExterno.length; i++) {
        doc.text(38 + posicion, y, lineExpedienteExterno[i], null, "center");
        y = y + 4;
      }
      let rectanguloExpedienteExterno = lineExpedienteExterno.length * 5;
      doc.rect(
        8 + posicion,
        puntoFinClaveClasificacion + 8,
        60,
        rectanguloExpedienteExterno
      );
      let puntoFinExpedienteExterno =
        puntoFinClaveClasificacion + rectanguloExpedienteExterno + 8;

      //---------------------------------------------------------------------------------------//
      doc.setFillColor(221, 217, 196);
      doc.rect(8 + posicion, puntoFinExpedienteExterno, 60, 8, "FD");
      doc.setFontSize(16);
      doc.text(
        "Fechas Extremas (9)",
        38 + posicion,
        puntoFinExpedienteExterno + 6,
        null,
        null,
        "center"
      );

      //---------------------------------------------------------------------------------------//
      doc.setFontSize(10);
      y = puntoFinExpedienteExterno + 12;
      //let textSerie = **Ingresa variable**
      let textFecha = "1998 al 1998";
      var lineFecha = doc.splitTextToSize(textFecha, 55);
      for (var i = 0; i < lineFecha.length; i++) {
        doc.text(38 + posicion, y, lineFecha[i], null, "center");
        y = y + 4;
      }
      let rectanguloFecha = lineFecha.length * 5;
      doc.rect(
        8 + posicion,
        puntoFinExpedienteExterno + 8,
        60,
        rectanguloFecha
      );
      let puntoFinFechas = puntoFinExpedienteExterno + rectanguloFecha + 8;

      //---------------------------------------------------------------------------------------//
      doc.setFillColor(221, 217, 196);
      doc.rect(8 + posicion, puntoFinFechas, 60, 8, "FD");
      doc.setFontSize(16);
      doc.text(
        "Valor documental",
        38 + posicion,
        puntoFinFechas + 6,
        null,
        null,
        "center"
      );

      //---------------------------------------------------------------------------------------//
      doc.setFontSize(10);
      y = puntoFinFechas + 12;
      //let textSerie = **Ingresa variable**
      let textValor = "Legal";
      var lineValor = doc.splitTextToSize(textValor, 55);
      for (var i = 0; i < lineValor.length; i++) {
        doc.text(38 + posicion, y, lineValor[i], null, "center");
        y = y + 4;
      }
      let rectanguloValor = lineValor.length * 5;
      doc.rect(8 + posicion, puntoFinFechas + 8, 60, rectanguloValor);

      if (posicion == 204) {
        doc.addPage();
        multiplo = 0;
      } else {
        multiplo = multiplo + 1;
      }

      //----------------------------------------------------------------------------------------//
    }
    doc.save("Anexo 5" + ".pdf");
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

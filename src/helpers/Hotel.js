import { api } from "src/boot/axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ReporteHotel = async () => {
  try {
    let img = new Image();
    img.src = require("../assets/hotelGirasol.png");
    const doc = new jsPDF();
    doc.addImage(img, "png", 5, 3, 35, 35);
    doc.setFontSize(22);
    doc.setFont("times", "bolditalic");
    doc.text("Hotel Los Girasoles ", 105, 16, null, null, "center");
    doc.setFontSize(9);
    doc.setFont("times", "bold");
    doc.text(
      "Leon No.181 Pte.  Col. Centro  Tel. 216-26-51  C.P. 63000  Tepic, Nayarit ",
      105,
      22,
      null,
      null,
      "center"
    );
    doc.setFont("times", "italic");
    doc.text(
      "No nos hacemos Responsables de Valores no Depositados \n en la Administración, ni de Objetos Olvidados en la Habitación",
      105,
      26,
      null,
      null,
      "center"
    );
    doc.setFont("times", "bold");
    doc.setTextColor(255, 0, 0);
    doc.setFontSize(10);
    doc.text("No. {{Variable}}", 195, 18, null, null, "right");

    doc.setFont("times", "normal");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text("Nombre:", 35, 46, null, null, "right");
    doc.line(36, 47, 195, 47);
    doc.text("Se factura a:", 35, 54, null, null, "right");
    doc.line(36, 55, 195, 55);
    doc.text("Domicilio:", 35, 62, null, null, "right");
    doc.line(36, 63, 195, 63);
    doc.text("Ciudad:", 35, 70, null, null, "right");
    doc.text("Tel:", 115, 70, null, null, "right");
    doc.line(36, 71, 102, 71);
    doc.line(116, 71, 195, 71);
    doc.text("RFC:", 35, 78, null, null, "right");
    doc.text("Email:", 115, 78, null, null, "right");
    doc.line(36, 79, 102, 79);
    doc.line(116, 79, 195, 79);
    doc.text("Marca:", 35, 86, null, null, "right");
    doc.text("Color:", 115, 86, null, null, "right");
    doc.line(36, 87, 102, 87);
    doc.line(116, 87, 195, 87);
    doc.text(
      "El servicio telefónico se incluye en factura",
      100,
      94,
      null,
      null,
      "right"
    );
    doc.line(116, 95, 195, 95);

    let body = [["25/05/2023", "18:30", "5", "2", "27/05/2023"]];
    jsPDF.autoTableSetDefaults({
      headStyles: {
        fillColor: [0, 0, 0],
        halign: "center",
        lineWidth: {
          right: 0.5,
          left: 0.5,
        },
      },
      styles: {
        halign: "center",
        valign: "middle",
      },
    });

    autoTable(doc, {
      theme: "grid",
      startY: 98,
      head: [
        ["FECHA ENTRADA", "HORA", "PERSONAS", "HABITACIONES", "FECHA SALIDA"],
      ],
      body: body,
    });

    let y = doc.lastAutoTable.finalY;
    doc.line(66, y + 15, 146, y + 15);
    doc.text(
      "Firma\n  Sera causa de recisión el incumplimiento al reglamento de esta empresa",
      105,
      y + 20,
      null,
      null,
      "center"
    );
    doc.text(
      "El dia " +
        "{dia}" +
        " del " +
        "{mes}" +
        " del año " +
        "{año}" +
        "me doy por enterado sobre el aviso de privacidad que se maneja en esta empresa\n y me comprometo a notificar de manera inmediata si legara a existir una duda o inconformidad ante el mismo",
      9,
      y + 30
    );

    doc.text("{Variable nombre} ", 116, 46, null, null, "center");
    doc.text("{Variable factura} ", 116, 54, null, null, "center");
    doc.text("{Variable domicilio} ", 116, 62, null, null, "center");
    doc.text("{Variable ciudad} ", 70, 70, null, null, "center");
    doc.text("{Variable tel} ", 156, 70, null, null, "center");
    doc.text("{Variable RFC} ", 70, 78, null, null, "center");
    doc.text("{Variable EMAIL} ", 156, 78, null, null, "center");
    doc.text("{Variable Marca} ", 70, 86, null, null, "center");
    doc.text("{Variable color} ", 156, 86, null, null, "center");
    doc.text("{Variable se factura} ", 156, 94, null, null, "center");

    /*
        doc.rect(40, 55, 130, 7, "F");
    doc.rect(40, 70, 130, 7, "F");
    doc.text(user, 105, 60, null, null, "center");
    doc.text("Nombre de usuario", 105, 67, null, null, "center");
    doc.text(pass, 105, 75, null, null, "center");
    doc.text("Contraseña", 105, 82, null, null, "center");
    */
    doc.save("hotel.pdf");
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
    };
  }
};
export default ReporteHotel;

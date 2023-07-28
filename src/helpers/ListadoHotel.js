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

    let body = [
      [
        "25/05/2023",
        "200",
        "3114789632",
        "2",
        "500",
        "ESTACIONAMIENTO",
        "VESPERTINO",
      ],
    ];
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
      startY: 40,
      head: [
        ["FECHA", "ABONO", "TELEFONO", "HOSPED.", "CONSUMO", "OTROS", "TURNO"],
      ],
      body: body,
    });

    doc.save("listadoHotel.pdf");
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
    };
  }
};
export default ReporteHotel;

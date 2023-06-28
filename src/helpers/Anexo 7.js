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
      "Anexo 10 \n Archivo de trámite \n Cédula de prestamo de expedientes de Archivo de Trámite ",
      110,
      10,
      null,
      null,
      "center"
    );
    //--------------------------------------------------------------------------//

    //--------------------------------------------------------------------------//
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

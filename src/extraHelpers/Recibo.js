import { api } from "src/boot/axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/*import { storeToRefs } from "pinia";
import { useReportesStore } from "../stores/reportes_store";
const ReportesStore = useReportesStore();
const { listadoConsumibles } = storeToRefs(ReportesStore);*/
const Recibo_hotel = async () => {
  try {
    //await ReportesStore.loadConsumiblesEntregados(0, 0, 0);

    const doc = new jsPDF();
    let logo = new Image();

    logo.src = require("../assets/VillaRosas1.png");
    doc.addImage(logo, "png", 5, 5, 65, 30);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Av. Insurgentes 100 Pte. Tepic, Nay.\nTel. (01 311) 213-1800, (01 311) 214 5001\n(01 800) 504 7888, Fax (01 311) 214 5002\nihnsa@hotelvillalasrosas.com\nhttp://www.hotelvillalasrosas.com",
      105,
      15,
      null,
      null,
      "center"
    );
    //-----------------------------LINEAS y CUADROS ---------------------------
    doc.rect(10, 35, 190, 85);
    doc.line(13, 47, 196, 47);
    doc.line(13, 53, 196, 53);
    doc.line(13, 59, 196, 59);
    doc.line(13, 65, 196, 65);
    doc.line(13, 71, 196, 71);
    doc.rect(13, 73, 183, 14);
    doc.line(13, 92, 100, 92);
    doc.line(105, 92, 196, 92);
    doc.line(13, 97, 100, 97);
    doc.line(105, 97, 196, 97);
    doc.line(13, 102, 100, 102);
    doc.line(105, 102, 196, 102);
    doc.line(13, 107, 100, 107);
    doc.line(105, 107, 196, 107);
    doc.line(13, 112, 100, 112);
    doc.line(105, 112, 196, 112);
    doc.line(13, 117, 196, 117);
    doc.rect(146, 122, 54, 25);

    //---------------------------CAMPOS----------------------------------------//
    doc.setFontSize(9);
    doc.setFont("times", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("Fecha de Ingreso\nDate In", 34, 38, null, null, "center");
    doc.text("Fecha de Salida\nDate Out", 82, 38, null, null, "center");
    doc.text("Fecha Real de Salida\nDate Out", 130, 38, null, null, "center");
    doc.text("Control", 177, 38, null, null, "center");
    //**/
    doc.text("Habitación/Room", 13, 52);
    doc.text("Tipo de habitación", 74, 52);
    doc.text("Deposito", 138, 52);

    //** */
    doc.text("Tarifa/Rate", 13, 58);
    doc.text("Recepcionista Entrada", 74, 58);
    doc.text("Recepcionista Salida", 138, 58);

    //** */
    doc.text("Número de Personas", 13, 64);
    doc.text("Facturación", 74, 64);
    doc.text("Automovil", 138, 64);
    //** */
    doc.text("Marca", 13, 70);
    doc.text("Color", 74, 70);
    doc.text("Placas", 138, 70);

    doc.text("Forma de pago", 16, 77);
    doc.text("Anticipo", 76, 77);
    doc.text("Folio", 136, 77);

    doc.text("T/C Aut.", 16, 84);
    doc.text("Monto Aut.", 76, 84);
    doc.text("Cheque $", 136, 84);

    doc.text("Nombre/Name", 13, 91);
    doc.text("Nacionalidad/Nacionality", 105, 91);
    doc.text("Dirección/Adress", 13, 96);
    doc.text("Ciudad/City", 105, 96);
    doc.text("Estado/State", 13, 101);
    doc.text("Profesión/Profession", 105, 101);
    doc.text("Compañia/Company", 13, 106);
    doc.text("Telefono/Fax", 105, 106);
    doc.text("E-Mail", 13, 111);
    doc.text("Clave del cliente", 105, 111);
    doc.text("Observaciones", 13, 116);
    doc.text(
      "La habitación vence a las 13:00 Hrs.\nDaños o perdidas en la habitación tienen cargo.\nLa habitación se liquida diariamente.\n\nLa Administración no se hace responsable por \ndaños o pérdidas en los vehículos, por ser un\nestacionamiento público",
      10,
      125
    );

    doc.text(
      "Check Out time: 13:00Hrs.\nDamage or missing pieces will be charger to consumer.\nThe room rate must paid daily.\n\nThe Hotel don't be responsable for any damage or\npersonal belongins in the parking area because\nit's a public parking",
      75,
      125
    );

    doc.text("Firma/Signature", 173, 125, null, null, "center");

    //--------VARIABLES-------------------------------------------------------

    doc.setFontSize(8);
    doc.setFont("times", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Variable fecha ingreso", 34, 46, null, null, "center");
    doc.text("Variable fecha salida", 82, 46, null, null, "center");
    doc.text("Variable fecha real", 130, 46, null, null, "center");
    doc.text("Numero control", 177, 46, null, null, "center");

    //** */
    doc.text("Variable habitación", 37, 52);
    doc.text("Variable tipo", 99, 52);
    doc.text("Variable deposito", 150, 52);

    //+++
    doc.text("Variable tarifa", 28, 58);
    doc.text("Variable entrada", 103, 58);
    doc.text("Variable salida", 165, 58);
    //** */

    doc.text("Variable personas", 40, 64);
    doc.text("Facturación SI/NO", 90, 64);
    doc.text("Vehiculo SI/NO", 153, 64);
    //+++
    doc.text("Variable Marca", 22, 70);
    doc.text("Variable color", 82, 70);
    doc.text("Variable placas", 148, 70);
    //++++
    doc.text("Variable Pago", 37, 77);
    doc.text("Variable anticipo", 88, 77);
    doc.text("Variable Folio", 145, 77);

    doc.text("Variable Pago", 38, 84);
    doc.text("Variable anticipo", 91, 84);
    doc.text("Variable Folio", 149, 84);

    doc.text("variable Nombre", 33, 91);
    doc.text("variable Nacionalidad/Nacionality", 139, 91);
    doc.text("variable Dirección/Adress", 36, 96);
    doc.text("variable Ciudad/City", 121, 96);
    doc.text("variable Estado/State", 31, 101);
    doc.text("variable Profesión/Profession", 134, 101);
    doc.text("variable Compañia/Company", 40, 106);
    doc.text("variable Telefono/Fax", 125, 106);
    doc.text("variable E-Mail", 26, 111);
    doc.text("variable Clave del cliente", 128, 111);
    doc.text("variable Observaciones", 34, 116);

    //---------------------------------------------------------------------------
    doc.save("Recibo_General.pdf");
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

export default Recibo_hotel;

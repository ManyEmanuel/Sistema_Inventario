import { api } from "src/boot/axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth_store";
import { useMovimientoConsumibleStore } from "../stores/movimientos_consumible_store";

const MovimientoConsumibleStore = useMovimientoConsumibleStore();

const { movimiento } = storeToRefs(MovimientoConsumibleStore);

const Reporte = async (id) => {
  try {
    await MovimientoConsumibleStore.loadMovimiento(id);
    let resp = await api.get(
      `/Empleados/GetResponsableByEmpleado/${movimiento.value.empleado_Id}`
    );
    let detalle = await api.get(
      `/DetalleMovimientoConsumible/BySolicitud/${id}`
    );
    let detalleData = detalle.data.data;
    let { data } = resp.data;
    let nombre = data.nombre_Completo.split("-");
    let empleadoo = movimiento.value.empleado.split("-");
    let totalPagesExp = "{total_pages_count_string}";
    let img = new Image();
    let num = 1;
    let tamano1 = 0;
    let body = [];
    let head = [];
    img.src = require("../assets/IEEN300.png");
    const doc = new jsPDF();
    jsPDF.autoTableSetDefaults({
      headStyles: { fillColor: [84, 37, 131], halign: "center" },
      styles: {
        halign: "center",
        valign: "middle",
      },
    });
    doc.addImage(img, "png", 10, 8, 35, 20);
    doc.setFontSize(9);
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text(
      "INSTITUTO ESTATAL ELECTORAL DE NAYARIT \n" +
        "Dirección de Administración \n" +
        movimiento.value.concepto,
      105,
      20,
      null,
      null,
      "center"
    );
    doc.setFontSize(9);
    doc.text("FECHA: " + movimiento.value.fecha_Movimiento_Tabla, 15, 35);
    doc.text("NOMBRE DEL EMPLEADO: " + empleadoo[0], 15, 40);
    doc.text("FOLIO: " + movimiento.value.folio, 195, 35, null, null, "right");
    let textObservacion = "OBSERVACIÓN: " + movimiento.value.observaciones;
    let textProveedor = "PROVEEDOR: " + movimiento.value.proveedor;

    var lines = doc.splitTextToSize(textObservacion, 180); // 80 is the maximum width of line (you can change it according to your needs)
    var y = 45;
    for (var i = 0; i < lines.length; i++) {
      doc.text(15, y, lines[i], {
        align: "justify",
      });
      y = y + 4; // Change this value to increase or decrease the vertical space between lines
    }
    if (movimiento.value.concepto == "Entrada por compra") {
      var linesTwo = doc.splitTextToSize(textProveedor, 180);
      for (var i = 0; i < linesTwo.length; i++) {
        doc.text(15, y, linesTwo[i], {
          align: "justify",
        });
        y = y + 4;
      }
      head = [
        "#",
        "Folio",
        "Consumible",
        "Cantidad",
        "Precio unitario",
        "Importe total",
      ];
      detalleData.forEach((item) => {
        let tamanoClave = item.clave;
        let clave = "";
        if (tamanoClave <= 9) {
          clave = "000" + tamanoClave;
        } else if (tamanoClave <= 99) {
          clave = "00" + tamanoClave;
        } else if (tamanoClave <= 999) {
          clave = "0" + tamanoClave;
        } else if (tamanoClave <= 9999) {
          clave = tamanoClave;
        }
        body.push([
          num.toString(),
          "EY-99-" + clave,
          item.consumible,
          item.cantidad,
          item.precio_Unitario,
          item.importe,
        ]);
        num = num + 1;
      });
    } else {
      head = ["#", "Folio", "Consumible", "Cantidad"];
      detalleData.forEach((item) => {
        let tamanoClave = item.clave;
        let clave = "";
        if (tamanoClave <= 9) {
          clave = "000" + tamanoClave;
        } else if (tamanoClave <= 99) {
          clave = "00" + tamanoClave;
        } else if (tamanoClave <= 999) {
          clave = "0" + tamanoClave;
        } else if (tamanoClave <= 9999) {
          clave = tamanoClave;
        }
        body.push([
          num.toString(),
          "EY-99-" + clave,
          item.consumible,
          item.cantidad,
          item.precio_Unitario,
          item.importe,
        ]);
        num = num + 1;
      });
    }

    jsPDF.autoTableSetDefaults({
      headStyles: { fillColor: [84, 37, 131], halign: "center" },
      styles: {
        halign: "center",
        valign: "middle",
        fontSize: 7,
      },
    });

    doc.setFontSize(9);
    doc.setTextColor(0);
    doc.text("Vo.Bo.", 70, 251, null, null, "center");
    doc.text(nombre[0] + "\n" + nombre[1], 70, 269, null, null, "center");
    doc.line(40, 266, 100, 266);

    doc.text("Elaboró", 150, 251, null, null, "center");
    doc.text(
      empleadoo[0] + "\n" + empleadoo[1],
      150,
      269,
      null,
      null,
      "center"
    );
    doc.line(120, 266, 180, 266);
    autoTable(doc, {
      theme: "grid",
      startY: y,
      head: [head],
      body: body,
      bodyStyles: { fontSize: 8 },
      didDrawPage: function (data) {
        let str = "Página " + doc.internal.getNumberOfPages();
        if (typeof doc.putTotalPages === "function") {
          str = str + " de " + totalPagesExp;
        }
        doc.setFontSize(11);
        doc.text(str, 235, 290, null, null, "right");
      },
    });
    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages(totalPagesExp);
    }

    doc.save(movimiento.value.folio + ".pdf");

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

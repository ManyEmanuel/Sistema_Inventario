<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Solicitud de consumible</div>
        <q-space />
        <q-btn icon="close" @click="actualizarModal(false)" flat round dense />
      </q-card-section>
      <q-card-section>
        <div class="row q-col-gutter-xs">
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="solicitud.area"
              autogrow
              label="Área solicitante"
              readonly
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="solicitud.empleado_Solicitante"
              autogrow
              label="Personal que solicita"
              readonly
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="solicitud.responsable_Area"
              autogrow
              label="Encargado que aprueba"
              readonly
            >
            </q-input>
          </div>
          <div
            v-if="solicitud.estatus == 'Entregado'"
            class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="solicitud.empleado_Entrega"
              autogrow
              label="Empleado de administración que entrega"
              readonly
            >
            </q-input>
            <q-input
              v-model="solicitud.empleado_Recibe"
              autogrow
              label="Empleado que recibe consumibles"
              readonly
            >
            </q-input>
          </div>
          <div
            v-if="isConsulta == false && isSurtir == false"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-select
              v-model="solicitud.tipo"
              :options="tipoSolicitud"
              :readonly="isEditar"
              label="Tipo de solicitud"
              hint="Selecciona un tipo de solicitud"
            >
            </q-select>
          </div>
          <div
            v-else-if="isConsulta == true || isSurtir == true"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="solicitud.tipo"
              readonly
              label="Tipo de solicitud"
            >
            </q-input>
          </div>
          <div
            v-if="
              (isConsulta == true || isSurtir == true) &&
              solicitud.estatus == 'Borrador'
            "
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12 text-h5 text-center q-pt-xs"
          >
            Guardado como borrador
          </div>
          <div
            v-if="isConsulta == false && isSurtir == false"
            class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="solicitud.justificacion"
              autogrow
              counter
              maxlength="190"
              :readonly="isEditar"
              label="Justificación de la solicitud"
            >
            </q-input>
          </div>
          <div
            v-else-if="isConsulta == true || isSurtir == true"
            class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="solicitud.justificacion"
              readonly
              label="Justificación"
            >
            </q-input>
          </div>
          <div
            v-if="isConsulta == false && isSurtir == false"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-select
              v-model="clasificacionId"
              :options="listaClasificacion"
              :disable="habilitarCombo"
              label="Filtrar consumibles"
              hint="Selecciona un tipo de clasificación"
            >
            </q-select>
          </div>
          <div
            v-if="isConsulta == false && isSurtir == false"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12 text-center"
          >
            <q-checkbox
              v-model="solicitud.borrador"
              label="¿Guardar como borrador?"
              color="purple"
              :disable="isEditar"
              checked-icon="task_alt"
              unchecked-icon="highlight_off"
              :true-value="true"
              :false-value="false"
            />
          </div>
          <div
            v-if="isConsulta == false && isSurtir == false"
            class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
          >
            <q-select
              v-model="consumibleId"
              :options="opcionesConsumibles"
              :disable="habilitarCombo"
              use-input
              @filter="filterConsumible"
              label="Listado de consumibles"
              hint="Selecciona un consumible"
            >
            </q-select>
          </div>
          <div
            v-if="isConsulta == false && isSurtir == false"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="NombreProducto"
              autogrow
              label="Nombre del producto"
              readonly
            >
            </q-input>
          </div>
          <div
            v-if="isConsulta == false && isSurtir == false"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="MarcaProducto"
              autogrow
              label="Marca del producto"
              readonly
            >
            </q-input>
          </div>
          <div
            v-if="isConsulta == false && isSurtir == false"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="TipoProducto"
              autogrow
              label="Tipo de producto"
              readonly
            >
            </q-input>
          </div>
          <div
            v-if="isConsulta == false && isSurtir == false"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="cantidadProducto"
              type="number"
              :disable="habilitarCampos"
              min="1"
              label="Cantidad a solicitar"
              :suffix="unidadProducto"
            >
            </q-input>
          </div>
          <q-space />
          <div
            v-if="isConsulta == false && isSurtir == false"
            class="col-12 justify-end"
          >
            <div class="text-right q-gutter-xs">
              <q-btn
                icon-right="add"
                label="Agregar"
                color="positive"
                class="q-ml-sm"
                :disable="habilitarBoton"
                @click="agregarProducto()"
              />
            </div>
          </div>
        </div>
        <div v-show="habilitarCombo" class="row q-col-gutter-xs text-center">
          <q-banner inline-actions rounded class="bg-purple-ieen text-white">
            Solo se pueden solicitar 8 articulos en total por solicitud
          </q-banner>
        </div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section>
        <TablaSolicitud v-if="isSurtir == false" />
        <!--<TablaSurtir v-else-if="isSurtir == true" /> -->
      </q-card-section>
      <q-card-section>
        <q-space />
        <div
          v-if="isConsulta == false && isSurtir == false"
          class="col-12 justify-end"
        >
          <div class="text-right q-gutter-xs">
            <q-btn
              label="Cancelar"
              type="reset"
              color="negative"
              @click="actualizarModal(false)"
            />
            <q-btn
              :label="textoBoton"
              @click="solicitar()"
              color="positive"
              class="q-ml-sm"
              :disable="habilitarGuardar"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { onBeforeMount, ref, watch, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useAuthStore } from "../../../stores/auth_store";
import { useSolicitudConsumibleStore } from "../../../stores/solicitud_consumible_store";
import { useClasificacionConsumibleStore } from "../../../stores/clasificaciones_consumibles_store";
import { useConsumibleStore } from "../../../stores/consumible_store";
import TablaSolicitud from "../components/TablaSolicitud.vue";
//import TablaSurtir from "../../solicitudes_areas/components/TablaSurtir.vue";

const $q = useQuasar();
const consumibleStore = useConsumibleStore();
const solicitudStore = useSolicitudConsumibleStore();
const clasificacionStore = useClasificacionConsumibleStore();
const consumibleId = ref(null);
const clasificacionId = ref(null);
let habilitarBoton = ref(true);
let habilitarCampos = ref(true);
let habilitarCombo = ref(false);
let habilitarGuardar = ref(true);
let textoBoton = ref("Solicitar");
//----------------------------------------------------------------------------//
const idProducto = ref(null);
const NombreProducto = ref(null);
const MarcaProducto = ref(null);
const TipoProducto = ref(null);
const cantidadProducto = ref(null);
const solicitudConsumible = ref([]);
const unidadProducto = ref(null);
//----------------------------------------------------------------------------//
const {
  modal,
  listaSolicitud,
  solicitud,
  isEditar,
  jefeArea,
  isConsulta,
  isEntregada,
  isSurtir,
  tipoSolicitud,
} = storeToRefs(solicitudStore);
const { listaConsumibles, consumibles } = storeToRefs(consumibleStore);
const { listaClasificacion } = storeToRefs(clasificacionStore);
const opcionesConsumibles = ref([...listaConsumibles.value]);

onBeforeMount(() => {
  consumibleStore.loadListaConsumible(0);
  consumibleStore.loadConsumibles();
  clasificacionStore.loadListaClasificacion(true);
  clasificacionId.value = { value: 0, label: "Todos" };
  console.log("Esto es el listado de tipo de solicitud", tipoSolicitud);
});

const actualizarModal = (valor) => {
  if (isEditar.value == true) {
    $q.loading.show();
    $q.dialog({
      title: "No se han guardado los cambios realizados",
      message: "¿Desea guardar cambios antes de salir?",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: {
        color: "positive",
        label: "¡Sí!, Guardar",
      },
      cancel: {
        color: "negative",
        label: " No, volver ",
      },
    }).onOk(async () => {
      solicitar();
    });
    $q.loading.hide();
  } else {
    limpiarRegistro();
    listaSolicitud.value = [];
    solicitudStore.initSolicitud();
    solicitudStore.actualizarModal(valor);
    solicitudStore.updateEditar(valor);
    solicitudStore.updateConsulta(valor);
    solicitudStore.updateSurtir(valor);
    solicitudStore.updateEntregar(valor);
    clasificacionId.value = { value: 0, label: "Todos" };
    habilitarBoton.value = true;
    habilitarCampos.value = true;
    habilitarCombo.value = false;
    habilitarGuardar.value = true;
    textoBoton.value = "Solicitar";
  }
};

const limpiarRegistro = () => {
  consumibleId.value = "";
  idProducto.value = null;
  NombreProducto.value = null;
  MarcaProducto.value = null;
  TipoProducto.value = null;
  unidadProducto.value = null;
  solicitudConsumible.value = null;
  cantidadProducto.value = null;
};

watch(isEditar, (val) => {
  console.log("Esto es idEditar", val);
  if (val == false) {
    textoBoton.value = "Solicitar";
  } else {
    habilitarGuardar.value = false;
    textoBoton.value = "Actualizar";
  }
});

watch(clasificacionId, (val) => {
  limpiarRegistro();
  consumibleStore.loadListaConsumible(val.value);
});

watchEffect(() => {
  if (listaSolicitud.value.length > 0 && listaSolicitud.value.length <= 8) {
    habilitarGuardar.value = false;
  } else {
    if (isEditar.value == false) {
      habilitarGuardar.value = true;
    } else {
      habilitarGuardar.value = false;
    }
  }
  if (listaSolicitud.value.length >= 8) {
    habilitarCombo.value = true;
  } else {
    habilitarCombo.value = false;
  }
});

watch(solicitud.value, (val) => {
  if (val.borrador == true) {
    textoBoton.value = "Guardar";
  } else {
    textoBoton.value = "Solicitar";
  }
});

watch(consumibleId, (val) => {
  if (val.value != undefined) {
    habilitarCampos.value = false;
    solicitudConsumible.value = consumibles.value.find(
      (x) => x.id == val.value
    );
    idProducto.value = solicitudConsumible.value.id;
    NombreProducto.value = solicitudConsumible.value.abreviatura;
    MarcaProducto.value = solicitudConsumible.value.marca;
    TipoProducto.value = solicitudConsumible.value.clasificacion;
    unidadProducto.value = solicitudConsumible.value.unidad_Medida;
    cantidadProducto.value = 1;
  } else if (val.value == undefined) {
    habilitarCampos.value = true;
  }
});

watch(cantidadProducto, (val) => {
  if (val == null) {
    habilitarBoton.value = true;
  } else if (val <= 0) {
    cantidadProducto.value = 1;
  } else if (val > 0) {
    habilitarBoton.value = false;
  }
});

const agregarProducto = async () => {
  if (listaSolicitud.value.length == 0) {
    let resp = await solicitudStore.addConsumible(
      NombreProducto.value,
      cantidadProducto.value,
      unidadProducto.value,
      idProducto.value
    );
    limpiarRegistro();
  } else {
    let filtro = listaSolicitud.value.find(
      (x) => x.consumible_Id == idProducto.value
    );
    if (filtro == undefined) {
      let resp = await solicitudStore.addConsumible(
        NombreProducto.value,
        cantidadProducto.value,
        unidadProducto.value,
        idProducto.value
      );
      limpiarRegistro();
    } else {
      $q.dialog({
        title: "Producto ya solicitado",
        message: "¿Desea sumar la cantidad nueva a la ya registrada?",
        icon: "Warning",
        persistent: true,
        transitionShow: "scale",
        transitionHide: "scale",
        ok: {
          color: "positive",
          label: "¡Sí!, Sumar",
        },
        cancel: {
          color: "negative",
          label: " No Cancelar",
        },
      }).onOk(async () => {
        let sum = await solicitudStore.sumarConsumible(
          idProducto.value,
          cantidadProducto.value
        );
        limpiarRegistro();
      });
    }
  }
};

const solicitar = async () => {
  console.log("Estos son los datos del solicitante", solicitud.value);
  solicitud.value.detalle = listaSolicitud.value;
  solicitud.value.fecha_Solicitud = new Date();
  let resp = null;
  $q.loading.show();
  if (isEditar.value == true) {
    if (listaSolicitud.value.length > 0) {
      resp = await solicitudStore.updateSolicitud(listaSolicitud.value);
      if (resp.success) {
        $q.notify({
          type: "positive",
          message: resp.data,
        });
        console.log("Esto es jefe de area", jefeArea.value);
        if (jefeArea.value == false) {
          solicitudStore.loadSolicitudes();
        } else {
          solicitudStore.loadSolicitudesJefeArea();
        }
        //consumibleStore.loadConsumibles();
        //clasificacionStore.loadInformacionClasificacion();
        solicitudStore.updateEditar(false);
        actualizarModal(false);
      } else {
        $q.notify({
          type: "negative",
          message: resp.data,
        });
        //loading.value = false;
      }
    } else {
      $q.loading.hide();
      $q.dialog({
        title: "Solicitud sin consumible registrado",
        message:
          "El listado de consumibles esta vacio ¿Desea agregar productos o cancelar la solicitud?",
        icon: "Warning",
        persistent: true,
        transitionShow: "scale",
        transitionHide: "scale",
        cancel: {
          color: "positive",
          label: "Agregar consumible",
        },
        ok: {
          color: "negative",
          label: " Cancelar solicitud",
        },
      }).onOk(async () => {
        $q.loading.show();
        resp = await solicitudStore.cancelarSolicitud(solicitud.value.id);
        if (resp.success) {
          $q.notify({
            type: "positive",
            message: resp.data,
          });
          console.log("Esto es jefe de area", jefeArea.value);
          if (jefeArea.value == false) {
            solicitudStore.loadSolicitudes();
          } else {
            solicitudStore.loadSolicitudesJefeArea();
          }
          //consumibleStore.loadConsumibles();
          //clasificacionStore.loadInformacionClasificacion();
          solicitudStore.updateEditar(false);
          actualizarModal(false);
        } else {
          $q.notify({
            type: "negative",
            message: resp.data,
          });
          //loading.value = false;
        }
        $q.loading.hide();
      });
    }
  } else {
    resp = await solicitudStore.createSolicitud(solicitud.value);
    if (resp.success) {
      $q.notify({
        type: "positive",
        message: resp.data,
      });
      console.log("Esto es jefe de area", jefeArea.value);
      if (jefeArea.value == false) {
        solicitudStore.loadSolicitudes();
      } else {
        solicitudStore.loadSolicitudesJefeArea();
      }
      //consumibleStore.loadConsumibles();
      //clasificacionStore.loadInformacionClasificacion();
      actualizarModal(false);
    } else {
      $q.notify({
        type: "negative",
        message: resp.data,
      });
      //loading.value = false;
    }
  }

  $q.loading.hide();
};

const filterConsumible = (val, update) => {
  if (val === "") {
    update(() => {
      opcionesConsumibles.value = listaConsumibles.value;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    opcionesConsumibles.value = listaConsumibles.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};
</script>

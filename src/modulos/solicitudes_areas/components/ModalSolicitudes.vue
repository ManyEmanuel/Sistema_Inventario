<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 1000px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Solicitud de consumibles</div>
        <q-space />
        <q-btn
          icon="close"
          @click="actualizarModal(false)"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>
      <q-card-section>
        <div class="row q-col-gutter-xs">
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="solicitud.folio"
              autogrow
              label="Folio de la solicitud"
              readonly
            >
            </q-input>
          </div>

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
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="solicitud.tipo"
              autogrow
              label="Tipo de solicitud"
              readonly
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="solicitud.justificacion"
              autogrow
              label="Justificación de la solicitud"
              readonly
            >
            </q-input>
          </div>
        </div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section>
        <TablaSurtir />
      </q-card-section>
      <q-card-section>
        <div
          v-if="isConsulta == false && isFinalizado == false"
          class="text-right q-gutter-xs"
        >
          <q-btn
            label="Cancelar"
            type="reset"
            color="negative"
            @click="actualizarModal(false)"
          />
          <q-btn
            label="Surtir"
            @click="surtir()"
            color="positive"
            class="q-ml-sm"
          />
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
import { useSolicitudAreaStore } from "../../../stores/solicitudes_areas_store";
import TablaSurtir from "../components/TablaSurtir.vue";

const $q = useQuasar();
const solicitudesAreasStore = useSolicitudAreaStore();
const { modal, listaSolicitud, solicitud, isConsulta, isFinalizado } =
  storeToRefs(solicitudesAreasStore);

const actualizarModal = (valor) => {
  solicitudesAreasStore.actualizarModal(valor);
  solicitudesAreasStore.updateConsulta(valor);
  solicitudesAreasStore.updateFinalizado(valor);
  solicitudesAreasStore.initSolicitud();
  solicitudesAreasStore.initListaSolicitud();
};

const surtir = async () => {
  $q.loading.show();
  let resp = "";
  solicitud.value.detalle = listaSolicitud.value;
  resp = await solicitudesAreasStore.atenderSolicitud(solicitud.value);
  if (resp.success) {
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    solicitudesAreasStore.loadSolicitudes();
    actualizarModal(false);
  } else {
    $q.notify({
      type: "negative",
      message: resp.data,
    });
  }
  $q.loading.hide();
};

/*const validacion = async () => {
  let valida = false;
  let numIndex = 0;
  for (let lista of listaSolicitud.value) {
    if (lista.cantidad_Entregada <= lista.cantidad_Tope) {
    } else {
      valida = true;
      listaSolicitud.value[numIndex].cantidad_Entregada = lista.cantidad_Tope;
    }
    numIndex = numIndex + 1;
  }
  return valida;
};*/
</script>

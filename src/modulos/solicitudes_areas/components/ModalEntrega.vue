<template>
  <q-dialog
    v-model="modalEntrega"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 500px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Personal de entrega</div>
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
              label="Solicitud de folio"
              readonly
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="solicitud.area"
              autogrow
              label="Área que solicito"
              readonly
            >
            </q-input>
          </div>

          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-select
              v-model="personalId"
              :options="personalEntrega"
              label="Empleado que recibe"
              hint="Seleccione un empleado"
              :rules="[(val) => val.label != '' || 'Seleccione un empleado']"
            >
            </q-select>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-right q-gutter-xs">
          <q-btn
            label="Cancelar"
            type="reset"
            color="negative"
            @click="actualizarModal(false)"
          />
          <q-btn
            label="Entregar"
            @click="entregar()"
            color="positive"
            class="q-ml-sm"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useAuthStore } from "../../../stores/auth_store";
import { useSolicitudAreaStore } from "../../../stores/solicitudes_areas_store";

const $q = useQuasar();
const solicitudesAreasStore = useSolicitudAreaStore();
const { modalEntrega, solicitud, personalEntrega } = storeToRefs(
  solicitudesAreasStore
);

const personalId = ref(null);

const actualizarModal = (valor) => {
  solicitudesAreasStore.actualizarModalEntrega(valor);
  solicitudesAreasStore.initSolicitud();
  solicitudesAreasStore.initListaSolicitud();
  solicitudesAreasStore.initListaPersonal();
};

const entregar = async () => {
  $q.loading.show();
  let resp = null;
  resp = await solicitudesAreasStore.entregarSolicitud(personalId);
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
    //loading.value = false;
  }
  $q.loading.hide();
};
</script>

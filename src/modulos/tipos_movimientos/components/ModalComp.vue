<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Registro de tipo de movimiento</div>
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
        <q-form class="row q-col-gutter-xs" @submit="onSubmit">
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="tipo_movimiento.tipo_Movimiento"
              label="Nombre del tipo de movimiento"
              hint="Ingrese un nombre"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'El tipo es requerido']"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="tipo_movimiento.naturaleza"
              label="Naturaleza del movimiento"
              hint="Ingrese una clave"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La naturaleza es requerida']"
            >
            </q-input>
          </div>

          <q-space />
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                label="Cancelar"
                type="reset"
                color="negative"
                @click="actualizarModal(false)"
              />
              <q-btn
                label="Guardar"
                type="submit"
                color="positive"
                class="q-ml-sm"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useAuthStore } from "../../../stores/auth_store";
import { useTipoMovimientoStore } from "../../../stores/tipos_movimientos_store";

const $q = useQuasar();
const tipoMovimientoStore = useTipoMovimientoStore();
const authStore = useAuthStore();
const { tipo_movimiento, modal, isEditar } = storeToRefs(tipoMovimientoStore);
const actualizarModal = (valor) => {
  tipoMovimientoStore.actualizarModal(valor);
  tipoMovimientoStore.updateEditar(valor);
  tipoMovimientoStore.initTipoMovimiento();
};

const onSubmit = async () => {
  let resp = null;
  $q.loading.show();
  resp = await tipoMovimientoStore.createTipoMovimiento(tipo_movimiento.value);
  if (resp.success) {
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    tipoMovimientoStore.loadInformacionTipoMovimiento();
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

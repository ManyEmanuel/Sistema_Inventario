<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Registro de concepto de movimiento</div>
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
            <q-select
              v-model="tipoMovimientoId"
              :options="listTipoMovimiento"
              label="Tipos de movimiento"
              hint="Selecciona un tipo de movimiento"
            >
            </q-select>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="concepto_movimiento.concepto"
              label="Concepto"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'El concepto es requerido']"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="concepto_movimiento.descripcion"
              label="Descripción del concepto"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La descripción es requerida']"
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
import { useConceptoMovimientoStore } from "../../../stores/concepto_movimientos_store";

const $q = useQuasar();
const conceptoMovimientoStore = useConceptoMovimientoStore();
const tipoMovimientoStore = useTipoMovimientoStore();
const authStore = useAuthStore();
const { concepto_movimiento, modal, isEditar } = storeToRefs(
  conceptoMovimientoStore
);
const { listTipoMovimiento } = storeToRefs(tipoMovimientoStore);
const tipoMovimientoId = ref(null);

onBeforeMount(() => {
  tipoMovimientoStore.loadTipoMovimientoList();
});

watch(concepto_movimiento.value, (val) => {
  if (val.id != null) {
    cargaTipoMovimiento(val);
  }
});

const cargaTipoMovimiento = async (val) => {
  console.log("Esto es val", val);
  console.log("Esto es la lista", listTipoMovimiento.value);
  if (tipoMovimientoId.value == null) {
    let tipoFiltrado = listTipoMovimiento.value.find(
      (x) => x.value == `${val.tipo_Movimiento_Inventario_Id}`
    );
    tipoMovimientoId.value = tipoFiltrado;
  }
};

const actualizarModal = (valor) => {
  conceptoMovimientoStore.actualizarModal(valor);
  conceptoMovimientoStore.updateEditar(valor);
  conceptoMovimientoStore.initConceptoMovimiento();
  tipoMovimientoId.value = null;
};

const onSubmit = async () => {
  let resp = null;
  $q.loading.show();
  concepto_movimiento.value.tipo_Movimiento_Inventario_Id =
    tipoMovimientoId.value.value;
  if (isEditar.value == true) {
    resp = await conceptoMovimientoStore.updateTipoMovimiento(
      concepto_movimiento.value
    );
  } else {
    resp = await conceptoMovimientoStore.createConceptoMovimiento(
      concepto_movimiento.value
    );
  }

  if (resp.success) {
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    conceptoMovimientoStore.loadInformacionConceptoMovimiento();
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

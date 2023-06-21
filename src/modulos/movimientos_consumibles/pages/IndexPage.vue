<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el
              label="Registro de movimientos"
              icon="library_books"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="text-right q-pa-md items-start q-gutter-md">
          <q-btn
            v-if="modulo == null ? false : modulo.registrar"
            type="button"
            class="q-ma-sm"
            color="purple-ieen"
            icon-right="add_circle_outline"
            label="Nuevo"
            @click="actualizarModal(true)"
          />
        </div>
      </div>
    </div>
    <TablaComp />
    <ModalComp />
    <ModalProveedor />
  </q-page>
</template>
<script setup>
import { useQuasar } from "quasar";
import { useAuthStore } from "../../../stores/auth_store";
import { onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import { useMovimientoConsumibleStore } from "src/stores/movimientos_consumible_store";
import ModalProveedor from "../../proveedores/components/ModalComp.vue";
import TablaComp from "../components/TablaComp.vue";
import ModalComp from "../components/ModalComp.vue";

const $q = useQuasar();
const authStore = useAuthStore();
const MovimientoConsumibleStore = useMovimientoConsumibleStore();
const { modulo } = storeToRefs(authStore);
const siglas = "SI-CAT-MOV";
onBeforeMount(() => {
  leerPermisos();
});

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const Guardar = async () => {
  MovimientoConsumibleStore.createMovimiento();
};

const actualizarModal = (valor) => {
  $q.loading.show();
  MovimientoConsumibleStore.actualizarModal(valor);
  MovimientoConsumibleStore.fechaHoy();
  $q.loading.hide();
};
</script>

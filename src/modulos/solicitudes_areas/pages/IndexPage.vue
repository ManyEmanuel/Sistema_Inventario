<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el
              label="Solicitudes de áreas "
              icon="library_books"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <!--<div class="row">
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
    </div>-->
    <TablaComp />
    <!-- <TablaJefeArea />-->
    <ModalSolicitudes />
    <ModalEntrega />
  </q-page>
</template>
<script setup>
import { useQuasar } from "quasar";
import { useAuthStore } from "../../../stores/auth_store";
import { onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import { useSolicitudConsumibleStore } from "src/stores/solicitud_consumible_store";
import TablaComp from "../components/TablaComp.vue";
//import TablaJefeArea from "../components/TablaJefeArea.vue";
import ModalSolicitudes from "../components/ModalSolicitudes.vue";
import ModalEntrega from "../components/ModalEntrega.vue";

const $q = useQuasar();
const authStore = useAuthStore();
const solicitudStore = useSolicitudConsumibleStore();
const { modulo } = storeToRefs(authStore);
const { jefeArea } = storeToRefs(solicitudStore);
const siglas = "SI-REG-ARE";
onBeforeMount(() => {
  leerPermisos();
  cargarTipo();
});

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const cargarTipo = async () => {
  await solicitudStore.loadJefeArea();
};

const actualizarModal = (valor) => {
  $q.loading.show();
  solicitudStore.actualizarModal(valor);
  if (valor == true) {
    solicitudStore.datosSolicitante();
  }
  $q.loading.hide();
};
</script>

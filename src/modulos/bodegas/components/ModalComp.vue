<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Registro de bodega</div>
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
              v-model="bodega.nombre"
              label="Nombre de bodega"
              hint="Ingrese un nombre"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'El nombre es requerido']"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-select
              v-model="area_Id"
              :options="areas"
              label="Área responsable de bodega"
              hint="Seleccione un área"
              lazy-rules
              :rules="[(val) => !!val || 'El area es requerida']"
            >
            </q-select>
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
import { useBodegaStore } from "../../../stores/bodega_store";

const $q = useQuasar();
const bodegaStore = useBodegaStore();
const authStore = useAuthStore();

const { bodega, modal, areas, isEditar } = storeToRefs(bodegaStore);
const area_Id = ref(null);
const actualizarModal = (valor) => {
  bodegaStore.actualizarModal(valor);
  bodegaStore.updateEditar(valor);
  bodegaStore.initBodega();
  area_Id.value = null;
};

onBeforeMount(() => {
  bodegaStore.loadAreasList();
});

watch(bodega.value, (val) => {
  if (val.id != null) {
    cargarArea(val);
  }
});

const cargarArea = async (val) => {
  if (area_Id.value == null) {
    console.log("Esto es value, desde cargar area", val);
    let areaFiltrado = areas.value.find((x) => x.value == `${val.area_Id}`);
    area_Id.value = areaFiltrado;
  }
};

const onSubmit = async () => {
  let resp = null;
  $q.loading.show();
  bodega.value.area_Id = area_Id.value.value;
  bodega.value.eliminado = false;
  if (isEditar.value == true) {
    resp = await bodegaStore.updateBodega(bodega.value);
  } else {
    resp = await bodegaStore.createBodega(bodega.value);
  }

  if (resp.success) {
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    bodegaStore.loadInformacionBodega();
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

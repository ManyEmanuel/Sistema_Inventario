<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Registro de catálogo</div>
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
              v-model="catalogo.clave"
              label="Clave del catálogo"
              hint="Ingrese una clave"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La clave es requerida']"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="catalogo.nombre"
              label="Nombre del catálogo"
              hint="Ingrese un nombre"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'El nombre es requerido']"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="catalogo.nombre_Corto"
              label="Nombre corto del catálogo"
              hint="Ingrese un nombre corto"
              autogrow
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
import { useCatalogoProductoStore } from "../../../stores/catalogos_producto_store";

const $q = useQuasar();
const catalagoStore = useCatalogoProductoStore();
const authStore = useAuthStore();

const { catalogo, modal, isEditar } = storeToRefs(catalagoStore);
const actualizarModal = (valor) => {
  catalagoStore.actualizarModal(valor);
  catalagoStore.updateEditar(valor);
  catalagoStore.initCatalago();
};

const onSubmit = async () => {
  let resp = null;
  $q.loading.show();
  if (isEditar.value == true) {
    resp = await catalagoStore.updateCatalogo(catalogo.value);
  } else {
    resp = await catalagoStore.createCatalogo(catalogo.value);
  }

  if (resp.success) {
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    catalagoStore.loadInformacionCatalago();
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

<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Registro de proveedor</div>
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
              v-model="proveedor.nombre"
              label="Nombre del proveedor"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'El nombre es requerido']"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="proveedor.razon_Social"
              label="Razón social del proveedor"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La razón social es requerida']"
            >
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="proveedor.rfc"
              label="RFC del proveedor"
              counter
              lazy-rules
              :rules="[(val) => !!val || 'El rfc es requerido']"
            >
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="proveedor.telefono"
              label="Teléfono del proveedor"
              type="tel"
            >
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="proveedor.eMail"
              label="Correo electronico del proveedor"
              type="email"
            >
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="proveedor.direccion"
              autogrow
              label="Dirección del proveedor"
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
import { useProveedorStore } from "../../../stores/proovedores_store";

const $q = useQuasar();
const proveedorStore = useProveedorStore();
const { proveedor, modal, isEditar } = storeToRefs(proveedorStore);

const actualizarModal = (valor) => {
  proveedorStore.actualizarModal(valor);
  proveedorStore.updateEditar(valor);
  proveedorStore.initProveedor();
};

const onSubmit = async () => {
  let resp = null;
  $q.loading.show();
  if (isEditar.value == true) {
    resp = await proveedorStore.updateProveedor(proveedor.value);
  } else {
    resp = await proveedorStore.createProveedor(proveedor.value);
  }
  if (resp.success) {
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    proveedorStore.loadInformacionProveedor();
    proveedorStore.loadProveedorList();
    actualizarModal(false);
  } else {
    $q.notify({
      type: "negative",
      message: resp.data,
    });
  }
  $q.loading.hide();
};
</script>

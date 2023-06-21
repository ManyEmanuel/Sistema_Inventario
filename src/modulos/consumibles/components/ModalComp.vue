<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Registro de consumible</div>
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
              v-model="consumible.catalago"
              label="Catálogo perteneciente del consumible"
              readonly
            >
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              v-model="bodegaId"
              :options="listBodega"
              label="Bodega de resguardo"
              hint="Selecciona una bodega"
              lazy-rules
              :rules="[(val) => !!val || 'La bodega es requerida']"
            >
            </q-select>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              v-model="clasificacionId"
              :options="listaClasificacion"
              label="Clasificación del consumibles"
              hint="Seleccione una clasificación"
              lazy-rules
              :rules="[(val) => !!val || 'La clasificación es requerida']"
            >
            </q-select>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="consumible.nombre"
              label="Nombre del producto"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'El nombre es requerido']"
            >
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="consumible.abreviatura"
              label="Nombre corto del producto"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="consumible.descripcion"
              label="Descripción del producto"
              autogrow
            >
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input v-model="consumible.marca" label="Marca del producto">
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input v-model="consumible.color" label="Color del producto">
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              v-model="medidaId"
              :options="listaUnidades"
              label="Unidades de medida"
              hint="Seleccione una medida"
              lazy-rules
              :rules="[(val) => !!val || 'La unidad de medida es requerida']"
            >
            </q-select>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="consumible.fecha_Caducidad"
              label="Fecha de caducidad del producto"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="consumible.fecha_Caducidad"
                      :locale="myLocale"
                      mask="DD-MM-YYYY"
                      use-input
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="consumible.precio_Compra"
              label="Precio de compra del producto"
              prefix="$"
            >
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-input
              v-model.number="consumible.stock"
              label="Stock actual"
              type="number"
              readonly
              val="0"
              :rules="[(val) => val >= 0 || 'Solo números positivos']"
            />
          </div>

          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-input
              v-model.number="consumible.stock_Maximo"
              label="Stock máximo del consumible"
              type="number"
              min="0"
              :rules="[(val) => val >= 0 || 'Solo números positivos']"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-input
              v-model.number="consumible.stock_Minimo"
              label="Stock mínimo del consumible"
              type="number"
              :max="consumible.stock_Maximo"
              min="0"
              :rules="[(val) => val >= 0 || 'Solo números positivos']"
            />
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
import { useConsumibleStore } from "../../../stores/consumible_store";
import { useBodegaStore } from "../../../stores/bodega_store";
import { useClasificacionConsumibleStore } from "../../../stores/clasificaciones_consumibles_store";
import { useUnidadMedidaStore } from "../../../stores/unidades_medida_store";

const $q = useQuasar();
const consumibleStore = useConsumibleStore();
const bodegaStore = useBodegaStore();
const clasificacionStore = useClasificacionConsumibleStore();
const unidadStore = useUnidadMedidaStore();
const authStore = useAuthStore();
const bodegaId = ref(null);
const catalogoId = ref(null);
const clasificacionId = ref(null);
const medidaId = ref(null);
const {
  consumible,
  modal,
  isEditar,
  catalogos,
  bodegas,
  clasificaciones,
  unidades,
  myLocale,
} = storeToRefs(consumibleStore);

const { listBodega } = storeToRefs(bodegaStore);
const { listaClasificacion } = storeToRefs(clasificacionStore);
const { listaUnidades } = storeToRefs(unidadStore);

const actualizarModal = (valor) => {
  consumibleStore.actualizarModal(valor);
  consumibleStore.updateEditar(valor);
  consumibleStore.initConsumible();
  bodegaId.value = null;
  clasificacionId.value = null;
  medidaId.value = null;
};

onBeforeMount(() => {
  bodegaStore.loadBodegasList();
  clasificacionStore.loadListaClasificacion(false);
  unidadStore.loadListaUnidades();
});

watch(consumible.value, (val) => {
  if (val.id != null) {
    cargarBodega(val);
    cargarClasificacion(val);
    cargarMedida(val);
  }
});

const cargarBodega = async (val) => {
  if (bodegaId.value == null) {
    let bodegaFiltrado = listBodega.value.find(
      (x) => x.value == `${val.bodega_Id}`
    );
    bodegaId.value = bodegaFiltrado;
  }
};

const cargarClasificacion = async (val) => {
  if (clasificacionId.value == null) {
    let clasificacionFiltrado = listaClasificacion.value.find(
      (x) => x.value == `${val.clasificacion_Id}`
    );
    clasificacionId.value = clasificacionFiltrado;
  }
};

const cargarMedida = async (val) => {
  if (medidaId.value == null) {
    let medidaFiltrado = listaUnidades.value.find(
      (x) => x.value == `${val.unidad_Medida_Id}`
    );
    medidaId.value = medidaFiltrado;
  }
};

const onSubmit = async () => {
  let fechaFiltroUno = consumible.value.fecha_Caducidad.split("-");
  consumible.value.fecha_Caducidad =
    fechaFiltroUno[2] + "-" + fechaFiltroUno[1] + "-" + fechaFiltroUno[0];
  consumible.value.bodega_Id = bodegaId.value.value;
  consumible.value.clasificacion_Id = clasificacionId.value.value;
  consumible.value.unidad_Medida_Id = medidaId.value.value;
  consumible.value.catalago_Id = 11;
  let resp = null;
  $q.loading.show();
  if (isEditar.value == true) {
    resp = await consumibleStore.updateConsumible(consumible.value);
  } else {
    resp = await consumibleStore.createConsumible(consumible.value);
  }

  if (resp.success) {
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    consumibleStore.loadConsumibles();
    //clasificacionStore.loadInformacionClasificacion();
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

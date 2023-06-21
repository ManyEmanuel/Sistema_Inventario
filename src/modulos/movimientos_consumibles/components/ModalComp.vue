<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Registro de movimientos</div>
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
      <q-form @submit="registrar" ref="RegistroMovimiento">
        <q-card-section>
          <div class="row q-col-gutter-xs">
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-select
                v-model="tipoMovimientoId"
                :options="listTipoMovimiento"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'Seleccionar tipo de movimiento']"
                label="Tipo de movimiento"
                hint="Selecciona un tipo de movimiento"
                :readonly="isConsulta"
              >
              </q-select>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-select
                v-model="conceptoId"
                :options="listConceptoMovimiento"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'Selecciona un concepto']"
                label="Concepto de movimiento"
                hint="Selecciona un concepto de movimiento"
                :readonly="isConsulta"
              >
              </q-select>
            </div>
            <div
              v-if="isCompra == true"
              class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
            >
              <q-select
                v-model="proveedorId"
                :options="listProveedor"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'Selecciona un proveedor']"
                label="Proveedor"
                hint="Selecciona un proveedor"
                :readonly="isConsulta"
              >
                <template v-slot:after>
                  <q-btn round dense flat icon="add" @click="addProveedor" />
                </template>
              </q-select>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-input
                v-model="movimiento.observaciones"
                autogrow
                label="Observaciones del movimiento"
                :rules="[(val) => !!val || 'Observación es requerida']"
                lazy-rules
                :readonly="isConsulta"
              >
              </q-input>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-input
                label="Fecha del movimiento"
                hint="Ingrese fecha y hora"
                v-model="movimiento.fecha_Movimiento"
                :readonly="isConsulta"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="movimiento.fecha_Movimiento"
                        :locale="myLocale"
                        mask="YYYY-MM-DD"
                        color="purple"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Cerrar"
                            color="black"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <q-space />
            <div
              v-if="isConsulta == false"
              class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
            >
              <q-select
                v-model="clasificacionId"
                :options="listaClasificacion"
                :disable="habilitarCombo"
                label="Filtrar consumibles"
                hint="Selecciona un tipo de clasificación"
                :readonly="isConsulta"
              >
              </q-select>
            </div>
            <div
              v-if="isConsulta == false"
              class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
            >
              <q-select
                v-model="consumibleId"
                :options="opcionesConsumibles"
                :disable="habilitarCombo"
                use-input
                @filter="filterConsumible"
                label="Listado de consumibles"
                hint="Selecciona un consumible"
                :readonly="isConsulta"
              >
              </q-select>
            </div>
            <div
              v-if="isConsulta == false"
              class="col-lg-4 col-md-4 col-sm-12 col-xs-12"
            >
              <q-input
                v-model="cantidad"
                label="Cantidad"
                type="number"
                min="1"
                :readonly="isConsulta"
              >
              </q-input>
            </div>
            <div
              v-if="isConsulta == false && isCompra == true"
              class="col-lg-4 col-md-4 col-sm-12 col-xs-12"
            >
              <q-input
                v-model="precioUnitario"
                label="Precio unitario del producto"
                prefix="$"
                :readonly="isConsulta"
              >
              </q-input>
            </div>
            <div
              v-if="isConsulta == false && isCompra == true"
              class="col-lg-4 col-md-4 col-sm-12 col-xs-12"
            >
              <q-input
                v-model="importe"
                label="Importe total de la transición"
                prefix="$"
              >
              </q-input>
            </div>
            <q-space />
            <div v-if="isConsulta == false" class="col-12 justify-end">
              <div class="text-right q-gutter-xs">
                <q-btn
                  icon-right="add"
                  label="Agregar"
                  color="positive"
                  class="q-ml-sm"
                  @click="
                    $refs.RegistroMovimiento.validate(), agregarProducto()
                  "
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <TablaMovimiento />
          <!--<TablaSurtir v-else-if="isSurtir == true" /> -->
        </q-card-section>
        <q-card-section>
          <q-space />
          <div v-if="isConsulta == false" class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                label="Cancelar"
                type="reset"
                color="negative"
                @click="actualizarModal(false)"
              />
              <q-btn
                :disable="habilitarBoton"
                label="Guardar"
                type="submit"
                color="positive"
                class="q-ml-sm"
              />
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { onBeforeMount, ref, watch, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useAuthStore } from "../../../stores/auth_store";
import { useMovimientoConsumibleStore } from "../../../stores/movimientos_consumible_store";
import { useTipoMovimientoStore } from "../../../stores/tipos_movimientos_store";
import { useProveedorStore } from "../../../stores/proovedores_store";
import { useClasificacionConsumibleStore } from "../../../stores/clasificaciones_consumibles_store";
import { useConsumibleStore } from "../../../stores/consumible_store";
import { useConceptoMovimientoStore } from "../../../stores/concepto_movimientos_store";
import TablaMovimiento from "../components/TablaMovimiento.vue";

const $q = useQuasar();
const MovimientoConsumibleStore = useMovimientoConsumibleStore();
const tipoMovimientoStore = useTipoMovimientoStore();
const proveedorStore = useProveedorStore();
const consumibleStore = useConsumibleStore();
const clasificacionStore = useClasificacionConsumibleStore();
const conceptoMovimientoStore = useConceptoMovimientoStore();
const authStore = useAuthStore();
const {
  movimiento,
  modal,
  isEditar,
  myLocale,
  listaConsumibleMovimiento,
  isConsulta,
  isCompra,
} = storeToRefs(MovimientoConsumibleStore);
const { listTipoMovimiento } = storeToRefs(tipoMovimientoStore);
const { listProveedor } = storeToRefs(proveedorStore);
const { listaConsumibles, consumibles } = storeToRefs(consumibleStore);
const { listaClasificacion } = storeToRefs(clasificacionStore);
const { listConceptoMovimiento } = storeToRefs(conceptoMovimientoStore);
const opcionesConsumibles = ref([...listaConsumibles.value]);

const tipoMovimientoId = ref(null);
const conceptoId = ref(null);
const clasificacionId = ref(null);
const proveedorId = ref(null);
const consumibleId = ref(null);
const cantidad = ref(null);
const precioUnitario = ref(null);
const importe = ref(null);
const habilitarBoton = ref(true);

onBeforeMount(() => {
  consumibleStore.loadListaConsumible(0);
  consumibleStore.loadConsumibles();
  clasificacionStore.loadListaClasificacion(true);
  clasificacionId.value = { value: 0, label: "Todos" };
  tipoMovimientoStore.loadTipoMovimientoList();
  proveedorStore.loadProveedorList();
});

const actualizarModal = (valor) => {
  MovimientoConsumibleStore.actualizarModal(valor);
  MovimientoConsumibleStore.updateEditar(valor);
  MovimientoConsumibleStore.updateConsultar(valor);
  MovimientoConsumibleStore.updateCompra(valor);
  MovimientoConsumibleStore.initMovimiento();
  MovimientoConsumibleStore.initListaConsumible();
  MovimientoConsumibleStore.initListaConsumibleMovimiento();
  clasificacionId.value = { value: 0, label: "Todos" };
  limpiarVariables();
};

const addProveedor = () => {
  $q.loading.show();
  proveedorStore.actualizarModal(true);
  $q.loading.hide();
};

const limpiarVariables = () => {
  tipoMovimientoId.value = null;
  conceptoId.value = null;
  proveedorId.value = null;
  consumibleId.value = null;
  cantidad.value = null;
  precioUnitario.value = null;
  importe.value = null;
};

watch(movimiento.value, (val) => {
  if (val.id != null) {
    cargarTipo(val);
    cargarProveedor(val);
    //cargarConcepto(val);
  }
});

watch(tipoMovimientoId, (val) => {
  if (val != null) {
    conceptoId.value = null;
    conceptoMovimientoStore.loadConceptoMovimientoListFiltro(val.label);
  } else {
    conceptoId.value = null;
    listConceptoMovimiento.value = [];
  }
});

watch(conceptoId, (val) => {
  if (val != null) {
    if (val.label == "Entrada por compra") {
      MovimientoConsumibleStore.updateCompra(true);
      MovimientoConsumibleStore.initListaConsumibleMovimiento();
    } else {
      MovimientoConsumibleStore.updateCompra(false);
      MovimientoConsumibleStore.initListaConsumibleMovimiento();
    }
  } else {
    MovimientoConsumibleStore.updateCompra(false);
    MovimientoConsumibleStore.initListaConsumibleMovimiento();
  }
});

watch(consumibleId, (val) => {
  if (val != null) {
    cantidad.value = 1;
  }
});
watchEffect(() => {
  if (listaConsumibleMovimiento.value.length > 0) {
    console.log("Este es el valor", listaConsumibleMovimiento.value.length);
    habilitarBoton.value = false;
  } else {
    habilitarBoton.value = true;
  }
});

const cargarTipo = async (val) => {
  if (tipoMovimientoId.value == null) {
    let tipoFiltrado = listTipoMovimiento.value.find(
      (x) => x.value == `${val.tipo_Movimiento_Id}`
    );
    tipoMovimientoId.value = tipoFiltrado;
  }
  await conceptoMovimientoStore.loadConceptoMovimientoList();
  cargarConcepto(val);
};

const cargarProveedor = async (val) => {
  if (proveedorId.value == null) {
    let proveedorFiltrado = listProveedor.value.find(
      (x) => x.value == `${val.proveedor_Id}`
    );
    proveedorId.value = proveedorFiltrado;
  }
};

const cargarConcepto = async (val) => {
  if (conceptoId.value == null) {
    let conceptoFiltrado = listConceptoMovimiento.value.find(
      (x) => x.value == `${val.concepto_Id}`
    );
    conceptoId.value = conceptoFiltrado;
  }
};

const validaProducto = async (consumible) => {
  console.log("esto es la lista", listaConsumibleMovimiento.value);
  console.log("Esto es consumible", consumible);
  let filtro = listaConsumibleMovimiento.value.find(
    (x) => x.consumible_Id == consumible
  );
  return filtro;
};

const agregarProducto = async () => {
  let resp = await validaProducto(consumibleId.value.value);
  if (resp == undefined) {
    if (conceptoId.value.label == "Entrada por compra") {
      if (
        precioUnitario.value == "" ||
        precioUnitario.value == null ||
        importe.value == "" ||
        importe.value == null
      ) {
        $q.notify({
          type: "negative",
          message: "Ingrese datos completos de la compra",
        });
      } else {
        let resp = await MovimientoConsumibleStore.addConsumible(
          consumibleId.value.label,
          cantidad.value,
          precioUnitario.value,
          importe.value,
          consumibleId.value.value
        );
        consumibleId.value = null;
        cantidad.value = null;
        precioUnitario.value = null;
        importe.value = null;
      }
    } else {
      let resp = await MovimientoConsumibleStore.addConsumible(
        consumibleId.value.label,
        cantidad.value,
        precioUnitario.value,
        importe.value,
        consumibleId.value.value
      );
      consumibleId.value = null;
      cantidad.value = null;
      precioUnitario.value = null;
      importe.value = null;
    }
  } else {
    $q.dialog({
      title: "Producto ya agregado en lista",
      message:
        "Si desea modificar la cantidad, puede hacerlo directamente de la tabla",
    }).onOk(() => {
      // console.log('OK')
    });
  }
};

const registrar = async () => {
  let resp = null;
  movimiento.value.tipo_Movimiento_Id = tipoMovimientoId.value.value;
  movimiento.value.concepto_Id = conceptoId.value.value;
  if (conceptoId.value.label == "Entrada por compra") {
    movimiento.value.proveedor_Id = proveedorId.value.value;
  } else {
    movimiento.value.proveedor_Id = "";
  }

  movimiento.value.detalle = listaConsumibleMovimiento.value;
  $q.loading.show();
  resp = await MovimientoConsumibleStore.createMovimiento(movimiento.value);
  if (resp.success) {
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    MovimientoConsumibleStore.loadInformacionMovimiento();
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

const filterConsumible = (val, update) => {
  if (val === "") {
    update(() => {
      opcionesConsumibles.value = listaConsumibles.value;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    opcionesConsumibles.value = listaConsumibles.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};
</script>

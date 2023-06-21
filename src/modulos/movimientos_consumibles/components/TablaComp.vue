<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="movimientos"
        :columns="columns"
        :filter="filter"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Buscar.."
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name === 'id'">
                <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="search"
                  @click="visualizar(col.value)"
                >
                  <q-tooltip>Ver movimiento</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="props.row.estatus == 'Pendiente'"
                  flat
                  round
                  color="purple-ieen"
                  icon="send"
                  @click="afectar(col.value)"
                >
                  <q-tooltip>Afectar movmiento</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="props.row.estatus == 'Pendiente'"
                  flat
                  round
                  color="purple-ieen"
                  icon="delete"
                  @click="eliminar(col.value)"
                >
                  <q-tooltip>Eliminar movmiento</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="props.row.estatus == 'Afectado'"
                  flat
                  round
                  color="purple-ieen"
                  icon="print"
                  @click="Generar(col.value)"
                >
                  <q-tooltip>Generar comprobante</q-tooltip>
                </q-btn>
              </div>
              <label v-else>{{ col.value }}</label>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { onBeforeMount, ref } from "vue";
import { useAuthStore } from "../../../stores/auth_store";
import Reporte from "../../../helpers/helpers";
import { useMovimientoConsumibleStore } from "../../../stores/movimientos_consumible_store";

const $q = useQuasar();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const MovimientoConsumibleStore = useMovimientoConsumibleStore();
const { movimientos } = storeToRefs(MovimientoConsumibleStore);

onBeforeMount(() => {
  MovimientoConsumibleStore.loadInformacionMovimiento();
  //unidadStore.loadInformacionUnidades();
});

const columns = [
  {
    name: "folio",
    align: "center",
    label: "Folio del movimiento",
    field: "folio",
    sortable: true,
  },
  {
    name: "estatus",
    align: "center",
    label: "Estatus del movimiento",
    field: "estatus",
    sortable: true,
  },
  {
    name: "tipo_Movimiento",
    align: "center",
    label: "Tipo de movimiento",
    field: "tipo_Movimiento",
    sortable: true,
  },
  {
    name: "concepto",
    align: "center",
    label: "Concepto de movimiento",
    field: "concepto",
    sortable: true,
  },
  {
    name: "empleado",
    align: "center",
    label: "Empleado que realiza movimiento",
    field: "empleado",
    sortable: true,
  },
  {
    name: "id",
    align: "center",
    label: "Opciones",
    field: "id",
    sortable: false,
  },
];

const pagination = ref({
  //********** */
  page: 1,
  rowsPerPage: 25,
  sortBy: "name",
  descending: false,
});

const filter = ref("");

const afectar = async (id) => {
  $q.dialog({
    title: "Afectar movimiento",
    message: "Al aceptar, se ejecutaran los movimientos realizados",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "¡Sí!, Aceptar",
    },
    cancel: {
      color: "negative",
      label: " No Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    const resp = await MovimientoConsumibleStore.afectarMovimiento(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
      });
      MovimientoConsumibleStore.loadInformacionMovimiento();
    } else {
      $q.loading.hide();
      $q.notify({
        type: "negative",
        message: resp.data,
      });
    }
  });
};

const visualizar = async (id) => {
  $q.loading.show();
  await MovimientoConsumibleStore.loadMovimiento(id);
  MovimientoConsumibleStore.actualizarModal(true);
  MovimientoConsumibleStore.updateConsultar(true);
  await MovimientoConsumibleStore.detalleMovimiento(id);

  $q.loading.hide();
};

const Generar = async (id) => {
  Reporte(id);
};
const eliminar = async (id) => {
  $q.dialog({
    title: "Eliminar movimiento",
    message:
      "¿Está seguro de eliminar el movimiento, no se registraran cambios?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "¡Sí!, eliminar",
    },
    cancel: {
      color: "negative",
      label: " No Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    const resp = await MovimientoConsumibleStore.deleteMovimiento(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
      });
      MovimientoConsumibleStore.loadInformacionMovimiento();
    } else {
      $q.loading.hide();
      $q.notify({
        type: "negative",
        message: resp.data,
      });
    }
  });
};
</script>

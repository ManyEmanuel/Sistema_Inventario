<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="conceptos_movimientos"
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
                  v-if="modulo.actualizar"
                  flat
                  round
                  color="purple-ieen"
                  icon="edit"
                  @click="editar(col.value)"
                >
                  <q-tooltip>Editar tipo de movimiento</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="modulo.eliminar"
                  flat
                  round
                  color="purple-ieen"
                  icon="delete"
                  @click="eliminar(col.value)"
                >
                  <q-tooltip>Eliminar tipo de movimiento</q-tooltip>
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
import { useConceptoMovimientoStore } from "../../../stores/concepto_movimientos_store";

const $q = useQuasar();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);

const conceptoMovimientoStore = useConceptoMovimientoStore();
const { conceptos_movimientos } = storeToRefs(conceptoMovimientoStore);

onBeforeMount(() => {
  conceptoMovimientoStore.loadInformacionConceptoMovimiento();
  //unidadStore.loadInformacionUnidades();
});

const columns = [
  {
    name: "tipo_Movimiento_Inventario",
    align: "center",
    label: "Tipo de movimiento",
    field: "tipo_Movimiento_Inventario",
    sortable: true,
  },
  {
    name: "concepto",
    align: "center",
    label: "Concepto",
    field: "concepto",
    sortable: true,
  },
  {
    name: "descripcion",
    align: "center",
    label: "Descripción del concepto",
    field: "descripcion",
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

const editar = async (id) => {
  $q.loading.show();
  await conceptoMovimientoStore.loadConceptoMovimiento(id);
  conceptoMovimientoStore.updateEditar(true);
  conceptoMovimientoStore.actualizarModal(true);
  $q.loading.hide();
};
const eliminar = async (id) => {
  $q.dialog({
    title: "Eliminar concepto",
    message: "¿Está seguro de eliminar el concepto?",
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
    const resp = await conceptoMovimientoStore.deleteConceptoMovimiento(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
      });
      conceptoMovimientoStore.loadInformacionConceptoMovimiento();
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

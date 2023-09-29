<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="listadoAreasConsumibles"
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
              <div v-if="col.name === 'total'">
                ${{
                  (
                    props.row.precio_Unitario * props.row.totalEntregada
                  ).toFixed(2)
                }}
              </div>
              <label v-else-if="col.name === 'precio_Unitario'"
                >${{ col.value }}</label
              >
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
import { useReportesStore } from "../../../stores/reportes_store";
import { useBodegaStore } from "../../../stores/bodega_store";
const ReportesStore = useReportesStore();
const { listadoAreasConsumibles } = storeToRefs(ReportesStore);
const $q = useQuasar();
const authStore = useAuthStore();
onBeforeMount(() => {
  cargarDatos();
});
const cargarDatos = async () => {
  await ReportesStore.loadConsumiblesEntregadosPorArea(0, 0, 0, 0);
};

const columns = [
  {
    name: "claveProducto",
    align: "center",
    label: "Clave de consumible",
    field: "claveProducto",
    sortable: true,
  },
  {
    name: "consumible",
    align: "center",
    label: "Consumible",
    field: "consumible",
    sortable: true,
  },
  {
    name: "totalSolicitado",
    align: "center",
    label: "Total Solicitado",
    field: "totalSolicitado",
    sortable: true,
  },
  {
    name: "totalEntregada",
    align: "center",
    label: "Total Entregado",
    field: "totalEntregada",
    sortable: true,
  },
  {
    name: "precio_Unitario",
    align: "center",
    label: "Precio unitario",
    field: "precio_Unitario",
    sortable: true,
  },
  {
    name: "total",
    align: "center",
    label: "Total precio de consumo",
    field: "total",
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
</script>

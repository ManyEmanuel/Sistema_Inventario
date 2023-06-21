<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="consumibles"
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
                  <q-tooltip>Editar clasificación</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="modulo.eliminar"
                  flat
                  round
                  color="purple-ieen"
                  icon="delete"
                  @click="eliminar(col.value)"
                >
                  <q-tooltip>Eliminar clasificación</q-tooltip>
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
import { useConsumibleStore } from "../../../stores/consumible_store";

const $q = useQuasar();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const consumibleStore = useConsumibleStore();
const { consumibles } = storeToRefs(consumibleStore);

onBeforeMount(() => {
  consumibleStore.loadConsumibles();
});

const columns = [
  {
    name: "catalago",
    align: "center",
    label: "Catálogo perteneciente",
    field: "catalago",
    sortable: true,
  },
  {
    name: "clasificacion",
    align: "center",
    label: "Clasificación del producto",
    field: "clasificacion",
    sortable: true,
  },
  {
    name: "nombre",
    align: "center",
    label: "Producto",
    field: "nombre",
    sortable: true,
  },
  {
    name: "unidad_Medida",
    align: "center",
    label: "Unidad",
    field: "unidad_Medida",
    sortable: true,
  },
  {
    name: "stock",
    align: "center",
    label: "Stock existente",
    field: "stock",
    sortable: true,
  },
  {
    name: "bodega",
    align: "center",
    label: "Bodega de resguardo",
    field: "bodega",
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
  await consumibleStore.loadConsumible(id);
  consumibleStore.updateEditar(true);
  consumibleStore.actualizarModal(true);
  $q.loading.hide();
};
const eliminar = async (id) => {
  $q.dialog({
    title: "Eliminar consumible",
    message: "¿Está seguro de eliminar el consumible?",
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
    const resp = await consumibleStore.deleteConsumible(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
      });
      consumibleStore.loadConsumibles();
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

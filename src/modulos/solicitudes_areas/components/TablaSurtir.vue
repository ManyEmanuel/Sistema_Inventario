<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="listaSolicitud"
        :columns="columns"
        :filter="filter"
        :loading="loading"
        :pagination="pagination"
        :visible-columns="columnasVisibles"
        row-key="id"
        hide-bottom
        :rows-per-page-options="[0]"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="nombre" :props="props">{{ props.row.nombre }}</q-td>
            <q-td key="cantidad_Solicitada" :props="props">{{
              props.row.cantidad_Solicitada
            }}</q-td>

            <q-td key="cantidad_Stock" :props="props">{{
              props.row.cantidad_Stock
            }}</q-td>
            <q-td key="cantidad_Entregada" :props="props">
              {{ props.row.cantidad_Entregada }}
              <q-popup-edit
                v-model="props.row.cantidad_Entregada"
                title="Cantidad a surtir"
                auto-save
                v-slot="scope"
              >
                <q-input
                  type="number"
                  v-model.number="scope.value"
                  dense
                  use-input="false"
                  autofocus
                  min="0"
                  :max="props.row.cantidad_Tope"
                  @keyup.enter="scope.set"
                />
              </q-popup-edit>
            </q-td>
            <q-td key="cantidad_Entregada_final" :props="props">{{
              props.row.cantidad_Entregada
            }}</q-td>
            <q-td key="observaciones" :props="props">
              {{ props.row.observaciones }}
              <q-popup-edit
                v-if="isFinalizado == false"
                v-model="props.row.observaciones"
                title="Observación de entrega"
                auto-save
                v-slot="scope"
              >
                <q-input
                  v-model="scope.value"
                  dense
                  autofocus
                  @keyup.enter="scope.set"
                />
              </q-popup-edit>
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
import { onBeforeMount, ref, watch, watchEffect } from "vue";
import { useAuthStore } from "../../../stores/auth_store";
import { useSolicitudAreaStore } from "../../../stores/solicitudes_areas_store";

const $q = useQuasar();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const solicitudesAreasStore = useSolicitudAreaStore();
const { listaSolicitud, isConsulta, isFinalizado } = storeToRefs(
  solicitudesAreasStore
);
let columnasVisibles = [];

onBeforeMount(() => {
  cargarColumnas();
});

const columns = [
  {
    name: "nombre",
    align: "center",
    label: "Nombre del producto",
    field: "nombre",
    sortable: true,
  },
  {
    name: "cantidad_Solicitada",
    align: "center",
    label: "Cantidad solicitada",
    field: "cantidad_Solicitada",
    sortable: true,
  },
  {
    name: "cantidad_Stock",
    align: "center",
    label: "Cantidad en stock",
    field: "cantidad_Stock",
    sortable: true,
  },
  {
    name: "cantidad_Entregada_final",
    align: "center",
    label: "Cantidad entregada",
    field: "cantidad_Entregada",
    sortable: true,
  },
  {
    name: "cantidad_Entregada",
    align: "center",
    label: "Cantidad a entregar",
    field: "cantidad_Entregada",
    sortable: true,
  },
  {
    name: "observaciones",
    align: "center",
    label: "Observaciones de entrega",
    field: "observaciones",
    sortable: true,
  },
  {
    name: "cantidad_Tope",
    align: "center",
    label: "cantidad_Tope",
    field: "cantidad_Tope",
    sortable: true,
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

const cargarColumnas = async () => {
  if (isConsulta.value == false && isFinalizado.value == false) {
    columnasVisibles = [
      "nombre",
      "cantidad_Solicitada",
      "cantidad_Stock",
      "cantidad_Entregada",
      "cantidad_Entregada1",
      "observaciones",
    ];
  } else if (isConsulta.value == true) {
    columnasVisibles = ["nombre", "cantidad_Solicitada", "cantidad_Stock"];
  } else if (isFinalizado.value == true) {
    columnasVisibles = [
      "nombre",
      "cantidad_Solicitada",
      "cantidad_Entregada_final",
      "observaciones",
    ];
  }
  console.log(
    "Este es el valor de IsConsulta",
    isConsulta.value,
    "Este es el de columnas",
    columnasVisibles
  );
};

/*watchEffect(() => {
  console.log("Si entro al watch");
  let numIndex = 0;
  for (let lista of listaSolicitud.value) {
    console.log("Esto es lista", lista);
    if (lista.cantidad_Entregada <= lista.cantidad_Tope) {
    } else {
      listaSolicitud.value[numIndex].cantidad_Entregada = lista.cantidad_Tope;
      $q.notify({
        type: "negative",
        message: "Cantidad a entregar de " + lista.nombre + " excede limite",
        position: "top",
      });
      break;
    }
    numIndex = numIndex + 1;
  }
});*/

watchEffect(() => {
  console.log("Entro al watch");
  listaSolicitud.value.forEach((element) => {
    if (element.cantidad_Entregada > element.cantidad_Tope) {
      element.cantidad_Entregada = element.cantidad_Tope;
      $q.notify({
        type: "negative",
        message: "Cantidad a entregar de " + element.nombre + " excede limite",
        position: "top",
      });
    }
  });
});
</script>

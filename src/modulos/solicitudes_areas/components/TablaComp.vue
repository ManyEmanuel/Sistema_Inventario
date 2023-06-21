<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="solicitudes"
        :columns="columns"
        :filter="filter"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
      >
        <template v-slot:top-left>
          <q-select
            v-model="filtroEstatus"
            :options="estatus"
            label="Selecciona un estatus"
            hint="Seleccione el estatus de solicitudes a mostrar"
            style="width: 260px"
          >
          </q-select>
        </template>
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
          <q-btn
            v-if="modulo == null ? false : modulo.leer"
            type="button"
            class="q-ma-sm"
            color="purple-ieen"
            icon-right="refresh"
            label="Actualizar"
            @click="actualizar()"
          />
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name === 'id'">
                <q-btn
                  v-if="props.row.estatus == 'Aprobado por jefe de area'"
                  flat
                  round
                  color="purple-ieen"
                  icon="search"
                  @click="visualizar(col.value)"
                >
                  <q-tooltip>Ver solicitud</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="props.row.estatus == 'Aprobado por jefe de area'"
                  flat
                  round
                  color="purple-ieen"
                  icon="shelves"
                  @click="surtir(col.value)"
                >
                  <q-tooltip>Surtir solicitud</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="
                    props.row.estatus == 'Aprobado' ||
                    props.row.estatus == 'Entregado' ||
                    props.row.estatus == 'Rechazada por administración'
                  "
                  flat
                  round
                  color="purple-ieen"
                  icon="search"
                  @click="visualizarFinal(col.value)"
                >
                  <q-tooltip>Ver solicitud</q-tooltip>
                </q-btn>

                <q-btn
                  v-if="props.row.estatus == 'Aprobado'"
                  flat
                  round
                  color="purple-ieen"
                  icon="trolley"
                  @click="entregar(col.value)"
                >
                  <q-tooltip>Entregar lo solicitado</q-tooltip>
                </q-btn>

                <q-btn
                  v-if="
                    props.row.estatus != 'Entregado' &&
                    props.row.estatus != 'Rechazada por administración'
                  "
                  flat
                  round
                  color="purple-ieen"
                  icon="cancel"
                  @click="rechazar(col.value)"
                >
                  <q-tooltip>Rechazar solicitud</q-tooltip>
                </q-btn>

                <q-btn
                  v-if="props.row.estatus == 'Entregado'"
                  flat
                  round
                  color="purple-ieen"
                  icon="print"
                  @click="imprimir(col.value)"
                >
                  <q-tooltip>Generar vale</q-tooltip>
                </q-btn>

                <!--<q-btn
                  v-if="modulo.eliminar"
                  flat
                  round
                  color="purple-ieen"
                  icon="cancel"
                  @click="surtir(col.value)"
                >
                  <q-tooltip>Surtir solicitud</q-tooltip>
                </q-btn>-->
              </div>
              <label v-else>{{ col.value }}</label>
            </q-td>
            <!--<q-td key="empleado_Solicitante" :props="props">
              {{ props.row.empleado_Solicitante }}

            </q-td>-->
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { onBeforeMount, ref, watch } from "vue";
import { useAuthStore } from "../../../stores/auth_store";
import { useSolicitudAreaStore } from "../../../stores/solicitudes_areas_store";
import { useSolicitudConsumibleStore } from "../../../stores/solicitud_consumible_store";

const $q = useQuasar();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const solicitudesAreasStore = useSolicitudAreaStore();
const solicitudStore = useSolicitudConsumibleStore();
const { solicitudes, solicitud } = storeToRefs(solicitudesAreasStore);
const filtroEstatus = ref("Ver todos");
const estatus = ref([
  "Ver todos",
  "Aprobado por jefe de area",
  "Aprobado",
  "Entregado",
  "Rechazada por administración",
]);

onBeforeMount(() => {
  solicitudesAreasStore.loadSolicitudes();
});

const columns = [
  {
    name: "folio",
    align: "center",
    label: "Folio de solicitud",
    field: "folio",
    sortable: true,
  },
  {
    name: "tipo",
    align: "center",
    label: "Tipo de solicitud",
    field: "tipo",
    sortable: true,
  },
  {
    name: "area",
    align: "center",
    label: "Área que solicita",
    field: "area",
    sortable: true,
  },
  {
    name: "empleado_Solicitante",
    align: "center",
    label: "Empleado que solicito",
    field: "empleado_Solicitante",
    sortable: true,
  },
  {
    name: "fecha_Solicitud",
    align: "center",
    label: "Fecha de la solicitud",
    field: "fecha_Solicitud",
    sortable: true,
  },
  {
    name: "estatus",
    align: "center",
    label: "Estatus",
    field: "estatus",
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

const visualizar = async (id) => {
  $q.loading.show();
  await solicitudesAreasStore.loadConsumiblesSolicitudSurtir(id);
  solicitudesAreasStore.actualizarModal(true);
  solicitudesAreasStore.updateConsulta(true);

  $q.loading.hide();
};

const actualizar = async () => {
  $q.loading.show();
  solicitudesAreasStore.loadSolicitudes();
  $q.loading.hide();
};

const visualizarFinal = async (id) => {
  $q.loading.show();
  await solicitudesAreasStore.loadConsumiblesSolicitudSurtir(id);
  solicitudesAreasStore.actualizarModal(true);
  solicitudesAreasStore.updateFinalizado(true);

  $q.loading.hide();
};

const surtir = async (id) => {
  $q.loading.show();
  await solicitudesAreasStore.loadConsumiblesSolicitudSurtir(id);
  solicitudesAreasStore.actualizarModal(true);
  console.log("Esto es la solicitud", solicitud.value);
  $q.loading.hide();
};

const imprimir = async (id) => {
  $q.loading.show();
  let resp = await solicitudesAreasStore.crearPase(id);
  let { success, msj } = resp;
  if (success == true) {
    $q.notify({
      type: "positive",
      message: msj,
    });
  } else {
    $q.notify({
      type: "negative",
      message: msj,
    });
  }
  $q.loading.hide();
};

const entregar = async (id) => {
  $q.loading.show();
  let resp = await solicitudesAreasStore.loadEntrega(id);
  solicitudesAreasStore.actualizarModalEntrega(true);
  $q.loading.hide();
};

watch(filtroEstatus, (val) => {
  if (val == "Ver todos") {
    solicitudesAreasStore.loadSolicitudes();
  } else {
    solicitudesAreasStore.loadSolicitudesFiltro(val);
  }
});

const rechazar = async (id) => {
  $q.loading.show();
  $q.dialog({
    title: "Cancelar solicitud",
    message: "¿Está seguro de cancelar la solicitud?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "¡Sí!, Cancelar",
    },
    cancel: {
      color: "negative",
      label: " No, Cerrar",
    },
  }).onOk(async () => {
    $q.loading.show();
    let resp = await solicitudesAreasStore.cancelarSolicitudAdministracion(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
      });
    } else {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
      });
    }
    solicitudesAreasStore.loadSolicitudes();
  });

  $q.loading.hide();
};
</script>

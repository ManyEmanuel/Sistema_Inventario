<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="solicitudes"
        :columns="columns"
        :filter="filter"
        :loading="loading"
        :pagination="pagination"
        :visible-columns="columnasVisibles"
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
                  v-if="modulo.actualizar"
                  flat
                  round
                  color="purple-ieen"
                  icon="search"
                  @click="visualizar(col.value)"
                >
                  <q-tooltip>Ver solicitud</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="
                    (props.row.estatus == 'Pendiente' ||
                      props.row.estatus == 'Borrador') &&
                    props.row.filtro == true
                  "
                  flat
                  round
                  color="purple-ieen"
                  icon="edit"
                  @click="editar(col.value)"
                >
                  <q-tooltip>Editar solicitud</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="
                    props.row.estatus == 'Borrador' && props.row.filtro == true
                  "
                  flat
                  round
                  color="purple-ieen"
                  icon="send"
                  @click="enviar(col.value)"
                >
                </q-btn>
                <q-btn
                  v-if="props.row.estatus == 'Pendiente'"
                  flat
                  round
                  color="purple-ieen"
                  icon="check_circle"
                  @click="aceptar(col.value)"
                >
                  <q-tooltip>Aceptar solicitud</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="
                    props.row.estatus == 'Pendiente' &&
                    props.row.filtro == false
                  "
                  flat
                  round
                  color="purple-ieen"
                  icon="cancel"
                  @click="rechazar(col.value)"
                >
                  <q-tooltip>Rechazar solicitud</q-tooltip>
                </q-btn>
                <q-icon
                  v-if="props.row.estatus == 'Aprobado por jefe de area'"
                  flat
                  size="sm"
                  name="schedule"
                  round
                  color="blue-grey-4"
                >
                  <q-tooltip
                    >Esperando autorización de administración</q-tooltip
                  >
                </q-icon>
                <q-btn
                  v-if="
                    (props.row.estatus == 'Pendiente' ||
                      props.row.estatus == 'Borrador') &&
                    props.row.filtro == true
                  "
                  flat
                  round
                  color="purple-ieen"
                  icon="delete"
                  @click="eliminar(col.value)"
                >
                  <q-tooltip>Eliminar solicitud</q-tooltip>
                </q-btn>
                <q-icon
                  v-if="props.row.estatus == 'Aprobado'"
                  flat
                  size="sm"
                  name="follow_the_signs"
                  round
                  color="red"
                >
                  <q-tooltip
                    >Aprobado por Administración, pase a surtir su
                    solicitud</q-tooltip
                  >
                </q-icon>
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
import { onBeforeMount, ref } from "vue";
import { useAuthStore } from "../../../stores/auth_store";
import { useSolicitudConsumibleStore } from "../../../stores/solicitud_consumible_store";
import { useSolicitudAreaStore } from "../../../stores/solicitudes_areas_store";

const $q = useQuasar();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const solicitudStore = useSolicitudConsumibleStore();
const solicitudesAreasStore = useSolicitudAreaStore();
const { solicitudes, jefeArea } = storeToRefs(solicitudStore);

let columnasVisibles = [
  "folio",
  "tipo",
  "empleado_Solicitante",
  "fecha_Solicitud",
  "estatus",
  "id",
];
onBeforeMount(() => {
  solicitudStore.loadSolicitudesJefeArea();
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
  {
    name: "filtro",
    align: "center",
    label: "filtro",
    field: "filtro",
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
  await solicitudStore.loadConsumiblesSolicitud(id);
  solicitudStore.updateConsulta(true);
  solicitudStore.actualizarModal(true);
  $q.loading.hide();
};

const editar = async (id) => {
  $q.loading.show();
  await solicitudStore.loadConsumiblesSolicitud(id);
  solicitudStore.updateEditar(true);
  solicitudStore.actualizarModal(true);
  $q.loading.hide();
};

const actualizar = async () => {
  $q.loading.show();
  solicitudStore.loadSolicitudesJefeArea();
  $q.loading.hide();
};

const aceptar = async (id) => {
  $q.loading.show();
  $q.dialog({
    title: "Aceptar solicitud",
    message: "¿Está seguro de aceptar la solicitud?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "¡Sí!, aceptar",
    },
    cancel: {
      color: "negative",
      label: " No Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    let resp = await solicitudStore.aceptarSolicitud(id);
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
    solicitudStore.loadSolicitudesJefeArea();
  });

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

const enviar = async (id) => {
  $q.loading.show();
  $q.dialog({
    title: "Enviar solicitud",
    message: "¿Está seguro de enviar la solicitud?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "¡Sí!, enviar",
    },
    cancel: {
      color: "negative",
      label: " No, Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    let resp = await solicitudStore.enviarSolicitud(id);
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
    solicitudStore.loadSolicitudesJefeArea();
  });
  $q.loading.hide();
};

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
    let resp = await solicitudStore.cancelarSolicitud(id);
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
    solicitudStore.loadSolicitudesJefeArea();
  });

  $q.loading.hide();
};

const eliminar = async (id) => {
  $q.loading.show();
  $q.dialog({
    title: "Eliminar solicitud",
    message: "¿Está seguro de eliminar la solicitud?",
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
    let resp = await solicitudStore.deleteSolicitud(id);
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
    solicitudStore.loadSolicitudesJefeArea();
  });
  $q.loading.hide();
};
</script>

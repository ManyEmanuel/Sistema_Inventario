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
            <q-td key="cantidad_Solicitada" :props="props"
              >{{ props.row.cantidad_Solicitada }}
              <q-popup-edit
                v-model="props.row.cantidad_Solicitada"
                title="Cantidad a solicitar"
                auto-save
                v-slot="scope"
              >
                <q-input
                  type="number"
                  v-model.number="scope.value"
                  dense
                  use-input="false"
                  autofocus
                  min="1"
                  @keyup.enter="scope.set"
                />
              </q-popup-edit>
            </q-td>
            <q-td key="cantidad_Entregada" :props="props">{{
              props.row.cantidad_Entregada
            }}</q-td>
            <q-td key="unidad_Medida" :props="props">{{
              props.row.unidad_Medida
            }}</q-td>
            <q-td key="observaciones" :props="props">{{
              props.row.observaciones
            }}</q-td>

            <q-td key="consumible_Id" :props="props">
              <q-btn
                flat
                round
                color="purple-ieen"
                icon="cancel"
                @click="eliminar(props.row.consumible_Id)"
              >
                <q-tooltip>Eliminar consumible</q-tooltip>
              </q-btn>
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
import { useSolicitudConsumibleStore } from "../../../stores/solicitud_consumible_store";

const $q = useQuasar();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const solicitudStore = useSolicitudConsumibleStore();
const { listaSolicitud, isEditar, isConsulta, isEntregada } =
  storeToRefs(solicitudStore);
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
    label: "Cantidad a solicitar",
    field: "cantidad_Solicitada",
    sortable: true,
  },
  {
    name: "cantidad_Entregada",
    align: "center",
    label: "Cantidad entregada",
    field: "cantidad_Entregada",
    sortable: true,
  },
  {
    name: "unidad_Medida",
    align: "center",
    label: "Unidad de medida",
    field: "unidad_Medida",
    sortable: true,
  },

  {
    name: "consumible_Id",
    align: "center",
    label: "Opciones",
    field: "consumible_Id",
    sortable: false,
  },
  {
    name: "observaciones",
    align: "center",
    label: "Observaciones de entrega",
    field: "observaciones",
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
  if (isConsulta.value == false) {
    columnasVisibles = [
      "nombre",
      "cantidad_Solicitada",
      "unidad_Medida",
      "consumible_Id",
    ];
  } else {
    if (isEntregada.value == true) {
      columnasVisibles = [
        "nombre",
        "cantidad_Solicitada",
        "unidad_Medida",
        "cantidad_Entregada",
        "observaciones",
      ];
    } else {
      columnasVisibles = ["nombre", "cantidad_Solicitada", "unidad_Medida"];
    }
  }
};

const editar = async (id) => {
  $q.loading.show();
  $q.dialog({
    title: "Cambiar cantidad de consumibles",
    message: "¿Cuantos productos desea solicitar?",
    icon: "Warning",
    prompt: {
      model: 0,
      min: 0,
      isValid: (val) => val > 0,
      type: "number",
    },
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "Cambiar",
    },
    cancel: {
      color: "negative",
      label: "Cancelar",
    },
  }).onOk(async (data) => {
    $q.loading.show();
    console.log("Esto es data", data);
    const resp = await solicitudStore.cambiarConsumible(id, data);
    console.log("Esto es resp", resp);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: "Cantidad actualizada",
      });
    } else {
      $q.loading.hide();
      $q.notify({
        type: "negative",
        message: "No se pudo actualizar",
      });
    }
    console;
  });
  $q.loading.hide();
};

const eliminar = async (id) => {
  let filtro = listaSolicitud.value.find((x) => x.consumible_Id == id);
  console.log("Esto es filtro de eliminar", filtro);
  $q.dialog({
    title: "Eliminar consumible",
    message: "¿Está seguro de eliminar el consumible del listado?",
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
    let resp = null;
    if (isEditar.value == false) {
      resp = await solicitudStore.deleteConsumible(id);
    } else {
      if (filtro.id == 0) {
        resp = await solicitudStore.deleteConsumible(id);
      } else {
        resp = await solicitudStore.deleteConsumibleBD(id);
      }
    }

    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
      });
      //if (isEditar.value == true && filtro.id != 0) {
      //solicitudStore.loadListaConsumiblesSolicitud(filtro.solicitud_Id);
      //}
    } else {
      $q.loading.hide();
      $q.notify({
        type: "negative",
        message: resp.data,
      });
    }
  });
};

watchEffect(() => {
  listaSolicitud.value.forEach((element) => {
    if (element.cantidad_Solicitada <= 0) {
      element.cantidad_Solicitada = 1;
    }
  });
});
</script>

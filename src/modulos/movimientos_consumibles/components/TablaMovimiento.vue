<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="listaConsumibleMovimiento"
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
            <q-td key="cantidad" :props="props"
              >{{ props.row.cantidad }}
              <q-popup-edit
                v-model="props.row.cantidad"
                :disable="isConsulta"
                title="Cantidad a ingresar"
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
            <q-td key="precio_Unitario" :props="props"
              >{{ props.row.precio_Unitario }}
              <q-popup-edit
                v-model="props.row.precio_Unitario"
                :disable="isConsulta"
                title="Precio unitario"
                auto-save
                v-slot="scope"
              >
                <q-input
                  v-model.number="scope.value"
                  dense
                  prefix="$"
                  @keyup.enter="scope.set"
                />
              </q-popup-edit>
            </q-td>
            <q-td key="importe" :props="props"
              >{{ props.row.importe }}
              <q-popup-edit
                :disable="isConsulta"
                v-model="props.row.importe"
                title="Precio unitario"
                auto-save
                v-slot="scope"
              >
                <q-input
                  v-model.number="scope.value"
                  dense
                  prefix="$"
                  @keyup.enter="scope.set"
                />
              </q-popup-edit>
            </q-td>
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
import { useMovimientoConsumibleStore } from "../../../stores/movimientos_consumible_store";

const $q = useQuasar();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const MovimientoConsumibleStore = useMovimientoConsumibleStore();
const { listaConsumibleMovimiento, isEditar, isCompra, isConsulta } =
  storeToRefs(MovimientoConsumibleStore);
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
    name: "cantidad",
    align: "center",
    label: "Cantidad a ingresar",
    field: "cantidad_Solicitada",
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
    name: "importe",
    align: "center",
    label: "Importe total",
    field: "importe",
    sortable: true,
  },

  {
    name: "consumible_Id",
    align: "center",
    label: "Opciones",
    field: "consumible_Id",
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

const cargarColumnas = async () => {
  if (isCompra.value == true) {
    if (isConsulta.value == true) {
      columnasVisibles = ["nombre", "cantidad", "precio_Unitario", "importe"];
    } else {
      columnasVisibles = [
        "nombre",
        "cantidad",
        "precio_Unitario",
        "importe",
        "consumible_Id",
      ];
    }
  } else {
    if (isConsulta.value == true) {
      columnasVisibles = ["nombre", "cantidad"];
    } else {
      columnasVisibles = ["nombre", "cantidad", "consumible_Id"];
    }
  }
};

watch(isCompra, (val) => {
  if (val == true) {
    columnasVisibles = [
      "nombre",
      "cantidad",
      "precio_Unitario",
      "importe",
      "consumible_Id",
    ];
  } else {
    columnasVisibles = ["nombre", "cantidad", "consumible_Id"];
  }
});

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
  let filtro = listaConsumibleMovimiento.value.find(
    (x) => x.consumible_Id == id
  );
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
    resp = await MovimientoConsumibleStore.deleteConsumible(id);

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
</script>

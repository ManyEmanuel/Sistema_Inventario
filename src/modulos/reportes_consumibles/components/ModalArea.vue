<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 1000px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6 text-center">Filtro de reporte</div>
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
      <q-card-section>
        <div class="row">
          <div class="col-6">
            <q-input
              v-model="textoFecha"
              label="Fecha de consulta"
              lazy-rules
              :rules="[(val) => !!val || 'Seleccione una fecha de consulta']"
              hint="Si no agrega fecha, se tomaran todos los registros hasta el dia de hoy"
            >
              <template v-slot:after>
                <q-btn icon="event" color="purple-ieen" flat round>
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="fecha"
                      :locale="myLocale"
                      mask="YYYY-MM-DD"
                      color="purple"
                      range
                    >
                      <div class="row items-center justify-end q-gutter-sm">
                        <q-btn
                          label="Aceptar"
                          color="primary"
                          flat
                          v-close-popup
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-btn>
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
      <q-card-section horizontal>
        <q-card-section class="col-6">
          <div><strong>Listado de áreas</strong></div>
          <div class="row items-start">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-checkbox
                v-model="areasTodos"
                :label="textoAreaTodos"
                color="purple"
                checked-icon="task_alt"
                unchecked-icon="highlight_off"
                :true-value="true"
                :false-value="false"
              />
            </div>

            <div
              v-for="items in listAreas"
              :key="items"
              class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
            >
              <q-checkbox
                v-model="items.select"
                :label="items.label"
                color="purple"
                checked-icon="task_alt"
                unchecked-icon="highlight_off"
                :true-value="true"
                :false-value="false"
              />
            </div>
          </div>
        </q-card-section>
      </q-card-section>
      <q-card-actions>
        <div class="col-12">
          <div class="text-right q-gutter-xs">
            <q-btn
              label="Generar reporte"
              icon-right="print"
              color="purple-ieen"
              class="q-ml-xl q-mb-xl"
              @click="busquedaFiltro()"
            />
          </div>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useAuthStore } from "../../../stores/auth_store";
import { useReportesStore } from "../../../stores/reportes_store";
import ReportePorArea from "../../../helpers/areaReporte";

const $q = useQuasar();
const ReportesStore = useReportesStore();

const authStore = useAuthStore();
const { myLocale, modal, listAreas, listadoSolicitudes } =
  storeToRefs(ReportesStore);
//let listAreasBusqueda = [...listAreas.value];
const areasTodos = ref(false);
let textoAreaTodos = ref("Seleccionar todos");
let fecha = ref();
let textoFecha = ref("");

onBeforeMount(() => {
  cargarDatos();
});

const cargarDatos = async () => {
  await ReportesStore.loadAreasConsumibles();
};

watch(areasTodos, (val) => {
  textoAreaTodos.value =
    val == true ? "Deshabilitar todos" : "Seleccionar Todos";
  let modificar = listAreas.value.map((obj) => {
    if (obj.select != val) {
      return { ...obj, select: val };
    }
    return obj;
  });
  listAreas.value = modificar;
});

watch(fecha, (val) => {
  if (val != undefined || val != "") {
    if (typeof val != "string") {
      let { from, to } = val;
      textoFecha.value = "del " + from + " hasta " + to;
    } else {
      textoFecha.value = val;
    }
  } else {
    textoFecha.value = "";
  }
});

const busquedaFiltro = async () => {
  $q.loading.show();
  let areasSelect = listAreas.value.filter((x) => x.select == true);
  if (areasSelect.length >= 1) {
    let solicitudes = null;
    let inicio = 0;
    let fin = 0;
    let tipo = "";
    if (fecha.value == undefined || fecha.value == "") {
      tipo = 0;
      solicitudes = await ReportesStore.loadSolicitudes(0, 0, 0);
    } else {
      if (typeof fecha.value == "string") {
        tipo = 1;
        inicio = fecha.value;
        solicitudes = await ReportesStore.loadSolicitudes(fecha.value, 0, 1);
      } else {
        let { from, to } = fecha.value;
        tipo = 2;
        inicio = from;
        fin = to;
        solicitudes = await ReportesStore.loadSolicitudes(from, to, 2);
      }
    }
    let resp = await ReportePorArea(areasSelect, inicio, fin, tipo);
    let { success, msj } = resp;
    if (success) {
      $q.notify({
        type: "positive",
        message: msj,
      });
      areasTodos.value = false;
      actualizarModal(false);
    }
  } else {
    $q.notify({
      type: "negative",
      message: "Seleccione al menos un área",
    });
  }

  $q.loading.hide();
};

const actualizarModal = (valor) => {
  ReportesStore.actualizarModal(valor);
  fecha.value = "";
};
</script>

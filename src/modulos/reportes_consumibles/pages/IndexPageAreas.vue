<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el
              label="Generación de Reportes"
              icon="library_books"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <div class="row justify-between">
      <div class="col-4">
        <q-select
          v-model="area_Id"
          :options="listaBusquedaAreas"
          label="Filtro por área"
        >
        </q-select>
      </div>
      <div class="col-8">
        <div class="text-right q-pa-md items-start q-gutter-md">
          <q-chip
            v-if="verFecha == true"
            outline
            class="q-ma-sm"
            square
            color="purple"
            text-color="white"
            size="md"
            icon="event"
            :label="'Información del ' + textoFecha"
          />

          <q-btn
            icon-right="event"
            color="purple-ieen"
            label="Busqueda por fecha"
            class="q-ma-sm"
          >
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="fechaFiltro"
                :locale="myLocale"
                mask="YYYY-MM-DD"
                color="purple-ieen"
                range
              >
                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn
                    label="Buscar"
                    color="purple"
                    flat
                    @click="buscarFecha()"
                    v-close-popup
                  />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-btn>
          <q-btn
            v-if="modulo == null ? false : modulo.registrar"
            type="button"
            class="q-ma-sm"
            color="purple-ieen"
            icon-right="visibility"
            label="Ver Todos"
            @click="verTodos()"
          />

          <q-btn
            v-if="modulo == null ? false : modulo.registrar"
            type="button"
            class="q-ma-sm"
            color="purple-ieen"
            icon-right="picture_as_pdf"
            label="Generar Reporte"
            @click="verConsumibles()"
          />
        </div>
      </div>
    </div>
    <TablaCompArea />
    <ModalArea />
  </q-page>
</template>
<script setup>
import { useQuasar } from "quasar";
import { useAuthStore } from "../../../stores/auth_store";
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useReportesStore } from "src/stores/reportes_store";
import ReportePorConsumible from "../../../helpers/consumibleReporte";
import TablaCompArea from "../components/TablaCompArea.vue";
import ModalArea from "../components/ModalArea.vue";
import { useBodegaStore } from "../../../stores/bodega_store";

const $q = useQuasar();
const authStore = useAuthStore();
const ReportesStore = useReportesStore();
const fechaFiltro = ref();
const verFecha = ref(false);
const textoFecha = ref("");
const bodegaStore = useBodegaStore();
const { areas } = storeToRefs(bodegaStore);
const area_Id = ref({ label: "Ver Todos", value: 0 });
//const catalagoStore = useCatalogoProductoStore();
const { modulo } = storeToRefs(authStore);
const { myLocale } = storeToRefs(ReportesStore);
const siglas = "SI-GEN-REP";
onMounted(() => {
  cargarAreas();
});

onBeforeMount(() => {
  cargarDatos();
});

const cargarDatos = async () => {
  leerPermisos();
  await bodegaStore.loadAreasList();
};

const cargarAreas = async () => {
  await bodegaStore.loadAreasList();
};

let listaBusquedaAreas = areas.value;
let verificación = listaBusquedaAreas.find((x) => x.value == 0);
if (verificación == undefined) {
  listaBusquedaAreas.unshift({ label: "Ver Todos", value: 0 });
}
const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  $q.loading.show();
  //proveedorStore.actualizarModal(valor);
  $q.loading.hide();
};

const verTodos = async () => {
  $q.loading.show();
  await ReportesStore.loadConsumiblesEntregadosPorArea(0, 0, 0, 0);
  verFecha.value = false;
  textoFecha.value = "";
  fechaFiltro.value = "";
  area_Id.value = { label: "Ver Todos", value: 0 };
  $q.loading.hide();
};

const buscarFecha = async () => {
  $q.loading.show();
  if (typeof fechaFiltro.value !== "undefined" && fechaFiltro.value !== "") {
    if (typeof fechaFiltro.value == "string") {
      await ReportesStore.loadConsumiblesEntregadosPorArea(
        fechaFiltro,
        0,
        1,
        area_Id.value.value
      );
      textoFecha.value = fechaFiltro.value;
      verFecha.value = true;
    } else {
      const { from, to } = fechaFiltro.value;
      await ReportesStore.loadConsumiblesEntregadosPorArea(
        from,
        to,
        2,
        area_Id.value.value
      );
      verFecha.value = true;
      textoFecha.value = from + " hasta " + to;
    }
  } else {
    verFecha.value = false;
    textoFecha.value = "";
    fechaFiltro.value = "";
    await ReportesStore.loadConsumiblesEntregadosPorArea(
      0,
      0,
      0,
      area_Id.value.value
    );
  }
  $q.loading.hide();
};

watch(area_Id, (val) => {
  $q.loading.show();
  buscarFecha();
  $q.loading.hide();
});

const verConsumibles = async () => {
  ReportesStore.actualizarModal(true);
};
</script>

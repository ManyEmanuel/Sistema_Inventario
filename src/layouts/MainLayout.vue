<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-purple-ieen">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Sistema de consumibles </q-toolbar-title>
        <q-btn flat round dense icon="apps" @click="show" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="300"
      :breakpoint="1024"
      class="text-black"
    >
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list>
          <q-expansion-item
            v-if="CatalogosConList.length > 0"
            expand-separator
            icon="menu_book"
            label="Catálogos generales"
            class="text-purple-ieen label-title text-bold"
          >
            <q-item
              v-if="CatalogosConList.some((element) => element == 'SI-CAT-BOD')"
              :to="{ name: 'bodegas' }"
              :content-inset-level="2"
              :header-inset-level="2"
            >
              <q-item-section avatar>
                <q-icon name="warehouse" color="purple-ieen" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-purple-ieen label-title text-bold"
                  >Bodegas</q-item-label
                >
              </q-item-section>
            </q-item>
            <q-item
              v-if="CatalogosConList.some((element) => element == 'SI-CAT-COS')"
              :to="{ name: 'catalogos_productos' }"
              :content-inset-level="2"
              :header-inset-level="2"
            >
              <q-item-section avatar>
                <q-icon name="list_alt" color="purple-ieen" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-purple-ieen label-title text-bold"
                  >Catálogo de productos</q-item-label
                >
              </q-item-section>
            </q-item>
            <q-item
              v-if="CatalogosConList.some((element) => element == 'SI-CAT-CLA')"
              :to="{ name: 'clasificacion_consumibles' }"
              :content-inset-level="2"
              :header-inset-level="2"
            >
              <q-item-section avatar>
                <q-icon name="category" color="purple-ieen" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-purple-ieen label-title text-bold"
                  >Clasificaciones</q-item-label
                >
              </q-item-section>
            </q-item>
            <q-item
              v-if="CatalogosConList.some((element) => element == 'SI-CAT-UDM')"
              :to="{ name: 'unidades_medida' }"
              :content-inset-level="2"
              :header-inset-level="2"
            >
              <q-item-section avatar>
                <q-icon name="calculate" color="purple-ieen" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-purple-ieen label-title text-bold"
                  >Unidades de medida</q-item-label
                >
              </q-item-section>
            </q-item>
            <q-item
              v-if="CatalogosConList.some((element) => element == 'SI-CAT-PRO')"
              :to="{ name: 'proveedores_ieen' }"
              :content-inset-level="2"
              :header-inset-level="2"
            >
              <q-item-section avatar>
                <q-icon name="groups" color="purple-ieen" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-purple-ieen label-title text-bold"
                  >Proveedores</q-item-label
                >
              </q-item-section>
            </q-item>
            <q-item
              v-if="CatalogosConList.some((element) => element == 'SI-CAT-TIP')"
              :to="{ name: 'tipos_movimientos' }"
              :content-inset-level="2"
              :header-inset-level="2"
            >
              <q-item-section avatar>
                <q-icon name="bookmarks" color="purple-ieen" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-purple-ieen label-title text-bold"
                  >Tipos de movimientos</q-item-label
                >
              </q-item-section>
            </q-item>
            <q-item
              v-if="CatalogosConList.some((element) => element == 'SI-CAT-CMO')"
              :to="{ name: 'concepto_movimientos' }"
              :content-inset-level="2"
              :header-inset-level="2"
            >
              <q-item-section avatar>
                <q-icon name="list_alt" color="purple-ieen" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-purple-ieen label-title text-bold"
                  >Concepto de movimientos</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-expansion-item>
          <q-item
            v-if="ConsumiblesList.some((element) => element == 'SI-CON-REG')"
            :to="{ name: 'registro_consumible' }"
          >
            <q-item-section avatar>
              <q-icon name="how_to_reg" color="purple-ieen" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-purple-ieen label-title text-bold"
                >Consumibles</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item
            v-if="CatalogosConList.some((element) => element == 'SI-CAT-MOV')"
            :to="{ name: 'registro_movimientos' }"
          >
            <q-item-section avatar>
              <q-icon name="move_up" color="purple-ieen" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-purple-ieen label-title text-bold"
                >Registro de movimientos</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item
            v-if="SolicitudesList.some((element) => element == 'SI-REG-SOL')"
            :to="{ name: 'solicitud_consumible' }"
          >
            <q-item-section avatar>
              <q-icon name="edit_square" color="purple-ieen" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-purple-ieen label-title text-bold"
                >Solicitud de consumibles</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item
            v-if="SolicitudesList.some((element) => element == 'SI-REG-ARE')"
            :to="{ name: 'solicitud_areas' }"
          >
            <q-item-section avatar>
              <q-icon name="list_alt" color="purple-ieen" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-purple-ieen label-title text-bold"
                >Solicitudes de áreas</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
        <q-btn label="Prueba" icon="send" @click="PruebaReporte()"> </q-btn>
      </q-scroll-area>

      <q-img
        class="absolute-top"
        src="~assets/FondoIEEN.png"
        style="height: 150px"
      >
        <div class="bg-transparent">
          <div class="text-weight-bold text-black">
            <br />
            Bienvenido(a) {{ usuario }}
          </div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer reveal bordered class="bg-purple-ieen">
      <q-toolbar>
        <q-toolbar-title
          ><div>
            &#169; Unidad Técnica de Informática y Estadística
          </div></q-toolbar-title
        >
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
//import EssentialLink from "components/EssentialLink.vue";
import { useRoute, useRouter } from "vue-router";
import { onBeforeMount } from "vue";
import { useAuthStore } from "../stores/auth_store";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import Reporte from "../helpers/Anexo 7";

export default defineComponent({
  name: "MainLayout",

  components: {
    //EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const $q = useQuasar();
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const usuario = ref("");
    const { modulos, sistemas, apps } = storeToRefs(authStore);
    const CatalogosConList = ref([]);
    const ConsumiblesList = ref([]);
    const SolicitudesList = ref([]);
    onBeforeMount(async () => {
      if (route.query.key) {
        localStorage.setItem("key", route.query.key);
      }

      if (route.query.sistema) {
        localStorage.setItem("sistema", route.query.sistema);
      }

      if (route.query.usr) {
        localStorage.setItem("usuario", route.query.usr);
        usuario.value = localStorage.getItem("usuario");
      } else {
        if (localStorage.getItem("usuario") != null) {
          usuario.value = localStorage.getItem("usuario");
        }
      }
      await loadMenu();
    });

    const PruebaReporte = () => {
      Reporte();
    };

    const show = () => {
      $q.bottomSheet({
        message: "Aplicaciones",
        grid: true,
        actions: apps.value,
      }).onOk((action) => {
        if (action.label == "Cerrar sesión") {
          localStorage.clear();
          window.location = "http://sistema.ieenayarit.org:9171?return=false";
        } else if (action.label == "Ir a universo") {
          window.location = "http://sistema.ieenayarit.org:9171?return=true";
        } else {
          window.location =
            action.url +
            `/#/?key=${localStorage.getItem("key")}&sistema=${
              action.id
            }&usr=${localStorage.getItem("usuario")}`;
        }
      });
    };

    const loadMenu = async () => {
      $q.loading.show();
      await authStore.loadSistemas();
      await authStore.loadModulos();
      await authStore.loadPerfil();
      //console.log("Estos son los modulos", modulos.value);
      modulos.value.forEach((element) => {
        switch (element.siglas_Modulo) {
          case "SI-CAT-BOD":
            CatalogosConList.value.push("SI-CAT-BOD");
            break;
          case "SI-CAT-COS":
            CatalogosConList.value.push("SI-CAT-COS");
            break;
          case "SI-CAT-CLA":
            CatalogosConList.value.push("SI-CAT-CLA");
            break;
          case "SI-CAT-UDM":
            CatalogosConList.value.push("SI-CAT-UDM");
            break;
          case "SI-CAT-PRO":
            CatalogosConList.value.push("SI-CAT-PRO");
            break;
          case "SI-CAT-TIP":
            CatalogosConList.value.push("SI-CAT-TIP");
            break;
          case "SI-CAT-CMO":
            CatalogosConList.value.push("SI-CAT-CMO");
            break;
          case "SI-CAT-MOV":
            CatalogosConList.value.push("SI-CAT-MOV");
            break;
          case "SI-CON-REG":
            ConsumiblesList.value.push("SI-CON-REG");
            break;
          case "SI-REG-SOL":
            SolicitudesList.value.push("SI-REG-SOL");
            break;
          case "SI-REG-ARE":
            SolicitudesList.value.push("SI-REG-ARE");
            break;
        }
      });
      $q.loading.hide();
    };

    return {
      leftDrawerOpen,
      CatalogosConList,
      ConsumiblesList,
      SolicitudesList,
      usuario,
      PruebaReporte,
      show,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
<style lang="scss">
.text-purple-ieen {
  color: #673e84 !important;
}
.bg-purple-ieen {
  background: #673e84 !important;
}
.text-purple-ieen-1 {
  color: #863399 !important;
}
.bg-purple-ieen-1 {
  background: #863399 !important;
}
.text-purple-ieen-2 {
  color: #a25eb5 !important;
}
.bg-purple-ieen-2 {
  background: #a25eb5 !important;
}
.text-purple-ieen-3 {
  color: #bb83ca !important;
}
.bg-purple-ieen-3 {
  background: #bb83ca !important;
}
.text-pink-ieen-1 {
  color: #b32572 !important;
}
.bg-pink-ieen-1 {
  background: #b32572 !important;
}
.text-pink-ieen-2 {
  color: #cc5599 !important;
}
.bg-pink-ieen-2 {
  background: #cc5599 !important;
}
.text-pink-ieen-3 {
  color: #dd85ba !important;
}
.bg-pink-ieen-3 {
  background: #dd85ba !important;
}
.text-gray-ieen-1 {
  color: #76777a !important;
}
.bg-gray-ieen-1 {
  background: #76777a !important;
}
.text-gray-ieen-2 {
  color: #98989a !important;
}
.bg-gray-ieen-2 {
  background: #98989a !important;
}
.text-gray-ieen-3 {
  color: #b1b1b1 !important;
}
.bg-gray-ieen-3 {
  background: #b1b1b1 !important;
}
</style>

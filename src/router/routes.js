const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "/bodegas",
        name: "bodegas",
        component: () => import("../modulos/bodegas/pages/IndexPage"),
      },
      {
        path: "/catalogos_productos",
        name: "catalogos_productos",
        component: () =>
          import("../modulos/catalogos_productos/pages/IndexPage"),
      },
      {
        path: "/clasificacion_consumibles",
        name: "clasificacion_consumibles",
        component: () =>
          import("../modulos/clasificaciones_consumibles/pages/IndexPage"),
      },
      {
        path: "/unidades_medida",
        name: "unidades_medida",
        component: () => import("../modulos/unidades_medida/pages/IndexPage"),
      },
      {
        path: "/registro_consumible",
        name: "registro_consumible",
        component: () => import("../modulos/consumibles/pages/IndexPage"),
      },
      {
        path: "/solicitud_consumible",
        name: "solicitud_consumible",
        component: () =>
          import("../modulos/solicitud_consumibles/pages/IndexPage"),
      },
      {
        path: "/proveedores_ieen",
        name: "proveedores_ieen",
        component: () => import("../modulos/proveedores/pages/IndexPage"),
      },
      {
        path: "/tipos_movimientos",
        name: "tipos_movimientos",
        component: () => import("../modulos/tipos_movimientos/pages/IndexPage"),
      },
      {
        path: "/concepto_movimientos",
        name: "concepto_movimientos",
        component: () =>
          import("../modulos/concepto_movimientos/pages/IndexPage"),
      },
      {
        path: "/registro_movimientos",
        name: "registro_movimientos",
        component: () =>
          import("../modulos/movimientos_consumibles/pages/IndexPage"),
      },
      {
        path: "/solicitud_areas",
        name: "solicitud_areas",
        component: () => import("../modulos/solicitudes_areas/pages/IndexPage"),
      },
      {
        path: "/reportes_consumibles",
        name: "reportes_consumibles",
        component: () =>
          import("../modulos/reportes_consumibles/pages/IndexPage"),
      },
      {
        path: "/reportes_consumibles_areas",
        name: "reportes_consumibles_areas",
        component: () =>
          import("../modulos/reportes_consumibles/pages/IndexPageAreas"),
      },
    ],
  },

  //solicitud_consumible

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;

import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import TestView from "../views/TestView.vue";
import StudentDashboardView from "../views/student/StudentDashboardView.vue";
import TeacherDashboardView from "../views/teacher/TeacherDashboardView.vue";
import TeacherSessionDetails from "../views/teacher/TeacherSessionDetails.vue";
import DeviceRegister from "@/views/student/DeviceRegister.vue";
import TeacherScan from "@/views/teacher/TeacherScan.vue";
import StudentSessionDetailsView from "@/views/student/StudentSessionDetailsView.vue";
import StudentAttendanceView from "@/views/student/StudentAttendanceView.vue";
// import { routes } from "vue-router/auto-routes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { guestOnly: true },
    },
    // {
    //   path: "/device/registration/:token",
    //   name: "deviceRegistration",
    //   component: DeviceRegistration,
    // },

    // Student routes
    {
      path: "/student/dashboard",
      name: "student-dashboard",
      component: StudentDashboardView,
      meta: { requiresAuth: true, role: "Student" },
    },
    {
      path: "/student/session/:id",
      name: "student-session-details",
      component: StudentSessionDetailsView,
      meta: { requiresAuth: true, role: "Student" },
    },
    {
      path: "/student/attendance/",
      name: "student-attendance-details",
      component: StudentAttendanceView,
      meta: { requiresAuth: true, role: "Student" },
    },

    // Teacher routes
    {
      path: "/teacher/dashboard",
      name: "teacher-dashboard",
      component: TeacherDashboardView,
      meta: { requiresAuth: true, role: "Teacher" },
    },
    {
      path: "/teacher/session/:id",
      name: "teacher-session-details",
      component: TeacherSessionDetails,
      meta: { requiresAuth: true, role: "Teacher" },
    },
    {
      path: "/teacher/Scan/:id",
      name: "teacher-scan",
      component: TeacherScan,
      meta: { requiresAuth: true, role: "Teacher" },
    },
    {
      path: "/device/register/:token",
      name: "DeviceRegister",
      component: DeviceRegister,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;

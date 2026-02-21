import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import TestView from "../views/TestView.vue";
import StudentDashboardView from "../views/student/StudentDashboardView.vue";
import TeacherDashboardView from "../views/teacher/TeacherDashboardView.vue";
import TeacherSessionDetails from "../views/teacher/TeacherSessionDetails.vue";
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

    // Student routes
    {
      path: "/student/dashboard",
      name: "student-dashboard",
      component: StudentDashboardView,
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

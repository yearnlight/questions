import Router from "vue-router";
const routes = [
    {
        path: "/",
        redirect: "/index"
    },
    {
        path: "/index",
        component: require("@/components/index/index.vue").default
    },
    {
        path: "/index-add",
        component: require("@/components/index/add.vue").default
    },
    {
        path: "/template",
        component: require("@/components/template/index.vue").default
    },    
    {
        path: "/question",
        component: require("@/components/question/index.vue").default
    },    
    {
        path: "/recruitment",
        component: require("@/components/recruitment/index.vue").default
    },
    {
        path: "/template-detail",
        component: require("@/components/template/detail.vue").default
    },
    {
        path: "/my-home",
        component: require("@/components/my/home.vue").default
    },
];

export default new Router({
    linkActiveClass: 'active',
    scrollBehavior: () => ({
        y: 0
    }),
    routes: routes
});
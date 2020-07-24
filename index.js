import PreLoader from "./preloader.js";

const preloader = new PreLoader();

preloader.load("resources/colors.txt");

preloader.onload = (resources) => {
    console.log(resources);
}
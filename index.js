import IframePaginator from "./js/iframe-paginator.js";

window.onload = () => {
    const paginator = new IframePaginator(document.body);
    paginator.addPage("character-traits", "./pages/character-traits.html");
    paginator.display("character-traits");
}